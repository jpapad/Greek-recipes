# 🚀 Deployment Checklist

## Pre-Deployment Steps

### 1. Environment Variables ✅
- [ ] Copy `.env.local` values to hosting platform
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Verify environment variables are set correctly

### 2. Database Setup ✅
- [ ] Run all SQL migrations in Supabase:
  - [ ] `supabase-setup.sql` (core tables)
  - [ ] `admin-policies.sql` (permissions)
  - [ ] `reviews-table.sql` (reviews)
  - [ ] `favorites-table.sql` (favorites)
- [ ] Verify RLS policies are enabled
- [ ] Test database connections
- [ ] Add sample data (recipes, regions)

### 3. Build Test 🔨
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] Check bundle size
- [ ] Verify no TypeScript errors
- [ ] Test production build locally: `npm start`

### 4. SEO & Meta Tags 📊
- [ ] Add proper meta descriptions
- [ ] Set up Open Graph images
- [ ] Create `robots.txt`
- [ ] Add `sitemap.xml`
- [ ] Verify favicon.ico exists

### 5. Performance ⚡
- [ ] Optimize images (use WebP/AVIF)
- [ ] Enable image optimization in Next.js
- [ ] Check Core Web Vitals
- [ ] Test loading speed
- [ ] Enable caching headers

### 6. Security 🔒
- [ ] Enable HTTPS (auto on Vercel/Netlify)
- [ ] Set up CORS properly
- [ ] Review RLS policies
- [ ] Test authentication flows
- [ ] Set secure cookie settings

### 7. Content 📝
- [ ] Add real recipe data (not mock data)
- [ ] Upload high-quality images
- [ ] Write compelling descriptions
- [ ] Add Greek translations
- [ ] Create "About" page content

### 8. Admin Setup 👤
- [ ] Create admin user in Supabase
- [ ] Set `is_admin: true` in user metadata
- [ ] Test admin panel access
- [ ] Verify CRUD operations work

### 9. Testing 🧪
- [ ] Test all pages load correctly
- [ ] Test search functionality
- [ ] Test filters
- [ ] Test authentication (signup/login/logout)
- [ ] Test favorites (logged in + anonymous)
- [ ] Test shopping list
- [ ] Test reviews submission
- [ ] Test mobile responsive
- [ ] Test dark mode toggle
- [ ] Test language switching
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### 10. Analytics (Optional) 📈
- [ ] Set up Google Analytics
- [ ] Add Vercel Analytics
- [ ] Track user behavior
- [ ] Monitor errors with Sentry

---

## Deployment Options

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

**Post-Deploy:**
- [ ] Set environment variables in Vercel dashboard
- [ ] Connect custom domain (optional)
- [ ] Enable automatic deployments from Git

### Option B: Netlify
1. Push code to GitHub
2. Go to netlify.com
3. "Add new site" → "Import from Git"
4. Select repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Add environment variables
8. Deploy!

### Option C: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### Option D: DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

### Option E: AWS Amplify
1. Connect GitHub repository
2. Configure Next.js settings
3. Add environment variables
4. Deploy with CDN

---

## Post-Deployment

### Monitoring 📊
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Set up alerts for downtime

### SEO 🔍
- [ ] Submit sitemap to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify site on social platforms
- [ ] Add structured data (recipes schema)

### Marketing 📣
- [ ] Share on social media
- [ ] Add to recipe directories
- [ ] Create blog posts
- [ ] Email newsletter

### Maintenance 🔧
- [ ] Regular database backups
- [ ] Update dependencies monthly
- [ ] Monitor security vulnerabilities
- [ ] Add new recipes regularly
- [ ] Respond to user reviews

---

## Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `greekrecipes.gr`)
3. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
4. Wait for DNS propagation (up to 48h)

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Follow DNS instructions
4. Enable HTTPS

---

## Cost Estimate

### Free Tier (Hobby):
- Vercel/Netlify: **FREE**
- Supabase: **FREE** (500MB database, 50k monthly active users)
- Total: **$0/month**

### With Custom Domain:
- Domain registration: **$10-15/year**
- Vercel Pro (optional): **$20/month**
- Supabase Pro (optional): **$25/month**
- Total: **$0-45/month**

---

## Performance Targets

- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Total Blocking Time < 300ms
- [ ] Cumulative Layout Shift < 0.1

---

## Backup Strategy

### Database:
- Supabase auto-backups (Pro plan)
- Manual exports weekly
- Store in GitHub private repo

### Code:
- Git version control
- Multiple branches (main, develop, staging)
- Tag releases

---

## Support & Help

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Deployment Discord: https://discord.gg/nextjs

---

**Ready to deploy?** 🚀

Run: `vercel` and your site will be live in minutes!
