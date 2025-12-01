export interface Region {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
}

export interface Recipe {
    id: string;
    title: string;
    slug: string;
    region_id?: string;
    short_description?: string;
    steps: string[] | any; // JSON or text
    ingredients?: string[];
    time_minutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
    servings: number;
    image_url: string;
    created_at?: string;
    category?: string;
    region?: Region;
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
