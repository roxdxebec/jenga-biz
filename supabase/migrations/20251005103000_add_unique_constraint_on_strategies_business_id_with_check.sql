-- Migration: Add UNIQUE constraint on strategies.business_id with pre-check for duplicates
-- Generated: 2025-10-05

DO $$
DECLARE
  dup_count integer;
  dup_list text;
BEGIN
  -- Count business_id occurrences excluding NULLs
  SELECT count(*) INTO dup_count
  FROM (
    SELECT business_id
    FROM public.strategies
    WHERE business_id IS NOT NULL
    GROUP BY business_id
    HAVING count(*) > 1
  ) t;

  IF dup_count > 0 THEN
    -- Build a sample list of offending business_ids
    SELECT string_agg(business_id::text, ', ' ORDER BY business_id) INTO dup_list
    FROM (
      SELECT business_id
      FROM public.strategies
      WHERE business_id IS NOT NULL
      GROUP BY business_id
      HAVING count(*) > 1
      LIMIT 50
    ) t;

    RAISE EXCEPTION 'Cannot add UNIQUE constraint on strategies.business_id: found % duplicate business_id groups. Sample business_ids: %', dup_count, COALESCE(dup_list, 'none');
  END IF;

  -- If no duplicates, add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'strategies' AND c.contype = 'u' AND array_to_string(c.conkey, ',') ILIKE '%'
  ) THEN
    ALTER TABLE public.strategies
    ADD CONSTRAINT IF NOT EXISTS unique_business_strategy UNIQUE (business_id);
  END IF;
END $$;

-- Note: If you want stricter detection, run a separate query to list all duplicate rows for manual resolution before applying.
