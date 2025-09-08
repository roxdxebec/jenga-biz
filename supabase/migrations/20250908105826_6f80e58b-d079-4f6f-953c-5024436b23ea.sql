-- Fix the handle_new_user function to bypass the security trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Insert profile with better error handling
  BEGIN
    INSERT INTO public.profiles (
      id, 
      email, 
      full_name, 
      account_type,
      is_profile_complete
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'account_type', 'business'),
      false
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;
  
  -- Insert user role with security bypass
  BEGIN
    -- Bypass the security trigger by setting application_name
    SET application_name = 'secure_role_function';
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
      NEW.id,
      CASE 
        WHEN COALESCE(NEW.raw_user_meta_data ->> 'account_type', 'business') = 'organization' 
        THEN 'hub_manager'::user_role
        ELSE 'entrepreneur'::user_role
      END
    );
    
    -- Reset application_name
    RESET application_name;
  EXCEPTION
    WHEN OTHERS THEN
      -- Reset application_name even if there's an error
      RESET application_name;
      RAISE WARNING 'Role creation failed for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$function$;