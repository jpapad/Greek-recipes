import { supabase } from './supabaseClient';
import { Recipe, Region } from './types';

// Mock Data for fallback
const MOCK_REGIONS: Region[] = [
    {
        id: '1',
        name: 'Crete',
        slug: 'crete',
        description: 'Home of the Mediterranean diet, famous for olive oil and fresh herbs.',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '2',
        name: 'Cyclades',
        slug: 'cyclades',
        description: 'Known for fresh seafood and sun-dried tomatoes.',
        image_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
    },
    {
        id: '3',
        name: 'Peloponnese',
        slug: 'peloponnese',
        description: 'Rich in history and flavors, famous for oranges and olives.',
        image_url: 'https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?q=80&w=1000&auto=format&fit=crop',
    },
];

const MOCK_RECIPES: Recipe[] = [
    {
        id: '1',
        title: 'Moussaka',
        slug: 'moussaka',
        region_id: '1',
        short_description: 'The legendary eggplant casserole with rich meat sauce and creamy béchamel.',
        steps: [
            'Slice eggplants and potatoes.',
            'Fry them lightly.',
            'Prepare the meat sauce with cinnamon and cloves.',
            'Make the béchamel sauce.',
            'Layer everything and bake.'
        ],
        ingredients: ['Eggplants', 'Potatoes', 'Ground Beef', 'Béchamel Sauce', 'Cheese'],
        time_minutes: 90,
        difficulty: 'hard',
        servings: 8,
        image_url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=1000&auto=format&fit=crop',
        category: 'Main Dish',
        region: MOCK_REGIONS[0],
    },
    {
        id: '2',
        title: 'Greek Salad (Horiatiki)',
        slug: 'greek-salad',
        region_id: '1',
        short_description: 'Fresh, vibrant, and healthy traditional salad.',
        steps: ['Chop tomatoes and cucumbers.', 'Add onions and olives.', 'Top with feta block.', 'Drizzle olive oil and oregano.'],
        ingredients: ['Tomatoes', 'Cucumbers', 'Feta Cheese', 'Olives', 'Olive Oil'],
        time_minutes: 15,
        difficulty: 'easy',
        servings: 4,
        image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop',
        category: 'Salad',
        region: MOCK_REGIONS[0],
    },
    {
        id: '3',
        title: 'Spanakopita',
        slug: 'spanakopita',
        region_id: '3',
        short_description: 'Spinach and feta pie wrapped in crispy phyllo dough.',
        steps: ['Prepare spinach filling with herbs and feta.', 'Layer phyllo sheets with butter.', 'Add filling and bake.'],
        ingredients: ['Spinach', 'Feta', 'Phyllo Dough', 'Dill', 'Spring Onions'],
        time_minutes: 60,
        difficulty: 'medium',
        servings: 6,
        image_url: 'https://images.unsplash.com/photo-1606525437679-037aca74a3e9?q=80&w=1000&auto=format&fit=crop',
        category: 'Pie',
        region: MOCK_REGIONS[2],
    },
];

export async function getRegions(): Promise<Region[]> {
    const { data, error } = await supabase.from('regions').select('*');
    if (error || !data || data.length === 0) {
        console.warn('Using mock regions data');
        return MOCK_REGIONS;
    }
    return data;
}

export interface GetRecipesOptions {
    search?: string;
    category?: string | null;
    difficulty?: string | null;
    time?: string | null;
}

