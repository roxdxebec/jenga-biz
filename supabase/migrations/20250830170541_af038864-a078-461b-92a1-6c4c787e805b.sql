-- Create business_progress_stages table for tracking user progress through strategy building stages
CREATE TABLE public.business_progress_stages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  strategy_id uuid NULL,
  stage_name text NOT NULL,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone NULL,
  time_spent_seconds integer DEFAULT 0,
  form_fields_completed integer DEFAULT 0,
  total_form_fields integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create template_usage_analytics table for tracking template selection and completion
CREATE TABLE public.template_usage_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  template_id text NOT NULL,
  template_name text NOT NULL,
  selected_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone NULL,
  completion_percentage numeric DEFAULT 0,
  time_to_complete_minutes integer NULL,
  abandoned_at_stage text NULL,
  conversion_type text NULL, -- 'completed', 'abandoned', 'partial'
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_journey_analytics table for drop-off point analysis
CREATE TABLE public.user_journey_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  page_path text NOT NULL,
  action_type text NOT NULL, -- 'page_view', 'form_interaction', 'button_click', 'exit'
  action_data jsonb DEFAULT '{}',
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  user_agent text NULL,
  referrer text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create milestone_completion_analytics table for business milestone tracking
CREATE TABLE public.milestone_completion_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_id uuid NULL,
  milestone_title text NOT NULL,
  milestone_category text NULL,
  target_date date NULL,
  completed_at timestamp with time zone NULL,
  status text NOT NULL DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'overdue'
  days_to_complete integer NULL,
  business_stage text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all analytics tables
ALTER TABLE public.business_progress_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journey_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_completion_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for business_progress_stages
CREATE POLICY "Users can view their own progress stages" 
ON public.business_progress_stages 
FOR SELECT 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "System can insert progress stages" 
ON public.business_progress_stages 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress stages" 
ON public.business_progress_stages 
FOR UPDATE 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

-- Create RLS policies for template_usage_analytics
CREATE POLICY "Users can view their own template analytics" 
ON public.template_usage_analytics 
FOR SELECT 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "System can insert template analytics" 
ON public.template_usage_analytics 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own template analytics" 
ON public.template_usage_analytics 
FOR UPDATE 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

-- Create RLS policies for user_journey_analytics
CREATE POLICY "Users can view their own journey analytics" 
ON public.user_journey_analytics 
FOR SELECT 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "System can insert journey analytics" 
ON public.user_journey_analytics 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create RLS policies for milestone_completion_analytics
CREATE POLICY "Users can manage their own milestone analytics" 
ON public.milestone_completion_analytics 
FOR ALL 
USING (user_id = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

-- Create triggers for updated_at timestamp
CREATE TRIGGER update_milestone_completion_analytics_updated_at
BEFORE UPDATE ON public.milestone_completion_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_business_progress_stages_user_id ON public.business_progress_stages(user_id);
CREATE INDEX idx_business_progress_stages_stage ON public.business_progress_stages(stage_name);
CREATE INDEX idx_template_usage_analytics_user_id ON public.template_usage_analytics(user_id);
CREATE INDEX idx_template_usage_analytics_template ON public.template_usage_analytics(template_id);
CREATE INDEX idx_user_journey_analytics_user_id ON public.user_journey_analytics(user_id);
CREATE INDEX idx_user_journey_analytics_session ON public.user_journey_analytics(session_id);
CREATE INDEX idx_milestone_completion_analytics_user_id ON public.milestone_completion_analytics(user_id);
CREATE INDEX idx_milestone_completion_analytics_business ON public.milestone_completion_analytics(business_id);

-- Create function to calculate completion rates
CREATE OR REPLACE FUNCTION public.calculate_stage_completion_rates()
RETURNS TABLE(
  stage_name text,
  total_starts bigint,
  total_completions bigint,
  completion_rate numeric,
  avg_time_to_complete numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    bps.stage_name,
    COUNT(*) as total_starts,
    COUNT(bps.completed_at) as total_completions,
    ROUND(
      (COUNT(bps.completed_at)::numeric / COUNT(*)::numeric) * 100, 2
    ) as completion_rate,
    ROUND(
      AVG(
        CASE 
          WHEN bps.completed_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (bps.completed_at - bps.started_at)) / 60.0 
          ELSE NULL 
        END
      ), 2
    ) as avg_time_to_complete
  FROM public.business_progress_stages bps
  GROUP BY bps.stage_name
  ORDER BY total_starts DESC;
$$;

-- Create function to analyze drop-off points
CREATE OR REPLACE FUNCTION public.analyze_drop_off_points()
RETURNS TABLE(
  page_path text,
  total_entries bigint,
  total_exits bigint,
  drop_off_rate numeric,
  avg_time_on_page numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH page_entries AS (
    SELECT page_path, COUNT(*) as entries
    FROM public.user_journey_analytics 
    WHERE action_type = 'page_view'
    GROUP BY page_path
  ),
  page_exits AS (
    SELECT page_path, COUNT(*) as exits
    FROM public.user_journey_analytics 
    WHERE action_type = 'exit'
    GROUP BY page_path
  ),
  page_times AS (
    SELECT 
      page_path,
      AVG(
        CASE 
          WHEN action_data->>'time_on_page' IS NOT NULL 
          THEN (action_data->>'time_on_page')::numeric 
          ELSE NULL 
        END
      ) as avg_time
    FROM public.user_journey_analytics 
    WHERE action_type = 'exit'
    GROUP BY page_path
  )
  SELECT 
    pe.page_path,
    pe.entries as total_entries,
    COALESCE(px.exits, 0) as total_exits,
    ROUND(
      (COALESCE(px.exits, 0)::numeric / pe.entries::numeric) * 100, 2
    ) as drop_off_rate,
    ROUND(COALESCE(pt.avg_time, 0), 2) as avg_time_on_page
  FROM page_entries pe
  LEFT JOIN page_exits px ON pe.page_path = px.page_path
  LEFT JOIN page_times pt ON pe.page_path = pt.page_path
  ORDER BY drop_off_rate DESC;
$$;