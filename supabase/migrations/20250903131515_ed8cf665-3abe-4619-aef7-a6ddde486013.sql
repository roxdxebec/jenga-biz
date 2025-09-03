-- Fix RLS policies to prevent unauthorized access to sensitive data
-- Drop existing problematic policies and recreate with proper restrictions

-- Fix profiles table policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure policies for profiles table (authenticated users only)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Fix invite_codes table policies  
DROP POLICY IF EXISTS "Organizations and super admins can create invite codes" ON public.invite_codes;
DROP POLICY IF EXISTS "Users can update invite codes they created" ON public.invite_codes;
DROP POLICY IF EXISTS "Users can view invite codes they created or used" ON public.invite_codes;

CREATE POLICY "Organizations and super admins can create invite codes" 
ON public.invite_codes 
FOR INSERT 
TO authenticated
WITH CHECK (
  (created_by = auth.uid()) AND 
  (is_admin_or_hub_manager(auth.uid()) OR 
   ((account_type = 'business'::text) AND 
    (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.account_type = 'organization'::text))))
);

CREATE POLICY "Users can update invite codes they created" 
ON public.invite_codes 
FOR UPDATE 
TO authenticated
USING ((created_by = auth.uid()) OR is_admin_or_hub_manager(auth.uid()));

CREATE POLICY "Users can view invite codes they created or used" 
ON public.invite_codes 
FOR SELECT 
TO authenticated
USING ((created_by = auth.uid()) OR (used_by = auth.uid()) OR is_admin_or_hub_manager(auth.uid()));

-- Fix user_activities policies
DROP POLICY IF EXISTS "System can insert activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;

CREATE POLICY "System can insert activities" 
ON public.user_activities 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
TO authenticated
USING ((user_id = auth.uid()) OR is_admin_or_hub_manager(auth.uid()));

-- Fix user_journey_analytics policies
DROP POLICY IF EXISTS "System can insert journey analytics" ON public.user_journey_analytics;
DROP POLICY IF EXISTS "Users can view their own journey analytics" ON public.user_journey_analytics;

CREATE POLICY "System can insert journey analytics" 
ON public.user_journey_analytics 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own journey analytics" 
ON public.user_journey_analytics 
FOR SELECT 
TO authenticated
USING ((user_id = auth.uid()) OR is_admin_or_hub_manager(auth.uid()));

-- The hubs table already has proper authenticated policies, so no changes needed