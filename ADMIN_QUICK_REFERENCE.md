# 🚀 Admin Dashboard - Quick Reference

## 📦 What's Included

### ✅ Core Features
- WordPress-style admin dashboard
- Server-side authentication & authorization
- Full i18n (EL default + EN)
- Modern UI με shadcn/ui + Tailwind
- Media library με Supabase Storage
- User management με admin toggle
- Audit logging
- Toast notifications

### ✅ Pages Created
- `/admin` - Dashboard με stats
- `/admin/recipes` - Recipe list (existing, working)
- `/admin/media` - Media library με upload
- `/admin/users` - User management
- `/api/debug/me` - Debug authentication
- `/api/admin/media/*` - Upload/delete APIs
- `/api/admin/users/toggle-admin` - Toggle admin role

### ✅ Database Setup
- `profiles` table με `is_admin` flag
- RLS policies για admin-only writes
- Auto-create profile trigger
- Storage buckets με policies
- Audit log table

---

## ⚡ Quick Setup (5 λεπτά)

### 1. Run SQL Scripts (Supabase Dashboard → SQL Editor)
```bash
sql/01-profiles-table.sql        # Copy-paste and run
sql/02-admin-policies.sql        # Copy-paste and run
sql/03-set-admin-user.sql        # EDIT EMAIL FIRST, then run
sql/04-storage-buckets.sql       # Copy-paste and run
```

### 2. Install Dependencies
```bash
npm install js-cookie
npm install --save-dev @types/js-cookie
```

### 3. Test
```bash
npm run dev

# Visit these URLs:
http://localhost:3000/admin           ✅ Dashboard
http://localhost:3000/api/debug/me    ✅ Check auth status
http://localhost:3000/admin/media     ✅ Upload images
http://localhost:3000/admin/users     ✅ Manage users
```

---

## 🎯 Key Files

### Authentication
```
src/lib/adminServerGuard.ts          Server-side auth guard
src/middleware.ts                     Route protection
```

### Layout & Navigation
```
src/app/admin/layout.tsx              Admin layout wrapper
src/components/admin/AdminSidebar.tsx Collapsible sidebar
src/components/admin/AdminTopbar.tsx  Header με search/locale/theme
```

### i18n
```
src/context/AdminI18nContext.tsx      Admin translations (EL/EN)
```

### Pages
```
src/app/admin/page.tsx                Dashboard
src/app/admin/media/page.tsx          Media library
src/app/admin/users/page.tsx          User management
```

### API Routes
```
src/app/api/admin/media/upload/route.ts       Upload files
src/app/api/admin/media/delete/route.ts       Delete files
src/app/api/admin/users/toggle-admin/route.ts Toggle admin
```

---

## 🔒 Security

### Server-Side Auth
```typescript
// In any admin page.tsx (Server Component)
import { requireAdminServer } from "@/lib/adminServerGuard";

export default async function MyAdminPage() {
    const { user, profile } = await requireAdminServer();
    // User is guaranteed to be authenticated and admin
}
```

### API Route Protection
```typescript
// In route.ts
import { requireAdminServer } from "@/lib/adminServerGuard";

export async function POST(request: NextRequest) {
    await requireAdminServer(); // Throws if not admin
    // ... your logic
}
```

---

## 🌍 i18n Usage

```tsx
"use client";
import { useAdminI18n } from "@/context/AdminI18nContext";

function MyComponent() {
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

---

## 🎨 UI Components

### StatCard (Dashboard Widget)
```tsx
import { StatCard } from "@/components/admin/StatCard";
import { UtensilsCrossed } from "lucide-react";

<StatCard
    title="Total Recipes"
    value={120}
    icon={UtensilsCrossed}
    description="Published recipes"
/>
```

### Table
```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

<Table>
    <TableHeader>
        <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell>John</TableCell>
            <TableCell>john@example.com</TableCell>
        </TableRow>
    </TableBody>
</Table>
```

### Toast Notifications
```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
    title: "Success",
    description: "Item saved successfully",
    variant: "success",
});
```

---

## 📝 Next Steps

### Create CRUD Pages
Use the existing patterns to create:

1. **Recipe Forms** (`/admin/recipes/new`, `/admin/recipes/[id]/edit`)
2. **Region CRUD** (`/admin/regions/*`)
3. **Prefecture CRUD** (`/admin/prefectures/*`)
4. **City CRUD** (`/admin/cities/*`)
5. **Settings Page** (`/admin/settings`)

### Example Template
```tsx
// src/app/admin/mypage/page.tsx
import { requireAdminServer } from "@/lib/adminServerGuard";
import { Card } from "@/components/ui/card";

export default async function MyPage() {
    await requireAdminServer();
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Page</h1>
            <Card>
                {/* Your content */}
            </Card>
        </div>
    );
}
```

---

## 🐛 Troubleshooting

### "Admin Access Required" Error
1. Check `/api/debug/me` - should show `is_admin: true`
2. Verify email in SQL script matches your account
3. Clear cookies and re-login

### Media Upload Fails
1. Check Supabase Storage → Buckets exist
2. Check RLS policies enabled
3. Check file size < 10MB

### TypeScript Errors
```bash
npm run build
```
Fix any type errors before deploying.

---

## 📚 Documentation

- `ADMIN_DASHBOARD_SETUP.md` - Full setup guide
- `ADMIN_IMPLEMENTATION_COMPLETE.md` - Implementation details
- This file - Quick reference

---

## 🎉 You're Ready!

Your admin dashboard is fully functional with:
- ✅ Authentication & Authorization
- ✅ Dashboard με stats
- ✅ Media management
- ✅ User management
- ✅ i18n support (EL/EN)
- ✅ Modern UI
- ✅ Secure RLS policies

**Start creating your CRUD pages using the patterns provided!**
