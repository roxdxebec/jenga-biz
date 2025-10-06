-- Add milestone_type column to canonical milestones and populate from business_milestones
BEGIN;

ALTER TABLE IF EXISTS public.milestones
  ADD COLUMN IF NOT EXISTS milestone_type text;

DO $$
BEGIN
  -- Only run if business_milestones exists
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'business_milestones') THEN
    -- Copy milestone_type values for matching IDs
    UPDATE public.milestones m
    SET milestone_type = bm.milestone_type::text
    FROM public.business_milestones bm
    WHERE bm.id = m.id AND (m.milestone_type IS NULL OR m.milestone_type = '');
  END IF;
END$$;

COMMIT;

-- This migration ensures we preserve milestone_type in the canonical milestones table before dropping legacy tables.
