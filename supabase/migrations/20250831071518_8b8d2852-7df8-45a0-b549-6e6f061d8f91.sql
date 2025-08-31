-- Add account_type to profiles table for Business vs Organization selection
ALTER TABLE public.profiles ADD COLUMN account_type text DEFAULT 'business' CHECK (account_type IN ('business', 'organization'));

-- Add invite codes table for managing invitations
CREATE TABLE public.invite_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  created_by uuid NOT NULL,
  invited_email text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('business', 'organization')),
  used_at timestamp with time zone NULL,
  used_by uuid NULL,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on invite_codes
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for invite codes
CREATE POLICY "Users can view invite codes they created or used"
ON public.invite_codes
FOR SELECT
USING (
  created_by = auth.uid() 
  OR used_by = auth.uid()
  OR is_admin_or_hub_manager(auth.uid())
);

CREATE POLICY "Organizations and super admins can create invite codes"
ON public.invite_codes
FOR INSERT
WITH CHECK (
  created_by = auth.uid() 
  AND (
    is_admin_or_hub_manager(auth.uid())
    OR (
      account_type = 'business' 
      AND EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() 
        AND p.account_type = 'organization'
      )
    )
  )
);

CREATE POLICY "Users can update invite codes they created"
ON public.invite_codes
FOR UPDATE
USING (created_by = auth.uid() OR is_admin_or_hub_manager(auth.uid()));

-- Add organization_id to profiles for hierarchy
ALTER TABLE public.profiles ADD COLUMN organization_id uuid NULL;

-- Create index for invite codes
CREATE INDEX idx_invite_codes_code ON public.invite_codes(code);
CREATE INDEX idx_invite_codes_email ON public.invite_codes(invited_email);

-- Update handle_new_user function to support account types
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