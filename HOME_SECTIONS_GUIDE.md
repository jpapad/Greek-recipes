# 🏠 Home Sections Manager - Οδηγίες Χρήσης

## 📋 Τι είναι το Home Sections Manager;

Το Home Sections Manager σου επιτρέπει να **διαχειρίζεσαι δυναμικά** όλα τα sections της αρχικής σελίδας:
- ✅ Προσθήκη/Διαγραφή sections
- ✅ Αλλαγή σειράς με drag & drop
- ✅ Ενεργοποίηση/Απενεργοποίηση sections
- ✅ Επεξεργασία περιεχομένου (JSON)

## 🚀 Πώς να ξεκινήσεις

### 1. **Εγκατάσταση της Database**

Τρέξε το SQL script στο Supabase SQL Editor:
```bash
# Άνοιξε το αρχείο: home-sections-table.sql
# Αντίγραψε το περιεχόμενο στο Supabase SQL Editor
# Πάτησε RUN
```

### 2. **Πρόσβαση στο Admin Panel**

1. Πήγαινε στο: `http://localhost:3000/admin/home-sections`
2. Θα δεις λίστα με όλα τα sections (6 default sections)

## 🎨 Διαθέσιμοι Τύποι Sections

### 1. 🎬 **Hero Slider**
- **Χρήση**: Slider στην κορυφή της σελίδας
- **JSON Template**:
```json
{
  "slides": [
    {
      "title": "Ανακαλύψτε την Αυθεντική Ελληνική Κουζίνα",
      "subtitle": "Παραδοσιακές συνταγές από όλη την Ελλάδα",
      "buttonText": "Εξερευνήστε Συνταγές",
      "buttonLink": "/recipes",
      "imageUrl": ""
    }
  ]
}
```

### 2. 📊 **Στατιστικά**
- **Χρήση**: Cards με αριθμούς (π.χ. "120+ Συνταγές")
- **JSON Template**:
```json
{
  "title": "Τα Νούμερά μας",
  "subtitle": "Η ελληνική κουζίνα σε αριθμούς",
  "stats": [
    {
      "label": "Αυθεντικές Συνταγές",
      "value": "dynamic",
      "icon": "ChefHat",
      "color": "from-orange-500 to-pink-500"
    }
  ]
}
```

**Διαθέσιμα Icons**: ChefHat, MapPin, Star, Users, Clock, Salad, Utensils, Cake, Coffee, BookOpen

### 3. 🍽️ **Προβεβλημένες Συνταγές**
- **Χρήση**: Grid με συνταγές (latest/popular/featured)
- **JSON Template**:
```json
{
  "title": "Πρόσφατες Συνταγές",
  "subtitle": "Οι τελευταίες προσθήκες στη συλλογή μας",
  "limit": 8,
  "filterType": "latest"
}
```

**filterType options**: `latest`, `popular`, `featured`, `random`

### 4. 📁 **Κατηγορίες Φαγητού**
- **Χρήση**: Grid με κατηγορίες (Ορεκτικά, Κυρίως Πιάτα, κλπ)
- **JSON Template**:
```json
{
  "title": "Κατηγορίες Φαγητού",
  "subtitle": "Εξερευνήστε την ελληνική κουζίνα ανά κατηγορία",
  "categories": [
    {
      "name": "Ορεκτικά",
      "slug": "appetizer",
      "icon": "Salad",
      "color": "from-green-500 to-emerald-500",
      "description": "Νόστιμα ορεκτικά"
    }
  ]
}
```

### 5. 📧 **Newsletter**
- **Χρήση**: Newsletter signup form
- **JSON Template**:
```json
{
  "badge": "Newsletter",
  "title": "Λάβετε τις καλύτερες συνταγές στο inbox σας",
  "subtitle": "Κάθε εβδομάδα μοιραζόμαστε νέες αυθεντικές ελληνικές συνταγές",
  "placeholder": "Το email σας...",
  "buttonText": "Εγγραφή",
  "privacyText": "🔒 Δεν θα μοιραστούμε ποτέ το email σας με τρίτους"
}
```

### 6. 📝 **Blog Articles**
- **Χρήση**: Πρόσφατα άρθρα blog
- **JSON Template**:
```json
{
  "badge": "📚 Blog",
  "title": "Ιστορίες & Άρθρα",
  "subtitle": "Ανακαλύψτε την ιστορία και τα μυστικά της ελληνικής κουζίνας",
  "limit": 3
}
```

