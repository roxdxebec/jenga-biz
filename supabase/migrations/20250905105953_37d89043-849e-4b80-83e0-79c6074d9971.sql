-- Update auth configuration for proper email settings
UPDATE auth.config SET 
  smtp_admin_email = 'support@jengabiz.africa',
  smtp_sender_name = 'Jenga Biz Africa'
WHERE TRUE;

-- Add proper email redirect configuration
UPDATE auth.config SET 
  site_url = 'https://jengabiz.africa',
  additional_redirect_urls = ARRAY['https://jengabiz.africa/auth', 'https://jengabiz.africa/reset-password', 'https://2d5d3ba5-84e9-4b37-ba00-6b7d536851cd.lovableproject.com']
WHERE TRUE;