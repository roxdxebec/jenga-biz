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
create policy if not exists subscription_plans_select_anon
on public.subscription_plans
for select
to anon
using (is_active = true);

-- Authenticated users can select active plans too
create policy if not exists subscription_plans_select_auth
on public.subscription_plans
for select
to authenticated
using (is_active = true);

-- Only super admins can insert/update/delete plans
-- relies on helper function public.is_super_admin(user_id uuid) returning boolean
create policy if not exists subscription_plans_modify_super_admin
on public.subscription_plans
for all
to authenticated
using (public.is_super_admin(auth.uid()))
with check (public.is_super_admin(auth.uid()));

-- Policies for user_subscriptions
-- Users can view their own subscriptions
create policy if not exists user_subscriptions_select_own
on public.user_subscriptions
for select
to authenticated
using (user_id = auth.uid());

-- Users can insert their own records (e.g., free plan), admins can insert for anyone
create policy if not exists user_subscriptions_insert
on public.user_subscriptions
for insert
to authenticated
with check (
  user_id = auth.uid() 
  or public.is_admin_or_hub_manager(auth.uid()) 
  or public.is_super_admin(auth.uid())
);

-- Updates allowed to the owner or admins/super_admins
create policy if not exists user_subscriptions_update
on public.user_subscriptions
for update
to authenticated
using (
  user_id = auth.uid() 
  or public.is_admin_or_hub_manager(auth.uid()) 
  or public.is_super_admin(auth.uid())
)
with check (
  user_id = auth.uid() 
  or public.is_admin_or_hub_manager(auth.uid()) 
  or public.is_super_admin(auth.uid())
);

-- Optional: prevent deletes except super_admins
create policy if not exists user_subscriptions_delete_super_admin
on public.user_subscriptions
for delete
to authenticated
using (public.is_super_admin(auth.uid()));
