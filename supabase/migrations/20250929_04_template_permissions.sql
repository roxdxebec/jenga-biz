-- Template Permissions schema migration
-- Maps business templates to subscription tiers with optional permissions payload

-- Ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

create table if not exists public.template_permissions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.business_templates(id) on delete cascade,
  subscription_tier varchar(20) not null, -- free | pro | premium
  permissions jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Basic indexes
create index if not exists idx_template_permissions_template on public.template_permissions(template_id);
create index if not exists idx_template_permissions_tier on public.template_permissions(subscription_tier);
create index if not exists idx_template_permissions_active on public.template_permissions(is_active);

-- Maintain updated_at
create trigger if not exists trg_template_permissions_set_updated
before update on public.template_permissions
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.template_permissions enable row level security;

-- Public (anon) can select only active permissions
create policy if not exists template_permissions_select_anon
on public.template_permissions
for select
to anon
using (is_active = true);

-- Authenticated can select active permissions as well
create policy if not exists template_permissions_select_auth
on public.template_permissions
for select
to authenticated
using (is_active = true);

-- Only super admins can insert/update/delete
-- relies on helper function public.is_super_admin(user_id uuid) returning boolean
create policy if not exists template_permissions_modify_super_admin
on public.template_permissions
for all
to authenticated
using (public.is_super_admin(auth.uid()))
with check (public.is_super_admin(auth.uid()));

-- Optional: seed example mappings (idempotent, safe during development)
-- Note: This section assumes some templates may already exist. It is safe if none do.
-- insert into public.template_permissions (template_id, subscription_tier, permissions, is_active)
-- select id, 'free', '{}'::jsonb, true from public.business_templates bt
-- on conflict do nothing;