export async function getRecipes(options: GetRecipesOptions = {}): Promise<Recipe[]> {
    let query = supabase
        .from('recipes')
        .select('*, region:regions(*)')
        .order('created_at', { ascending: false });

    if (options.category) {
        query = query.eq('category', options.category);
    }

    if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty);
    }

    if (options.search) {
        // Search in title or ingredients (if ingredients was text, but it's JSONB array)
        // For simple text search on title:
        query = query.ilike('title', `%${options.search}%`);
    }

    // Time filtering needs to be handled carefully or on client side if complex
    // But we can try range queries
    if (options.time) {
        if (options.time === "Under 30m") {
            query = query.lt('time_minutes', 30);
        } else if (options.time === "30m - 60m") {
            query = query.gte('time_minutes', 30).lte('time_minutes', 60);
        } else if (options.time === "Over 60m") {
            query = query.gt('time_minutes', 60);
        }
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
        console.warn('Using mock recipes data (fallback or empty)');
        // Filter mock data if DB fails or is empty
        let filtered = [...MOCK_RECIPES];

        if (options.category) {
            filtered = filtered.filter(r => r.category === options.category);
        }
        if (options.difficulty) {
            filtered = filtered.filter(r => r.difficulty === options.difficulty);
        }
        if (options.search) {
            const lowerQuery = options.search.toLowerCase();
            filtered = filtered.filter(r => r.title.toLowerCase().includes(lowerQuery));
        }
        if (options.time) {
            if (options.time === "Under 30m") {
                filtered = filtered.filter(r => r.time_minutes < 30);
            } else if (options.time === "30m - 60m") {
                filtered = filtered.filter(r => r.time_minutes >= 30 && r.time_minutes <= 60);
            } else if (options.time === "Over 60m") {
                filtered = filtered.filter(r => r.time_minutes > 60);
            }
        }
        return filtered;
    }
    return data;
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*, region:regions(*)')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.warn('Using mock recipe data for slug:', slug);
        return MOCK_RECIPES.find((r) => r.slug === slug) || null;
    }
    return data;
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.warn('Using mock region data for slug:', slug);
        return MOCK_REGIONS.find((r) => r.slug === slug) || null;
    }
    return data;
}

export async function getRecipesByRegion(regionId: string): Promise<Recipe[]> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*, region:regions(*)')
        .eq('region_id', regionId);

    if (error || !data || data.length === 0) {
        return MOCK_RECIPES.filter(r => r.region_id === regionId);
    }
    return data;
}

// ============================================
// ADMIN CRUD OPERATIONS
// ============================================

// Recipe CRUD
export async function createRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe | null> {
    const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select('*, region:regions(*)')
        .single();

    if (error) {
        console.error('Error creating recipe:', error);
        return null;
    }
    return data;
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe | null> {
    const { data, error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', id)
        .select('*, region:regions(*)')
        .single();

    if (error) {
        console.error('Error updating recipe:', error);
        return null;
    }
    return data;
}

export async function deleteRecipe(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting recipe:', error);
        return false;
    }
    return true;
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
        .from('recipes')
        .select('*, region:regions(*)')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching recipe:', error);
        return null;
    }
    return data;
}

// Region CRUD
export async function createRegion(region: Omit<Region, 'id' | 'created_at'>): Promise<Region | null> {
    const { data, error } = await supabase
        .from('regions')
        .insert([region])
        .select()
        .single();

    if (error) {
        console.error('Error creating region:', error);
        return null;
    }
    return data;
}

export async function updateRegion(id: string, region: Partial<Region>): Promise<Region | null> {
    const { data, error } = await supabase
        .from('regions')
        .update(region)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating region:', error);
        return null;
    }
    return data;
}

export async function deleteRegion(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting region:', error);
        return false;
    }
    return true;
}

export async function getRegionById(id: string): Promise<Region | null> {
    const { data, error } = await supabase
        .from('regions')
        .select()
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Error fetching region:', error);
        return null;
    }
    return data;
}

// ============================================
// USER FAVORITES (Database)
// ============================================

export async function getUserFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('user_favorites')
        .select('recipe_id')
        .eq('user_id', userId);

    if (error || !data) {
        console.error('Error fetching user favorites:', error);
        return [];
    }

    return data.map(fav => fav.recipe_id);
}

export async function addFavorite(userId: string, recipeId: string): Promise<boolean> {
    const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: userId, recipe_id: recipeId }]);

    if (error) {
        console.error('Error adding favorite:', error);
        return false;
    }

    return true;
}

export async function removeFavorite(userId: string, recipeId: string): Promise<boolean> {
    const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId);

    if (error) {
        console.error('Error removing favorite:', error);
        return false;
    }

    return true;
}

// ============================================
// REVIEWS
// ============================================

export async function getReviews(recipeId: string): Promise<any[]> {
    const { data, error } = await supabase
        .from('reviews')
        .select('*, user:user_id(email)')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
    return data || [];
}

export async function addReview(review: { recipe_id: string; rating: number; comment: string; user_id: string }): Promise<any | null> {
    const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

    if (error) {
        console.error('Error adding review:', error);
        return null;
    }
    return data;
}

