-- Edge Functions Support Migration
-- Creates tables and functions to support the new edge-first architecture

-- ===================================
-- FINANCIAL TRANSACTIONS TABLE
-- ===================================

-- Create financial_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id uuid NULL, -- Reference to business strategy if applicable
  transaction_type text NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'KES',
  category text NOT NULL,
  description text,
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON public.financial_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON public.financial_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON public.financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_currency ON public.financial_transactions(currency);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON public.financial_transactions(category);

-- ===================================
-- OCR JOBS TABLE
-- ===================================

-- Create ocr_jobs table for receipt/document processing
CREATE TABLE IF NOT EXISTS public.ocr_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_type text DEFAULT 'image/jpeg',
  expected_type text DEFAULT 'receipt' CHECK (expected_type IN ('receipt', 'invoice', 'document')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result jsonb DEFAULT '{}',
  error_message text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for OCR jobs
CREATE INDEX IF NOT EXISTS idx_ocr_jobs_user_id ON public.ocr_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ocr_jobs_status ON public.ocr_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ocr_jobs_created_at ON public.ocr_jobs(created_at);

-- ===================================
-- ROW LEVEL SECURITY
-- ===================================

-- Enable RLS on financial_transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for financial_transactions
CREATE POLICY "Users can manage their own transactions" 
ON public.financial_transactions 
FOR ALL 
USING (user_id = auth.uid());

-- Enable RLS on ocr_jobs
ALTER TABLE public.ocr_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ocr_jobs
CREATE POLICY "Users can manage their own OCR jobs" 
ON public.ocr_jobs 
FOR ALL 
USING (user_id = auth.uid());

-- ===================================
-- TRIGGERS
-- ===================================

-- Update triggers for automatic timestamp updates
CREATE TRIGGER update_financial_transactions_updated_at
BEFORE UPDATE ON public.financial_transactions
FOR EACH ROW
EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TRIGGER update_ocr_jobs_updated_at
BEFORE UPDATE ON public.ocr_jobs
FOR EACH ROW
EXECUTE FUNCTION public.tg_set_updated_at();

-- ===================================
-- HELPER FUNCTIONS
-- ===================================

-- Function to check if user has admin or manager role (used in some policies)
CREATE OR REPLACE FUNCTION public.is_admin_or_hub_manager(p_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = COALESCE(p_user_id, auth.uid())
      AND ur.role IN ('admin', 'super_admin', 'hub_manager')
  );
$$;

-- Function to get user's financial summary (server-side calculation)
CREATE OR REPLACE FUNCTION public.get_financial_summary(
  p_user_id uuid DEFAULT NULL,
  p_currency text DEFAULT 'KES',
  p_date_from date DEFAULT NULL,
  p_date_to date DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_total_income numeric := 0;
  v_total_expenses numeric := 0;
  v_income_count integer := 0;
  v_expense_count integer := 0;
  v_result jsonb;
BEGIN
  -- Use provided user_id or current authenticated user
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  -- Verify user can access this data (themselves or admin)
  IF v_user_id != auth.uid() AND NOT public.is_admin_or_hub_manager(auth.uid()) THEN
    RAISE EXCEPTION 'insufficient_privileges' USING HINT = 'You can only access your own financial data';
  END IF;

  -- Calculate income totals
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(*)
  INTO v_total_income, v_income_count
  FROM public.financial_transactions
  WHERE user_id = v_user_id
    AND transaction_type = 'income'
    AND currency = p_currency
    AND (p_date_from IS NULL OR transaction_date >= p_date_from)
    AND (p_date_to IS NULL OR transaction_date <= p_date_to);

  -- Calculate expense totals
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(*)
  INTO v_total_expenses, v_expense_count
  FROM public.financial_transactions
  WHERE user_id = v_user_id
    AND transaction_type = 'expense'
    AND currency = p_currency
    AND (p_date_from IS NULL OR transaction_date >= p_date_from)
    AND (p_date_to IS NULL OR transaction_date <= p_date_to);

  -- Build result JSON
  v_result := jsonb_build_object(
    'currency', p_currency,
    'totals', jsonb_build_object(
      'income', v_total_income,
      'expenses', v_total_expenses,
      'netProfit', v_total_income - v_total_expenses,
      'profitMargin', CASE 
        WHEN v_total_income > 0 THEN ROUND(((v_total_income - v_total_expenses) / v_total_income * 100)::numeric, 2)
        ELSE 0 
      END
    ),
    'transactionCounts', jsonb_build_object(
      'income', v_income_count,
      'expenses', v_expense_count,
      'total', v_income_count + v_expense_count
    )
  );

  RETURN v_result;
END;
$$;

-- ===================================
-- GRANTS
-- ===================================

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.is_admin_or_hub_manager(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_financial_summary(uuid, text, date, date) TO authenticated;

-- ===================================
-- COMMENTS
-- ===================================

COMMENT ON TABLE public.financial_transactions IS 'User financial transactions with RLS enforcement';
COMMENT ON TABLE public.ocr_jobs IS 'OCR processing jobs for receipts and documents';
COMMENT ON FUNCTION public.get_financial_summary(uuid, text, date, date) IS 'Calculate financial summary with security checks';

-- ===================================
-- DATA CONSISTENCY CHECKS
-- ===================================

-- Add constraint to ensure profile fields are used correctly
-- This helps maintain data consistency when migrating from frontend validation
ALTER TABLE public.profiles 
ADD CONSTRAINT IF NOT EXISTS profiles_account_type_check 
CHECK (account_type IN ('business', 'organization', 'individual', 'deactivated'));

-- Ensure user_roles table exists with proper constraints
CREATE TABLE IF NOT EXISTS public.user_roles (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('entrepreneur', 'hub_manager', 'admin', 'super_admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create index on user_roles if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Enable RLS on user_roles if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roles (admin access only for management)
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'super_admin')
  )
);

-- Allow users to read their own roles
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());