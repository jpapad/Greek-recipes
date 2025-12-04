export interface Attraction {
    name: string;
    type: 'museum' | 'monument' | 'beach' | 'park' | 'archaeological' | 'religious' | 'nature';
    description: string;
    image_url?: string;
    address?: string;
    website?: string;
}

export interface Event {
    name: string;
    date: string;
    description: string;
    location?: string;
}

export interface LocalProduct {
    name: string;
    category: 'food' | 'wine' | 'craft' | 'other';
    description: string;
    image_url?: string;
}

export interface Region {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    photo_gallery?: string[];
    attractions?: Attraction[];
    how_to_get_there?: string;
    tourist_info?: string;
    events_festivals?: Event[];
    local_products?: LocalProduct[];
}

export interface Prefecture {
    id: string;
    name: string;
    slug: string;
    region_id: string;
    description?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    region?: Region;
    photo_gallery?: string[];
    attractions?: Attraction[];
    how_to_get_there?: string;
    tourist_info?: string;
    events_festivals?: Event[];
    local_products?: LocalProduct[];
}

export interface City {
    id: string;
    name: string;
    slug: string;
    prefecture_id: string;
    description?: string;
    image_url?: string;
    latitude?: number;
    longitude?: number;
    prefecture?: Prefecture;
    photo_gallery?: string[];
    attractions?: Attraction[];
    how_to_get_there?: string;
    tourist_info?: string;
    events_festivals?: Event[];
    local_products?: LocalProduct[];
}

export interface Recipe {
    id: string;
    title: string;
    slug: string;
    region_id?: string;
    prefecture_id?: string;
    city_id?: string;
    short_description?: string;
    steps: string[] | any; // JSON or text
    ingredients?: string[];
    time_minutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
    servings: number;
    image_url: string;
    created_at?: string;
    category?: string;
    average_rating?: number;
    review_count?: number;
    region?: Region;
    prefecture?: Prefecture;
    city?: City;
    // Dietary tags
    is_vegetarian?: boolean;
    is_vegan?: boolean;
    is_gluten_free?: boolean;
    is_dairy_free?: boolean;
    dietary_tags?: string[]; // Keto, Paleo, Mediterranean, Low-Carb, etc.
    // Nutrition
    calories?: number;
    protein_g?: number;
    carbs_g?: number;
    fat_g?: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    allergens?: string[];
    // Additional features
    equipment?: string[];
    video_url?: string;
    wine_pairing?: string;
    seasons?: string[];
    source_recipe_id?: string;
    source_attribution?: string;
    keywords?: string[];
}

export interface Review {
    id: string;
    user_id: string;
    recipe_id: string;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
        email: string;
    };
}

// Blog System Types
export interface ArticleCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    color?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    content: string; // HTML from Tiptap
    excerpt?: string;
    featured_image?: string;
    author_id: string;
    category_id?: string;
    tags?: string[];
    related_recipe_ids?: string[];
    
    // SEO
    meta_title?: string;
    meta_description?: string;
    keywords?: string[];
    
    // Publishing
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    
    // Stats
    views_count?: number;
    reading_time_minutes?: number;
    
    created_at?: string;
    updated_at?: string;
    
    // Relations
    author?: UserProfile;
    category?: ArticleCategory;
    related_recipes?: Recipe[];
}

export interface UserProfile {
    user_id: string;
    is_admin?: boolean;
    is_author?: boolean;
    bio?: string;
    avatar_url?: string;
    social_links?: {
        twitter?: string;
        instagram?: string;
        website?: string;
    };
    email?: string;
    name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ArticleComment {
    id: string;
    article_id: string;
    user_id?: string;
    user_name?: string;
    user_email?: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

// Collections
export interface Collection {
    id: string;
    user_id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    
    // Relations
    user?: UserProfile;
    recipe_count?: number;
    recipes?: CollectionRecipe[];
}

export interface CollectionRecipe {
    id: string;
    collection_id: string;
    recipe_id: string;
    added_at: string;
    notes?: string;
    
    // Relations
    recipe?: Recipe;
}

// Meal Planning
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlan {
    id: string;
    user_id: string;
    name: string;
    week_start_date: string;
    week_end_date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    
    // Relations
    items?: MealPlanItem[];
}

export interface MealPlanItem {
    id: string;
    meal_plan_id: string;
    recipe_id: string;
    date: string;
    meal_type: MealType;
    servings: number;
    notes?: string;
    is_completed: boolean;
    created_at: string;
    
    // Relations
    recipe?: Recipe;
}

export interface ShoppingList {
    id: string;
    meal_plan_id?: string;
    user_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    
    // Relations
    items?: ShoppingListItem[];
}

export interface ShoppingListItem {
    id: string;
    shopping_list_id: string;
    ingredient: string;
    quantity?: string;
    category?: string;
    is_checked: boolean;
    recipe_id?: string;
    created_at: string;
    
    // Relations
    recipe?: Recipe;
}