### 7. ✨ **Custom**
- **Χρήση**: Custom HTML ή React component
- **JSON Template**:
```json
{
  "html": "<div class='text-center'><h2>Custom Section</h2></div>"
}
```

## 🔧 Χρήση του Interface

### **Drag & Drop για Αλλαγή Σειράς**
1. Πήγαινε στο `/admin/home-sections`
2. Σύρε τα sections από το εικονίδio `⋮⋮`
3. Πάτησε **"Αποθήκευση Σειράς"** (πράσινο κουμπί)

### **Ενεργοποίηση/Απενεργοποίηση**
- Πάτησε το εικονίδιο 👁️ (Eye) για να κρύψεις/εμφανίσεις ένα section
- Τα ανενεργά sections εμφανίζονται με opacity 50%

### **Επεξεργασία Section**
1. Πάτησε το εικονίδιο ✏️ (Pencil)
2. Επεξεργάσου το JSON στο textarea
3. Πάτησε **"Ενημέρωση"**

### **Δημιουργία Νέου Section**
1. Πάτησε **"Νέο Section"**
2. Επίλεξε τύπο section (αυτόματα φορτώνει template)
3. Επεξεργάσου το JSON
4. Πάτησε **"Δημιουργία"**

### **Διαγραφή Section**
1. Πάτησε το εικονίδιο 🗑️ (Trash)
2. Επιβεβαίωσε τη διαγραφή

## 💡 Tips & Best Practices

### ✅ **DO**
- Χρησιμοποίησε valid JSON format (έλεγξε με JSONLint.com)
- Κράτα τη σειρά λογική (Hero → Stats → Content → Newsletter)
- Χρησιμοποίησε `"value": "dynamic"` στα stats για αυτόματο counting
- Δοκίμασε πάντα σε Incognito mode μετά από αλλαγές

### ❌ **DON'T**
- Μην διαγράψεις ΌΛΑ τα sections (κράτα τουλάχιστον 1)
- Μην χρησιμοποιήσεις το ίδιο slug 2 φορές
- Μην αλλάξεις σειρά χωρίς να πατήσεις "Αποθήκευση"

## 🎯 Παραδείγματα Χρήσης

### **Παράδειγμα 1: Προσθήκη Hero με 3 Slides**
```json
{
  "slides": [
    {
      "title": "Slide 1",
      "subtitle": "Περιγραφή 1",
      "buttonText": "Δες Συνταγές",
      "buttonLink": "/recipes"
    },
    {
      "title": "Slide 2",
      "subtitle": "Περιγραφή 2",
      "buttonText": "Περιοχές",
      "buttonLink": "/regions"
    },
    {
      "title": "Slide 3",
      "subtitle": "Περιγραφή 3",
      "buttonText": "Blog",
      "buttonLink": "/blog"
    }
  ]
}
```

### **Παράδειγμα 2: Featured Recipes με Category Filter**
```json
{
  "title": "Τα Καλύτερα Γλυκά",
  "subtitle": "Τα πιο δημοφιλή ελληνικά γλυκά",
  "limit": 6,
  "filterType": "popular",
  "categorySlug": "dessert"
}
```

### **Παράδειγμα 3: Stats με Custom Values**
```json
{
  "title": "Η Επιτυχία μας",
  "subtitle": "Αριθμοί που μιλούν",
  "stats": [
    {
      "label": "Ενεργοί Χρήστες",
      "value": "10,000+",
      "icon": "Users",
      "color": "from-blue-500 to-cyan-500"
    },
    {
      "label": "5-Star Ratings",
      "value": "95%",
      "icon": "Star",
      "color": "from-yellow-500 to-orange-500"
    }
  ]
}
```

## 🐛 Troubleshooting

### **Πρόβλημα: "Invalid JSON" error**
- **Λύση**: Έλεγξε το JSON σε https://jsonlint.com
- Βεβαιώσου ότι όλα τα strings είναι μέσα σε `"..."`
- Όχι trailing commas (`,` στο τέλος)

### **Πρόβλημα: Δεν φαίνονται οι αλλαγές**
- **Λύση**: 
  1. Clear browser cache (Ctrl+Shift+Delete)
  2. Hard refresh (Ctrl+F5)
  3. Δοκίμασε σε Incognito mode

### **Πρόβλημα: Sections με λάθος σειρά**
- **Λύση**: Πάτησε το πράσινο κουμπί "Αποθήκευση Σειράς"

## 📞 Support

Για βοήθεια:
- 📧 Email: support@greekrecipes.com
- 💬 Slack: #admin-help
- 📚 Docs: /docs/home-sections

---

**Happy Managing! 🎉**
