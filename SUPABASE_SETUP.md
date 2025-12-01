# Οδηγίες Σύνδεσης με Supabase

Ακολούθησε αυτά τα βήματα για να συνδέσεις την εφαρμογή με τη βάση δεδομένων Supabase:

## Βήμα 1: Δημιούργησε Supabase Project

1. Πήγαινε στο [supabase.com](https://supabase.com)
2. Κάνε **Sign Up** (δωρεάν)
3. Κάνε κλικ στο **"New Project"**
4. Συμπλήρωσε:
   - **Name**: Greek Recipes App
   - **Database Password**: (κράτα το κάπου ασφαλές)
   - **Region**: Διάλεξε το πιο κοντινό (Europe West για Ελλάδα)
5. Κάνε κλικ **"Create new project"**
6. Περίμενε 1-2 λεπτά μέχρι να ετοιμαστεί το project

## Βήμα 2: Τρέξε το Database Schema

1. Στο Supabase dashboard, πήγαινε στο **SQL Editor** (αριστερό μενού)
2. Κάνε κλικ **"New Query"**
3. Άνοιξε το αρχείο `supabase-setup.sql` από αυτό το project
4. Αντίγραψε **ΟΛΟ** το περιεχόμενο
5. Κάνε paste στο SQL Editor
6. Κάνε κλικ **"Run"** (ή πάτα Ctrl+Enter)
7. Θα δεις μήνυμα επιτυχίας ✅

Αυτό θα δημιουργήσει:
- 2 πίνακες (`regions`, `recipes`)
- 5 περιοχές (Κρήτη, Κυκλάδες, Πελοπόννησος, Μακεδονία, Θεσσαλία)
- 6 συνταγές (Μουσακάς, Χωριάτικη, Σπανακόπιτα, Σουβλάκι, Παστίτσιο, Τζατζίκι)

## Βήμα 3: Πάρε τα API Keys

1. Πήγαινε στο **Settings** → **API** (αριστερό μενού)
2. Θα δεις:
   - **Project URL**: κάτι σαν `https://abcdefgh.supabase.co`
   - **anon public key**: ένα μεγάλο string

## Βήμα 4: Ρύθμισε την Εφαρμογή

1. Δημιούργησε ένα αρχείο `.env.local` στο root του project:
   ```bash
   # Στο terminal
   copy env.example .env.local
   ```

2. Άνοιξε το `.env.local` και συμπλήρωσε:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

3. **Κάνε restart το dev server**:
   - Πάτα `Ctrl+C` στο terminal
   - Τρέξε ξανά: `npm run dev`

## Βήμα 5: Δοκίμασε!

Άνοιξε την εφαρμογή στο `http://localhost:3000` και θα δεις:
- Τις πραγματικές συνταγές από τη βάση
- Όλες τις περιοχές
- Λειτουργικά φίλτρα και αναζήτηση

## Προσθήκη Νέων Συνταγών

Μπορείς να προσθέσεις νέες συνταγές απευθείας από το Supabase:

1. Πήγαινε στο **Table Editor** → **recipes**
2. Κάνε κλικ **"Insert row"**
3. Συμπλήρωσε τα πεδία (προσοχή στο format των `steps` και `ingredients` - πρέπει να είναι JSON arrays)

Ή τρέξε SQL:
```sql
INSERT INTO recipes (title, slug, region_id, short_description, steps, ingredients, time_minutes, difficulty, servings, image_url, category)
VALUES (
    'Γεμιστά',
    'gemista',
    (SELECT id FROM regions WHERE slug = 'crete'),
    'Ντομάτες και πιπεριές γεμιστές με ρύζι.',
    '["Κόψε το καπάκι από ντομάτες και πιπεριές", "Άδειασε το εσωτερικό", "Ετοίμασε γέμιση με ρύζι, κρεμμύδι, μαϊντανό", "Γέμισε τα λαχανικά", "Ψήσε στο φούρνο για 1 ώρα"]'::jsonb,
    '["6 ντομάτες", "4 πιπεριές", "1 κούπα ρύζι", "1 κρεμμύδι", "Μαϊντανός", "Ελαιόλαδο"]'::jsonb,
    75,
    'medium',
    4,
    'https://images.unsplash.com/photo-1...',
    'Main Dish'
);
```

---

**Έτοιμο!** Η εφαρμογή σου τώρα χρησιμοποιεί πραγματική βάση δεδομένων! 🎉
