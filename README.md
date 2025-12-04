# 🇬🇷 Greek Recipes - Authentic Traditional Greek Cuisine

A comprehensive, modern web application for discovering and managing authentic Greek recipes. Built with Next.js 16, React 19, TypeScript, and Supabase.

![Greek Recipes Banner](https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=400&fit=crop)

## ✨ Features

### 🔍 **Discovery & Search**
- Global search with autocomplete
- Advanced filtering (difficulty, time, servings, dietary tags)
- Multi-criteria sorting (newest, rating, cooking time)
- Region-based browsing
- Category-based organization

### 🍳 **Recipe Management**
- Detailed recipe pages with step-by-step instructions
- Cooking mode for hands-free viewing
- Servings calculator (auto-adjust quantities)
- Nutritional information display
- Equipment requirements list
- Video integration (YouTube embeds)
- User-uploaded recipe photos
- Print-optimized versions

### 🛒 **Shopping & Planning**
- Smart shopping list with auto-categorization (7 categories)
- PDF export with Greek text support
- Quantity controls and management
- Weekly meal planner with calendar view
- Drag-and-drop meal assignment
- Generate shopping list from meal plan

### 🌍 **Multi-language Support**
- Greek/English interface toggle
- Persistent language preference
- Full translation coverage
- Server-side locale handling

### 👤 **User Features**
- User authentication (Supabase Auth)
- Personal profiles with stats
- Recipe collections (public/private)
- Favorites system (synced or local)
- Review and rating system
- Recently viewed recipes

### 🔧 **Advanced Tools**
- Unit converter (volume, weight, temperature)
- Ingredient substitutions database
- Recipe similarity recommendations
- SEO optimization with Schema.org markup
- Progressive image loading
- Responsive glass morphism UI

### 👨‍💼 **Admin Panel**
- Full CRUD operations for recipes and regions
- Bulk import (CSV/JSON)
- Image upload to Supabase Storage
- SEO fields management
- Draft/published status control
- Scheduled publishing

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/greek-recipes.git
cd greek-recipes
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up database**

Run these SQL files in Supabase SQL Editor (in order):
- `supabase-setup.sql` (base tables)
- `admin-policies.sql` (security policies)
- `favorites-table.sql` (favorites)
- `reviews-table.sql` (reviews)
- `advanced-features.sql` (new features)
- `storage-setup.sql` (image storage)

5. **Create admin user**

After signing up via the app, run in Supabase:
```sql
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'your-email@example.com';
```

6. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📂 Project Structure

