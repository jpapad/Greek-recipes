# Remaining Features - Implementation Checklist

## 🔴 High Priority (Must Have)

### 1. Shopping List Enhancement
**Status:** Partially Complete (basic functionality exists)  
**Missing Features:**
- [ ] Category grouping (Produce, Dairy, Meat, Pantry, Other)
- [ ] PDF export functionality
- [ ] Quantity adjustment (+/- buttons)
- [ ] "Check all in category" feature
- [ ] Improved localStorage persistence with categories

**Files to Modify:**
- `src/context/ShoppingListContext.tsx` - Add category logic
- `src/app/shopping-list/page.tsx` - Redesign with categories
- Create `src/lib/pdfExport.ts` - PDF generation
- Create `src/components/shopping/CategoryGroup.tsx`

**Dependencies Needed:**
```bash
npm install jspdf
```

**Estimated Time:** 3-4 hours

---

### 2. Multi-language Support (Greek/English)
**Status:** Infrastructure exists (next-intl), not activated  
**Missing Features:**
- [ ] Activate next-intl routing
- [ ] Complete translation files (en.json, el.json)
- [ ] Add language switcher to Navbar
- [ ] Create language-specific routes
- [ ] Translate all hardcoded strings

**Files to Modify:**
- `src/i18n/request.ts` - Remove hardcoded 'en'
- `messages/el.json` - Add all translation keys
- `messages/en.json` - Complete English translations
- `src/components/layout/Navbar.tsx` - Add LanguageSwitcher
- `src/middleware.ts` - Add i18n routing

**Translation Keys Needed:** ~200-300 keys

**Estimated Time:** 4-5 hours

---

### 3. User Engagement Features
**Status:** Basic reviews exist  
**Missing Features:**
- [ ] Display average rating on RecipeCard
- [ ] Enhanced reviews section (sorting, pagination)
- [ ] User profile page with favorite recipes
- [ ] Recipe collections/cookbooks feature
- [ ] "Similar recipes" algorithm

**Files to Create:**
- `src/app/profile/page.tsx` - User profile
- `src/app/collections/page.tsx` - User collections
- `src/components/recipes/SimilarRecipes.tsx`
- `src/lib/recommendations.ts` - Algorithm

**Database Changes:**
```sql
CREATE TABLE user_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  recipe_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Estimated Time:** 5-6 hours

---

## 🟡 Medium Priority (Should Have)

### 4. Meal Planning System
**Status:** Not started  
**Features:**
- [ ] Weekly calendar component (7 days grid)
- [ ] Drag-and-drop recipes to calendar
- [ ] Auto-generate shopping list from week's meals
- [ ] Meal plan persistence (localStorage + optional DB)
- [ ] Print weekly meal plan

**Files to Create:**
- `src/app/meal-plan/page.tsx`
- `src/components/meal-plan/WeeklyCalendar.tsx`
- `src/components/meal-plan/MealSlot.tsx`
- `src/context/MealPlanContext.tsx`

**Dependencies Needed:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

**Database Table (Optional):**
```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  week_start DATE NOT NULL,
  meals JSONB NOT NULL, -- { "monday-breakfast": "recipe-id", ... }
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Estimated Time:** 6-8 hours

---

### 5. Admin Enhancements
**Status:** Basic admin exists  
**Missing Features:**
- [ ] Bulk recipe import (CSV/JSON upload)
- [ ] Image upload to Supabase Storage
- [ ] SEO fields in recipe form (meta title, description, keywords)
- [ ] Draft/Published status toggle
- [ ] Scheduled publishing
- [ ] Analytics dashboard (views, favorites count, etc.)

**Files to Create:**
- `src/app/admin/import/page.tsx` - Bulk import UI
- `src/components/admin/ImageUploader.tsx`
- `src/components/admin/AnalyticsDashboard.tsx`
- `src/lib/csvParser.ts`

**Supabase Storage Setup:**
```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true);

-- Storage policy
CREATE POLICY "Anyone can view recipe images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recipe-images' AND auth.role() = 'authenticated');
```

**Database Changes:**
```sql
ALTER TABLE recipes ADD COLUMN status TEXT DEFAULT 'published';
ALTER TABLE recipes ADD COLUMN publish_at TIMESTAMPTZ;
ALTER TABLE recipes ADD COLUMN meta_title TEXT;
ALTER TABLE recipes ADD COLUMN meta_description TEXT;
ALTER TABLE recipes ADD COLUMN keywords TEXT[];
```

**Estimated Time:** 8-10 hours

---

## 🟢 Lower Priority (Nice to Have)

### 6. Advanced Recipe Features
**Status:** Not started  
**Features:**
- [ ] Video integration (YouTube/Vimeo embed)
- [ ] Ingredient substitution suggestions
- [ ] Unit converter (cups ↔ grams ↔ ml ↔ oz)
- [ ] Recipe suggestion algorithm
- [ ] "What's in your fridge" reverse search

**Files to Create:**
- `src/components/recipes/VideoPlayer.tsx`
- `src/components/recipes/UnitConverter.tsx`
- `src/components/recipes/IngredientSubstitutions.tsx`
- `src/lib/unitConversions.ts`
- `src/lib/recipeRecommendations.ts`

**Database Changes:**
```sql
ALTER TABLE recipes ADD COLUMN video_url TEXT;

CREATE TABLE ingredient_substitutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ingredient TEXT NOT NULL,
  substitutes TEXT[] NOT NULL,
  notes TEXT
);
```

