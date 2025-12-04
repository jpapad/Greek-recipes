# Pages & Menu Management - Οδηγός Χρήσης

## 📋 Περιεχόμενα

1. [Εισαγωγή](#εισαγωγή)
2. [Pages System](#pages-system)
3. [Menu System](#menu-system)
4. [Block Types Reference](#block-types-reference)
5. [Εγκατάσταση](#εγκατάσταση)

---

## 🎯 Εισαγωγή

Το Greek Recipes site έχει πλέον ολοκληρωμένο σύστημα διαχείρισης σελίδων (Pages) και μενού πλοήγησης (Menu) που επιτρέπει:

- ✅ Δημιουργία custom σελίδων με block-based content
- ✅ Διαχείριση navigation menus σε 5 διαφορετικές τοποθεσίες
- ✅ SEO optimization για κάθε σελίδα
- ✅ Hierarchical menu structure με dropdowns
- ✅ Access control (auth/admin required)
- ✅ 18 διαφορετικοί τύποι content blocks

---

## 📄 Pages System

### Πρόσβαση

Μπείτε στο **Admin Panel → Pages** (`/admin/pages`)

### Δημιουργία Νέας Σελίδας

1. Κλικ στο **"Νέα Σελίδα"**
2. Συμπληρώστε τα βασικά:
   - **Τίτλος**: π.χ. "Σχετικά με εμάς"
   - **Slug**: Δημιουργείται αυτόματα από τον τίτλο (π.χ. `about-us`)
   - **Template**: Επιλέξτε layout (default, full-width, sidebar-left, sidebar-right)
   - **Κατάσταση**: draft / published / archived

3. Προσθέστε περιεχόμενο (JSON format):
```json
{
  "blocks": [
    {
      "type": "heading",
      "level": 1,
      "text": "Καλώς ήρθατε!"
    },
    {
      "type": "paragraph",
      "text": "Αυτή είναι η νέα μας σελίδα..."
    },
    {
      "type": "image",
      "url": "https://example.com/image.jpg",
      "alt": "Περιγραφή",
      "caption": "Caption κάτω από την εικόνα"
    }
  ]
}
```

4. Συμπληρώστε SEO Meta Tags:
   - **Meta Title**: Για καλύτερο SEO
   - **Meta Description**: 150-160 χαρακτήρες
   - **Meta Keywords**: Χωρισμένες με κόμματα
   - **OG Image**: URL για social media sharing

5. Κλικ **"Δημιουργία Σελίδας"**

### Λειτουργίες

#### Dashboard Σελίδων

Το dashboard σας δείχνει:
- 📊 **Στατιστικά**: Σύνολο, Δημοσιευμένες, Πρόχειρα, Αρχική
- 🔍 **Αναζήτηση**: Βρείτε σελίδες με τίτλο ή slug
- 🏷️ **Φίλτρα**: all / published / draft / archived

#### Ενέργειες Σελίδας

Για κάθε σελίδα μπορείτε:
- 👁️ **Preview**: Δείτε τη δημοσιευμένη σελίδα
- ✏️ **Edit**: Επεξεργασία περιεχομένου
- 📋 **Duplicate**: Κλωνοποίηση σελίδας
- 🏠 **Set Homepage**: Ορισμός ως αρχική σελίδα
- ✅ **Publish**: Δημοσίευση πρόχειρης σελίδας
- 🗑️ **Delete**: Διαγραφή

### Templates

#### 1. Default
Κανονικό layout με container

#### 2. Full Width
Πλήρες πλάτος οθόνης, χωρίς margins

#### 3. Sidebar Left
Sidebar στα αριστερά (π.χ. για blog posts)

#### 4. Sidebar Right
Sidebar στα δεξιά (π.χ. για documentation)

### Status Workflow

```
draft → published → archived
  ↑         ↓
  └─────────┘
```

- **Draft**: Πρόχειρο, δεν είναι ορατό
- **Published**: Δημοσιευμένο, ορατό στο public
- **Archived**: Αρχειοθετημένο, κρυμμένο αλλά διατηρημένο

---

## 🍔 Menu System

### Πρόσβαση

Μπείτε στο **Admin Panel → Menu** (`/admin/menu`)

### Menu Locations

Το σύστημα υποστηρίζει 5 διαφορετικές τοποθεσίες:

1. **Main Menu** (🔵 Κύριο) - Header navigation
2. **Footer Menu** (🟢 Footer) - Links στο footer
3. **Mobile Menu** (🟣 Mobile) - Mobile hamburger menu
4. **User Menu** (🟠 User) - Logged-in user dropdown
5. **Admin Menu** (🔴 Admin) - Admin panel sidebar

### Προσθήκη Menu Item

1. Στο δεξί sidebar, συμπληρώστε:
   - **Label**: Το κείμενο που θα φαίνεται (π.χ. "Αρχική")
   - **URL**: Το link (π.χ. `/` ή `/recipes`)
   - **Icon**: Lucide icon name (π.χ. `Home`, `UtensilsCrossed`)
   - **Τοποθεσία**: Επιλέξτε menu location
   - **Parent**: (Προαιρετικό) Για dropdown, επιλέξτε parent item

2. Προαιρετικά:
   - ✅ **Απαιτεί Login**: Εμφάνιση μόνο σε logged-in users
   - ✅ **Μόνο Admin**: Εμφάνιση μόνο σε admins

3. Κλικ **"Προσθήκη"**

### Hierarchical Menus (Dropdowns)

Για να δημιουργήσετε dropdown:

1. Δημιουργήστε το **parent item** (π.χ. "Συνταγές")
2. Δημιουργήστε τα **child items**:
   - Label: "Ορεκτικά"
   - URL: `/recipes?category=appetizers`
   - Parent: Επιλέξτε "Συνταγές"

Αποτέλεσμα:
```
Συνταγές ▼
  ├─ Ορεκτικά
  ├─ Κυρίως Πιάτα
  ├─ Επιδόρπια
  └─ Σαλάτες
```

### Λειτουργίες Menu

#### Inline Editing
- Κλικ στο ✏️ **Edit** για γρήγορη επεξεργασία
- Αλλάξτε Label, URL, Icon
- Κλικ **Save** (💾) ή **Cancel** (✖️)

#### Toggle Visibility
- Κλικ στο 👁️ **Eye icon** για hide/show
- Κρυμμένα items έχουν badge "Κρυφό"

#### Delete
- Κλικ στο 🗑️ **Trash icon**
- **ΠΡΟΣΟΧΗ**: Διαγράφει και όλα τα children

#### Expand/Collapse
- Κλικ στο ▶️/▼ για να δείτε children
- Hierarchical tree view

### Filtering

Φιλτράρετε menu items με location:
- **Όλα**: Εμφάνιση όλων
- **Κύριο Menu**: Main navigation
- **Footer**: Footer links
- **Mobile**: Mobile menu
- **User Menu**: User dropdown
- **Admin**: Admin sidebar

---

## 🧱 Block Types Reference

### 1. Heading Block
Επικεφαλίδες H1-H6

```json
{
  "type": "heading",
  "level": 1,
  "text": "Τίτλος Σελίδας",
  "align": "center",
  "color": "#333333"
}
```

**Properties:**
- `level`: 1-6 (H1 to H6)
- `text`: Το κείμενο
- `align`: left / center / right
- `color`: Hex color code

---

### 2. Paragraph Block
Κανονικό κείμενο παραγράφου

```json
{
  "type": "paragraph",
  "text": "Αυτό είναι μια παράγραφος κειμένου...",
  "align": "left",
  "color": "#000000"
}
```

---

### 3. Image Block
Εικόνες με caption

```json
{
  "type": "image",
  "url": "https://example.com/photo.jpg",
  "alt": "Περιγραφή για accessibility",
  "caption": "Caption κάτω από την εικόνα",
  "width": "full",
  "height": "auto",
  "link": "/recipes/moussaka"
}
```

**Properties:**
- `width`: full / medium / small / px value
- `height`: auto / px value
- `link`: (Optional) Κάνει την εικόνα clickable

---

### 4. Video Block
Ενσωμάτωση video (YouTube, Vimeo, direct)

```json
{
  "type": "video",
  "platform": "youtube",
  "video_id": "dQw4w9WgXcQ",
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "width": "100%",
  "height": "500px",
  "autoplay": false,
  "controls": true
}
```

**Platforms:**
- `youtube`: YouTube videos
- `vimeo`: Vimeo videos
- `direct`: Direct MP4/WebM URL

---

### 5. Code Block
Syntax highlighted code

```json
{
  "type": "code",
  "code": "const greeting = 'Γεια σας!';",
  "language": "javascript",
  "showLineNumbers": true,
  "theme": "dark"
}
```

**Languages:**
- javascript, typescript, python, html, css, json, sql, bash, php, etc.

---

### 6. Quote Block
Blockquotes με attribution

```json
{
  "type": "quote",
  "text": "Η μαγειρική είναι τέχνη...",
  "author": "Julia Child",
  "align": "center"
}
```

---

### 7. List Block
Ordered ή unordered λίστες

```json
{
  "type": "list",
  "listType": "unordered",
  "items": [
    "Πρώτο στοιχείο",
    "Δεύτερο στοιχείο",
    "Τρίτο στοιχείο"
  ]
}
```

**List Types:**
- `ordered`: 1, 2, 3...
- `unordered`: Bullets (•)

---

### 8. Divider Block
Οριζόντιες γραμμές διαχωρισμού

```json
{
  "type": "divider",
  "style": "solid",
  "color": "#e5e7eb",
  "width": "100%"
}
```

**Styles:**
- solid, dashed, dotted

---

### 9. Spacer Block
Κενό διάστημα για spacing

```json
{
  "type": "spacer",
  "height": "50px"
}
```

---

### 10. Button Block
Call-to-action buttons

```json
{
  "type": "button",
  "text": "Δείτε Συνταγές",
  "url": "/recipes",
  "style": "primary",
  "size": "large",
  "align": "center",
  "icon": "ChefHat"
}
```

**Styles:**
- primary, secondary, outline, ghost

**Sizes:**
- small, medium, large

---

### 11. Columns Block
Multi-column layouts

```json
{
  "type": "columns",
  "columnCount": 2,
  "gap": "20px",
  "columns": [
    {
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "Στήλη 1"
        }
      ]
    },
    {
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "Στήλη 2"
        }
      ]
    }
  ]
}
```

---

### 12. Hero Block
Full-width hero sections

```json
{
  "type": "hero",
  "title": "Ανακαλύψτε Ελληνικές Γεύσεις",
  "subtitle": "Παραδοσιακές συνταγές από όλη την Ελλάδα",
  "backgroundImage": "https://example.com/hero.jpg",
  "overlayOpacity": 0.5,
  "height": "500px",
  "buttonText": "Ξεκινήστε",
  "buttonUrl": "/recipes"
}
```

---

### 13. HomeSections Block
Φορτώνει τα Home Sections από τη βάση

```json
{
  "type": "homeSections",
  "sectionIds": ["uuid-1", "uuid-2"],
  "showAll": true
}
```

---

### 14. ContactForm Block
Contact form με configurable fields

```json
{
  "type": "contactForm",
  "title": "Επικοινωνήστε μαζί μας",
  "fields": ["name", "email", "phone", "message"],
  "submitText": "Αποστολή",
  "successMessage": "Ευχαριστούμε!"
}
```

---

### 15. ContactInfo Block
Στοιχεία επικοινωνίας

```json
{
  "type": "contactInfo",
  "email": "info@greekrecipes.com",
  "phone": "+30 210 1234567",
  "address": "Αθήνα, Ελλάδα",
  "social": {
    "facebook": "https://facebook.com/greekrecipes",
    "instagram": "https://instagram.com/greekrecipes"
  }
}
```

---

### 16. RecipesGrid Block
Προβολή συνταγών με filters

```json
{
  "type": "recipesGrid",
  "title": "Δημοφιλείς Συνταγές",
  "filters": {
    "category": "Appetizers",
    "difficulty": "easy",
    "limit": 6
  },
  "showFilters": true
}
```

---

### 17. RegionsGrid Block
Προβολή περιοχών

```json
{
  "type": "regionsGrid",
  "title": "Ελληνικές Περιοχές",
  "limit": 12,
  "layout": "grid"
}
```

---

### 18. CustomHTML Block
Raw HTML για advanced χρήση

```json
{
  "type": "customHTML",
  "html": "<div class='custom'>...</div>"
}
```

**ΠΡΟΣΟΧΗ**: Χρησιμοποιείτε με προσοχή! XSS risk.

---

## 🚀 Εγκατάσταση

### 1. Εκτέλεση SQL Scripts

Στο Supabase SQL Editor:

```sql
-- 1. Δημιουργία Pages table
-- Εκτελέστε το αρχείο: pages-table.sql

-- 2. Δημιουργία Menu Items table
-- Εκτελέστε το αρχείο: menu-items-table.sql
```

### 2. Επαλήθευση

```sql
-- Έλεγχος Pages
SELECT * FROM pages;

-- Έλεγχος Menu Items
SELECT * FROM menu_items;
```

### 3. Πρόσβαση στο Admin

1. Μπείτε στο `/admin/pages`
2. Μπείτε στο `/admin/menu`
3. Θα δείτε τις default σελίδες και menu items

---

## 📚 API Functions

### Pages API

```typescript
// Get all pages
const pages = await getPages({ status: 'published' });

// Get page by slug
const page = await getPageBySlug('about-us');

// Get homepage
const homepage = await getHomepage();

// Create page
const newPage = await createPage({
  title: 'New Page',
  slug: 'new-page',
  content: { blocks: [] },
  status: 'draft'
});

// Update page
await updatePage(pageId, { title: 'Updated Title' });

// Publish page
await publishPage(pageId);

// Set as homepage
await setHomepage(pageId);

// Duplicate page
await duplicatePage(pageId);

// Delete page
await deletePage(pageId);
```

### Menu API

```typescript
// Get menu items by location (hierarchical)
const mainMenu = await getMenuItems('main');

// Get all menu items (flat list)
const allItems = await getAllMenuItems();

// Create menu item
const newItem = await createMenuItem({
  label: 'Home',
  url: '/',
  menu_location: 'main',
  icon: 'Home'
});

// Update menu item
await updateMenuItem(itemId, { label: 'New Label' });

// Toggle visibility
await toggleMenuItem(itemId, true);

// Reorder items
await reorderMenuItems([
  { id: 'uuid-1', display_order: 0 },
  { id: 'uuid-2', display_order: 1 }
]);

// Delete menu item
await deleteMenuItem(itemId);
```

---

## 🎨 Frontend Rendering (Coming Soon)

Για να προβάλλετε τις σελίδες στο frontend:

```typescript
// src/app/[slug]/page.tsx
import { getPageBySlug } from '@/lib/api';
import PageRenderer from '@/components/PageRenderer';

export default async function DynamicPage({ params }) {
  const page = await getPageBySlug(params.slug);
  
  if (!page || page.status !== 'published') {
    notFound();
  }
  
  return <PageRenderer page={page} />;
}
```

**Επόμενο βήμα**: Δημιουργία του `PageRenderer` component που θα render κάθε block type.

---

## 🔧 Troubleshooting

### Pages δεν εμφανίζονται

1. Ελέγξτε ότι το status είναι `published`
2. Ελέγξτε ότι το slug είναι unique
3. Δείτε console για errors

### Menu items δεν εμφανίζονται

1. Ελέγξτε ότι `is_active = true`
2. Ελέγξτε το `menu_location`
3. Για dropdown, βεβαιωθείτε ότι το parent_id είναι σωστό

### JSON Errors στο Content

1. Χρησιμοποιήστε [JSONLint](https://jsonlint.com/) για validation
2. Βεβαιωθείτε ότι τα strings έχουν double quotes `"`
3. Ελέγξτε για missing commas

---

## 📞 Support

Για βοήθεια:
- 📧 Email: support@greekrecipes.com
- 📚 Documentation: `/docs`
- 🐛 Issues: GitHub Issues

---

**Ημερομηνία:** Δεκέμβριος 2025  
**Version:** 1.0.0  
**Author:** Greek Recipes Team
