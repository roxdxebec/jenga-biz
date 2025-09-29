-- Business Templates schema migration
-- Creates business_templates table with basic RLS policies

-- Ensure pgcrypto for gen_random_uuid
create extension if not exists pgcrypto;

create table if not exists public.business_templates (
  id uuid primary key default gen_random_uuid(),
  name varchar(200) not null,
  description text,
  category varchar(100),
  template_config jsonb not null,
  is_active boolean not null default true,
  version integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists idx_business_templates_active on public.business_templates(is_active);
create index if not exists idx_business_templates_category on public.business_templates(category);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_business_templates_set_updated
before update on public.business_templates
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.business_templates enable row level security;

-- Public/anon can select only active templates
create policy if not exists business_templates_select_anon
on public.business_templates
for select
to anon
using (is_active = true);

-- Authenticated can select active templates too
create policy if not exists business_templates_select_auth
on public.business_templates
for select
to authenticated
using (is_active = true);

-- Only super admins can insert/update/delete templates
-- relies on helper function public.is_super_admin(user_id uuid) returning boolean
create policy if not exists business_templates_modify_super_admin
on public.business_templates
for all
to authenticated
using (public.is_super_admin(auth.uid()))
with check (public.is_super_admin(auth.uid()));
