-- Migration: Link financial_transactions to strategies
-- Generated: 2025-10-05

-- 1) Add strategy_id column
ALTER TABLE public.financial_transactions
ADD COLUMN IF NOT EXISTS strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE;

-- 2) Create index
CREATE INDEX IF NOT EXISTS idx_financial_transactions_strategy_id ON public.financial_transactions(strategy_id);

-- 3) Attempt to populate strategy_id from business_id via strategies (if businesses exist)
UPDATE public.financial_transactions ft
SET strategy_id = (
  SELECT s.id FROM public.strategies s WHERE s.business_id = ft.business_id ORDER BY s.created_at LIMIT 1
)
WHERE strategy_id IS NULL AND ft.business_id IS NOT NULL;

-- 4) If there are no strategy references and the table allows nulls, decide whether to set NOT NULL. Here we set NOT NULL only if no rows remain NULL.
DO $$
DECLARE
  null_count integer;
BEGIN
  SELECT COUNT(*) INTO null_count FROM public.financial_transactions WHERE strategy_id IS NULL;
  IF null_count = 0 THEN
    ALTER TABLE public.financial_transactions ALTER COLUMN strategy_id SET NOT NULL;
  ELSE
    RAISE NOTICE 'strategy_id contains % NULL values; leaving column nullable for manual reconciliation.', null_count;
  END IF;
END $$;

-- 5) Drop the old business_id column if it exists and is unused (optional)
ALTER TABLE public.financial_transactions DROP COLUMN IF EXISTS business_id;

-- 6) Update RLS policies to reference strategy_id (policies may be updated elsewhere too)
DO $$
BEGIN
  -- Replace policies to check strategy ownership where applicable
  DROP POLICY IF EXISTS "Users can view their own transactions" ON public.financial_transactions;
  DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.financial_transactions;
  DROP POLICY IF EXISTS "Users can update their own transactions" ON public.financial_transactions;
  DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.financial_transactions;

  CREATE POLICY "Users can view their own transactions"
  ON public.financial_transactions
  FOR SELECT
  USING (
    auth.uid() = user_id
    AND (
      EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = financial_transactions.strategy_id AND s.user_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
    )
  );

  CREATE POLICY "Users can insert their own transactions"
  ON public.financial_transactions
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = new.strategy_id AND s.user_id = auth.uid())
  );

  CREATE POLICY "Users can update their own transactions"
  ON public.financial_transactions
  FOR UPDATE
  USING (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = financial_transactions.strategy_id AND s.user_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = new.strategy_id AND s.user_id = auth.uid())
  );

  CREATE POLICY "Users can delete their own transactions"
  ON public.financial_transactions
  FOR DELETE
  USING (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.strategies s WHERE s.id = financial_transactions.strategy_id AND s.user_id = auth.uid())
  );
END $$;

-- Finish
DO $$ BEGIN RAISE NOTICE 'Linked financial_transactions to strategies (if possible)'; END $$;
