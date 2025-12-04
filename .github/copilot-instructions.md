# Greek Recipes App - AI Agent Instructions

## Architecture Overview

This is a **Next.js 16 App Router** application with **Supabase** backend, featuring a bilingual Greek recipe platform with admin CMS, user authentication, and client-side favorites/shopping list features.

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + RLS policies)
- **Internationalization**: next-intl (currently hardcoded to 'en', with Greek translations in `messages/el.json`)
- **UI Components**: Radix UI primitives + custom components in `src/components/ui/`

### Key Data Flow
1. **Server Components** (default): Pages in `src/app/` fetch data directly from Supabase using `src/lib/api.ts`
2. **Client Components**: Use `"use client"` directive + hooks (`useFavorites`, React Context for shopping lists)
3. **Middleware**: `src/middleware.ts` protects `/admin/*` routes, requires authentication + `is_admin` user metadata
4. **Auth**: Supabase Auth with server-side session handling via `@supabase/ssr`

## Critical Setup Requirements

### Environment Variables (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup (One-time)
1. Run `supabase-setup.sql` in Supabase SQL Editor (creates tables: `regions`, `recipes`, `reviews`, `favorites`)
2. Run `admin-policies.sql` to enable CRUD for authenticated users
3. For admin access: Set user metadata `is_admin: true` via Supabase dashboard or `admin-role.sql`

### Development Commands
- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint check

## Project-Specific Patterns

### Component Architecture
- **GlassPanel**: Custom glassmorphism UI component (`src/components/ui/GlassPanel.tsx`) with variants (`default`, `card`, `dark`)
- **cn() utility**: Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes (wraps `clsx` + `tailwind-merge`)
- **Client-side interactivity**: Always use `"use client"` directive for components with useState/useEffect/Context

### Data Fetching Patterns
```typescript
// Server Component (default in app/)
import { getRecipes } from '@/lib/api';
const recipes = await getRecipes({ search, category, difficulty });

// Client Component with filtering
"use client";
const [filters, setFilters] = useState({});
// Fetch in useEffect or use server actions
```

### Forms and Mutations
- **Admin forms** (`RecipeForm`, `RegionForm`): Client components with controlled state, call API functions from `src/lib/api.ts`
- **Dynamic arrays**: Ingredients/steps use array state with add/remove buttons (see `RecipeForm.tsx:66-82`)
- **After mutations**: Call `router.push()` + `router.refresh()` to revalidate server components

### Authentication Patterns
```typescript
// Server-side (in Server Components/Actions)
import { getUser } from '@/lib/auth';
const user = await getUser(); // Returns User | null

// Client-side
import { getUser } from '@/lib/auth';
const user = await getUser(); // Suppress session errors for anonymous users

// Middleware protection
// /admin/* routes auto-redirect to /login if not authenticated or not admin
```

### Favorites & Shopping List (Hybrid Storage)
- **Favorites** (`useFavorites` hook): 
  - Authenticated users → Supabase `favorites` table
  - Anonymous users → `localStorage`
  - Auto-switches on auth state change
- **Shopping List** (`ShoppingListContext`): Always `localStorage` (no backend persistence)

### Database Schema Notes
- **JSONB fields**: `recipes.steps` and `recipes.ingredients` are JSONB arrays
- **Slugs**: Must be unique and URL-friendly (lowercase, hyphens, no spaces)
- **RLS policies**: Public read for `recipes`/`regions`, authenticated write (see `admin-policies.sql`)
- **Foreign keys**: `recipes.region_id` references `regions.id` with `ON DELETE SET NULL`

## Common Tasks

### Adding a New Recipe (Programmatically)
```typescript
import { createRecipe } from '@/lib/api';
await createRecipe({
  title: 'Dolmades',
  slug: 'dolmades',
  region_id: 'uuid-here',
  steps: ['Step 1', 'Step 2'], // Array of strings
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  time_minutes: 60,
  difficulty: 'medium', // 'easy' | 'medium' | 'hard'
  servings: 4,
  image_url: 'https://...',
  category: 'Appetizer',
  short_description: '...'
});
```

### Creating Admin Routes
1. Add page under `src/app/admin/`
2. Create server component (auth checked by middleware)
3. Use `GlassPanel` for consistent styling
4. Import types from `src/lib/types.ts`

### Styling Conventions
- **Colors**: Use Tailwind semantic colors (`bg-primary`, `text-foreground`, etc.)
- **Glass effects**: Use `<GlassPanel>` instead of raw divs for cards
- **Responsive**: Mobile-first with `md:`, `lg:` breakpoints
- **Icons**: Import from `lucide-react`

### Internationalization (Future-Ready)
- Translation keys in `messages/en.json` and `messages/el.json`
- Import via `next-intl` (currently hardcoded to 'en' in `src/i18n/request.ts`)
- Use `useTranslations()` hook in client components, `getTranslations()` in server components

## File Organization
- `/src/app/` - Next.js pages (App Router)
- `/src/components/` - Organized by domain (`admin/`, `recipes/`, `layout/`, `ui/`)
- `/src/lib/` - Core logic (`api.ts` for Supabase queries, `auth.ts` for auth helpers, `types.ts` for TypeScript interfaces)
- `/src/context/` - React Context providers (shopping list only)
- `/src/hooks/` - Custom hooks (`useFavorites`, `useDebounce`)

## Debugging Tips
- **Mock data fallback**: `src/lib/api.ts` has mock data if Supabase queries fail (check console warnings)
- **Auth errors**: Middleware suppresses "Auth session missing" errors for anonymous users
- **Image URLs**: Next.js configured for `images.unsplash.com` only (see `next.config.ts`)

## Avoid Common Mistakes
- Don't use `createClient` from `@supabase/supabase-js` directly - use `supabase` instance from `src/lib/supabaseClient.ts`
- Don't forget `"use client"` for components using hooks, context, or event handlers
- Don't modify `steps`/`ingredients` as strings - they're JSONB arrays in database
- Don't create admin users manually - use `admin-role.sql` or set `is_admin` metadata in Supabase dashboard
