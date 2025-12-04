# Deployment Guide - Greek Recipes App

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Vercel account (recommended) or another hosting platform

## Step 1: Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 1.2 Run SQL Migrations
Execute these SQL files in order via Supabase SQL Editor:

1. **supabase-setup.sql** (base tables)
2. **admin-policies.sql** (RLS policies)
3. **favorites-table.sql** (favorites table)
4. **reviews-table.sql** (reviews table)
5. **advanced-features.sql** (new features)
6. **storage-setup.sql** (image storage)

### 1.3 Create Admin User
```sql
-- In Supabase SQL Editor, after creating your first user via Auth UI:
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

## Step 2: Environment Variables

Create `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: Sentry
SENTRY_DSN=https://your-sentry-dsn
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Build and Test Locally

```bash
# Development server
npm run dev

# Production build test
npm run build
npm start
```

Visit `http://localhost:3000` and verify:
- ✅ Homepage loads
- ✅ Recipes page displays recipes
- ✅ Search works
- ✅ Login/signup works
- ✅ Admin panel accessible (after login)

## Step 5: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables from `.env.local`
6. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

## Step 6: Post-Deployment Configuration

### 6.1 Update Supabase Settings
In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: Add `https://your-domain.com/auth/callback`

### 6.2 Configure Custom Domain (Optional)
In Vercel:
1. Go to your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### 6.3 Set Up Analytics (Optional)

**Google Analytics:**
```bash
# Add to .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Vercel Analytics:**
Already integrated - enable in Vercel dashboard

## Step 7: Populate Initial Data

### 7.1 Add Regions
Via Admin Panel or SQL:
```sql
INSERT INTO regions (id, name, slug, description, image_url)
VALUES 
  (uuid_generate_v4(), 'Κρήτη', 'crete', 'Νησί της Μεσογείου', 'https://...'),
  (uuid_generate_v4(), 'Μακεδονία', 'macedonia', 'Βόρεια Ελλάδα', 'https://...');
```

### 7.2 Add Recipes
Use Admin Panel at `/admin/recipes/new` or bulk import at `/admin/import`

Sample CSV format:
```csv
title,slug,ingredients,steps,time_minutes,servings,difficulty,category
Μουσακάς,moussaka,"πατάτες,κιμάς,μελιτζάνες","Κόψτε τις πατάτες,Τηγανίστε",90,6,medium,Main Course
```

## Step 8: Testing Checklist

### Functionality Tests
- [ ] User registration and login
- [ ] Recipe browsing and search
- [ ] Favorite recipes (authenticated)
- [ ] Shopping list with PDF export
- [ ] Meal planning calendar
- [ ] Unit converter
- [ ] Language switching (Greek/English)
- [ ] Reviews and ratings
- [ ] Admin CRUD operations
- [ ] Image uploads
- [ ] Collections creation

### Performance Tests
- [ ] Lighthouse score >90
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] Mobile performance
- [ ] Image optimization

### SEO Tests
- [ ] Meta tags present
- [ ] Schema.org markup valid
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible
- [ ] Open Graph images working

## Step 9: Monitoring

### Set Up Error Tracking (Optional)

**Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to `.env.local`:
```bash
SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
```

### Set Up Uptime Monitoring
- [UptimeRobot](https://uptimerobot.com) (free)
- [Checkly](https://www.checklyhq.com)
- [Better Uptime](https://betteruptime.com)

## Step 10: Backup Strategy

### Database Backups
Supabase provides automatic backups. For manual backups:

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Schedule weekly backups (GitHub Actions example)
# .github/workflows/backup.yml
```

### Code Backups
- Git repository on GitHub (already set up)
- Enable Vercel deployment protection

## Troubleshooting

### Issue: Build fails on Vercel
**Solution:**
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Check build logs for specific errors
- Run `npm run build` locally to reproduce

### Issue: Supabase connection errors
**Solution:**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY
- Check RLS policies are enabled
- Ensure database migrations ran successfully

### Issue: Images not loading
**Solution:**
- Add image domains to `next.config.ts`
- Check Supabase Storage policies
- Verify CORS settings in Supabase

### Issue: Admin panel not accessible
**Solution:**
- Verify user has `is_admin: true` in metadata
- Check middleware configuration
- Ensure `/admin/*` routes are protected

## Performance Optimization

### Enable Caching
```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: '*.supabase.co' }
    ]
  },
  experimental: {
    optimizeCss: true
  }
};
```

### Enable Compression
Vercel automatically handles compression, but you can add:

```typescript
// next.config.ts
compress: true
```

### Database Indexing
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_region_id ON recipes(region_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
```

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] RLS policies enabled on all tables
- [ ] Admin routes protected with middleware
- [ ] CORS configured properly
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] HTTPS enforced (Vercel default)
- [ ] Rate limiting on API routes (optional)

## Maintenance Tasks

### Weekly
- Monitor error logs
- Check uptime status
- Review user feedback

### Monthly
- Update dependencies: `npm update`
- Review analytics
- Database cleanup (old sessions, etc.)

### Quarterly
- Security audit
- Performance review
- Backup verification
- Feature planning

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint

# Deployment
vercel               # Deploy preview
vercel --prod        # Deploy production

# Database
supabase db dump     # Backup database
supabase db reset    # Reset local DB

# Maintenance
npm update           # Update dependencies
npm audit            # Check for vulnerabilities
npm run analyze      # Bundle size analysis
```

## Support Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Project Issues**: GitHub Issues tab

---

**Deployment Complete!** 🎉

Your Greek Recipes app is now live and ready for users.
