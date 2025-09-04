-- Create strategies table for persistent data
CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT,
  template_name TEXT,
  business_name TEXT,
  vision TEXT,
  mission TEXT,
  target_market TEXT,
  revenue_model TEXT,
  value_proposition TEXT,
  key_partners TEXT,
  marketing_approach TEXT,
  operational_needs TEXT,
  growth_goals TEXT,
  language TEXT DEFAULT 'en',
  country TEXT DEFAULT 'KE',
  currency TEXT DEFAULT 'KES',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table for persistent milestone tracking
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date DATE,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'complete', 'overdue')),
  business_stage TEXT DEFAULT 'ideation' CHECK (business_stage IN ('ideation', 'early', 'growth')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update profiles table with enhanced fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_person_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_person_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'KE';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;

-- Enable RLS
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for strategies
CREATE POLICY "Users can manage their own strategies"
ON public.strategies
FOR ALL
USING (user_id = auth.uid());

-- Create RLS policies for milestones  
CREATE POLICY "Users can manage their own milestones"
ON public.milestones
FOR ALL
USING (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_strategies_updated_at
BEFORE UPDATE ON public.strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON public.milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();