-- Backfill financial_records from financial_transactions
BEGIN;

DO $$
DECLARE
  tx_count bigint := 0;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financial_transactions') THEN
    SELECT count(*) INTO tx_count FROM public.financial_transactions;
  END IF;

  IF tx_count = 0 THEN
    RAISE NOTICE 'No financial_transactions found, skipping backfill.';
    RETURN;
  END IF;

  -- Attempt to map transactions to businesses via strategies table if strategy -> business mapping exists
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'strategies') THEN
    -- Insert aggregated daily sums per business using strategies.business_id mapping
    -- Aggregate revenue (positive amounts) and expenses (negative amounts) into separate columns
    INSERT INTO public.financial_records (business_id, record_date, amount, revenue, expenses, metric_type, created_at, updated_at)
    SELECT
      s.business_id as business_id,
      ft.transaction_date::date as record_date,
      SUM(ft.amount) as amount,
      SUM(CASE WHEN ft.amount > 0 THEN ft.amount ELSE 0 END) as revenue,
      SUM(CASE WHEN ft.amount < 0 THEN ABS(ft.amount) ELSE 0 END) as expenses,
      'aggregate' as metric_type,
      now() as created_at,
      now() as updated_at
    FROM public.financial_transactions ft
    LEFT JOIN public.strategies s ON s.id = ft.strategy_id
    WHERE ft.transaction_date IS NOT NULL AND s.business_id IS NOT NULL
    GROUP BY s.business_id, ft.transaction_date
    ON CONFLICT (business_id, record_date) DO UPDATE
      SET amount = EXCLUDED.amount,
          revenue = EXCLUDED.revenue,
          expenses = EXCLUDED.expenses,
          updated_at = now();
  ELSE
    RAISE NOTICE 'Strategies table not present, cannot map transactions to businesses. Manual backfill required.';
  END IF;
END$$;

COMMIT;
