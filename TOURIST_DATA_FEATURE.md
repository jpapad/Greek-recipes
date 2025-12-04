# Tourist Data Feature - Documentation

## Overview
Το σύστημα τουριστικών δεδομένων επιτρέπει την προσθήκη πλούσιου περιεχομένου για Περιοχές, Νομούς και Πόλεις.

## Database Setup
✅ Το SQL script `tourist-data-schema.sql` έχει ήδη εκτελεστεί στη Supabase.

Προστέθηκαν 6 νέα πεδία σε κάθε πίνακα (`regions`, `prefectures`, `cities`):
- `photo_gallery` - TEXT[] - Πίνακας URLs φωτογραφιών
- `attractions` - JSONB - Αξιοθέατα με τύπο, περιγραφή, εικόνα
- `how_to_get_there` - TEXT - Οδηγίες πρόσβασης
- `tourist_info` - TEXT - Γενικές τουριστικές πληροφορίες
- `events_festivals` - JSONB - Εκδηλώσεις και γιορτές
- `local_products` - JSONB - Τοπικά προϊόντα

## Admin Features

### 1. Photo Gallery Manager
Διαχείριση φωτογραφιών της περιοχής:
- Προσθήκη URLs φωτογραφιών
- Preview εικόνων με thumbnails
- Αφαίρεση φωτογραφιών
- Grid layout με responsive design

### 2. Attractions Manager
Διαχείριση αξιοθέατων:
- 7 τύποι: Μουσείο, Μνημείο, Παραλία, Πάρκο, Αρχαιολογικός Χώρος, Θρησκευτικό, Φυσικό Αξιοθέατο
- Πεδία: όνομα, τύπος, περιγραφή, εικόνα, διεύθυνση, website
- Add/Edit/Delete functionality
- Card-based UI

### 3. Events Manager
Διαχείριση εκδηλώσεων και γιορτών:
- Πεδία: όνομα, ημερομηνία/περίοδος, περιγραφή, τοποθεσία
- Timeline-style display
- Add/Edit/Delete functionality

### 4. Local Products Manager
Διαχείριση τοπικών προϊόντων:
- 4 κατηγορίες: Τρόφιμα, Κρασιά/Ποτά, Χειροτεχνήματα, Άλλο
- Πεδία: όνομα, κατηγορία, περιγραφή, εικόνα
- Grid layout με preview εικόνων
- Add/Edit/Delete functionality

### 5. Text Fields
- **Πώς να φτάσετε**: Textarea για οδηγίες πρόσβασης (αεροδρόμια, τρένα, λεωφορεία)
- **Τουριστικές Πληροφορίες**: Textarea για γενικές συμβουλές επισκεπτών

## Frontend Display Components

### 1. PhotoGallery Component
- Grid layout με thumbnails
- Lightbox με navigation (πλήκτρα βέλη, ESC για κλείσιμο)
- Counter (1/10)
- Responsive design
- Hover effects

### 2. AttractionsList Component
- Grid layout με cards
- Φίλτρα ανά τύπο αξιοθέατου
- Εικόνα, όνομα, περιγραφή, διεύθυνση, website
- Emoji icons για κάθε τύπο
- Hover effects

### 3. EventsList Component
- Grid layout 3 columns
- Calendar icon και ημερομηνία
- Τοποθεσία με map pin icon
- Card-based design

### 4. LocalProducts Component
- Grid layout με product cards
- Εικόνα προϊόντος (aspect-ratio video)
- Badge για κατηγορία
- Emoji icons για κάθε κατηγορία

### 5. AccessInfo Component
- Simple panel με Navigation icon
- Multiline text display
- Preserves line breaks

### 6. TouristInfoPanel Component
- Simple panel με Info icon
- Multiline text display
- Preserves line breaks

## Usage in Admin Panel

### Για Regions:
1. Πηγαίνετε στο `/admin/regions`
2. Επιλέξτε "Edit" σε μια περιοχή ή "Add New Region"
3. Scroll down στο τμήμα "Τουριστικά Δεδομένα"
4. Χρησιμοποιήστε τα 4 managers και τα 2 text fields
5. Πατήστε "Update Region" ή "Create Region"

### Για Prefectures:
Ακριβώς το ίδιο process στο `/admin/prefectures`

### Για Cities:
Ακριβώς το ίδιο process στο `/admin/cities`

## Frontend Display

