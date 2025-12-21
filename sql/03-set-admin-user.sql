-- ============================================
-- Set User as Admin
-- ============================================
-- Usage: Replace 'your-email@example.com' with actual email

-- Method 1: Set admin by email
UPDATE public.profiles
SET is_admin = true
WHERE email = 'your-email@example.com';

-- Method 2: Set admin by user ID
-- UPDATE public.profiles
-- SET is_admin = true
-- WHERE id = 'user-uuid-here';

-- Verify the change
SELECT id, email, is_admin, created_at
FROM public.profiles
WHERE email = 'your-email@example.com';

-- Remove admin access (if needed)
-- UPDATE public.profiles
-- SET is_admin = false
-- WHERE email = 'user-email@example.com';
