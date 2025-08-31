-- Create a special invite code for the super admin setup
INSERT INTO public.invite_codes (
  code,
  invited_email,
  account_type,
  created_by,
  expires_at
) VALUES (
  'JENGA-SUPER-ADMIN-2025',
  'jengabizafrica@gmail.com',
  'organization',
  '00000000-0000-0000-0000-000000000000', -- System generated
  now() + interval '30 days'
);