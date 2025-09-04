-- Fix the handle_new_user trigger function to handle potential errors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with proper error handling
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    account_type,
    is_profile_complete
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'account_type', 'business'),
    false
  );
  
  -- Insert user role with error handling
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data ->> 'account_type', 'business') = 'organization' 
      THEN 'hub_manager'::user_role
      ELSE 'entrepreneur'::user_role
    END
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;