# 🚀 Greek Recipes App - Complete Setup Guide

## Completed Features ✅

### 1. Image Upload with Supabase Storage
- ✅ Storage buckets for recipes, regions, prefectures, cities, avatars, reviews
- ✅ ImageUpload component with preview and validation
- ✅ Integrated into all admin forms

### 2. Enhanced Cooking Mode
- ✅ Step-by-step navigation with progress bar
- ✅ Built-in timers (5, 10, 15 min + custom)
- ✅ Play/Pause/Reset controls
- ✅ Wake Lock to keep screen on
- ✅ Vibration alert when timer ends

### 3. Advanced Search & Filters
- ✅ Dietary tags (vegetarian, vegan, gluten-free, dairy-free)
- ✅ Time range filters (min/max minutes)
- ✅ Location cascade filters (Region → Prefecture → City)
- ✅ Ingredient search
- ✅ Category and difficulty filters
- ✅ Active filter count badge

### 4. User Profiles
- ✅ Profile pages with avatar, bio, social links
- ✅ Display user's recipes, reviews, favorites
- ✅ Edit profile page with image upload
- ✅ Auto-create profile on signup

### 5. Progressive Web App (PWA)
- ✅ manifest.json with app metadata
- ✅ Service worker for offline support
- ✅ Install prompt component
- ✅ Cacheable assets

### 6. Dark Mode
- ✅ Theme toggle component
- ✅ Theme persistence in localStorage
- ✅ System preference detection
- ✅ Dark variants for all UI components
- ✅ Smooth transitions

### 7. Internationalization (i18n)
- ✅ Greek translations in el.json
- ✅ Language switcher component
- ✅ Translation keys for all major features

---

## 📋 Setup Instructions

### Step 1: Run SQL Migrations in Supabase

Execute these SQL files in order in your Supabase SQL Editor:

1. **storage-setup.sql** - Storage buckets and policies
2. **dietary-tags.sql** - Add dietary columns to recipes
3. **user-profiles.sql** - User profiles system
4. **analytics-seo.sql** - Views tracking and SEO metadata
5. **comments-enhanced-reviews.sql** - Comments and enhanced reviews
6. **collections.sql** - Recipe collections/playlists
7. **gamification-notes.sql** - Badges and recipe notes

### Step 2: Create PWA Icons

Create app icons in `public/icons/` directory:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

**Quick way**: Use an icon generator like https://realfavicongenerator.net/

### Step 3: Environment Variables

Ensure `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Install Dependencies (if needed)

```bash
npm install
```

### Step 5: Start Development Server

```bash
npm run dev
```

---

## 🎯 What You Can Do Now

### As Admin:
1. **Upload images** directly from forms (recipes, regions, prefectures, cities)
2. **Set dietary tags** when creating recipes
3. **Create user profiles** with avatars and social links

### As User:
1. **Search recipes** with advanced filters (dietary, time, location)
2. **Use cooking mode** with built-in timers
3. **Switch themes** between light and dark mode
4. **Install app** as PWA on mobile/desktop
5. **View user profiles** and their recipes

---

## 🌟 Additional Features (Database Ready)

These features have database schemas created but need frontend components:

### Comments System
- Nested replies
- Edit/delete own comments
- Real-time updates (with Supabase subscriptions)

### Enhanced Reviews
- Photo uploads
- Helpful/unhelpful votes
- Filter by rating

### Recipe Collections
- Create themed playlists
- Public/private collections
- Share collections

### Gamification
- Badge system
- Achievement tracking
- Progress milestones

### Recipe Notes
- Personal variations
- Private/public notes
- Modification tracking

---

## 🔧 Quick Fixes Needed

### 1. Add Icons to PWA
```bash
# Create a simple icon (you can use any image)
# Place in public/icons/ with different sizes
```

### 2. Test Service Worker
- Visit site in incognito mode
- Try offline mode
- Check Application tab in DevTools

### 3. Verify Supabase Storage
- Go to Supabase Dashboard → Storage
- Buckets should auto-create when first upload happens
- Or manually create them if policies fail

---

## 📱 Mobile Testing

Test PWA features:
1. Open site on mobile browser
2. "Add to Home Screen" prompt should appear
3. Install app
4. Test offline mode
5. Test cooking mode timers

---

## 🎨 Customization

### Change Theme Colors
Edit `src/app/globals.css`:
```css
--primary: oklch(0.65 0.22 35); /* Change hue value */
```

### Add More Languages
1. Create `messages/[locale].json`
2. Add translations
3. Update LanguageSwitcher component

### Modify PWA Settings
Edit `public/manifest.json`:
- Change app name
- Update theme colors
- Add more icon sizes

---

## 🐛 Troubleshooting

### Images not loading
- Check Next.js config has Supabase domain
- Verify storage bucket policies
- Check browser console for CORS errors

### Dark mode not working
- Clear localStorage
- Check if ThemeProvider is wrapping app
- Verify globals.css has dark variants

### PWA not installing
- Must be served over HTTPS (or localhost)
- Check manifest.json is accessible
- Verify service worker registered

### Filters not working
- Run dietary-tags.sql migration
- Check API includes new filter parameters
- Verify Supabase RLS policies allow reads

---

## 🚀 Next Steps

1. **Run all SQL migrations** ✓
2. **Create PWA icons** ✓
3. **Test image upload** in admin forms
4. **Try cooking mode** with timers
5. **Switch to dark mode** and test UI
6. **Create a user profile**
7. **Test advanced filters** with dietary tags
8. **Install app as PWA** on your device

---

## 📊 Database Schema Overview

```
Tables Created:
- user_profiles (profiles with social links)
- recipe_views (analytics tracking)
- comments (nested commenting)
- review_votes (helpful votes)
- collections (recipe playlists)
- collection_recipes (many-to-many)
- badges (achievement system)
- user_badges (earned badges)
- recipe_notes (personal variations)

Columns Added to recipes:
- is_vegetarian, is_vegan, is_gluten_free, is_dairy_free
- keywords (for search)
- views_count, published_at, is_draft
- user_id (recipe author)
```

---

## 🎉 You're All Set!

Your Greek Recipes app now has:
- ✅ Professional image management
- ✅ Advanced search and filtering
- ✅ User profiles and social features
- ✅ Mobile-first PWA capabilities
- ✅ Dark mode support
- ✅ Multi-language ready
- ✅ Database schemas for 10+ additional features

**Happy cooking! 🧑‍🍳**
