-- Subscriptions schema migration
-- Creates subscription_plans and user_subscriptions tables with basic RLS policies

-- Ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  description text,
  price numeric(10,2) not null,
  currency varchar(3) not null default 'KES',
  billing_cycle varchar(20) not null default 'monthly',
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists idx_subscription_plans_active on public.subscription_plans(is_active);
create index if not exists idx_subscription_plans_billing on public.subscription_plans(billing_cycle);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_subscription_plans_set_updated
before update on public.subscription_plans
for each row execute function public.set_updated_at();

-- User subscriptions
create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  status varchar(20) not null default 'active',
  paystack_subscription_id varchar(100),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone not null default now()
);

create index if not exists idx_user_subscriptions_user on public.user_subscriptions(user_id);
create index if not exists idx_user_subscriptions_plan on public.user_subscriptions(plan_id);
create index if not exists idx_user_subscriptions_status on public.user_subscriptions(status);

-- Enable RLS
alter table public.subscription_plans enable row level security;
alter table public.user_subscriptions enable row level security;

-- Policies for subscription_plans
-- Public (anon) can select only active plans
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscription_plans' AND policyname = 'subscription_plans_select_anon'
  ) THEN
    EXECUTE 'CREATE POLICY subscription_plans_select_anon ON public.subscription_plans FOR SELECT TO anon USING (is_active = true)';
  END IF;
END $$;

-- Authenticated users can select active plans too
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscription_plans' AND policyname = 'subscription_plans_select_auth'
  ) THEN
    EXECUTE 'CREATE POLICY subscription_plans_select_auth ON public.subscription_plans FOR SELECT TO authenticated USING (is_active = true)';
  END IF;
END $$;

-- Only super admins can insert/update/delete plans
-- relies on helper function public.is_super_admin(user_id uuid) returning boolean
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscription_plans' AND policyname = 'subscription_plans_modify_super_admin'
  ) THEN
    EXECUTE 'CREATE POLICY subscription_plans_modify_super_admin ON public.subscription_plans FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()))';
  END IF;
END $$;

-- Policies for user_subscriptions
-- Users can view their own subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'user_subscriptions_select_own'
  ) THEN
    EXECUTE 'CREATE POLICY user_subscriptions_select_own ON public.user_subscriptions FOR SELECT TO authenticated USING (user_id = auth.uid())';
  END IF;
END $$;

-- Users can insert their own records (e.g., free plan), admins can insert for anyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'user_subscriptions_insert'
  ) THEN
    EXECUTE 'CREATE POLICY user_subscriptions_insert ON public.user_subscriptions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()) OR public.is_super_admin(auth.uid()))';
  END IF;
END $$;

-- Updates allowed to the owner or admins/super_admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'user_subscriptions_update'
  ) THEN
    EXECUTE 'CREATE POLICY user_subscriptions_update ON public.user_subscriptions FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()) OR public.is_super_admin(auth.uid())) WITH CHECK (user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()) OR public.is_super_admin(auth.uid()))';
  END IF;
END $$;

-- Optional: prevent deletes except super_admins
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_subscriptions' AND policyname = 'user_subscriptions_delete_super_admin'
  ) THEN
    EXECUTE 'CREATE POLICY user_subscriptions_delete_super_admin ON public.user_subscriptions FOR DELETE TO authenticated USING (public.is_super_admin(auth.uid()))';
  END IF;
END $$;
