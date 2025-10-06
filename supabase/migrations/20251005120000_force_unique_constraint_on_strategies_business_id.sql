-- Migration: FORCE add UNIQUE constraint on strategies.business_id
-- WARNING: This is unconditional and will fail if duplicate business_id values exist.
-- Generated: 2025-10-05

ALTER TABLE public.strategies
ADD CONSTRAINT unique_business_strategy UNIQUE (business_id);

-- If the above fails due to duplicates, inspect duplicates and resolve before re-running.
