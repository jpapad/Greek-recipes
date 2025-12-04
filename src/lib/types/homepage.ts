// Homepage Settings Types

export interface HomepageSettings {
  id: string;
  section: string;
  content: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface StatsContent {
  title: string;
  subtitle: string;
  stats: StatItem[];
}

export interface CategoryItem {
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
}

export interface CategoriesContent {
  title: string;
  subtitle: string;
  categories: CategoryItem[];
}

export interface NewsletterContent {
  badge: string;
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
}
