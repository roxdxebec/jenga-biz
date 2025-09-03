-- Critical Security Fixes - Add missing components only

-- 1. Create audit logging table for role changes
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

-- Enable RLS on audit table if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'role_change_audit' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for audit table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'role_change_audit' 
    AND policyname = 'Admins can view role change audit'
  ) THEN
    CREATE POLICY "Admins can view role change audit" 
    ON public.role_change_audit 
    FOR SELECT 
    USING (is_admin_or_hub_manager(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'role_change_audit' 
    AND policyname = 'System can insert audit records'
  ) THEN
    CREATE POLICY "System can insert audit records" 
    ON public.role_change_audit 
    FOR INSERT 
    WITH CHECK (changed_by_user_id = auth.uid() AND is_admin_or_hub_manager(auth.uid()));
  END IF;
END $$;

-- 2. Create secure function to add user roles with audit logging
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
  
  -- Insert the new role (bypassing trigger)
  SET application_name = 'secure_role_function';
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role);
  RESET application_name;
  
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

-- 3. Create secure function to remove user roles with audit logging
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
  
  -- Remove the role (bypassing trigger)
  SET application_name = 'secure_role_function';
  DELETE FROM public.user_roles 
  WHERE user_id = target_user_id AND role = old_role;
  RESET application_name;
  
  RETURN true;
END;
$$;