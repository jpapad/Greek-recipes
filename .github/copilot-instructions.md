# Greek Recipes App - AI Agent Instructions

## Architecture Overview

This is a **Next.js 16 App Router** application with **Supabase** backend, featuring a bilingual Greek recipe platform with advanced CMS, blog system, page builder, user authentication, and AI-powered features.

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS policies)
- **Internationalization**: next-intl with Greek/English support via `LocaleContext`
- **UI Components**: Radix UI primitives + custom glassmorphism components in `src/components/ui/`
- **Rich Text**: TipTap editor for blog articles and content blocks
- **AI Integration**: Google Gemini 1.5 for recipe assistance and content generation

### Key Data Flow & Architecture Decisions
1. **Server Components** (default in `src/app/`): Fetch data directly from Supabase using `getSupabaseServerClient()` from `src/lib/supabaseServer.ts`
2. **Client Components**: Use `"use client"` directive, import from `src/lib/supabaseClient.ts` (singleton pattern with lazy initialization)
3. **Middleware**: `src/middleware.ts` protects `/admin/*`, checks `is_admin` from profiles table (fallback to user_metadata/app_metadata)
4. **Hybrid Storage Pattern**: Favorites use DB for authenticated users, localStorage for anonymous; auto-syncs on login
5. **Route Structure**: Dynamic locale routing via `[locale]` folder, but currently hardcoded to Greek ('el')

## Critical Setup Requirements

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Optional AI features
GOOGLE_AI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
```

### Database Setup (Sequential Execution Required)
Execute these SQL files in Supabase SQL Editor **in order**:
1. `supabase-setup.sql` - Core tables (regions, recipes with JSONB fields)
2. `admin-policies.sql` - RLS policies for authenticated CRUD
3. `favorites-table.sql` - User favorites with RLS
4. `reviews-table.sql` - Review system
5. `blog-system.sql` - Articles, categories, user_roles table
6. `pages-table.sql` + `menu-items-table.sql` - Page builder & navigation
7. `create-prefecture-city-schema.sql` - Geographic data (prefectures/cities)
8. `storage-setup.sql` - Supabase Storage buckets for images
9. `admin-role.sql` - Set initial admin user (replace UUID with your user ID)

**Admin Access**: Set `is_admin: true` in `profiles` table or user metadata via Supabase dashboard.

### Development Commands
- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Production build (strict type checking, no warnings suppressed)
- `npm run lint` - ESLint with custom rules (doesn't fail on errors via wrapper)

## Project-Specific Patterns

### Supabase Client Pattern (CRITICAL)
```typescript
// ❌ NEVER do this in ANY file:
import { createClient } from '@supabase/supabase-js'

// ✅ In Server Components/Routes:
import { getSupabaseServerClient } from '@/lib/supabaseServer'
const supabase = await getSupabaseServerClient() // async cookies handling

// ✅ In Client Components:
import { supabase } from '@/lib/supabaseClient' // singleton with Proxy pattern
const { data } = await supabase.from('recipes').select('*')

// ✅ In API routes:
import { createServerClient } from '@supabase/ssr'
// Manual cookie setup (see existing routes in src/app/api/auth/)
```

### Component Architecture
- **GlassPanel**: Custom glassmorphism UI (`src/components/ui/GlassPanel.tsx`) with variants (`default`, `card`, `dark`, `accent`). Use for ALL card-like containers in admin.
- **cn() utility**: Merge Tailwind classes via `clsx` + `tailwind-merge` (from `src/lib/utils.ts`)
- **"use client" directive**: Required for useState, useEffect, Context, event handlers, or any interactive logic
- **Dynamic imports**: TipTap editor and heavy components use `dynamic(() => import(...), { ssr: false })` to avoid SSR issues

### Data Fetching & Mutations
```typescript
// Server Component (in src/app/)
import { getRecipes } from '@/lib/api';
const recipes = await getRecipes({ search, category, difficulty, regionId });

// Client Component with real-time updates
"use client";
const [data, setData] = useState([]);
useEffect(() => {
  async function load() {
    const results = await getRecipes(filters);
    setData(results);
  }
  load();
}, [filters]);

// After mutations (admin forms):
await updateRecipe(id, formData);
router.push('/admin/recipes');
router.refresh(); // Revalidate server components
```

### Authentication & Authorization
```typescript
// Server-side user check
import { getUser } from '@/lib/auth';
const user = await getUser(); // Returns User | null, never throws

// Middleware auto-protects /admin/* routes
// Checks: authenticated + is_admin from profiles table (with fallbacks)

// Admin role check priority:
// 1. profiles.is_admin (authoritative)
// 2. user.app_metadata.is_admin
// 3. user.user_metadata.is_admin
```

### JSONB Array Pattern (Recipes)
```typescript
// recipes.steps and recipes.ingredients are JSONB arrays of strings
await createRecipe({
  steps: ['Step 1', 'Step 2', 'Step 3'], // Array, not comma-separated string
  ingredients: ['Ingredient A', 'Ingredient B'],
  // ...other fields
});

