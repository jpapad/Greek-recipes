-- ============================================
-- ΓΙΝΕ ADMIN ΤΩΡΑ! 🔑
-- ============================================
-- Τρέξε αυτό στο Supabase SQL Editor

-- ΒΗΜΑ 1: Βρες το email σου
-- Αντικατέστησε το 'jpapad85@gmail.com' με το δικό σου email

UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"is_admin": true}'::jsonb
    ELSE raw_user_meta_data || '{"is_admin": true}'::jsonb
  END
WHERE email = 'jpapad85@gmail.com';

-- ΒΗΜΑ 2: Έλεγξε ότι δούλεψε
SELECT 
  email,
  raw_user_meta_data->'is_admin' as is_admin,
  raw_user_meta_data
FROM auth.users
WHERE email = 'jpapad85@gmail.com';

-- Θα πρέπει να δεις: is_admin = true

-- ============================================
-- ΟΔΗΓΙΕΣ:
-- ============================================
-- 1. Άνοιξε το Supabase Dashboard
-- 2. Πήγαινε στο "SQL Editor"
-- 3. Κάνε paste αυτό το script
-- 4. Άλλαξε το email με το δικό σου
-- 5. Πάτα "Run"
-- 6. Κάνε logout και login ξανά
-- 7. Μπες στο /admin
-- ============================================
