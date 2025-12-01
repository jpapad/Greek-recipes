# Admin Role Setup

## Τι Άλλαξε:

Τώρα το admin panel προστατεύεται με **role-based access**:
- Μόνο users με `is_admin: true` μπορούν να δουν το `/admin`
- Το "Admin Panel" link στο UserMenu εμφανίζεται μόνο για admins

## Πώς να κάνεις κάποιον Admin:

### Μέθοδος 1: Από το Supabase Dashboard (Εύκολη)

1. Πήγαινε στο Supabase Dashboard
2. **Authentication** → **Users**
3. Βρες τον χρήστη που θέλεις να κάνεις admin (π.χ. `jpapad85@gmail.com`)
4. Κάνε κλικ στον χρήστη
5. Scroll down στο **User Metadata** section
6. Κάνε κλικ **Edit**
7. Πρόσθεσε:
   ```json
   {
     "is_admin": true
   }
   ```
8. Κάνε **Save**

### Μέθοδος 2: Με SQL (Γρήγορη)

Τρέξε στο Supabase SQL Editor:

```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'jpapad85@gmail.com';
```

## Δοκιμή:

1. **Χωρίς admin role**:
   - Κάνε login με έναν κανονικό user
   - Προσπάθησε να μπεις στο `/admin`
   - Θα σε redirect στο home με error

2. **Με admin role**:
   - Κάνε login με admin user
   - Θα δεις το "Admin Panel" link στο UserMenu
   - Μπορείς να μπεις στο `/admin` κανονικά

## Σημαντικό:

Μετά από κάθε αλλαγή στο user metadata:
- Κάνε **logout** και **login** ξανά για να φορτώσει τα νέα metadata
- Ή κάνε refresh τη σελίδα

Τώρα μόνο εσύ (ως admin) μπορείς να δεις και να διαχειριστείς το admin panel! 🔐
