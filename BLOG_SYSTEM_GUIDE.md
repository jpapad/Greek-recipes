# Blog System - Complete Implementation Guide

## 🎉 Features Implemented

✅ **WYSIWYG Editor** - Tiptap rich text editor με toolbar (bold, italic, headings, lists, images, links)  
✅ **Article Management** - Full CRUD για άρθρα με draft/published/archived status  
✅ **Categories System** - Δυναμικές κατηγορίες με colors για UI  
✅ **Author Roles** - Role-based access (Admin + Author roles)  
✅ **Recipe Linking** - Σύνδεση άρθρων με συνταγές  
✅ **SEO Optimization** - Meta tags, keywords, auto-generated reading time  
✅ **View Counter** - Automatic view tracking  
✅ **Tags System** - Flexible tagging με auto-complete  
✅ **Frontend Blog** - Beautiful listing και single article pages  
✅ **Similar Articles** - Related content suggestions  

---

## 📦 Database Setup

### 1. Run the SQL Migration

Στο **Supabase SQL Editor**, εκτέλεσε το αρχείο:

```bash
blog-system.sql
```

Αυτό δημιουργεί:
- `article_categories` - Κατηγορίες άρθρων
- `articles` - Τα άρθρα με όλα τα πεδία
- `user_roles` - Roles (is_admin, is_author) για κάθε χρήστη
- `article_comments` - Σχόλια σε άρθρα (optional)

### 2. Default Categories

Αυτόματα δημιουργούνται 5 default κατηγορίες:
- Ιστορία (μπλε)
- Tips Μαγειρικής (πράσινο)
- Περιφέρειες (πορτοκαλί)
- Συνεντεύξεις (κόκκινο)
- Εποχιακά (μωβ)

Μπορείς να τις διαγράψεις ή να προσθέσεις δικές σου από το `/admin/articles/categories`.

---

## 🔐 Author Role Management

### Πώς να δώσεις Author Role

1. **Ο χρήστης πρέπει να έχει κάνει εγγραφή** στην εφαρμογή πρώτα
2. Πήγαινε στο `/admin/authors`
3. Θα δεις λίστα με όλους τους εγγεγραμμένους
4. Κάνε κλικ στο "Ορισμός ως Author" για να δώσεις δικαιώματα
5. Πλέον ο χρήστης μπορεί να δημιουργεί άρθρα!

### Διαφορές Ρόλων

| Role | Δικαιώματα |
|------|-----------|
| **Admin** | Όλα! (CRUD άρθρα, διαχείριση authors, διαγραφή οτιδήποτε) |
| **Author** | Δημιουργία/Επεξεργασία ΜΟΝΟ των δικών του άρθρων |
| **User** | Μόνο ανάγνωση published άρθρων |

**Σημαντικό:** Οι Admins είναι ΠΑΝΤΑ authors. Δεν μπορείς να αφαιρέσεις το author role από admin.

---

## ✍️ Δημιουργία Άρθρου

### 1. Admin Panel

Πήγαινε στο `/admin/articles/new`

### 2. Βασικές Πληροφορίες

- **Τίτλος**: Ο τίτλος του άρθρου (π.χ. "Ιστορία του Μουσακά")
- **Slug**: Auto-generated από τον τίτλο, URL-friendly (π.χ. `istoria-tou-mousaka`)
- **Περίληψη**: Σύντομη περιγραφή (εμφανίζεται στη λίστα άρθρων)
- **Εικόνα Εξώφυλλου**: Upload ή URL
- **Κατηγορία**: Επιλογή κατηγορίας
- **Κατάσταση**: 
  - **Draft** → Μόνο εσύ το βλέπεις
  - **Published** → Δημόσιο
  - **Archived** → Κρυμμένο αλλά υπάρχει

### 3. Περιεχόμενο (Tiptap Editor)

Χρησιμοποίησε το toolbar για:
- **Bold, Italic, Underline** (Ctrl+B, Ctrl+I, Ctrl+U)
- **Headings** (H1, H2, H3)
- **Lists** (Bullets, Numbers)
- **Quotes**
- **Images** (Κλικ στο εικονίδιο εικόνας → Paste URL)
- **Links** (Επιλογή κείμενο → Κλικ link → Paste URL)
- **Alignment** (Left, Center, Right)
- **Undo/Redo**

### 4. Ετικέτες (Tags)

Γράψε λέξη → Enter ή κλικ "+"  
Παραδείγματα: `μουσακάς`, `παραδοσιακή κουζίνα`, `εποχιακό`

### 5. Σχετικές Συνταγές

Checkboxes με όλες τις διαθέσιμες συνταγές.  
Οι επιλεγμένες θα εμφανίζονται στο τέλος του άρθρου!

### 6. SEO (Optional)

- **Meta Title**: Τίτλος για Google (default: το title)
- **Meta Description**: Περιγραφή για snippets (default: το excerpt)
- **Keywords**: Λέξεις-κλειδιά για SEO

### 7. Αποθήκευση

Κλικ **"Δημιουργία Άρθρου"** → Αυτόματο redirect στη λίστα!

---

## 🎨 Frontend Pages

### `/blog` - Blog Homepage
- Λίστα όλων των **published** άρθρων
- Φίλτρα ανά κατηγορία
- Search bar
- Grid layout με cards

