-- Migration: Add UNIQUE constraint on strategies.business_id safely
-- Generated: 2025-10-05

DO $$
DECLARE
  duplicate_record RECORD;
  dup_count int;
  dup_list TEXT := '';
BEGIN
  -- Ensure the column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'strategies' AND column_name = 'business_id'
  ) THEN
    RAISE NOTICE 'Column strategies.business_id does not exist; skipping unique constraint migration.';
    RETURN;
  END IF;

  -- Check for duplicate business_id values (non-null)
  SELECT COUNT(*) INTO dup_count FROM (
    SELECT business_id FROM public.strategies WHERE business_id IS NOT NULL GROUP BY business_id HAVING COUNT(*) > 1
  ) t;

  IF dup_count > 0 THEN
    -- Build a list of duplicates for the error message
    FOR duplicate_record IN
      SELECT business_id, COUNT(*) as cnt FROM public.strategies WHERE business_id IS NOT NULL GROUP BY business_id HAVING COUNT(*) > 1
    LOOP
      dup_list := dup_list || format('%s (count=%s); ', duplicate_record.business_id, duplicate_record.cnt);
    END LOOP;
    RAISE EXCEPTION 'Cannot add UNIQUE constraint to strategies.business_id: duplicate business_id values found: %', dup_list;
  END IF;

  -- Add unique index/constraint if not already present
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE con.contype = 'u' AND nsp.nspname = 'public' AND rel.relname = 'strategies'
  ) THEN
    -- Create a unique index on business_id (if not exists), then add constraint using the index
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'uq_strategies_business_id_idx') THEN
      EXECUTE 'CREATE UNIQUE INDEX uq_strategies_business_id_idx ON public.strategies (business_id) WHERE business_id IS NOT NULL';
    END IF;

    -- Only add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
      WHERE con.conname = 'uq_strategies_business_id'
    ) THEN
      EXECUTE 'ALTER TABLE public.strategies ADD CONSTRAINT uq_strategies_business_id UNIQUE USING INDEX uq_strategies_business_id_idx';
    END IF;
  ELSE
    RAISE NOTICE 'A UNIQUE constraint already exists on table strategies; skipping.';
  END IF;
END$$;
