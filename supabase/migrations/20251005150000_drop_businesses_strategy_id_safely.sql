-- Migration: Drop businesses.strategy_id safely
-- Generated: 2025-10-05

DO $$
BEGIN
  -- Only run if column exists
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'businesses' AND column_name = 'strategy_id'
  ) THEN

    -- Ensure there are no non-null values referencing strategies (fail fast with a helpful message)
    IF EXISTS (SELECT 1 FROM public.businesses WHERE strategy_id IS NOT NULL) THEN
      RAISE EXCEPTION 'Cannot drop businesses.strategy_id: non-null values exist. Please migrate those rows first.';
    END IF;

    -- Drop any policies that explicitly reference businesses.strategy_id
    -- (policy names may vary; attempt to drop by trying to drop known names, ignore errors)
    BEGIN
      EXECUTE 'DROP POLICY IF EXISTS businesses_strategy_owner ON public.businesses';
    EXCEPTION WHEN OTHERS THEN
      -- ignore
      NULL;
    END;

    BEGIN
      ALTER TABLE public.businesses DROP COLUMN strategy_id;
    EXCEPTION WHEN OTHERS THEN
      RAISE EXCEPTION 'Failed to drop column businesses.strategy_id: %', SQLERRM;
    END;
  END IF;
END$$;
