# 🚀 Quick Start - Site Settings Manager

## Τρέξτε αυτό για να ξεκινήσετε!

### 1️⃣ Database Setup

**Τρόπος Α: Μέσω Supabase Dashboard (Recommended)**

1. Πηγαίνετε στο [Supabase Dashboard](https://supabase.com/dashboard)
2. Επιλέξτε το project σας
3. Πατήστε **SQL Editor** (αριστερή μπάρα)
4. Πατήστε **New Query**
5. Ανοίξτε το αρχείο `site-settings-table.sql`
6. Copy-paste όλο το περιεχόμενο
7. Πατήστε **Run** (ή Ctrl+Enter)

**Αναμενόμενο Output:**
```
CREATE TABLE
INSERT 0 7
CREATE POLICY
CREATE POLICY
```

### 2️⃣ Verification

Τρέξτε αυτό το query για να επιβεβαιώσετε ότι όλα είναι εντάξει:

```sql
SELECT 
    setting_key, 
    setting_group, 
    is_active 
FROM site_settings 
ORDER BY setting_group, setting_key;
```

**Πρέπει να δείτε 7 rows:**
- colors (design)
- backgrounds (design)
- glassmorphism (design)
- typography (design)
- spacing (design)
- animations (design)
- theme_presets (design)

### 3️⃣ Access Admin Panel

```bash
# Αν δεν τρέχει ήδη:
npm run dev

# Μετά πηγαίνετε στο:
http://localhost:3000/admin/site-settings
```

### 4️⃣ Test It!

1. **Presets Tab** → Click "Apply Dark Theme"
2. **Χρώματα Tab** → Αλλάξτε το Primary σε κάτι διαφορετικό
3. **Backgrounds Tab** → Επιλέξτε Gradient
4. **Save** → **Ctrl+Shift+R** (hard refresh)

---

## 🎯 Quick Test Commands

### Check if table exists:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'site_settings';
```

### View all settings:
```sql
SELECT * FROM site_settings;
```

### Test a setting update:
```sql
UPDATE site_settings 
SET value = jsonb_set(value, '{primary}', '"#ff0000"')
WHERE setting_key = 'colors';
```

### Reset a setting:
```sql
UPDATE site_settings 
SET value = default_value 
WHERE setting_key = 'colors';
```

---

## 🔧 Troubleshooting

### "Table already exists"
```sql
-- Drop and recreate:
DROP TABLE IF EXISTS site_settings CASCADE;
-- Then re-run site-settings-table.sql
```

### "Permission denied"
Ensure you're logged in as postgres or database owner in Supabase.

### "Settings not loading in admin"
1. Check browser console for errors
2. Verify Supabase URL and key in `.env.local`
3. Check RLS policies are enabled

### "Changes not appearing"
1. Hard refresh: **Ctrl+Shift+R**
2. Check StyleInjector is running (look for `<style id="dynamic-site-styles">` in `<head>`)
3. Verify setting `is_active = true`

---

## 📸 Screenshots Checklist

After setup, you should see:

### Admin Interface:
- ✅ 6 tabs: Colors, Backgrounds, Glass, Typography, Spacing, Presets
- ✅ Colors tab: 17 color pickers
- ✅ Backgrounds tab: Mode selector + gradient editor
- ✅ Glass tab: Sliders + live preview
- ✅ Typography tab: Font selectors, size inputs, weight dropdowns
- ✅ Spacing tab: Container width, padding controls, gap inputs
- ✅ Presets tab: 5 theme cards

### CSS Injection:
- ✅ Open DevTools → Elements → `<head>`
- ✅ Find `<style id="dynamic-site-settings">`
- ✅ Verify CSS variables inside

---

## 🎨 Quick Customization Examples

### Example 1: Purple Gradient
```
1. Backgrounds tab
2. Mode: Gradient
3. Type: Linear
4. Direction: 135deg
5. From: #667eea
6. To: #764ba2
7. Save → Refresh
```

### Example 2: Large Fonts
```
1. Typography tab
2. Font Size base: 1.25rem
3. Font Size lg: 1.5rem
4. Font Weight medium: 600
5. Save → Refresh
```

### Example 3: Compact Layout
```
1. Spacing tab
2. Container Max Width: 1024px
3. Section Padding Y: 2rem
4. Card Padding: 1rem
5. Save → Refresh
```

---

## ✅ Success Checklist

- [ ] SQL script executed without errors
- [ ] 7 settings visible in database
- [ ] Admin panel loads at `/admin/site-settings`
- [ ] All 6 tabs are clickable
- [ ] Can change colors and see in picker
- [ ] Can select gradient mode
- [ ] Can move glass effect sliders
- [ ] Can apply a preset theme
- [ ] Can change typography settings
- [ ] Can adjust spacing values
- [ ] Save button works (shows alert)
- [ ] Hard refresh shows changes
- [ ] StyleInjector creates CSS variables

---

## 🚀 You're Done!

Το Site Settings Manager είναι τώρα **100% λειτουργικό**!

Διαβάστε το `SITE_SETTINGS_GUIDE.md` για advanced features και best practices.

**Καλή διασκέδαση με το customization! 🎨**
