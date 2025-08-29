-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('entrepreneur', 'hub_manager', 'admin', 'super_admin');

-- Create enum for business stages
CREATE TYPE public.business_stage AS ENUM ('idea', 'launch', 'growth', 'scale');

-- Create enum for milestone types
CREATE TYPE public.milestone_type AS ENUM ('business_registration', 'first_customer', 'first_hire', 'break_even', 'loan_application', 'investment_ready');

-- Create hubs table for tracking regions/organizations
CREATE TABLE public.hubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role user_role NOT NULL DEFAULT 'entrepreneur',
  hub_id UUID REFERENCES public.hubs(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  hub_id UUID REFERENCES public.hubs(id),
  name TEXT NOT NULL,
  business_type TEXT,
  stage business_stage DEFAULT 'idea',
  description TEXT,
  registration_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business_milestones table
CREATE TABLE public.business_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  milestone_type milestone_type NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financial_records table
CREATE TABLE public.financial_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  revenue DECIMAL(15,2) DEFAULT 0,
  expenses DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, record_date)
);

-- Create job_creation_records table
CREATE TABLE public.job_creation_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  jobs_created INTEGER NOT NULL DEFAULT 0,
  job_type TEXT,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_creation_records ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is admin or hub manager
CREATE OR REPLACE FUNCTION public.is_admin_or_hub_manager(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin', 'hub_manager')
  )
$$;

-- RLS Policies for hubs
CREATE POLICY "Admins and hub managers can view hubs"
ON public.hubs FOR SELECT
TO authenticated
USING (public.is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Admins can manage hubs"
ON public.hubs FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for businesses
CREATE POLICY "Users can view their own businesses"
ON public.businesses FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Users can create their own businesses"
ON public.businesses FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own businesses"
ON public.businesses FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()));

-- RLS Policies for business_milestones
CREATE POLICY "Users can manage milestones for their businesses"
ON public.business_milestones FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b 
    WHERE b.id = business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()))
  )
);

-- RLS Policies for financial_records
CREATE POLICY "Users can manage financial records for their businesses"
ON public.financial_records FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b 
    WHERE b.id = business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()))
  )
);

-- RLS Policies for job_creation_records
CREATE POLICY "Users can manage job records for their businesses"
ON public.job_creation_records FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b 
    WHERE b.id = business_id AND (b.user_id = auth.uid() OR public.is_admin_or_hub_manager(auth.uid()))
  )
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_hubs_updated_at
  BEFORE UPDATE ON public.hubs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_records_updated_at
  BEFORE UPDATE ON public.financial_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();