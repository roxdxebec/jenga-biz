-- Migration: 20251005121000_drop_legacy_tables.sql
-- Purpose: Drop legacy tables which have been replaced by new canonical tables.
-- WARNING: Destructive. Run the backup migration first and verify backups.

BEGIN;

-- Safely drop business_milestones if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_milestones') THEN
    RAISE NOTICE 'Dropping table public.business_milestones';
    EXECUTE 'DROP TABLE public.business_milestones CASCADE';
  ELSE
    RAISE NOTICE 'Table public.business_milestones not found, skipping';
  END IF;
END$$;

-- Safely drop financial_records legacy table if you have an older version; ensure the canonical table exists before dropping
-- Safely drop business_financials (legacy) if it exists. IMPORTANT: we do NOT drop `financial_records`.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'business_financials') THEN
    RAISE NOTICE 'Dropping table public.business_financials';
    EXECUTE 'DROP TABLE public.business_financials CASCADE';
  ELSE
    RAISE NOTICE 'Table public.business_financials not found, skipping';
  END IF;
END$$;

COMMIT;

-- Notes:
-- 1) This migration assumes backups have been taken (see 20251005120000_backup_legacy_tables.sql).
-- 2) If you want to drop `financial_transactions` as well (not recommended), remove the protective checks and add a DROP TABLE statement.
