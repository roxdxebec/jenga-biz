-- Phase 1: Critical Security Fixes

-- 1. Fix Profile Data Exposure - Strengthen RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Add policy for admins to view profiles when needed for user management
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (is_admin_or_hub_manager(auth.uid()));

-- 2. Create audit logging table for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  changed_by_user_id uuid NOT NULL,
  target_user_id uuid NOT NULL,
  old_role user_role,
  new_role user_role NOT NULL,
  action_type text NOT NULL CHECK (action_type IN ('add', 'remove')),
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text
);

-- Enable RLS on audit table
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view role change audit" 
ON public.role_change_audit 
FOR SELECT 
USING (is_admin_or_hub_manager(auth.uid()));

-- System can insert audit records
CREATE POLICY "System can insert audit records" 
ON public.role_change_audit 
FOR INSERT 
WITH CHECK (changed_by_user_id = auth.uid() AND is_admin_or_hub_manager(auth.uid()));

-- 3. Create function to safely add user roles with audit logging
CREATE OR REPLACE FUNCTION public.add_user_role_with_audit(
  target_user_id uuid,
  new_role user_role,
  requester_ip inet DEFAULT NULL,
  requester_user_agent text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_id uuid;
  existing_role user_role;
BEGIN
  -- Get the requester's user ID
  requester_id := auth.uid();
  
  -- Check if requester has admin privileges
  IF NOT is_admin_or_hub_manager(requester_id) THEN
    RAISE EXCEPTION 'Insufficient privileges to add user roles';
  END IF;
  
  -- Prevent self-privilege escalation to super_admin
  IF requester_id = target_user_id AND new_role = 'super_admin' THEN
    RAISE EXCEPTION 'Cannot grant super_admin role to yourself';
  END IF;
  
  -- Check if role already exists
  SELECT role INTO existing_role 
  FROM public.user_roles 
  WHERE user_id = target_user_id AND role = new_role;
  
  IF existing_role IS NOT NULL THEN
    RETURN false; -- Role already exists
  END IF;
  
  -- Insert the new role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role);
  
  -- Log the change
  INSERT INTO public.role_change_audit (
    changed_by_user_id, 
    target_user_id, 
    new_role, 
    action_type,
    ip_address,
    user_agent
  )
  VALUES (
    requester_id, 
    target_user_id, 
    new_role, 
    'add',
    requester_ip,
    requester_user_agent
  );
  
  RETURN true;
END;
$$;

-- 4. Create function to safely remove user roles with audit logging
CREATE OR REPLACE FUNCTION public.remove_user_role_with_audit(
  target_user_id uuid,
  old_role user_role,
  requester_ip inet DEFAULT NULL,
  requester_user_agent text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requester_id uuid;
  role_exists boolean;
BEGIN
  -- Get the requester's user ID
  requester_id := auth.uid();
  
  -- Check if requester has admin privileges
  IF NOT is_admin_or_hub_manager(requester_id) THEN
    RAISE EXCEPTION 'Insufficient privileges to remove user roles';
  END IF;
  
  -- Prevent removing super_admin role from yourself
  IF requester_id = target_user_id AND old_role = 'super_admin' THEN
    RAISE EXCEPTION 'Cannot remove super_admin role from yourself';
  END IF;
  
  -- Check if role exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id AND role = old_role
  ) INTO role_exists;
  
  IF NOT role_exists THEN
    RETURN false; -- Role doesn't exist
  END IF;
  
  -- Log the change before removal
  INSERT INTO public.role_change_audit (
    changed_by_user_id, 
    target_user_id, 
    old_role, 
    action_type,
    ip_address,
    user_agent
  )
  VALUES (
    requester_id, 
    target_user_id, 
    old_role, 
    'remove',
    requester_ip,
    requester_user_agent
  );
  
  -- Remove the role
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id AND role = old_role;
  
  RETURN true;
END;
$$;

-- 5. Add trigger to prevent direct manipulation of user_roles table
CREATE OR REPLACE FUNCTION public.prevent_direct_role_manipulation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow the secure functions to operate
  IF current_setting('application_name', true) = 'secure_role_function' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  
  -- Block direct INSERT/UPDATE/DELETE operations on user_roles
  RAISE EXCEPTION 'Direct manipulation of user_roles table is not allowed. Use add_user_role_with_audit() or remove_user_role_with_audit() functions.';
END;
$$;

-- Apply the trigger to user_roles table
DROP TRIGGER IF EXISTS prevent_direct_role_changes ON public.user_roles;
CREATE TRIGGER prevent_direct_role_changes
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_direct_role_manipulation();