**Unit Conversion Data:**
```typescript
const CONVERSIONS = {
  cups_to_ml: 236.588,
  tbsp_to_ml: 14.787,
  tsp_to_ml: 4.929,
  oz_to_grams: 28.3495,
  lb_to_grams: 453.592
};
```

**Estimated Time:** 6-8 hours

---

### 7. Progressive Web App (PWA)
**Status:** Not started  
**Features:**
- [ ] Service worker for offline access
- [ ] App manifest (install prompt)
- [ ] Offline recipe viewing
- [ ] Push notifications (new recipes)
- [ ] Add to home screen prompt

**Files to Create:**
- `public/manifest.json`
- `public/sw.js` (service worker)
- `src/app/offline/page.tsx`

**Next.js Configuration:**
```bash
npm install next-pwa
```

```javascript
// next.config.ts
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({ /* existing config */ });
```

**Estimated Time:** 4-5 hours

---

### 8. Social Features
**Status:** Not started  
**Features:**
- [ ] User comments on recipes (separate from reviews)
- [ ] Recipe photo uploads by users
- [ ] Follow other users
- [ ] Activity feed
- [ ] Share collections with friends

**Database Changes:**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments, -- for nested replies
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE follows (
  follower_id UUID REFERENCES auth.users NOT NULL,
  following_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);
```

**Estimated Time:** 10-12 hours

---

## 🔵 Infrastructure & DevOps

### 9. Testing Suite
**Status:** Not started  
**Needed:**
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Integration tests (Playwright)
- [ ] E2E tests for critical flows
- [ ] Visual regression tests
- [ ] Performance tests

**Dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm install --save-dev @playwright/test
```

**Files to Create:**
- `__tests__/components/RecipeCard.test.tsx`
- `__tests__/lib/api.test.ts`
- `e2e/recipe-flow.spec.ts`
- `jest.config.js`
- `playwright.config.ts`

**Estimated Time:** 15-20 hours (comprehensive coverage)

---

### 10. CI/CD Pipeline
**Status:** Not started  
**Needed:**
- [ ] GitHub Actions workflow
- [ ] Automated testing on PRs
- [ ] Deployment to Vercel/Netlify
- [ ] Environment-specific deployments (dev/staging/prod)
- [ ] Database migrations automation

**Files to Create:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `scripts/db-migrate.sh`

**Example Workflow:**
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

**Estimated Time:** 3-4 hours

---

### 11. Analytics & Monitoring
**Status:** Not started  
**Needed:**
- [ ] Google Analytics integration
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] User behavior tracking
- [ ] Custom event tracking (recipe views, favorites, etc.)

**Dependencies:**
```bash
npm install @vercel/analytics
npm install @sentry/nextjs
```

**Files to Modify:**
- `src/app/layout.tsx` - Add Analytics component
- `sentry.client.config.ts`
- `sentry.server.config.ts`

**Estimated Time:** 2-3 hours

---

## 📊 Total Estimated Time

| Priority | Features | Total Hours |
|----------|----------|-------------|
| High | 3 features | 12-15 hours |
| Medium | 2 features | 14-18 hours |
| Lower | 3 features | 20-25 hours |
| Infrastructure | 3 items | 20-27 hours |
| **TOTAL** | **11 items** | **66-85 hours** |

---

## 🎯 Recommended Implementation Order

### Phase 1 (Week 1): Core User Features
1. Shopping List Enhancement (3-4h)
2. Multi-language Support (4-5h)
3. User Engagement Features (5-6h)

**Total:** 12-15 hours

---

### Phase 2 (Week 2): Planning & Admin
4. Meal Planning System (6-8h)
5. Admin Enhancements (8-10h)

**Total:** 14-18 hours

---

### Phase 3 (Week 3): Advanced Features
6. Advanced Recipe Features (6-8h)
7. PWA Implementation (4-5h)
8. Social Features (10-12h)

**Total:** 20-25 hours

---

### Phase 4 (Week 4): Quality & Infrastructure
9. Testing Suite (15-20h)
10. CI/CD Pipeline (3-4h)
11. Analytics & Monitoring (2-3h)

**Total:** 20-27 hours

---

## 🚀 Quick Start Guide for Each Feature

### Shopping List Enhancement:
```typescript
// 1. Install dependency
npm install jspdf

// 2. Add category to item type
interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  category: 'produce' | 'dairy' | 'meat' | 'pantry' | 'other';
}

// 3. Implement PDF export
import jsPDF from 'jspdf';

function exportToPDF(items: ShoppingItem[]) {
  const doc = new jsPDF();
  // Add items by category...
  doc.save('shopping-list.pdf');
}
```

---

### Multi-language:
```typescript
// 1. Modify i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !['en', 'el'].includes(locale)) {
    locale = 'en';
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

// 2. Add middleware routing
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'el'],
  defaultLocale: 'en'
});
```

---

### Meal Planning:
```bash
# 1. Install drag-and-drop
npm install @dnd-kit/core @dnd-kit/sortable

# 2. Create calendar component
const WeeklyCalendar = () => {
  const [meals, setMeals] = useState({});
  // Implement DnD...
};
```

---

## 📝 Notes

- All time estimates are for 1 developer
- Estimates include coding, testing, and documentation
- Database migrations should be tested on staging first
- Always create backups before schema changes
- Consider feature flags for gradual rollouts

---

**Last Updated:** December 2024  
**Maintained By:** Greek Recipes Team  
**Next Review:** After Phase 1 completion
