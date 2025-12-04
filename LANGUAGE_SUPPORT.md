# Greek Language Support - Implementation Guide

## Overview

The Greek Recipes app now features **full bilingual support** with English (EN) and Greek (EL) languages. Users can seamlessly switch between languages with instant UI updates.

## Features

- ✅ **Language Switcher**: Dropdown menu in navbar with flag icons (🇬🇧 English / 🇬🇷 Ελληνικά)
- ✅ **Complete Translations**: All UI text translated in both languages
- ✅ **Persistent Selection**: Language preference saved in localStorage
- ✅ **Instant Switching**: Page reloads to apply new language
- ✅ **Translation Hook**: Easy-to-use `useTranslations()` hook for components

## Files Structure

```
src/
├── hooks/
│   └── useTranslations.ts          # Custom hook for i18n
├── components/
│   └── ui/
│       └── LanguageSwitcher.tsx    # Language dropdown component
├── i18n/
│   └── request.ts                  # next-intl configuration
└── context/
    └── LocaleContext.tsx           # Locale context provider (alternative)

messages/
├── en.json                         # English translations
└── el.json                         # Greek translations
```

## How to Use

### 1. In Components (Client-side)

```tsx
"use client";

import { useTranslations } from "@/hooks/useTranslations";

export function MyComponent() {
    const { t, locale } = useTranslations();

    return (
        <div>
            <h1>{t('Navbar.home')}</h1>
            <p>{t('Common.loading')}</p>
            <span>Current locale: {locale}</span>
        </div>
    );
}
```

### 2. Translation Keys

Translation keys use dot notation to access nested objects:

```tsx
// For: { "Navbar": { "home": "Home" } }
t('Navbar.home')  // Returns "Home" or "Αρχική"

// For: { "Recipe": { "difficulty": "Difficulty" } }
t('Recipe.difficulty')  // Returns "Difficulty" or "Δυσκολία"
```

### 3. Adding New Translations

**Step 1:** Add to `messages/en.json`
```json
{
    "NewSection": {
        "title": "My Title",
        "description": "My Description"
    }
}
```

**Step 2:** Add Greek translation to `messages/el.json`
```json
{
    "NewSection": {
        "title": "Ο Τίτλος μου",
        "description": "Η Περιγραφή μου"
    }
}
```

**Step 3:** Use in component
```tsx
const { t } = useTranslations();
<h1>{t('NewSection.title')}</h1>
```

## Translation Categories

### Available Categories

| Category | EN Key | Description |
|----------|--------|-------------|
| **Navbar** | `Navbar.*` | Navigation menu items |
| **Home** | `Home.*` | Homepage content |
| **Recipe** | `Recipe.*` | Recipe-related text |
| **Filters** | `Filters.*` | Search and filter UI |
| **Common** | `Common.*` | Shared UI elements |
| **ShoppingList** | `ShoppingList.*` | Shopping list features |
| **Substitutions** | `Substitutions.*` | Ingredient substitutions |
| **RecentlyViewed** | `RecentlyViewed.*` | Recently viewed widget |
| **Reviews** | `Reviews.*` | Review system |
| **Auth** | `Auth.*` | Authentication forms |
| **Admin** | `Admin.*` | Admin dashboard |

## Examples

### Navbar Translation
```tsx
// Before
<Link href="/">Home</Link>
<Link href="/recipes">Recipes</Link>

// After
<Link href="/">{t('Navbar.home')}</Link>
<Link href="/recipes">{t('Navbar.recipes')}</Link>
```

### Recipe Page Translation
```tsx
// Before
<h2>Ingredients</h2>
<p>{servings} servings</p>
<span>Easy</span>

// After
<h2>{t('Recipe.ingredients')}</h2>
<p>{servings} {t('Recipe.servings')}</p>
<span>{t('Recipe.easy')}</span>
```

### With Fallbacks
```tsx
// Use fallback if translation missing
t('Some.missing.key', 'Default Text')
```

## Language Switcher Component

The `LanguageSwitcher` component is already integrated in the Navbar:

```tsx
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

// In Navbar
<LanguageSwitcher />
```

Features:
- Dropdown menu on hover
- Flag icons for visual identification
- Current language highlighted
- Persists choice in localStorage
- Reloads page to apply changes

## How It Works

1. **User selects language** from dropdown menu
2. **localStorage updated** with `locale` key (`'en'` or `'el'`)
3. **Page reloads** to apply new language
4. **useTranslations hook** reads locale from localStorage
5. **Messages loaded** from corresponding JSON file
6. **UI updates** with translated text

## Storage

```javascript
// Get current locale
const locale = localStorage.getItem('locale'); // 'en' or 'el'

// Set locale
localStorage.setItem('locale', 'el'); // Switch to Greek
```

## Supported Languages

| Language | Code | Status | Translations |
|----------|------|--------|--------------|
| English | `en` | ✅ Complete | 100+ strings |
| Greek | `el` | ✅ Complete | 100+ strings |

## Complete Translation List

See `messages/en.json` and `messages/el.json` for the full list of available translation keys.

### Sample Translations

**Navigation**
- `Navbar.home` → "Home" / "Αρχική"
- `Navbar.recipes` → "Recipes" / "Συνταγές"
- `Navbar.favorites` → "Favorites" / "Αγαπημένα"

**Recipe Details**
- `Recipe.difficulty` → "Difficulty" / "Δυσκολία"
- `Recipe.easy` → "Easy" / "Εύκολη"
- `Recipe.medium` → "Medium" / "Μέτρια"
- `Recipe.hard` → "Hard" / "Δύσκολη"

**Common UI**
- `Common.loading` → "Loading..." / "Φόρτωση..."
- `Common.search` → "Search..." / "Αναζήτηση..."
- `Common.viewAll` → "View All" / "Προβολή Όλων"

## Testing

1. **Open the app** in your browser
2. **Click the Globe icon** (🌐) in the navbar
3. **Select Greek** (🇬🇷 Ελληνικά)
4. **Page reloads** with Greek text
5. **Navigate** to different pages - all should show Greek
6. **Switch back to English** - reloads with English text

## Future Enhancements

- [ ] Add more languages (French, German, etc.)
- [ ] URL-based locale (`/en/recipes`, `/el/recipes`)
- [ ] Auto-detect browser language
- [ ] Translation management UI for admins
- [ ] RTL support for Arabic/Hebrew

## Troubleshooting

### Translations not showing
- Check if translation key exists in both `en.json` and `el.json`
- Verify exact key path (case-sensitive)
- Use fallback: `t('Key', 'Fallback Text')`

### Language not persisting
- Check localStorage in DevTools
- Ensure localStorage is enabled in browser
- Clear cache and reload

### Missing translations
- Check browser console for errors
- Verify JSON syntax in translation files
- Ensure both files have matching structure

## Credits

- Greek translations by native speakers
- Flag icons from Unicode emoji standard
- Powered by `useTranslations` custom hook
