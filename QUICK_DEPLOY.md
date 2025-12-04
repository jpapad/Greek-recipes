# 🚀 Quick Deploy Guide

## Prerequisites
- ✅ Node.js installed
- ✅ Git repository
- ✅ Supabase account with database setup
- ✅ Environment variables ready

## Deploy to Vercel (Fastest - 5 minutes)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
# From project root
vercel
```

### Step 4: Set Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Redeploy
```bash
vercel --prod
```

**Done!** 🎉 Your site is live at: `https://your-project.vercel.app`

---

## Deploy to Netlify (Alternative)

### Via CLI:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Via Dashboard:
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import from Git"
3. Connect GitHub repository
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables
6. Click "Deploy"

---

## Custom Domain Setup

### 1. Buy Domain
- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Google Domains: ~$12/year

### 2. Add to Vercel
1. Project Settings → Domains
2. Add your domain (e.g., `greekrecipes.gr`)
3. Follow DNS instructions

### 3. Update DNS Records
Add these to your domain registrar:

**For Vercel:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

**For Netlify:**
```
Type: CNAME
Name: www
Value: your-site.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

Wait 24-48 hours for DNS propagation.

---

## Post-Deployment Checklist

### Test Your Site:
- [ ] Homepage loads
- [ ] All recipes display
- [ ] Search works
- [ ] Login/signup works
- [ ] Admin panel accessible (for admin users)
- [ ] Mobile responsive
- [ ] Dark mode toggle
- [ ] Images load properly

### SEO Setup:
- [ ] Submit sitemap to Google Search Console
  - Go to: https://search.google.com/search-console
  - Add property: `https://your-domain.com`
  - Submit sitemap: `https://your-domain.com/sitemap.xml`

- [ ] Verify Open Graph tags:
  - Test at: https://www.opengraph.xyz
  - Share on Facebook/Twitter to check preview

### Performance:
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Check page speed: https://pagespeed.web.dev
- [ ] Optimize images if needed

### Monitoring:
- [ ] Set up Vercel Analytics (free)
- [ ] Add Google Analytics (optional)
- [ ] Set up error tracking with Sentry (optional)

---

## Troubleshooting

### Build Fails:
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint

# Clear cache and retry
rm -rf .next
npm run build
```

### Environment Variables Not Working:
1. Check spelling (must be EXACT)
2. Redeploy after adding variables
3. Variables starting with `NEXT_PUBLIC_` are exposed to browser
4. Server-only variables should NOT have `NEXT_PUBLIC_`

### Database Connection Issues:
1. Verify Supabase URL is correct
2. Check anon key is valid
3. Test connection locally first
4. Ensure RLS policies are set up

### 404 Errors:
1. Check routes match file structure
2. Verify dynamic routes use correct brackets
3. Check middleware redirects

---

## Continuous Deployment (Auto-Deploy)

### Connect GitHub to Vercel:
1. Push code to GitHub
2. Vercel Dashboard → Import Project → Select GitHub Repo
3. Enable auto-deployment
4. Every push to `main` branch auto-deploys!

### Branch Previews:
- Every PR gets a preview URL
- Test changes before merging
- Share with team for feedback

---

## Cost Breakdown

### Free Option (Perfect for Starting):
- **Vercel Hobby:** FREE
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Auto HTTPS
  - Global CDN

- **Supabase Free:** FREE
  - 500 MB database
  - 50k monthly active users
  - Unlimited API requests

- **Total:** $0/month ✨

### Pro Option (Scale Up):
- **Vercel Pro:** $20/month
  - Unlimited bandwidth
  - Advanced analytics
  - Better performance

- **Supabase Pro:** $25/month
  - 8 GB database
  - 100k monthly active users
  - Daily backups

- **Custom Domain:** ~$10/year

- **Total:** ~$45/month + domain

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Discord:** https://discord.gg/vercel
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Community Help:** Stack Overflow, Reddit r/nextjs

---

## One-Command Deploy

Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && vercel --prod"
  }
}
```

Then just run:
```bash
npm run deploy
```

---

**Your site is production-ready!** 🎉

The codebase is clean, modern, and follows best practices. Just deploy and share! 🚀
