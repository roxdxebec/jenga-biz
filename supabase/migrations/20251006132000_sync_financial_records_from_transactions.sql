-- Create function and trigger to keep financial_records in sync with financial_transactions
BEGIN;

-- Function: sync_financial_records()
-- This function aggregates transactions for the affected business and date, then upserts into financial_records
CREATE OR REPLACE FUNCTION public.sync_financial_records() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  affected_strategy_id uuid;
  affected_business_id uuid;
  affected_date date;
  agg_amount numeric;
  agg_metric text := 'aggregate';
  agg_revenue numeric := 0;
  agg_expenses numeric := 0;
BEGIN
  -- Determine the row that caused the trigger (handle INSERT/UPDATE/DELETE)
  IF (TG_OP = 'DELETE') THEN
    affected_strategy_id := OLD.strategy_id;
    affected_date := (OLD.transaction_date)::date;
  ELSE
    affected_strategy_id := NEW.strategy_id;
    affected_date := (NEW.transaction_date)::date;
  END IF;

  -- Resolve business_id via strategies table when available
  SELECT s.business_id INTO affected_business_id FROM public.strategies s WHERE s.id = affected_strategy_id LIMIT 1;

  IF affected_business_id IS NULL THEN
    -- Nothing to sync if we can't map to a business
    RETURN NULL;
  END IF;

  -- Aggregate revenue and expenses for this business and date
  SELECT
    COALESCE(SUM(ft.amount), 0) AS total_amount,
    COALESCE(SUM(CASE WHEN ft.amount > 0 THEN ft.amount ELSE 0 END), 0) AS total_revenue,
    COALESCE(SUM(CASE WHEN ft.amount < 0 THEN ABS(ft.amount) ELSE 0 END), 0) AS total_expenses
  INTO agg_amount, agg_revenue, agg_expenses
  FROM public.financial_transactions ft
  LEFT JOIN public.strategies s ON s.id = ft.strategy_id
  WHERE s.business_id = affected_business_id
    AND ft.transaction_date::date = affected_date;

  agg_metric := 'aggregate';

  -- Upsert into financial_records with revenue/expenses split
  INSERT INTO public.financial_records (business_id, record_date, amount, revenue, expenses, metric_type, updated_at, created_at)
  VALUES (affected_business_id, affected_date, agg_amount, agg_revenue, agg_expenses, agg_metric, now(), now())
  ON CONFLICT (business_id, record_date) DO UPDATE
    SET amount = EXCLUDED.amount,
        revenue = EXCLUDED.revenue,
        expenses = EXCLUDED.expenses,
        metric_type = EXCLUDED.metric_type,
        updated_at = now();

  RETURN NULL;
END;
$$;

-- Create trigger on financial_transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_sync_financial_records'
  ) THEN
    CREATE TRIGGER trg_sync_financial_records
    AFTER INSERT OR UPDATE OR DELETE
    ON public.financial_transactions
    FOR EACH ROW
    EXECUTE PROCEDURE public.sync_financial_records();
  END IF;
END$$;

COMMIT;

COMMENT ON FUNCTION public.sync_financial_records() IS 'Aggregate transactions and upsert into financial_records for the mapped business_id and date';
