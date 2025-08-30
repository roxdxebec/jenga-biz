-- Create loan readiness assessment table
CREATE TABLE public.loan_readiness_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  credit_score INTEGER CHECK (credit_score >= 300 AND credit_score <= 850),
  revenue_stability_score INTEGER CHECK (revenue_stability_score >= 0 AND revenue_stability_score <= 100),
  cash_flow_score INTEGER CHECK (cash_flow_score >= 0 AND cash_flow_score <= 100),
  debt_to_income_ratio NUMERIC(5,2),
  collateral_value NUMERIC(12,2) DEFAULT 0,
  business_plan_score INTEGER CHECK (business_plan_score >= 0 AND business_plan_score <= 100),
  financial_documentation_score INTEGER CHECK (financial_documentation_score >= 0 AND financial_documentation_score <= 100),
  overall_readiness_score INTEGER CHECK (overall_readiness_score >= 0 AND overall_readiness_score <= 100),
  readiness_level TEXT CHECK (readiness_level IN ('not_ready', 'partially_ready', 'loan_ready', 'highly_qualified')),
  recommendations TEXT[],
  assessed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loan_readiness_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage loan assessments for their businesses" 
ON public.loan_readiness_assessments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM businesses b 
  WHERE b.id = loan_readiness_assessments.business_id 
  AND (b.user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()))
));

-- Create access to finance tracking table
CREATE TABLE public.finance_access_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  funding_source TEXT NOT NULL, -- 'bank_loan', 'microfinance', 'grant', 'investor', 'crowdfunding', 'government', 'other'
  funding_type TEXT NOT NULL, -- 'applied', 'approved', 'disbursed', 'rejected'
  amount_requested NUMERIC(12,2),
  amount_approved NUMERIC(12,2),
  amount_disbursed NUMERIC(12,2),
  interest_rate NUMERIC(5,2),
  loan_term_months INTEGER,
  purpose TEXT, -- 'working_capital', 'equipment', 'expansion', 'inventory', 'other'
  application_status TEXT DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected', 'disbursed'
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.finance_access_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage finance access records for their businesses" 
ON public.finance_access_records 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM businesses b 
  WHERE b.id = finance_access_records.business_id 
  AND (b.user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()))
));

-- Create business survival tracking table
CREATE TABLE public.business_survival_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  months_in_operation INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  closure_date DATE,
  closure_reason TEXT, -- 'financial_difficulties', 'market_conditions', 'personal_reasons', 'pivot', 'success_exit', 'other'
  revenue_trend TEXT, -- 'increasing', 'stable', 'declining', 'volatile'
  employee_count INTEGER DEFAULT 0,
  survival_risk_score INTEGER CHECK (survival_risk_score >= 0 AND survival_risk_score <= 100),
  risk_factors TEXT[],
  support_interventions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_survival_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage survival records for their businesses" 
ON public.business_survival_records 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM businesses b 
  WHERE b.id = business_survival_records.business_id 
  AND (b.user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()))
));

-- Enhance job creation records with more details
ALTER TABLE public.job_creation_records 
ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full_time', -- 'full_time', 'part_time', 'contract', 'internship'
ADD COLUMN IF NOT EXISTS skill_level TEXT DEFAULT 'entry', -- 'entry', 'intermediate', 'skilled', 'management'
ADD COLUMN IF NOT EXISTS average_wage NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS benefits_provided BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gender_breakdown JSONB DEFAULT '{"male": 0, "female": 0, "other": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS age_breakdown JSONB DEFAULT '{"18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "55+": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS retention_rate NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_loan_readiness_assessments_updated_at
BEFORE UPDATE ON public.loan_readiness_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_finance_access_records_updated_at
BEFORE UPDATE ON public.finance_access_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_survival_records_updated_at
BEFORE UPDATE ON public.business_survival_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_creation_records_updated_at
BEFORE UPDATE ON public.job_creation_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();