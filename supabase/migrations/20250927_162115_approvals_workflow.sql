-- Approval Workflow Implementation Migration
-- Creates app_settings, pending_approvals, audit tables with secure RPCs and RLS policies

-- Enable extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===================================
-- TABLES
-- ===================================

-- app_settings table for system configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- pending_approvals table for organization signup approval workflow
CREATE TABLE IF NOT EXISTS public.pending_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'organization_signup',
  payload jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_id uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pending_approvals_status_created ON public.pending_approvals (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_approvals_user ON public.pending_approvals (user_id);

-- settings_audit table for auditing system setting changes
CREATE TABLE IF NOT EXISTS public.settings_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id),
  key text,
  old_value text,
  new_value text,
  reason text,
  ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- approval_audit table for auditing approval workflow actions
CREATE TABLE IF NOT EXISTS public.approval_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id uuid REFERENCES public.pending_approvals(id) ON DELETE SET NULL,
  actor_id uuid REFERENCES auth.users(id),
  action text NOT NULL CHECK (action IN ('created','auto_approved','approved','rejected','settings_change')),
  notes text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===================================
-- TRIGGERS
-- ===================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to pending_approvals
DROP TRIGGER IF EXISTS set_updated_at_pending_approvals ON public.pending_approvals;
CREATE TRIGGER set_updated_at_pending_approvals
BEFORE UPDATE ON public.pending_approvals
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ===================================
-- STORED PROCEDURES / FUNCTIONS
-- ===================================

-- Helper function: Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = COALESCE(p_user_id, auth.uid())
      AND ur.role = 'super_admin'
  );
$$;

-- Secure setting setter with audit trail
CREATE OR REPLACE FUNCTION public.set_app_setting(
  p_key text, 
  p_value text, 
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old text;
BEGIN
  -- Only super_admins can change settings
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'insufficient_privileges';
  END IF;

  -- Get old value for audit
  SELECT s.value INTO v_old 
  FROM public.app_settings s 
  WHERE s.key = p_key;

  -- Upsert the setting
  INSERT INTO public.app_settings(key, value)
  VALUES (p_key, p_value)
  ON CONFLICT (key)
  DO UPDATE SET value = EXCLUDED.value, updated_at = now();

  -- Audit the change
  INSERT INTO public.settings_audit(actor_id, key, old_value, new_value, reason)
  VALUES (auth.uid(), p_key, v_old, p_value, p_reason);
END;
$$;

-- Secure role assignment with audit (protects super_admin role)
CREATE OR REPLACE FUNCTION public.add_user_role_with_audit(
  p_user_id uuid, 
  p_role text, 
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only super_admins can assign super_admin role
  IF p_role = 'super_admin' AND NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'insufficient_privileges';
  END IF;

  -- Insert role (on conflict do nothing prevents duplicates)
  INSERT INTO public.user_roles(user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Audit the change
  INSERT INTO public.approval_audit(approval_id, actor_id, action, notes, details)
  VALUES (NULL, auth.uid(), 'settings_change', p_reason, 
          jsonb_build_object('target_user', p_user_id, 'role', p_role));
END;
$$;

-- Approve organization signup
CREATE OR REPLACE FUNCTION public.approve_pending_organization(
  p_approval_id uuid, 
  p_notes text DEFAULT NULL, 
  p_grant_role text DEFAULT 'hub_manager'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Only super_admins can approve
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'insufficient_privileges';
  END IF;

  -- Get user_id and lock the row
  SELECT pa.user_id INTO v_user_id
  FROM public.pending_approvals pa
  WHERE pa.id = p_approval_id
    AND pa.status = 'pending'
  FOR UPDATE;

  -- Check if approval exists and is still pending
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'invalid_or_already_processed';
  END IF;

  -- Update approval status
  UPDATE public.pending_approvals
  SET status = 'approved',
      reviewer_id = auth.uid(),
      reviewed_at = now()
  WHERE id = p_approval_id;

  -- Grant the specified role (default: hub_manager)
  PERFORM public.add_user_role_with_audit(
    v_user_id, 
    COALESCE(p_grant_role, 'hub_manager'), 
    'approval_granted'
  );

  -- Audit the approval
  INSERT INTO public.approval_audit(approval_id, actor_id, action, notes, details)
  VALUES (p_approval_id, auth.uid(), 'approved', p_notes, 
          jsonb_build_object('grant_role', COALESCE(p_grant_role, 'hub_manager')));
END;
$$;

-- Reject organization signup
CREATE OR REPLACE FUNCTION public.reject_pending_organization(
  p_approval_id uuid, 
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only super_admins can reject
  IF NOT public.is_super_admin(auth.uid()) THEN
    RAISE EXCEPTION 'insufficient_privileges';
  END IF;

  -- Update approval status
  UPDATE public.pending_approvals
  SET status = 'rejected',
      reviewer_id = auth.uid(),
      reviewed_at = now()
  WHERE id = p_approval_id
    AND status = 'pending';

  -- Check if update affected any rows
  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_or_already_processed';
  END IF;

  -- Audit the rejection
  INSERT INTO public.approval_audit(approval_id, actor_id, action, notes)
  VALUES (p_approval_id, auth.uid(), 'rejected', p_reason);
END;
$$;

-- Handle organization signup based on auto-approval setting
CREATE OR REPLACE FUNCTION public.handle_org_signup(
  p_user_id uuid, 
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auto_approve boolean;
  v_status text;
  v_approval_id uuid;
BEGIN
  -- Check if auto-approval is enabled
  SELECT COALESCE(
    (SELECT s.value FROM public.app_settings s WHERE s.key = 'auto_approve_organizations'), 
    'false'
  ) = 'true' INTO v_auto_approve;

  IF v_auto_approve THEN
    -- Auto-approve: grant hub_manager role immediately
    PERFORM public.add_user_role_with_audit(
      p_user_id, 
      'hub_manager', 
      'auto_approved_organization_signup'
    );
    
    -- Audit auto-approval
    INSERT INTO public.approval_audit(approval_id, actor_id, action, notes, details)
    VALUES (NULL, p_user_id, 'auto_approved', 
            'Auto-approved based on system setting', p_payload);
    
    v_status := 'approved';
  ELSE
    -- Manual approval: create pending approval
    INSERT INTO public.pending_approvals(user_id, type, payload, status)
    VALUES (p_user_id, 'organization_signup', p_payload, 'pending')
    RETURNING id INTO v_approval_id;

    -- Audit pending creation
    INSERT INTO public.approval_audit(approval_id, actor_id, action, notes, details)
    VALUES (v_approval_id, p_user_id, 'created', 
            'Organization signup pending approval', p_payload);

    v_status := 'pending';
  END IF;

  RETURN v_status;
END;
$$;

-- ===================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================

-- app_settings: readable by admins/hub_managers/super_admins; mutations only via RPC
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS app_settings_read ON public.app_settings;
CREATE POLICY app_settings_read
ON public.app_settings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin','hub_manager','super_admin')
  )
);

-- pending_approvals: only super_admin can read/manage
ALTER TABLE public.pending_approvals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pending_approvals_super_admin_rw ON public.pending_approvals;
CREATE POLICY pending_approvals_super_admin_rw
ON public.pending_approvals
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
  )
);

-- settings_audit: readable by super_admin only
ALTER TABLE public.settings_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS settings_audit_read ON public.settings_audit;
CREATE POLICY settings_audit_read
ON public.settings_audit
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
  )
);

