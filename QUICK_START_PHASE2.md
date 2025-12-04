# 🚀 Quick Integration Guide - Phase 2 Features

## Fast Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install date-fns @radix-ui/react-dropdown-menu
```

### 2. Run Database Migrations (Supabase SQL Editor)

**Copy-paste in this exact order:**

1. `recipe-gallery.sql`
2. `social-features.sql`
3. `recipe-enhancements.sql`
4. `ingredients-system.sql`
5. `meal-planning-sessions.sql`
6. `versioning-moderation.sql`

### 3. Add Print CSS to `src/app/globals.css`

```css
@media print {
  .print\:hidden {
    display: none !important;
  }
  
  nav, footer, aside, .no-print {
    display: none !important;
  }
  
  .recipe-content {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }
  
  .recipe-title {
    page-break-after: avoid;
  }
  
  .recipe-step {
    page-break-inside: avoid;
  }
}
```

---

## Quick Component Usage Examples

### Recipe Page Enhancement

Update `src/app/recipes/[slug]/page.tsx`:

```tsx
import { RecipeImageGallery } from '@/components/recipes/RecipeImageGallery';
import { RecipePrintButton } from '@/components/recipes/RecipePrintButton';
import { RecipeShareButton } from '@/components/recipes/RecipeShareButton';
import { NutritionFacts } from '@/components/recipes/NutritionFacts';
import { EquipmentList } from '@/components/recipes/EquipmentList';
import { ServingsCalculator } from '@/components/recipes/ServingsCalculator';
import { VideoEmbed } from '@/components/recipes/VideoEmbed';
import { RelatedRecipes } from '@/components/recipes/RelatedRecipes';

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = await getRecipeBySlug(params.slug);
  
  return (
    <div>
      {/* Action Buttons */}
      <div className="flex gap-2">
        <RecipePrintButton />
        <RecipeShareButton recipe={recipe} />
      </div>
      
      {/* Image Gallery */}
      <RecipeImageGallery images={recipe.images} recipeName={recipe.title} />
      
      {/* Video Tutorial */}
      <VideoEmbed videoUrl={recipe.video_url} />
      
      {/* Servings Calculator */}
      <ServingsCalculator
        originalServings={recipe.servings}
        ingredients={recipe.ingredients}
      />
      
      {/* Equipment */}
      <EquipmentList equipment={recipe.equipment} />
      
      {/* Nutrition Facts */}
      <NutritionFacts recipe={recipe} />
      
      {/* Related Recipes */}
      <RelatedRecipes currentRecipe={recipe} />
    </div>
  );
}
```

### Cooking Mode with Voice

Update `src/app/recipes/[slug]/cook/page.tsx`:

```tsx
import { VoiceCommands } from '@/components/recipes/VoiceCommands';

// Inside component:
<VoiceCommands
  onNextStep={() => setCurrentStep(s => s + 1)}
  onPreviousStep={() => setCurrentStep(s => Math.max(0, s - 1))}
  onStartTimer={(mins) => {
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  }}
  onPauseTimer={() => setIsTimerRunning(false)}
/>
```

### Recipes List with Infinite Scroll

Update `src/app/recipes/page.tsx`:

```tsx
import { InfiniteRecipeScroll } from '@/components/recipes/InfiniteRecipeScroll';

// Replace static grid with:
<InfiniteRecipeScroll
  initialRecipes={recipes}
  filters={filters}
  pageSize={12}
/>
```

### User Profile with Activity

Update `src/app/profile/[userId]/page.tsx`:

```tsx
import { ActivityFeed } from '@/components/profile/ActivityFeed';
import { FollowButton } from '@/components/profile/FollowButton';

<FollowButton targetUserId={userId} />
<ActivityFeed userId={userId} />
```

### Meal Planner Page

Create `src/app/meal-plan/page.tsx`:

```tsx
import { MealPlanCalendar } from '@/components/meal-plan/MealPlanCalendar';

export default function MealPlanPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">My Meal Plan</h1>
      <MealPlanCalendar />
    </div>
  );
}
```

---

## Optional Features Setup

### AI Recipe Generator

1. Get OpenAI API key from https://platform.openai.com/
2. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Install: `npm install openai`
4. Create `/api/ai/generate/route.ts`:

```tsx
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "You are a Greek cuisine expert. Generate detailed traditional Greek recipes with authentic ingredients and cooking methods."
    }, {
      role: "user",
      content: `Create a Greek recipe for: ${prompt}`
    }],
    response_format: { type: "json_object" }
  });
  
  return Response.json(JSON.parse(completion.choices[0].message.content));
}
```

### Live Cooking Sessions (Realtime)

1. Enable Realtime in Supabase dashboard
2. Create session component:

```tsx
"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function LiveCookingSession({ sessionId }) {
  const [participants, setParticipants] = useState([]);
  
  useEffect(() => {
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cooking_session_participants'
      }, (payload) => {
        // Update participants in real-time
        loadParticipants();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);
  
  return (
    <div>
      <h3>{participants.length} people cooking with you!</h3>
      {/* Show participant progress */}
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Image gallery shows multiple images
- [ ] Print button generates clean recipe printout
- [ ] Share button opens native share dialog (mobile)
- [ ] Voice commands work in cooking mode (Chrome/Edge)
- [ ] Infinite scroll loads more recipes
- [ ] Nutrition facts display correctly
- [ ] Equipment list shows icons
- [ ] Servings calculator scales ingredients
- [ ] Video embeds YouTube/Vimeo
- [ ] Follow/unfollow users works
- [ ] Activity feed shows recent actions
- [ ] Meal planner shows weekly calendar
- [ ] Service worker caches recipes offline

---

## Common Issues

**Issue**: Voice commands not working
- **Fix**: Only works in Chrome/Edge, requires HTTPS in production

**Issue**: Service worker not updating
- **Fix**: Hard reload (Ctrl+Shift+R), clear cache, or increment version number

**Issue**: Images not caching
- **Fix**: Check Supabase Storage bucket permissions are public

**Issue**: Infinite scroll keeps loading same recipes
- **Fix**: Ensure API returns different pages based on `page` parameter

---

## Performance Tips

1. **Lazy load components**: Use `dynamic()` from `next/dynamic`
2. **Optimize images**: Use Next.js Image component with `priority` for above-fold
3. **Reduce bundle size**: Import only what you need from libraries
4. **Enable compression**: Gzip/Brotli on server
5. **CDN for images**: Use Supabase CDN or Cloudflare

---

## Next Steps

1. ✅ Run all SQL migrations
2. ✅ Install dependencies
3. ✅ Add print CSS
4. ✅ Integrate components into pages
5. ✅ Test each feature
6. ⏳ Add OpenAI API (optional)
7. ⏳ Enable Supabase Realtime (optional)
8. ⏳ Create admin UI for moderation queue
9. ⏳ Implement batch import tool
10. ⏳ Add auto-translation feature

**Need help?** Check `NEW_FEATURES_PHASE2.md` for detailed documentation.

Καλή συνέχεια! 🎉
