-- Phase 2: Analytics Engine Database Setup

-- Create user activity tracking table
CREATE TABLE public.user_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  activity_type text NOT NULL, -- login, logout, page_view, action_taken, etc.
  activity_data jsonb DEFAULT '{}', -- flexible data storage for activity details
  ip_address inet,
  user_agent text,
  country_code text,
  region text,
  city text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create analytics summary table for quick dashboard queries
CREATE TABLE public.analytics_summaries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type text NOT NULL, -- daily_active_users, weekly_active_users, monthly_registrations, etc.
  metric_date date NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  additional_data jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(metric_type, metric_date)
);

-- Create geographic analytics table
CREATE TABLE public.geographic_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code text NOT NULL,
  country_name text NOT NULL,
  region text,
  user_count integer NOT NULL DEFAULT 0,
  active_businesses integer NOT NULL DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  last_updated timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(country_code)
);

-- Enable RLS on analytics tables
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_activities (users can only see their own, admins see all)
CREATE POLICY "Users can view their own activities"
ON public.user_activities
FOR SELECT 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "System can insert activities"
ON public.user_activities
FOR INSERT 
WITH CHECK (true); -- Allow system to insert activities

-- RLS policies for analytics_summaries (admin/hub manager only)
CREATE POLICY "Admins can view analytics summaries"
ON public.analytics_summaries
FOR SELECT 
USING (is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Admins can manage analytics summaries"
ON public.analytics_summaries
FOR ALL 
USING (is_admin_or_hub_manager(auth.uid()));

-- RLS policies for geographic_analytics (admin/hub manager only)
CREATE POLICY "Admins can view geographic analytics"
ON public.geographic_analytics
FOR SELECT 
USING (is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Admins can manage geographic analytics"
ON public.geographic_analytics
FOR ALL 
USING (is_admin_or_hub_manager(auth.uid()));

-- Add updated_at trigger for analytics_summaries
CREATE TRIGGER update_analytics_summaries_updated_at
BEFORE UPDATE ON public.analytics_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_type_date ON public.user_activities(activity_type, created_at);
CREATE INDEX idx_user_activities_country ON public.user_activities(country_code);
CREATE INDEX idx_analytics_summaries_metric_date ON public.analytics_summaries(metric_type, metric_date);
CREATE INDEX idx_geographic_analytics_country ON public.geographic_analytics(country_code);

-- Create function to update geographic analytics
CREATE OR REPLACE FUNCTION public.update_geographic_analytics()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.geographic_analytics (country_code, country_name, user_count, active_businesses)
  SELECT 
    COALESCE(ua.country_code, 'Unknown') as country_code,
    CASE 
      WHEN ua.country_code = 'KE' THEN 'Kenya'
      WHEN ua.country_code = 'TZ' THEN 'Tanzania'
      WHEN ua.country_code = 'UG' THEN 'Uganda'
      WHEN ua.country_code = 'RW' THEN 'Rwanda'
      WHEN ua.country_code = 'ET' THEN 'Ethiopia'
      WHEN ua.country_code = 'GH' THEN 'Ghana'
      WHEN ua.country_code = 'NG' THEN 'Nigeria'
      WHEN ua.country_code = 'ZA' THEN 'South Africa'
      WHEN ua.country_code = 'EG' THEN 'Egypt'
      WHEN ua.country_code = 'MA' THEN 'Morocco'
      ELSE 'Unknown'
    END as country_name,
    COUNT(DISTINCT ua.user_id) as user_count,
    COUNT(DISTINCT b.id) as active_businesses
  FROM public.user_activities ua
  LEFT JOIN public.businesses b ON b.user_id = ua.user_id AND b.is_active = true
  WHERE ua.activity_type = 'login'
  GROUP BY ua.country_code
  ON CONFLICT (country_code) 
  DO UPDATE SET 
    user_count = EXCLUDED.user_count,
    active_businesses = EXCLUDED.active_businesses,
    last_updated = now();
$$;