// In admin forms, use state arrays:
const [steps, setSteps] = useState<string[]>([]);
const addStep = () => setSteps([...steps, '']);
```

### Favorites & Shopping List (Dual-Storage Pattern)
- **useFavorites hook**: Checks `getUser()`, if authenticated uses Supabase `user_favorites` table, else localStorage. Auto-syncs when auth state changes.
- **ShoppingListContext**: Always localStorage only (no backend persistence by design)

### Blog System & Content Blocks
- **TipTap Editor**: Used in `ArticleForm` and `PageForm` for rich content (bold, italic, headings, images, links)
- **Page Builder**: 18 block types (hero, features, gallery, etc.) stored as JSONB in `pages.content`
- **Article Categories**: Managed via `article_categories` table with colors
- **SEO Fields**: Every article/page has meta_title, meta_description, keywords

### Internationalization (Partial Implementation)
- Translation files: `messages/en.json` and `messages/el.json`
- Current behavior: Hardcoded to Greek ('el') in most places
- Future: Use `useTranslations('namespace')` in client, `getTranslations('namespace')` in server
- LocaleContext provides language switching (stored in cookie `NEXT_LOCALE`)

## File Organization & Key Files
- `/src/app/` - Pages (Server Components by default)
  - `/admin/*` - Protected admin routes
  - `/api/*` - API routes for auth/AI endpoints
  - `/blog/` - Blog listing and article pages
  - `/recipes/` - Recipe catalog and detail pages
- `/src/components/` - Domain-organized components
  - `/admin/` - Admin forms (RecipeForm, ArticleForm, PageForm, etc.)
  - `/recipes/` - Recipe cards, filters, cooking mode
  - `/ui/` - Reusable Radix UI + custom components
- `/src/lib/` - Core business logic
  - `api.ts` - All Supabase queries (1300+ lines, mock fallbacks removed in production)
  - `supabaseClient.ts` - Client-side singleton with Proxy
  - `supabaseServer.ts` - Server-side client factory (async cookies)
  - `auth.ts` - `getUser()` helper with error suppression
  - `types.ts` - TypeScript interfaces (Recipe, Region, Article, etc.)
- `/src/context/` - React Context (ShoppingList, MealPlan, Locale, AdminI18n)
- `/src/hooks/` - Custom hooks (useFavorites, useDebounce, useRecentlyViewed)
- `/*.sql` - Database migrations (40+ files, run in sequence)

## Common Tasks & Workflows

### Adding a New Recipe Feature
1. Update `Recipe` type in `src/lib/types.ts`
2. Add database field via SQL migration (ensure RLS policies updated)
3. Update `getRecipes()` and `createRecipe()` in `src/lib/api.ts`
4. Modify `RecipeForm` component (`src/components/admin/RecipeForm.tsx`)
5. Update recipe detail page (`src/app/recipes/[slug]/page.tsx`)

### Creating a New Admin Page
1. Create `src/app/admin/my-feature/page.tsx` (Server Component)
2. Use `<GlassPanel>` for layout consistency
3. Import data functions from `src/lib/api.ts`
4. Middleware automatically protects route (must be admin)

### Adding a New Block Type (Page Builder)
1. Define type in `src/lib/types/blocks.ts`
2. Create renderer in `src/components/blocks/MyBlock.tsx`
3. Add to `PageRenderer.tsx` switch statement
4. Update `BlockEditor` in admin for UI controls

### Working with Supabase Storage
```typescript
// Upload to 'recipe-images' bucket (public)
const { data, error } = await supabase.storage
  .from('recipe-images')
  .upload(`${userId}/${filename}`, file);

const publicUrl = supabase.storage
  .from('recipe-images')
  .getPublicUrl(data.path).data.publicUrl;
```

## Debugging & Troubleshooting

### Common Issues
- **"Auth session missing!" errors**: Expected for anonymous users, suppressed in middleware
- **Empty data in admin**: Check if SQL migrations ran in correct order
- **Type errors on build**: Strict mode enabled, fix all TypeScript errors (no `any` allowed)
- **Client/Server hydration mismatch**: Ensure `"use client"` on interactive components, avoid conditionals based on `window`
- **Image 403 errors**: Only `images.unsplash.com` configured in `next.config.ts`, add new domains as needed

### Development Tips
- Use `router.refresh()` after mutations to revalidate server component data
- Check Supabase logs for RLS policy violations (most common DB error)
- For admin issues, verify `profiles.is_admin = true` in DB
- Mock data removed from production; empty responses indicate missing DB setup

## Styling Conventions
- **Tailwind Semantic Colors**: `bg-primary`, `text-foreground`, `bg-muted`, `text-muted-foreground`
- **Responsive Design**: Mobile-first, use `md:` (768px), `lg:` (1024px) breakpoints
- **Icons**: Import from `lucide-react` (e.g., `<ChefHat />`, `<Clock />`)
- **Glass Morphism**: Semi-transparent backgrounds with backdrop blur (`backdrop-blur-xl bg-white/10`)

## Critical Don'ts
❌ Don't import `createClient` directly from `@supabase/supabase-js` (breaks auth context)  
❌ Don't treat `steps`/`ingredients` as strings (they're JSONB arrays)  
❌ Don't create admin users via signup (set `is_admin` in profiles table after)  
❌ Don't use `getSupabaseServerClient()` in Client Components (causes build errors)  
❌ Don't skip `router.refresh()` after mutations (stale data will persist)  
❌ Don't add images from new domains without updating `next.config.ts`

## Advanced Features (Optional)
- **AI Recipe Assistant**: Powered by Gemini 1.5 (`src/app/api/generate-recipe/route.ts`)
- **Meal Planning**: Drag-and-drop calendar in `/meal-plan` with PDF export
- **Prefecture/City System**: Geographic taxonomy for recipes (Greek administrative divisions)
- **Analytics**: Page views, search queries, recipe views (see `analytics-schema.sql`)
- **Collections**: User-curated recipe collections (public/private visibility)
- **Interactive Maps**: 
  - **DrillDownMap** (`/regions/map`): Pure GeoJSON polygons with 4 levels + clustering. See `MAP_FEATURE.md`
  - **UnifiedMap** (`/regions/explore`): Hybrid mode (markers OR polygons), integrates with existing HierarchicalMap logic. Uses Region/Prefecture/City types. See `UNIFIED_MAP_GUIDE.md`
  - All maps use dynamic import `{ ssr: false }` for SSR safety. GeoJSON files in `/public/data/`
