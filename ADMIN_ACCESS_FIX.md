# 🔐 Admin Access Fix - Step by Step Guide

## Πρόβλημα
Δεν μπορείς να μπεις στο `/admin` παρόλο που είσαι συνδεδεμένος - σε γυρνάει πίσω στο login.

## ✅ Λύση (3 Βήματα)

### 1️⃣ Άνοιξε το Supabase Dashboard
1. Πήγαινε στο [supabase.com](https://supabase.com/dashboard)
2. Επίλεξε το project σου "Greek Recipes"
3. Πήγαινε στο **SQL Editor** (αριστερό menu)

### 2️⃣ Τρέξε το SQL Script
1. Κάνε κλικ στο **New Query**
2. Αντίγραψε και κόλλησε αυτό το SQL:

```sql
-- Set admin access for your user
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN '{"is_admin": true}'::jsonb
    ELSE raw_user_meta_data || '{"is_admin": true}'::jsonb
  END
WHERE email = 'jpapad85@gmail.com';  -- ⚠️ ΑΛΛΑΞΕ ΤΟ EMAIL ΣΟΥ ΕΔΩ

-- Verify
SELECT email, raw_user_meta_data->>'is_admin' as is_admin
FROM auth.users 
WHERE email = 'jpapad85@gmail.com';  -- ⚠️ ΑΛΛΑΞΕ ΤΟ EMAIL ΣΟΥ ΕΔΩ
```

3. **Αλλαξε** το `jpapad85@gmail.com` με το δικό σου email
4. Κάνε κλικ **Run** (ή πάτα F5)
5. Θα πρέπει να δεις: `is_admin: true` στα αποτελέσματα

### 3️⃣ Ξανακάνε Login
1. Κάνε **logout** από το site
2. Κάνε **login** ξανά
3. Τώρα πήγαινε στο `/admin` - θα δουλεύει! ✅

---

## 🔍 Έλεγχος αν δούλεψε

### Από το Supabase:
```sql
SELECT 
    email,
    raw_user_meta_data->>'is_admin' as is_admin,
    created_at
FROM auth.users
ORDER BY created_at DESC;
```

### Από το site:
1. Άνοιξε Developer Console (F12)
2. Πήγαινε στο `/admin`
3. Κοίταξε τα logs - θα πρέπει να δεις:
   ```
   🔒 Admin route protection active
   📧 User email: jpapad85@gmail.com
   🔑 Is Admin? true
   ✅ Admin access granted
   ```

---

## ⚠️ Αν ΑΚΟΜΑ δεν δουλεύει:

### Βήμα 1: Έλεγξε το Vercel
Πήγαινε στο Vercel Dashboard → Settings → Environment Variables
Βεβαιώσου ότι έχεις:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Βήμα 2: Redeploy
Στο Vercel Dashboard:
1. Πήγαινε στο Deployments
2. Πάτα τα 3 τελείες (...) στο τελευταίο deployment
3. Πάτα "Redeploy"

### Βήμα 3: Clear Cache
Στο browser:
1. Πάτα Ctrl+Shift+Delete
2. Clear cookies και cache για το site
3. Κάνε ξανά login

---

## 🚀 Για να δώσεις admin σε άλλον χρήστη:

```sql
-- Just change the email
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'other-user@example.com';
```

---

## 📝 Notes

- Το `is_admin` metadata αποθηκεύεται στο Supabase
- Το middleware το ελέγχει σε κάθε request
- Χρειάζεται logout/login για να ανανεωθεί το session
- Το SQL script είναι ήδη στο repo: `set-admin-user.sql`

---

## 🆘 Help

Αν ακόμα έχεις πρόβλημα, στείλε screenshot από:
1. Supabase SQL Editor results (μετά το verify query)
2. Browser Console logs (όταν πας στο /admin)
3. Vercel Environment Variables
