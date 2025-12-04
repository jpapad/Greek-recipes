# 🚀 Quick Start Guide - 5 Minutes Setup

## ✅ Prerequisites
- ✅ Supabase project setup
- ✅ Next.js app running (`npm run dev`)
- ✅ Admin account with `is_admin: true`

---

## 📋 Step 1: Run SQL Scripts (2 minutes)

### Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)

### Execute Scripts
```sql
-- 1. Create Pages Table
-- Copy-paste content from: pages-table.sql
-- Click "Run"

-- 2. Create Menu Items Table  
-- Copy-paste content from: menu-items-table.sql
-- Click "Run"
```

### Verify
```sql
-- Check tables exist
SELECT * FROM pages;
SELECT * FROM menu_items;

-- You should see default data
```

---

## 📱 Step 2: Test Mobile (1 minute)

### Open DevTools
```
1. Press F12 (or Ctrl+Shift+I)
2. Click "Toggle Device Toolbar" icon (or Ctrl+Shift+M)
3. Select device: "iPhone 12 Pro"
4. Refresh page
```

### Test Navigation
```
1. Go to: http://localhost:3000/admin
2. Click hamburger menu (top-left)
3. Sidebar should slide in
4. Click "Pages"
5. Click anywhere outside sidebar → should close
```

---

## 🎨 Step 3: Create First Page (2 minutes)

### Navigate
```
http://localhost:3000/admin/pages
```

### Create Page
```
1. Click "Νέα Σελίδα" button
2. Fill in:
   - Title: "About Us"
   - Slug: "about-us" (auto-generated)
3. Leave Visual Editor mode ON
4. Click "Προσθήκη Block"
5. Select: 📝 Επικεφαλίδα (Heading)
6. Edit:
   - Level: H1
   - Text: "Welcome to Greek Recipes"
   - Align: Center
7. Click "Προσθήκη Block" again
8. Select: 📄 Παράγραφος (Paragraph)
9. Edit:
   - Text: "Discover authentic Greek cuisine..."
10. Click "Προσθήκη Block" again
11. Select: 🔘 Κουμπί (Button)
12. Edit:
    - Text: "Explore Recipes"
    - URL: "/recipes"
    - Style: Primary
    - Size: Large
    - Align: Center
13. Sidebar (right):
    - Status: Published
    - Template: Default
14. Click "Δημιουργία Σελίδας"
```

### View Page
```
http://localhost:3000/about-us
```

You should see your page with:
- Large centered heading
- Paragraph text
- Centered button

---

## 🍔 Step 4: Test Menu Manager (30 seconds)

### Navigate
```
http://localhost:3000/admin/menu
```

### What You See
```
- Default menus already created:
  * Main Menu (5 items)
  * User Menu (4 items)  
  * Admin Menu (7 items)
  * Footer (4 items)
```

### Quick Test
```
1. Find "Αρχική" item in Main Menu
2. Click edit icon (✏️)
3. Change label to "Home Page"
4. Click save (💾)
5. Click toggle visibility (👁️) to hide/show
```

---

## 📱 Step 5: Test Responsive (30 seconds)

### Device Sizes to Test
```
1. DevTools → Responsive Mode
2. Try these widths:
   - 375px (iPhone SE) - Mobile
   - 768px (iPad) - Tablet
   - 1440px (Desktop)
```

### What to Check
```
✅ Mobile (375px):
   - Hamburger menu appears
   - Sidebar slides in
   - Forms are full-width
   - Buttons are big enough
   - Text is readable

✅ Tablet (768px):
   - 2-column grids
   - Sidebar toggles
   - Comfortable spacing

✅ Desktop (1440px):
   - Sidebar always visible
   - 3-column grids
   - Full layouts
```

---

## ✨ That's It!

### You Now Have:
✅ Pages CMS with Visual Editor  
✅ Menu Management System  
✅ Mobile-Responsive Admin  
✅ Dynamic Frontend Routing  
✅ 18 Block Types  
✅ SEO Optimization  

### URLs to Remember:
```
📊 Admin Dashboard:    /admin
📄 Pages Manager:      /admin/pages
🍔 Menu Manager:       /admin/menu
🏠 Home Sections:      /admin/home-sections
⚙️ Site Settings:     /admin/site-settings
```

---

## 🎯 Next Steps

### Create More Pages
```
Suggested pages:
- Contact (/contact)
- Privacy Policy (/privacy)
- Terms of Service (/terms)
- FAQ (/faq)
```

### Customize Blocks
```
Try all 18 block types:
✓ Heading (6 levels)
✓ Paragraph
✓ Image (with caption)
✓ Video (YouTube/Vimeo)
✓ Code (with syntax highlighting)
✓ Quote (with author)
✓ List (ordered/unordered)
✓ Divider
✓ Spacer
✓ Button (3 styles, 3 sizes)
✓ Columns (2-4 columns)
✓ Hero Section
✓ Home Sections
✓ Contact Form
✓ Contact Info
✓ Recipes Grid
✓ Regions Grid
✓ Custom HTML
```

### Setup Menus
```
1. Create menu items for each page
2. Organize into dropdowns
3. Set icons (Lucide names)
4. Configure access control
```

---

## 🐛 Troubleshooting

### Pages don't show in dashboard
```
❌ Problem: Empty list
✅ Solution: Check SQL scripts ran successfully
   SELECT COUNT(*) FROM pages; -- Should be > 0
```

### Visual Editor not showing
```
❌ Problem: Only JSON editor appears
✅ Solution: Check imports in page.tsx
   import BlockEditor from '@/components/admin/BlockEditor';
```

### Sidebar doesn't open (Mobile)
```
❌ Problem: Click hamburger, nothing happens
✅ Solution: Check layout.tsx state
   const [sidebarOpen, setSidebarOpen] = useState(false);
```

### Page 404 on frontend
```
❌ Problem: /about-us shows 404
✅ Solution: 
   1. Check status = 'published'
   2. Check slug = 'about-us'
   3. Verify: src/app/[slug]/page.tsx exists
```

---

## 📞 Need Help?

### Check Console
```javascript
// Open Browser Console (F12)
// Look for errors (red text)
// Common issues:
- "Cannot read property..." → Missing data
- "404 Not Found" → Wrong URL or route
- "JSON Parse error" → Invalid JSON (use Visual mode!)
```

### Verify API
```typescript
// Test in browser console
const pages = await fetch('/api/pages').then(r => r.json());
console.log('Pages:', pages);
```

### Documentation
```
📚 Full Guide: PAGES_MENU_GUIDE.md
✅ Checklist: PAGES_MENU_CHECKLIST.md
🎉 Complete: COMPLETE_MOBILE_READY.md
```

---

## 🎉 Success!

If you can:
- ✅ See pages dashboard
- ✅ Create a page with Visual Editor
- ✅ View page on frontend
- ✅ Toggle sidebar on mobile
- ✅ Edit menu items

**You're all set! 🚀**

---

**Time:** 5 minutes  
**Difficulty:** Easy  
**Result:** Full CMS Ready!

