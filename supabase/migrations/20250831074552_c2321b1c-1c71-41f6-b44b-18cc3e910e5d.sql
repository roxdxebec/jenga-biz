-- Create initial super admin setup function
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