```
greek-recipes/
├── src/
│   ├── app/                    # Next.js 16 App Router pages
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── admin/             # Admin panel routes
│   │   ├── recipes/           # Recipe pages
│   │   ├── regions/           # Region pages
│   │   ├── favorites/         # Favorites page
│   │   ├── meal-plan/         # Meal planning
│   │   ├── collections/       # User collections
│   │   ├── profile/           # User profile
│   │   └── tools/             # Utility tools (converter)
│   ├── components/            # React components
│   │   ├── admin/            # Admin-specific components
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   ├── recipes/          # Recipe-related components
│   │   ├── regions/          # Region components
│   │   ├── reviews/          # Review system
│   │   ├── shopping/         # Shopping list
│   │   ├── meal-plan/        # Meal planning
│   │   ├── collections/      # Collections management
│   │   └── ui/               # Reusable UI components
│   ├── context/              # React Context providers
│   │   ├── ShoppingListContext.tsx
│   │   └── MealPlanContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useFavorites.ts
│   │   └── useDebounce.ts
│   ├── lib/                  # Core utilities
│   │   ├── api.ts           # Supabase API functions
│   │   ├── auth.ts          # Authentication helpers
│   │   ├── types.ts         # TypeScript types
│   │   ├── utils.ts         # Utility functions
│   │   ├── recommendations.ts  # Similarity algorithm
│   │   ├── unitConversions.ts  # Unit converter
│   │   ├── substitutions.ts    # Ingredient subs
│   │   ├── ingredientCategories.ts
│   │   └── pdfExport.ts     # PDF generation
│   └── i18n/                # Internationalization
│       └── request.ts
├── messages/                # Translation files
│   ├── en.json
│   └── el.json
├── public/                  # Static assets
├── supabase-setup.sql      # Database schema
├── advanced-features.sql   # New features schema
├── storage-setup.sql       # Storage policies
└── package.json
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Internationalization**: next-intl

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Security**: Row Level Security (RLS)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

## 📊 Database Schema

### Core Tables
- `recipes` - Recipe data with JSONB ingredients/steps
- `regions` - Greek geographic regions
- `reviews` - User ratings and reviews
- `favorites` - User favorite recipes
- `user_collections` - Organized recipe collections
- `recipe_views` - View tracking for analytics
- `ingredient_substitutions` - Substitution database

### Key Features
- **RLS Policies**: Secure data access control
- **JSONB Fields**: Flexible ingredient/step storage
- **Foreign Keys**: Data integrity with cascading
- **Indexes**: Optimized query performance
- **Triggers**: Auto-update timestamps

## 🎨 UI Components

### Glass Morphism Design System
- `GlassPanel` - Glassmorphic container with variants
- `Button` - Multiple variants (default, outline, ghost)
- `Input` - Form inputs with validation
- `Badge` - Category and tag badges
- `Card` - Content cards
- `Modal` - Dialog overlays
- `Toast` - Notification system

### Custom Components
- `SearchAutocomplete` - Smart search with debouncing
- `FilterPanel` - Multi-criteria filtering
- `RecipeCard` - Recipe display with swipe actions
- `StarRating` - 5-star rating display
- `UnitConverter` - Measurement converter
- `MealSlot` - Drag-and-drop meal slot
- `ShoppingListButton` - Quick add to shopping list

## 🔒 Authentication Flow

1. User signs up/logs in via Supabase Auth
2. Session stored in cookies (server-side)
3. Middleware protects `/admin/*` routes
4. Admin check: `user.raw_user_meta_data.is_admin === true`
5. Anonymous users: localStorage for favorites/shopping

## 📱 Features Breakdown

### Shopping List System
- **Auto-Categorization**: 7 categories with 100+ keywords
- **Categories**: Produce, Dairy, Meat, Seafood, Pantry, Spices, Other
- **PDF Export**: Greek text support via jsPDF
- **Quantity Controls**: Min 1, increment/decrement
- **Batch Operations**: Clear checked, toggle category
- **Progress Tracking**: Completion percentage
- **Storage**: localStorage with auto-save

### Meal Planning
- **Calendar View**: 7-day week grid
- **Meal Types**: Breakfast, lunch, dinner, snack
- **Recipe Selection**: Modal with search
- **Week Navigation**: Previous/next week
- **Print Support**: Print-optimized layout
- **Shopping Integration**: Generate list from plan
- **Persistence**: localStorage with week offset

### Recipe Discovery
- **Search**: Full-text search with autocomplete
- **Filters**: 
  - Difficulty: Easy, Medium, Hard
  - Time: <30min, 30-60min, >60min
  - Servings: 1-2, 3-4, 5+
  - Dietary: Vegetarian, Vegan, Gluten-free, Dairy-free
- **Sorting**: Newest, Rating, Time, Alphabetical
- **Pagination**: Infinite scroll or pages

### Recommendations Algorithm
```typescript
// Similarity scoring:
// - Same category: +3 points
// - Same region: +2 points
// - Same difficulty: +1 point
// - Similar time (±15min): +1 point
// - Common ingredient: +0.5 points each
```

## 🌐 Internationalization

### Supported Languages
- Greek (el) - Default
- English (en)

### Translation Keys
Located in `messages/en.json` and `messages/el.json`:
- Common UI strings
- Navigation labels
- Form labels and placeholders
- Error messages
- Success messages

### Language Switching
- Toggle in navbar (LanguageSwitcher component)
- Persists to localStorage + cookie
- Server-side locale detection
- `router.refresh()` to apply changes

## 📈 Performance Optimizations

- **Progressive Images**: Blur-up placeholders
- **Debounced Search**: 500ms delay
- **Lazy Loading**: Components on demand
- **Optimistic UI**: Instant feedback
- **localStorage Cache**: Offline capability
- **Server Components**: Default for pages
- **Static Generation**: Recipe pages
- **Image Optimization**: Next.js Image component

## 🔐 Security

- **RLS Policies**: Database-level security
- **Middleware**: Route protection
- **CSRF Protection**: Built-in Next.js
- **XSS Prevention**: React auto-escaping
- **SQL Injection**: Parameterized queries
- **HTTPS**: Enforced on production
- **Environment Variables**: Never committed

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Recipe CRUD operations
- [ ] Search and filtering
- [ ] Shopping list PDF export
- [ ] Meal planning calendar
- [ ] Language switching
- [ ] Favorites sync
- [ ] Reviews submission
- [ ] Admin panel access
- [ ] Image uploads

### Performance Testing
- Lighthouse score target: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Mobile performance
- Image optimization

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Greek cuisine traditions and heritage
- Supabase for backend infrastructure
- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling
- All contributors and recipe providers

## 📞 Support

- **Documentation**: See `FEATURES_COMPLETE.md` for full feature list
- **Deployment**: See `DEPLOYMENT.md` for deployment guide
- **Issues**: GitHub Issues tab
- **Email**: support@greekrecipes.com

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Ingredient shopping integration
- [ ] Video recipe tutorials
- [ ] Social sharing features
- [ ] Recipe variations tracking
- [ ] Cooking timer integration
- [ ] Voice-guided cooking mode
- [ ] Nutritional meal planning
- [ ] Community recipe submissions
- [ ] Chef collaboration platform

---

**Made with ❤️ for Greek cuisine lovers worldwide**
