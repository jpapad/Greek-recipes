# Complete Admin Dashboard Setup Guide

## 🎯 Overview

WordPress-style admin dashboard για το "Ελλάδα στο Πιάτο" project με:
- ✅ Server-side authentication & authorization
- ✅ Full i18n support (EL default + EN)
- ✅ Modern UI με shadcn/ui + Tailwind
- ✅ Secure RLS policies στο Supabase
- ✅ CRUD για Recipes, Regions, Prefectures, Cities
- ✅ Media management με Supabase Storage
- ✅ Site settings management
- ✅ User management με admin toggle

---

## 📋 Prerequisites

- Supabase project ρυθμισμένο
- Next.js 16+ App Router
- Node.js 18+
- Environment variables configured

---

## 🚀 Installation Steps

### 1. Run SQL Scripts in Supabase

Πήγαινε στο Supabase Dashboard → SQL Editor και τρέξε τα scripts με τη σειρά:

```bash
sql/01-profiles-table.sql      # Profiles table + trigger
sql/02-admin-policies.sql      # RLS policies για όλα τα tables
sql/03-set-admin-user.sql      # Κάνε τον πρώτο admin (EDIT EMAIL FIRST!)
sql/04-storage-buckets.sql     # Storage buckets για εικόνες
```

**⚠️ ΣΗΜΑΝΤΙΚΟ:** Στο `03-set-admin-user.sql`, άλλαξε το email:
```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'YOUR-EMAIL@example.com';  -- <-- CHANGE THIS!
```

### 2. Install Missing Dependencies

```bash
npm install js-cookie
npm install --save-dev @types/js-cookie
```

### 3. Verify Environment Variables

Το `.env.local` πρέπει να έχει:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📁 Project Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx              # ✅ Admin layout με auth guard
│       ├── page.tsx                # ✅ Dashboard με stats
│       ├── recipes/
│       │   ├── page.tsx            # Recipes list
│       │   ├── new/page.tsx        # Create recipe
│       │   └── [id]/edit/page.tsx  # Edit recipe
│       ├── regions/
│       │   ├── page.tsx
│       │   └── [id]/edit/page.tsx
│       ├── prefectures/
│       ├── cities/
│       ├── media/
│       │   └── page.tsx            # Media library
│       ├── settings/
│       │   └── page.tsx            # Site settings
│       └── users/
│           └── page.tsx            # User management
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx        # ✅ Collapsible sidebar
│       ├── AdminTopbar.tsx         # ✅ Topbar με search/locale/theme
│       └── StatCard.tsx            # ✅ Dashboard stat widget
├── context/
│   └── AdminI18nContext.tsx        # ✅ i18n provider για admin
├── lib/
│   ├── adminServerGuard.ts         # ✅ Server-side auth guard
│   └── supabaseServer.ts           # ✅ Server client (fixed)
└── sql/
    ├── 01-profiles-table.sql       # ✅
    ├── 02-admin-policies.sql       # ✅
    ├── 03-set-admin-user.sql       # ✅
    └── 04-storage-buckets.sql      # ✅
```

**✅ = Already created**
**📝 = Needs to be created** (examples provided below)

---

## 🔐 Authentication Flow

### Server-Side (Recommended)

```typescript
// In any admin page.tsx (Server Component)
import { requireAdminServer } from "@/lib/adminServerGuard";

export default async function AdminPage() {
    const { user, profile } = await requireAdminServer();
    
    // User is guaranteed to be authenticated and admin
    return <div>Welcome {user.email}</div>;
}
```

### Middleware Protection

Το `src/middleware.ts` ελέγχει:
1. Session existence
2. `profiles.is_admin` από βάση (authoritative)
3. Fallback σε `user_metadata.is_admin` για compatibility

---

## 🌍 Internationalization

### Admin i18n (Independent από public site)

```tsx
"use client";
import { useAdminI18n } from "@/context/AdminI18nContext";

