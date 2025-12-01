-- Add is_admin field to user metadata
-- Run this in your Supabase SQL Editor

-- This will allow you to mark specific users as admins
-- By default, all users will have is_admin = false

-- You can manually set a user as admin by running:
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
-- WHERE email = 'your-email@example.com';

-- Or you can do it from the Supabase Dashboard:
-- Authentication → Users → Click on user → Edit user → User Metadata
-- Add: {"is_admin": true}
