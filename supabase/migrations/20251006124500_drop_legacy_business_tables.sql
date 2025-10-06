-- Destructive migration: backup and drop legacy business_milestones and financial_records
BEGIN;

-- Create backups with timestamp suffix
DO $$
DECLARE
  ts text := to_char(now(), 'YYYYMMDD_HH24MISS');
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'business_milestones') THEN
    EXECUTE format('CREATE TABLE IF NOT EXISTS public.business_milestones_backup_%s AS TABLE public.business_milestones WITH DATA', ts);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financial_records') THEN
    EXECUTE format('CREATE TABLE IF NOT EXISTS public.financial_records_backup_%s AS TABLE public.financial_records WITH DATA', ts);
  END IF;
END$$;

-- Drop legacy tables if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'business_milestones') THEN
    DROP TABLE public.business_milestones CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financial_records') THEN
    DROP TABLE public.financial_records CASCADE;
  END IF;
END$$;

-- Clean up any RLS policies or triggers referencing these tables is recommended but not automated here.

COMMIT;

-- WARNING: This migration is destructive. Ensure backups were verified before applying to production.