export function MyComponent() {
    const { t, locale, setLocale } = useAdminI18n();
    
    return (
        <div>
            <h1>{t("dashboard.title")}</h1>
            <button onClick={() => setLocale(locale === "el" ? "en" : "el")}>
                Toggle Language
            </button>
        </div>
    );
}
```

### Adding Translations

Edit `src/context/AdminI18nContext.tsx`:

```typescript
const translations: Record<AdminLocale, Record<string, string>> = {
    el: {
        "mykey": "Το κείμενο μου",
    },
    en: {
        "mykey": "My text",
    },
};
```

---

## 📊 Database Schema

### Profiles Table

```sql
profiles (
    id UUID PRIMARY KEY,           -- matches auth.users.id
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE, -- ⭐ Admin flag
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
```

### RLS Policies

- **Public read:** All users can view profiles/recipes/regions
- **Admin write:** Only `is_admin = true` can INSERT/UPDATE/DELETE
- **Self-update protection:** Users can't make themselves admin

---

## 🎨 UI Components Usage

### StatCard

```tsx
import { StatCard } from "@/components/admin/StatCard";
import { UtensilsCrossed } from "lucide-react";

<StatCard
    title="Total Recipes"
    value={120}
    icon={UtensilsCrossed}
    description="Published recipes"
    trend={{ value: 12, isPositive: true }}
/>
```

### Admin Sidebar

Automatically renders from `navItems` array. To add new menu item:

```typescript
// src/components/admin/AdminSidebar.tsx
const navItems: NavItem[] = [
    // ... existing items
    { href: "/admin/mypage", icon: MyIcon, labelKey: "sidebar.mypage" },
];
```

Don't forget to add translation:
```typescript
// src/context/AdminI18nContext.tsx
el: {
    "sidebar.mypage": "Η Σελίδα Μου",
}
```

---

## 🛠️ Creating CRUD Pages

### Example: Recipes List Page

```tsx
// src/app/admin/recipes/page.tsx
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getRecipes() {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });
    return data || [];
}

export default async function RecipesPage() {
    const recipes = await getRecipes();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Recipes</h1>
                <Link href="/admin/recipes/new">
                    <Button>Create New Recipe</Button>
                </Link>
            </div>

            <Card>
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-4">Title</th>
                                <th className="text-left p-4">Category</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe) => (
                                <tr key={recipe.id} className="border-b">
                                    <td className="p-4">{recipe.title}</td>
                                    <td className="p-4">{recipe.category}</td>
                                    <td className="p-4">
                                        <Link href={`/admin/recipes/${recipe.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
```

---

## 🔒 Security Best Practices

### ✅ DO

- Use `requireAdminServer()` in all admin pages
- Query profiles.is_admin from database (NOT metadata)
- Use Server Actions for mutations
- Enable RLS on all tables
- Validate all inputs with Zod
- Log admin actions to audit table

### ❌ DON'T

- Trust client-side checks alone
- Use `getUser()` from client lib in server components
- Bypass RLS policies
- Expose sensitive data in error messages
- Allow users to self-promote to admin

---

## 🧪 Testing

### 1. Create Admin User

```bash
# In Supabase SQL Editor:
UPDATE public.profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### 2. Test URLs

- `http://localhost:3000/admin` → Should show dashboard
- `http://localhost:3000/admin/recipes` → Recipes list
- `http://localhost:3000/api/debug/me` → Debug endpoint (shows user + admin status)

### 3. Test Auth Flow

1. Logout
2. Try accessing `/admin` → Should redirect to `/login`
3. Login with non-admin user → Should redirect to `/` with error
4. Login with admin user → Should show admin dashboard

---

## 📦 Next Steps

### Implement Remaining Pages

Use the recipes page template above to create:

- `/admin/regions` - CRUD για regions
- `/admin/prefectures` - CRUD με region selector
- `/admin/cities` - CRUD με prefecture selector
- `/admin/media` - File upload με Supabase Storage
- `/admin/settings` - JSON config management
- `/admin/users` - List users με admin toggle

### Add Server Actions

```typescript
// src/app/admin/actions.ts
"use server";

import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { requireAdminServer } from "@/lib/adminServerGuard";
import { revalidatePath } from "next/cache";

export async function createRecipe(formData: FormData) {
    await requireAdminServer(); // Auth check
    
    const supabase = await getSupabaseServerClient();
    
    const { error } = await supabase.from("recipes").insert({
        title: formData.get("title"),
        // ... other fields
    });
    
    if (error) throw error;
    
    revalidatePath("/admin/recipes");
    return { success: true };
}
```

---

## 🐛 Troubleshooting

### "Admin Access Required" error

- Check if user exists in `profiles` table
- Verify `is_admin = true` in profiles
- Run debug endpoint: `/api/debug/me`
- Check middleware console logs

### Session not persisting

- Verify cookies are set correctly
- Check `getSupabaseServerClient()` uses `await cookies()`
- Clear browser cookies and re-login

### TypeScript errors

```bash
npm run build
```

Fix any type errors before deploying.

---

## 📚 Resources

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [shadcn/ui Components](https://ui.shadcn.com/docs)

---

## ✅ Checklist

- [ ] SQL scripts executed in Supabase
- [ ] First admin user created
- [ ] Storage buckets created
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Can access `/admin` as admin
- [ ] Non-admin users blocked
- [ ] Locale switching works
- [ ] Theme switching works
- [ ] Dashboard stats loading
- [ ] Ready to build CRUD pages

**Congratulations! 🎉 Your admin dashboard foundation is complete!**
