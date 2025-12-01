# Admin Panel Setup Instructions

## Βήμα 1: Ενημέρωση Supabase Policies

Πρέπει να τρέξεις το SQL script για να επιτρέψεις τις CRUD λειτουργίες:

1. Πήγαινε στο Supabase SQL Editor
2. Άνοιξε το αρχείο `admin-policies.sql`
3. Αντίγραψε όλο το περιεχόμενο
4. Κάνε paste στο SQL Editor και πάτα **Run**

Αυτό θα ενημερώσει τα Row Level Security policies για να επιτρέπουν INSERT, UPDATE, DELETE για authenticated users.

## Βήμα 2: Πρόσβαση στο Admin Panel

Μετά το restart του dev server, μπορείς να μπεις στο admin panel:

**URL**: `http://localhost:3000/admin`

### Διαθέσιμες Λειτουργίες:

#### Dashboard (`/admin`)
- Στατιστικά (Total Recipes, Regions)
- Quick Actions (Add New Recipe/Region)
- Recent Recipes list

#### Recipes Management (`/admin/recipes`)
- Λίστα όλων των συνταγών
- **Add New Recipe** - Φόρμα με:
  - Βασικά στοιχεία (Title, Slug, Region, Category)
  - Time, Difficulty, Servings
  - Short Description
  - **Dynamic Ingredients** (πρόσθεσε/αφαίρεσε όσα θέλεις)
  - **Dynamic Steps** (πρόσθεσε/αφαίρεσε βήματα)
  - Image URL
- **Edit Recipe** - Επεξεργασία υπάρχουσας συνταγής
- **Delete Recipe** - Διαγραφή με confirmation

#### Regions Management (`/admin/regions`)
- Grid view όλων των περιοχών
- **Add New Region** - Φόρμα με Name, Slug, Description, Image URL
- **Edit Region** - Επεξεργασία
- **Delete Region** - Διαγραφή (προσοχή: επηρεάζει τις συνταγές)

## Σημαντικές Σημειώσεις:

### Slug Generation
Το slug πρέπει να είναι unique και URL-friendly:
- Χρησιμοποίησε lowercase
- Αντικατέστησε κενά με `-`
- Παράδειγμα: "Γεμιστά" → "gemista"

### Image URLs
Μπορείς να χρησιμοποιήσεις:
- Unsplash: `https://images.unsplash.com/photo-...`
- Δικές σου εικόνες (upload σε Supabase Storage)

### Ingredients & Steps Format
- Κάθε ingredient/step είναι ένα ξεχωριστό πεδίο
- Πάτα το **+** για να προσθέσεις νέο
- Πάτα το **X** για να αφαιρέσεις

## Επόμενα Βήματα:

Μετά το Admin Panel, θα προσθέσουμε:
1. **Authentication** - Login/Signup για να προστατεύσουμε το admin
2. **More Recipes** - 10-15 επιπλέον παραδοσιακές συνταγές