-- approval_audit: readable by super_admin only
ALTER TABLE public.approval_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS approval_audit_read ON public.approval_audit;
CREATE POLICY approval_audit_read
ON public.approval_audit
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
  )
);

-- ===================================
-- PERMISSIONS
-- ===================================

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION public.set_app_setting(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_user_role_with_audit(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_pending_organization(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_pending_organization(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_org_signup(uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;

-- ===================================
-- DEFAULT DATA
-- ===================================

-- Insert default setting (idempotent)
INSERT INTO public.app_settings (key, value)
VALUES ('auto_approve_organizations', 'false')
ON CONFLICT (key) DO NOTHING;

-- ===================================
-- COMMENTS
-- ===================================

COMMENT ON TABLE public.app_settings IS 'System configuration settings stored as key-value pairs';
COMMENT ON TABLE public.pending_approvals IS 'Queue of organization signups awaiting super admin approval';
COMMENT ON TABLE public.settings_audit IS 'Audit trail for system setting changes';
COMMENT ON TABLE public.approval_audit IS 'Audit trail for approval workflow actions';

COMMENT ON FUNCTION public.set_app_setting(text, text, text) IS 'Securely update system settings with audit trail (super_admin only)';
COMMENT ON FUNCTION public.handle_org_signup(uuid, jsonb) IS 'Process organization signup with auto-approval or manual queue based on settings';
COMMENT ON FUNCTION public.approve_pending_organization(uuid, text, text) IS 'Approve pending organization and grant specified role (super_admin only)';
COMMENT ON FUNCTION public.reject_pending_organization(uuid, text) IS 'Reject pending organization signup (super_admin only)';