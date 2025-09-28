-- Role and audit functions (idempotent) — add_user_role_with_audit
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'add_user_role_with_audit'
  ) THEN
    EXECUTE $func$
      CREATE FUNCTION public.add_user_role_with_audit(
        target_user_id uuid,
        new_role public.user_role,
        requester_ip inet DEFAULT NULL,
        requester_user_agent text DEFAULT NULL
      )
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path TO public
      AS $body$
      DECLARE
        current_user_id uuid;
      BEGIN
        current_user_id := auth.uid();
        IF NOT public.is_super_admin(current_user_id) THEN
          RAISE EXCEPTION 'Access denied: only super admins can assign roles';
        END IF;
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, new_role)
        ON CONFLICT (user_id, role) DO NOTHING;
        RETURN FOUND;
      END;
      $body$;
    $func$;
  END IF;
END
$$;
-- Role and audit functions (idempotent) — remove_user_role_with_audit
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'remove_user_role_with_audit'
  ) THEN
    EXECUTE $func$
      CREATE FUNCTION public.remove_user_role_with_audit(
        target_user_id uuid,
        old_role public.user_role,
        requester_ip inet DEFAULT NULL,
        requester_user_agent text DEFAULT NULL
      )
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path TO public
      AS $body$
      DECLARE
        requester_id uuid;
        role_exists boolean;
      BEGIN
        -- Get the requester's user ID
        requester_id := auth.uid();
        -- Remove role if exists
        DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = old_role;
        RETURN true;
      END;
      $body$;
    $func$;
  END IF;
END
$$;
