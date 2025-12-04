# Site Settings Manager - Complete Guide

## Overview

The Site Settings Manager provides a comprehensive admin interface for customizing the visual design of your Greek Recipes website without touching code. Control colors, backgrounds, glass effects, typography, spacing, animations, and SEO settings - all through an intuitive tabbed interface.

## Features

✅ **17 Color Variables** - Complete color palette control  
✅ **4 Background Modes** - Solid, gradient, image, pattern  
✅ **Glass Effects** - Blur, opacity, border, shadow controls  
✅ **5 Theme Presets** - One-click themes (Dark, Light, Ocean, Sunset, Forest)  
✅ **Typography Settings** - Fonts, sizes, weights, line heights  
✅ **Spacing Controls** - Containers, padding, gaps, border radius  
✅ **Animation Settings** - Speed, easing, hover effects  
✅ **SEO Settings** - Meta tags, Open Graph, Twitter Cards  
✅ **Real-time CSS Injection** - Changes apply dynamically via CSS variables  
✅ **Reset to Defaults** - One-click restore for each setting group  

---

## Setup Instructions

### 1. Database Setup

Run the SQL script in your Supabase SQL Editor:

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Create new query
# 3. Paste contents of site-settings-table.sql
# 4. Click "Run"
```

This creates:
- `site_settings` table with JSONB storage
- 7 default settings (colors, backgrounds, glassmorphism, typography, spacing, animations, theme_presets, seo)
- RLS policies (public read, authenticated write)

### 2. Verify Installation

1. Navigate to `/admin/site-settings`
2. You should see 6 tabs: Colors, Backgrounds, Glass Effects, Presets, Typography, Spacing
3. Default values are pre-populated from database

### 3. Access Control

- **View Settings**: Anyone can view (public read)
- **Edit Settings**: Requires authentication + `is_admin: true` metadata
- Protected by middleware at `/admin/*` routes

---

## Admin Interface Guide

### Colors Tab

Control all color variables used throughout the site:

**Primary Colors:**
- `Primary` - Main brand color (buttons, links, accents)
- `Primary Dark` - Darker shade for hover states
- `Primary Light` - Lighter shade for backgrounds

**Secondary Colors:**
- `Secondary` - Complementary brand color
- `Secondary Dark` - Darker secondary shade
- `Accent` - Highlight color for special elements

**Surface Colors:**
- `Background` - Main page background
- `Surface` - Card/panel backgrounds
- `White` - Pure white for overlays

**Text Colors:**
- `Text Primary` - Main text color
- `Text Secondary` - Muted text
- `Text Muted` - Disabled/placeholder text
- `Border` - Border and divider color

**Status Colors:**
- `Success` - Green for confirmations
- `Warning` - Yellow/orange for warnings
- `Error` - Red for errors
- `Info` - Blue for information

**How to Use:**
1. Click color swatch to open picker
2. Or type hex value directly (e.g., `#3B82F6`)
3. Click "Save Colors" to apply
4. **Hard refresh required** (Ctrl+Shift+R) to see changes

---

### Backgrounds Tab

Choose from 4 background modes:

#### 1. Solid Color
Simple single color background
- Pick color from palette
- Best for minimal designs

#### 2. Gradient
Two or three color gradients

**Linear Gradient:**
- Direction: `0deg` (vertical) to `360deg`
- From Color: Start color
- Via Color (optional): Middle color
- To Color: End color

**Radial Gradient:**
- Position: `center`, `top`, `bottom`, `left`, `right`
- Color flow from center outward

#### 3. Image
Full-page background image
- Image URL: Direct link to image (HTTPS)
- Opacity: 0.0 (transparent) to 1.0 (opaque)
- Auto cover + center positioning

#### 4. Pattern
Repeating background patterns
- Pattern Type: dots, grid, waves, etc.
- Pattern Color: Color of pattern elements
- Opacity: Pattern visibility

**Example Gradient:**
```json
{
  "mode": "gradient",
  "gradient": {
    "type": "linear",
    "direction": "135deg",
    "colorFrom": "#667eea",
    "colorVia": "#764ba2",
    "colorTo": "#f093fb"
  }
}
```

---

### Glass Effects Tab

Configure glassmorphism styling for all `GlassPanel` components:

**Controls:**
- **Blur Strength** (0-40px): Background blur intensity
- **Background Opacity** (0-1): Panel transparency
- **Border Opacity** (0-1): Border visibility
- **Shadow Intensity**: `none`, `light`, `medium`, `strong`
- **Border Width** (0-5px): Border thickness
- **Border Radius** (0-32px): Corner roundness

**Live Preview:**
Interactive preview panel shows real-time effect changes

**Recommended Settings:**
- **Light Theme**: Blur 12px, Opacity 0.7, Border 0.3
- **Dark Theme**: Blur 16px, Opacity 0.5, Border 0.2
- **Minimal**: Blur 0px, Opacity 1.0 (no glass effect)

---

### Presets Tab

One-click theme application with 5 pre-configured designs:

#### 🌙 Dark Theme
Deep blues and purples with high contrast
- Best for: Night mode, modern aesthetic
- Colors: #1e3a8a (primary), #1e1b4b (background)

#### ☀️ Light Theme
Bright blues with white surfaces
- Best for: Daytime, clean look
- Colors: #3b82f6 (primary), #ffffff (background)

#### 🌊 Ocean Theme
Teals and aqua blues
- Best for: Mediterranean vibe, fresh feel
- Colors: #0891b2 (primary), #0e7490 (dark)

#### 🌅 Sunset Theme
Warm oranges and pinks
- Best for: Inviting, warm atmosphere
- Colors: #f97316 (primary), #fb923c (light)

#### 🌲 Forest Theme
Earthy greens
- Best for: Natural, organic feel
- Colors: #059669 (primary), #047857 (dark)

**How to Apply:**
1. Click "Apply [Theme Name]"
2. Confirmation dialog appears
3. Colors instantly update
4. Hard refresh to see full effect

---

### Typography Tab

*(Coming Soon - UI Structure Ready)*

Control all font-related settings:

**Font Family:**
- System fonts or Google Fonts
- Headings font
- Body text font

**Font Sizes (10 levels):**
- `xs` - 0.75rem (12px)
- `sm` - 0.875rem (14px)
- `base` - 1rem (16px)
- `lg` - 1.125rem (18px)
- `xl` - 1.25rem (20px)
- `2xl` - 1.5rem (24px)
- `3xl` - 1.875rem (30px)
- `4xl` - 2.25rem (36px)
- `5xl` - 3rem (48px)
- `6xl` - 3.75rem (60px)

**Font Weights (6 levels):**
- Light (300)
- Normal (400)
- Medium (500)
- Semibold (600)
- Bold (700)
- Extrabold (800)

**Line Heights:**
- Tight (1.25)
- Normal (1.5)
- Relaxed (1.75)

---

### Spacing Tab

*(Coming Soon - UI Structure Ready)*

Control layout spacing and sizing:

**Container:**
- Max Width: `1280px`, `1536px`, `100%`

**Section Padding:**
- Y-axis: `4rem`, `6rem`, `8rem`
- X-axis: `1rem`, `2rem`, `4rem`

**Card Padding:**
- Small: `1rem`
- Medium: `1.5rem`
- Large: `2rem`

**Border Radius (6 sizes):**
- `sm` - 0.125rem (2px)
- `md` - 0.375rem (6px)
- `lg` - 0.5rem (8px)
- `xl` - 0.75rem (12px)
- `2xl` - 1rem (16px)
- `full` - 9999px (pill shape)

**Gap Sizes:**
- Small: `0.5rem`
- Medium: `1rem`
- Large: `1.5rem`

---

## API Reference

All settings are managed through `src/lib/api.ts`:

### Get All Settings
```typescript
const settings = await getAllSiteSettings();
// Returns: SiteSetting[] grouped by category
```

### Get Specific Setting
```typescript
const colors = await getSiteSettingByKey('colors');
// Returns: SiteSetting | null
```

### Get Settings by Group
```typescript
const designSettings = await getSiteSettingsByGroup('design');
// Returns: SiteSetting[]
```

### Update Setting
```typescript
await updateSiteSetting('colors', {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  // ... other colors
});
```

### Reset to Default
```typescript
await resetSiteSettingToDefault('glassmorphism');
// Restores original values from default_value column
```

### Apply Theme Preset
```typescript
await applyThemePreset('dark');
// Updates colors setting with preset values
```

---

## CSS Variables

Settings are injected as CSS custom properties via `StyleInjector` component:

### Color Variables
```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text-primary: #1f2937;
  /* ...17 total color variables */
}
```

### Background Variables
```css
:root {
  --bg-mode: gradient;
  --bg-gradient: linear-gradient(180deg, #667eea, #764ba2);
}
body {
  background: var(--bg-gradient);
  background-attachment: fixed;
}
```

### Glass Effect Variables
```css
:root {
  --glass-blur: 12px;
  --glass-opacity: 0.7;
  --glass-border-opacity: 0.3;
  --glass-shadow: medium;
}
.glass-panel {
  backdrop-filter: blur(var(--glass-blur));
  background-color: rgba(255, 255, 255, var(--glass-opacity));
}
```

### Typography Variables
```css
:root {
  --font-family: 'Inter', sans-serif;
  --font-size-base: 1rem;
  --font-weight-medium: 500;
  --line-height-normal: 1.5;
}
```

---

## Database Schema

```sql
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_group TEXT NOT NULL, -- 'design', 'seo', 'social', 'advanced'
  value JSONB NOT NULL,
  default_value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Setting Groups
- `design` - Colors, backgrounds, glass, typography, spacing, animations, presets
- `seo` - Meta tags, Open Graph, Twitter Cards
- `social` - Social media links and handles
- `advanced` - Custom CSS, analytics scripts

---

## TypeScript Types

### SiteSetting Base
```typescript
interface SiteSetting {
  id: string;
  setting_key: string;
  setting_group: string;
  value: ColorSettings | BackgroundSettings | /* ... */;
  default_value: ColorSettings | BackgroundSettings | /* ... */;
  is_active: boolean;
  updated_at: string;
}
```

### ColorSettings
```typescript
interface ColorSettings {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  white: string;
}
```

### BackgroundSettings
```typescript
interface BackgroundSettings {
  mode: 'solid' | 'gradient' | 'image' | 'pattern';
  solidColor?: string;
  gradient?: {
    type: 'linear' | 'radial';
    direction?: string; // e.g., '180deg'
    position?: string; // e.g., 'center'
    colorFrom: string;
    colorVia?: string;
    colorTo: string;
  };
  imageUrl?: string;
  imageOpacity?: number;
  patternType?: string;
  patternColor?: string;
  patternOpacity?: number;
}
```

*(See `src/lib/types/site-settings.ts` for all types)*

---

## Workflow Examples

### Scenario 1: Rebranding Color Scheme

**Goal:** Change from blue to purple theme

1. Go to `/admin/site-settings`
2. Click **Colors** tab
3. Update colors:
   - Primary: `#8b5cf6` (purple)
   - Primary Dark: `#7c3aed`
   - Primary Light: `#a78bfa`
4. Click **Save Colors**
5. Hard refresh (Ctrl+Shift+R)

**Result:** All buttons, links, accents now purple

---

### Scenario 2: Add Mediterranean Gradient

**Goal:** Ocean-themed gradient background

1. Go to **Backgrounds** tab
2. Select "Gradient" mode
3. Choose "Linear" gradient type
4. Set direction: `135deg` (diagonal)
5. Set colors:
   - From: `#0ea5e9` (sky blue)
   - Via: `#06b6d4` (cyan)
   - To: `#0891b2` (teal)
6. Click **Save Backgrounds**
7. Refresh page

**Result:** Beautiful ocean gradient across entire site

---

### Scenario 3: Soften Glass Effects

**Goal:** More subtle glassmorphism for better readability

1. Go to **Glass Effects** tab
2. Adjust sliders:
   - Blur: `8px` (reduced from 12px)
   - Background Opacity: `0.85` (more opaque)
   - Border Opacity: `0.4` (slightly visible)
   - Shadow: `light`
3. Preview in live panel
4. Click **Save Glass Effects**
5. Refresh

**Result:** Glass panels more readable, less distraction

---

### Scenario 4: Switch to Dark Mode

**Goal:** Enable dark theme for night viewing

**Option 1: Use Preset**
1. Go to **Presets** tab
2. Click "Apply Dark Theme"
3. Confirm in dialog
4. Refresh

**Option 2: Manual Customization**
1. Go to **Colors** tab
2. Set:
   - Background: `#0f172a` (dark blue)
   - Surface: `#1e293b`
   - Text Primary: `#f1f5f9` (light)
   - Text Secondary: `#cbd5e1`
3. Save & refresh

**Result:** Full dark mode experience

---

## Troubleshooting

### Changes Not Appearing?

**Hard refresh required after saving:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Clear browser cache:**
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

**Check StyleInjector:**
- Open DevTools
- Go to Elements tab
- Look for `<style id="dynamic-site-styles">` in `<head>`
- Verify CSS variables are present

### Colors Not Applying?

**Verify setting is active:**
```sql
SELECT is_active FROM site_settings WHERE setting_key = 'colors';
-- Should return: true
```

**Check hex format:**
- Must include `#` prefix
- Valid: `#3b82f6`, `#fff`
- Invalid: `3b82f6`, `rgb(59, 130, 246)`

### Gradient Not Showing?

**Ensure gradient structure is correct:**
```json
{
  "mode": "gradient",
  "gradient": {
    "type": "linear",
    "direction": "180deg",
    "colorFrom": "#667eea",
    "colorTo": "#764ba2"
  }
}
```

**Check body element:**
- Inspect `<body>` in DevTools
- Should have `background: var(--bg-gradient)`

### Glass Effects Not Working?

**Verify CSS variables:**
```css
:root {
  --glass-blur: 12px;
  --glass-opacity: 0.7;
}
```

**Check component usage:**
- Component must use `GlassPanel` from `@/components/ui/GlassPanel`
- Or have class `glass-panel`

---

## Advanced Customization

### Custom CSS Injection

For advanced users, directly edit the `value` JSONB field in Supabase:

```sql
UPDATE site_settings
SET value = jsonb_set(
  value,
  '{customCSS}',
  '"body { font-family: Georgia, serif; }"'
)
WHERE setting_key = 'advanced';
```

### Create Custom Theme Preset

Add new preset to `theme_presets` setting:

```sql
UPDATE site_settings
SET value = jsonb_set(
  value,
  '{presets,custom}',
  '{
    "name": "Custom Theme",
    "colors": {
      "primary": "#ff6b6b",
      "secondary": "#4ecdc4",
      "background": "#ffe66d"
    }
  }'
)
WHERE setting_key = 'theme_presets';
```

### Export/Import Settings

**Export all settings:**
```sql
SELECT setting_key, value
FROM site_settings
WHERE is_active = true;
```

**Import from JSON:**
```typescript
const importSettings = async (jsonData: any) => {
  for (const [key, value] of Object.entries(jsonData)) {
    await updateSiteSetting(key, value);
  }
};
```

---

## Best Practices

### Performance
- ✅ CSS variables are cached by browser
- ✅ StyleInjector runs once on load
- ✅ No runtime performance impact
- ⚠️ Avoid frequent preset switching (causes repaints)

### Design Consistency
- Use color variables consistently across components
- Test both light and dark themes
- Verify glass effects at different opacities
- Maintain 4.5:1 contrast ratio for text (WCAG AA)

### Accessibility
- Ensure text colors meet WCAG contrast ratios
- Test with screen readers
- Avoid overly bright or low-contrast combinations
- Provide alternative text for background images

### Version Control
- Backup settings before major changes
- Document custom presets in team wiki
- Use descriptive commit messages when updating defaults
- Test across devices and browsers

---

## File Structure

```
src/
├── app/
│   └── admin/
│       └── site-settings/
│           ├── page.tsx           # Main admin interface
│           └── [id]/
│               └── edit/
│                   └── page.tsx   # Individual setting editor (optional)
├── components/
│   ├── layout/
│   │   └── StyleInjector.tsx      # CSS variable injection
│   └── ui/
│       └── tabs.tsx               # Shadcn tabs component
└── lib/
    ├── api.ts                     # API functions (lines 820-930)
    └── types/
        └── site-settings.ts       # TypeScript types

Database:
├── site-settings-table.sql        # Schema + default data

Documentation:
└── SITE_SETTINGS_GUIDE.md         # This file
```

---

## Next Steps

### Phase 1: Complete Core Features ✅
- [x] Database schema with 7 settings
- [x] TypeScript types
- [x] API layer (6 functions)
- [x] Admin interface (Colors, Backgrounds, Glass, Presets)
- [x] CSS injection system
- [x] Navigation integration

### Phase 2: Expand UI (In Progress)
- [ ] Typography tab implementation
- [ ] Spacing tab implementation
- [ ] Animation settings tab
- [ ] SEO settings interface
- [ ] Real-time preview (no refresh)

### Phase 3: Advanced Features
- [ ] Export/Import settings as JSON
- [ ] Setting history and versioning
- [ ] A/B testing for themes
- [ ] Dark/Light mode auto-detection
- [ ] Custom CSS injection field
- [ ] Setting permissions (read-only, editor, admin)

### Phase 4: Polish
- [ ] Onboarding wizard for first-time setup
- [ ] Preset gallery with screenshots
- [ ] Accessibility checker
- [ ] Performance monitoring
- [ ] Mobile-responsive admin interface

---

## Support

### Common Questions

**Q: Can I use Google Fonts?**  
A: Yes! Add font URL to typography settings, then reference in `fontFamily`

**Q: Can I have multiple gradient backgrounds?**  
A: Not natively, but you can layer gradients using custom CSS

**Q: How do I restore factory defaults?**  
A: Click "Reset to Default" in each tab, or run:
```sql
UPDATE site_settings SET value = default_value;
```

**Q: Can I schedule theme changes?**  
A: Not built-in, but you can use cron jobs with the API

### Need Help?

- 📖 Check `HOME_SECTIONS_GUIDE.md` for related features
- 🐛 Report bugs in GitHub Issues
- 💬 Ask questions in Discord/Slack
- 📧 Email: support@greekrecipes.com

---

## Changelog

### v1.0.0 (Current)
- Initial release
- 7 default settings (colors, backgrounds, glass, typography, spacing, animations, presets, seo)
- Tabbed admin interface
- 5 theme presets
- CSS variable injection
- Real-time color picker
- Gradient editor
- Glass effects preview

### Upcoming
- v1.1.0: Typography + Spacing tabs
- v1.2.0: Real-time preview
- v1.3.0: Export/Import
- v2.0.0: Setting versioning + history

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Author:** Greek Recipes Team