Όλα τα τουριστικά δεδομένα εμφανίζονται αυτόματα στις σελίδες:
- `/regions/[slug]` - Region detail page
- `/prefectures/[slug]` - Prefecture detail page (αν υπάρχει)
- `/cities/[slug]` - City detail page (αν υπάρχει)

**Σειρά εμφάνισης:**
1. Hero Image & Description
2. Photo Gallery (αν υπάρχουν φωτογραφίες)
3. Πώς να φτάσετε (αν υπάρχει κείμενο)
4. Τουριστικές Πληροφορίες (αν υπάρχει κείμενο)
5. Αξιοθέατα (αν υπάρχουν)
6. Εκδηλώσεις & Γιορτές (αν υπάρχουν)
7. Τοπικά Προϊόντα (αν υπάρχουν)
8. Recipes από την περιοχή

**Note:** Τα components εμφανίζονται μόνο αν έχουν δεδομένα (conditional rendering).

## Sample Data

Στο SQL script υπάρχει sample data για την Κρήτη:
- 2 Αξιοθέατα: Παλάτι της Κνωσού, Σαμαριά
- Οδηγίες πρόσβασης: Αεροδρόμια Ηρακλείου & Χανιών + πλοίο από Πειραιά
- Τουριστικές πληροφορίες: Γενική περιγραφή
- 2 Εκδηλώσεις: Γιορτή Σουλτανίνας, Renaissance Festival
- 3 Προϊόντα: Ελαιόλαδο, Ρακί Τσικουδιά, Μέλι

## TypeScript Types

Όλα τα types είναι ορισμένα στο `src/lib/types.ts`:

```typescript
interface Attraction {
  name: string;
  type: 'museum' | 'monument' | 'beach' | 'park' | 'archaeological' | 'religious' | 'nature';
  description: string;
  image_url?: string;
  address?: string;
  website?: string;
}

interface Event {
  name: string;
  date: string;
  description: string;
  location?: string;
}

interface LocalProduct {
  name: string;
  category: 'food' | 'wine' | 'craft' | 'other';
  description: string;
  image_url?: string;
}

interface Region {
  // ... existing fields
  photo_gallery?: string[];
  attractions?: Attraction[];
  how_to_get_there?: string;
  tourist_info?: string;
  events_festivals?: Event[];
  local_products?: LocalProduct[];
}
```

## Files Created/Modified

### New Admin Components:
- `src/components/admin/PhotoGalleryManager.tsx`
- `src/components/admin/AttractionsManager.tsx`
- `src/components/admin/EventsManager.tsx`
- `src/components/admin/LocalProductsManager.tsx`

### New Display Components:
- `src/components/regions/PhotoGallery.tsx`
- `src/components/regions/AttractionsList.tsx`
- `src/components/regions/EventsList.tsx`
- `src/components/regions/LocalProducts.tsx`
- `src/components/regions/AccessInfo.tsx`
- `src/components/regions/TouristInfoPanel.tsx`

### Modified Files:
- `src/components/admin/RegionForm.tsx` - Added tourist fields
- `src/components/admin/PrefectureForm.tsx` - Added tourist fields
- `src/components/admin/CityForm.tsx` - Added tourist fields
- `src/app/regions/[slug]/page.tsx` - Added display components
- `src/lib/types.ts` - Added Attraction, Event, LocalProduct types
- `tourist-data-schema.sql` - Database migration (executed ✅)

## Print-Friendly
Όλα τα tourist data components είναι print-friendly και θα εμφανίζονται σωστά στην εκτύπωση.

## Responsive Design
Όλα τα components είναι fully responsive:
- Mobile: 1-2 columns
- Tablet: 2-3 columns
- Desktop: 3-4 columns

## Next Steps (Optional Enhancements)

1. **Image Upload Integration**: Αντί για manual URL entry, χρήση του ImageUpload component
2. **Map Integration**: Leaflet/Google Maps για εμφάνιση αξιοθέατων
3. **Calendar View**: Interactive calendar για εκδηλώσεις
4. **Product Marketplace**: E-commerce functionality για τοπικά προϊόντα
5. **Rich Text Editor**: WYSIWYG editor για tourist info
6. **Multi-language**: Μετάφραση τουριστικών δεδομένων σε Αγγλικά

## Support

Για περισσότερες πληροφορίες, δείτε τα sample data στο `tourist-data-schema.sql` ή τα TypeScript types στο `src/lib/types.ts`.
