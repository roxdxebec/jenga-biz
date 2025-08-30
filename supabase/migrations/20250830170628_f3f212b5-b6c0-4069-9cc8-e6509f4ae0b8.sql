-- Fix function search path issues by recreating functions with explicit search path
DROP FUNCTION IF EXISTS public.calculate_stage_completion_rates();
DROP FUNCTION IF EXISTS public.analyze_drop_off_points();

-- Recreate calculate_stage_completion_rates function with secure search path
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

-- Recreate analyze_drop_off_points function with secure search path
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