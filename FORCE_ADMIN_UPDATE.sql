-- ============================================
-- FORCE ADMIN UPDATE - Ενημέρωση με Email Trigger
-- ============================================
-- Αυτό το script ενημερώνει το user_metadata ΚΑΙ στέλνει email
-- για να αναγκάσει το Supabase να κάνει refresh το session

-- ΒΗΜΑ 1: Ενημέρωση user metadata
UPDATE auth.users
SET 
  raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{is_admin}',
    'true'::jsonb
  ),
  -- Force update timestamp to trigger session refresh
  updated_at = NOW()
WHERE email = 'jpapad85@gmail.com';

-- ΒΗΜΑ 2: Έλεγχος αποτελέσματος
SELECT 
  id,
  email,
  raw_user_meta_data->>'is_admin' as is_admin_text,
  raw_user_meta_data->'is_admin' as is_admin_value,
  jsonb_typeof(raw_user_meta_data->'is_admin') as is_admin_type,
  raw_user_meta_data,
  updated_at
FROM auth.users
WHERE email = 'jpapad85@gmail.com';

-- Θα πρέπει να δεις:
-- is_admin_text = "true"
-- is_admin_value = true
-- is_admin_type = "boolean"

-- ============================================
-- ΣΗΜΑΝΤΙΚΟ: Μετά από αυτό το script
-- ============================================
-- 1. Κάνε LOGOUT από το site
-- 2. ΚΛΕΙΣΕ όλα τα tabs του site
-- 3. Άνοιξε νέο tab
-- 4. Κάνε LOGIN ξανά
-- 5. Πήγαινε στο /admin
-- ============================================
