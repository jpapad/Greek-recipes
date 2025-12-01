# Authentication Setup Instructions

## Βήμα 1: Δημιουργία User Favorites Table

Τρέξε το SQL script στο Supabase SQL Editor:

1. Πήγαινε στο Supabase SQL Editor
2. Άνοιξε το αρχείο `favorites-table.sql`
3. Αντίγραψε όλο το περιεχόμενο
4. Κάνε paste και πάτα **Run**

Αυτό θα δημιουργήσει τον πίνακα `user_favorites` που συνδέει users με τις αγαπημένες τους συνταγές.

## Βήμα 2: Enable Email Auth στο Supabase

1. Πήγαινε στο **Authentication** → **Providers** στο Supabase dashboard
2. Βεβαιώσου ότι το **Email** provider είναι enabled
3. (Προαιρετικό) Απενεργοποίησε το "Confirm email" αν θέλεις instant signup χωρίς email verification

## Βήμα 3: Δοκίμασε την Εφαρμογή

### Sign Up
1. Πήγαινε στο `http://localhost:3000/signup`
2. Δημιούργησε έναν λογαριασμό με email/password
3. Θα σε redirect στο login

### Login
1. Πήγαινε στο `http://localhost:3000/login`
2. Κάνε login με τα credentials σου
3. Θα σε redirect στο `/admin`

### Protected Routes
- Δοκίμασε να μπεις στο `/admin` χωρίς login → θα σε redirect στο `/login`
- Μετά το login, μπορείς να μπεις στο `/admin` κανονικά

### User Menu
- Μετά το login, θα δεις το email σου στο navbar (πάνω δεξιά)
- Κάνε κλικ για να δεις το dropdown menu:
  - **Admin Panel** - Link στο admin
  - **Sign Out** - Logout

### Favorites με Database
- **Anonymous users**: Τα favorites αποθηκεύονται στο localStorage (όπως πριν)
- **Logged in users**: Τα favorites αποθηκεύονται στη βάση δεδομένων
- Δοκίμασε:
  1. Κάνε login
  2. Πρόσθεσε μερικές συνταγές στα favorites (❤️)
  3. Κάνε logout
  4. Κάνε login ξανά
  5. Τα favorites σου θα είναι ακόμα εκεί! 🎉

## Τι Δημιουργήθηκε:

### Authentication
- ✅ Login page (`/login`)
- ✅ Signup page (`/signup`)
- ✅ Auth helper functions (`lib/auth.ts`)

### Protected Routes
- ✅ Middleware που προστατεύει το `/admin/*`
- ✅ Redirect στο login αν δεν είσαι authenticated

### User-Specific Favorites
- ✅ `user_favorites` table στη βάση
- ✅ Updated `useFavorites` hook:
  - Authenticated users → Database
  - Anonymous users → localStorage
- ✅ API functions: `getUserFavorites`, `addFavorite`, `removeFavorite`

### UI Updates
- ✅ UserMenu component στο Navbar
- ✅ Login/Signup buttons (αν δεν είσαι logged in)
- ✅ User dropdown με email και logout (αν είσαι logged in)

## Επόμενο Βήμα:

Τώρα που έχουμε authentication, θα προσθέσουμε **10-15 επιπλέον παραδοσιακές ελληνικές συνταγές**! 🇬🇷
