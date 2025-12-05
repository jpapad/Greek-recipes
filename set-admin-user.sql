-- SET ADMIN USER
-- Run this in Supabase SQL Editor to make a user admin

-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"is_admin": true}'::jsonb
    ELSE raw_user_meta_data || '{"is_admin": true}'::jsonb
  END
WHERE email = 'jpapad85@gmail.com';  -- CHANGE THIS TO YOUR EMAIL

-- Verify the change
SELECT email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'jpapad85@gmail.com';  -- CHANGE THIS TO YOUR EMAIL
