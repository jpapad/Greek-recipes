-- ============================================
-- QUICK FIX: Make yourself admin immediately
-- ============================================
-- Run this in Supabase SQL Editor

-- Replace 'your-email@example.com' with your actual email
UPDATE auth.users
SET 
    raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{is_admin}',
        'true'::jsonb
    ),
    raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{is_admin}',
        'true'::jsonb
    )
WHERE email = 'your-email@example.com';

-- Also update profiles table (or insert if not exists)
INSERT INTO public.profiles (id, email, full_name, is_admin, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
    true,
    NOW()
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) 
DO UPDATE SET 
    is_admin = true,
    updated_at = NOW();

-- Verify it worked
SELECT 
    u.id,
    u.email,
    u.raw_app_meta_data->>'is_admin' as app_is_admin,
    u.raw_user_meta_data->>'is_admin' as user_is_admin,
    p.is_admin as profile_is_admin
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'your-email@example.com';
