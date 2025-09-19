-- Update jengabizafrica@gmail.com account type to ecosystem_enabler for proper /saas redirect
UPDATE profiles 
SET account_type = 'ecosystem_enabler' 
WHERE email = 'jengabizafrica@gmail.com';

-- Verify the update
SELECT id, email, account_type FROM profiles WHERE email = 'jengabizafrica@gmail.com';