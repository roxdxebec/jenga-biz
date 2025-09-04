-- Configure Supabase Auth settings for custom email sending
-- Set up email template to redirect properly after confirmation

-- Update auth settings for custom email configuration
-- This will be handled via Supabase dashboard settings

-- Ensure proper redirect URLs for email confirmation
UPDATE auth.config SET 
  site_url = 'https://jengabiz.africa',
  redirect_urls = '["https://jengabiz.africa", "https://jengabiz.africa/auth", "https://2d5d3ba5-84e9-4b37-ba00-6b7d536851cd.lovableproject.com"]'
WHERE TRUE;