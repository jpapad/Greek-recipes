// Home Sections Types

export type SectionType = 
  | 'hero' 
  | 'stats' 
  | 'featured-recipes' 
  | 'categories' 
  | 'newsletter' 
  | 'blog'
  | 'custom';

export interface HomeSection {
  id: string;
  title: string;
  slug: string;
  section_type: SectionType;
  content: Record<string, any>; // JSONB content
  is_active: boolean;
  display_order: number;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Content type interfaces for different section types
export interface HeroContent {
  slides: Array<{
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
  }>;
}

export interface StatsContent {
  title: string;
  subtitle?: string;
  stats: Array<{
    label: string;
    value: string | number;
    icon: string;
    color: string;
  }>;
}

export interface CategoriesContent {
  title: string;
  subtitle?: string;
  categories: Array<{
    name: string;
    slug: string;
    icon: string;
    color: string;
    description?: string;
  }>;
}

export interface FeaturedRecipesContent {
  title: string;
  subtitle?: string;
  limit: number;
  filterType: 'latest' | 'popular' | 'featured' | 'random';
  categorySlug?: string;
}

export interface BlogContent {
  badge?: string;
  title: string;
  subtitle?: string;
  limit: number;
}

export interface NewsletterContent {
  badge?: string;
  title: string;
  subtitle?: string;
  placeholder: string;
  buttonText: string;
  privacyText?: string;
}
