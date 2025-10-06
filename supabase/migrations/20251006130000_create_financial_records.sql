-- Create financial_records for aggregated business-level financial snapshots
BEGIN;

CREATE TABLE IF NOT EXISTS public.financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL,
  record_date date NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  metric_type text NOT NULL DEFAULT 'revenue',
  revenue numeric NOT NULL DEFAULT 0,
  expenses numeric NOT NULL DEFAULT 0,
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (business_id, record_date)
);

-- Add FK if businesses table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'businesses') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'financial_records'
    ) THEN
      ALTER TABLE public.financial_records
        ADD CONSTRAINT financial_records_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;
    END IF;
  END IF;
END$$;

COMMIT;

COMMENT ON TABLE public.financial_records IS 'Aggregated financial metrics per business per date (daily/weekly/monthly snapshots)';