### `/blog/[slug]` - Single Article
- Full article με formatting
- Author info (avatar, bio)
- Category badge
- View counter
- Reading time
- Tags
- Related recipes (αν υπάρχουν)
- Similar articles από την ίδια κατηγορία

---

## 🔧 Technical Details

### Auto-Features

1. **Reading Time**: Υπολογίζεται αυτόματα (200 λέξεις/λεπτό)
2. **View Counter**: Αυξάνεται κάθε φορά που ανοίγει το άρθρο
3. **Slug Generation**: Auto-generated από τον τίτλο (transliteration)
4. **Timestamps**: `created_at`, `updated_at` auto-update

### API Functions (src/lib/blog-api.ts)

```typescript
// Articles
getArticles(options?)      // Fetch με filters
getArticleBySlug(slug)     // Fetch single article
createArticle(data)        // Create new
updateArticle(id, data)    // Update existing
deleteArticle(id)          // Delete (admin only)

// Categories
getArticleCategories()
createArticleCategory(data)
deleteArticleCategory(id)

// Authors
getAuthors()               // Get all authors
getUserProfile(userId)     // Get user role info
updateUserRole(userId, data) // Grant/revoke author role
```

### TypeScript Types

```typescript
interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;  // HTML from Tiptap
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  category_id?: string;
  tags?: string[];
  related_recipe_ids?: string[];
  status: 'draft' | 'published' | 'archived';
  views_count?: number;
  reading_time_minutes?: number;
  // + SEO fields
}
```

---

## 🚀 Workflow Example

### Σενάριο: Άρθρο "10 Μυστικά για Τέλεια Μπακλαβά"

1. **Σύνδεση ως Admin/Author** → `/admin/articles/new`
2. **Τίτλος**: "10 Μυστικά για Τέλεια Μπακλαβά"
3. **Slug**: `10-mystika-teleia-baklava` (auto)
4. **Κατηγορία**: "Tips Μαγειρικής"
5. **Εικόνα**: Upload photo μπακλαβά
6. **Περίληψη**: "Ανακαλύψτε τα μυστικά των σεφ για το πιο νόστιμο μπακλαβά..."
7. **Content** (Tiptap):
   ```
   Heading 2: Εισαγωγή
   Παράγραφος με εισαγωγή...
   
   Heading 2: Μυστικό #1: Το Φύλλο
   Bold text για σημαντικές λέξεις...
   
   Image: Προσθήκη εικόνας φύλλου
   
   Bullet List:
   - Χρησιμοποιήστε φρέσκο φύλλο
   - Βουρτσίστε με βούτυρο κάθε στρώση
   ```
8. **Tags**: `μπακλαβάς`, `tips`, `γλυκά`
9. **Σχετικές Συνταγές**: ✅ Μπακλαβάς Θεσσαλονίκης
10. **SEO Keywords**: `μπακλαβάς`, `συνταγή μπακλαβά`, `tips μπακλαβά`
11. **Status**: Published
12. **Save** → Άρθρο live στο `/blog`!

---

## 📊 Admin Dashboard Integration

Το dashboard (`/admin`) τώρα δείχνει:
- **Total Articles** stat card
- **Add Article** quick action button
- Link στο **Manage Authors**

Sidebar navigation:
- 📄 Articles
- 👥 Authors

---

## 🎯 Best Practices

### Content
- **Excerpt**: 150-200 χαρακτήρες (για preview)
- **Images**: Χρησιμοποίησε Unsplash ή upload στο Supabase Storage
- **Headings**: H1 για title, H2 για sections, H3 για subsections
- **Tags**: 3-5 tags ανά άρθρο

### SEO
- **Meta Title**: Max 60 χαρακτήρες
- **Meta Description**: 150-160 χαρακτήρες
- **Keywords**: 5-10 relevant keywords
- **Images**: Χρησιμοποίησε alt text

### Performance
- **Images**: Optimize πριν upload (<200KB)
- **Content**: Keep it readable (1000-2000 λέξεις)
- **Related Recipes**: Max 4 recipes per article

---

## 🐛 Troubleshooting

### "Cannot create article"
→ Έλεγξε αν έχεις author ή admin role (`/admin/authors`)

### "Slug already exists"
→ Το slug πρέπει να είναι unique. Άλλαξέ το manually.

### "Tiptap editor not loading"
→ Refresh τη σελίδα. Αν συνεχίζει, check console errors.

### "Related recipes not showing"
→ Βεβαιώσου ότι οι συνταγές είναι published και έχουν valid IDs.

---

## 📝 Next Steps (Optional Enhancements)

1. **Comments System**: Ενεργοποίηση των article_comments
2. **Social Sharing**: Add share buttons (Twitter, Facebook, Pinterest)
3. **Newsletter**: Integrate με email service
4. **Author Pages**: Dedicated page per author
5. **Search**: Full-text search στο content
6. **Drafts Auto-Save**: Save drafts στο localStorage
7. **Image Upload**: Direct upload στο Supabase Storage

---

## 🎊 You're All Set!

Το blog system είναι **100% functional** και έτοιμο για χρήση!

Ξεκίνα να γράφεις άρθρα και να μοιράζεσαι ιστορίες για την ελληνική κουζίνα! 🇬🇷✨
