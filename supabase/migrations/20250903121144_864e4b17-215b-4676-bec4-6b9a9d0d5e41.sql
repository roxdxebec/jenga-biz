-- Fix remaining security linter warnings

-- 1. Fix Function Search Path Mutable warnings by updating existing functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_geographic_analytics()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.analyze_drop_off_points()
RETURNS TABLE(page_path text, total_entries bigint, total_exits bigint, drop_off_rate numeric, avg_time_on_page numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, account_type)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'account_type', 'business')
  );
  
  -- Assign default role based on account type
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'account_type' = 'organization' THEN 'hub_manager'::user_role
      ELSE 'entrepreneur'::user_role
    END
  );
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_hub_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'super_admin', 'hub_manager')
  )
$$;

CREATE OR REPLACE FUNCTION public.calculate_stage_completion_rates()
RETURNS TABLE(stage_name text, total_starts bigint, total_completions bigint, completion_rate numeric, avg_time_to_complete numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.setup_super_admin(admin_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the user ID for the provided email
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', admin_email;
    END IF;
    
    -- Insert super_admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'super_admin'::user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Also add admin role for broader permissions
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::user_role)
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN admin_user_id;
END;
$$;