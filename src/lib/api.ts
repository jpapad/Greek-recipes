import { supabase } from './supabaseClient';
import { Recipe, Region, Prefecture, City } from './types';
import { HomeSection } from './types/home-sections';
import { SiteSetting } from './types/site-settings';
import { Page, MenuItem } from './types/pages';

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
    minTime?: number;
    maxTime?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isDairyFree?: boolean;
    regionId?: string;
    prefectureId?: string;
    cityId?: string;
}

export async function getRecipes(options: GetRecipesOptions = {}): Promise<Recipe[]> {
    let query = supabase
        .from('recipes')
        .select('*, region:regions(*), prefecture:prefectures(*), city:cities(*)')
        .order('created_at', { ascending: false });

    if (options.category) {
        query = query.eq('category', options.category);
    }

    if (options.difficulty) {
        query = query.eq('difficulty', options.difficulty);
    }

    if (options.search) {
        // Search in title
        query = query.ilike('title', `%${options.search}%`);
    }

    // Time filtering
    if (options.minTime !== undefined) {
        query = query.gte('time_minutes', options.minTime);
    }

    if (options.maxTime !== undefined) {
        query = query.lte('time_minutes', options.maxTime);
    }

    if (options.time) {
        if (options.time === "Under 30m") {
            query = query.lt('time_minutes', 30);
        } else if (options.time === "30m - 60m") {
            query = query.gte('time_minutes', 30).lte('time_minutes', 60);
        } else if (options.time === "Over 60m") {
            query = query.gt('time_minutes', 60);
        }
    }

    // Dietary filters
    if (options.isVegetarian) {
        query = query.eq('is_vegetarian', true);
    }

    if (options.isVegan) {
        query = query.eq('is_vegan', true);
    }

    if (options.isGlutenFree) {
        query = query.eq('is_gluten_free', true);
    }

    if (options.isDairyFree) {
        query = query.eq('is_dairy_free', true);
    }

    // Location filters
    if (options.regionId) {
        query = query.eq('region_id', options.regionId);
    }

    if (options.prefectureId) {
        query = query.eq('prefecture_id', options.prefectureId);
    }

    if (options.cityId) {
        query = query.eq('city_id', options.cityId);
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
        .select('*')
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

// ============================================
// PREFECTURES
// ============================================

export async function getPrefectures(regionId?: string): Promise<Prefecture[]> {
    let query = supabase.from('prefectures').select('*, region:region_id(*)');
    
    if (regionId) {
        query = query.eq('region_id', regionId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
        console.error('Error fetching prefectures:', error);
        return [];
    }
    return data || [];
}

export async function getPrefectureBySlug(slug: string): Promise<Prefecture | null> {
    const { data, error } = await supabase
        .from('prefectures')
        .select('*, region:region_id(*)')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching prefecture:', error);
        return null;
    }
    return data;
}

export async function createPrefecture(prefecture: Partial<Prefecture>): Promise<Prefecture | null> {
    const { data, error } = await supabase
        .from('prefectures')
        .insert([prefecture])
        .select()
        .single();

    if (error) {
        console.error('Error creating prefecture:', error);
        return null;
    }
    return data;
}

export async function updatePrefecture(id: string, prefecture: Partial<Prefecture>): Promise<Prefecture | null> {
    const { data, error } = await supabase
        .from('prefectures')
        .update(prefecture)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating prefecture:', error);
        return null;
    }
    return data;
}

export async function deletePrefecture(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('prefectures')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting prefecture:', error);
        return false;
    }
    return true;
}

// ============================================
// CITIES
// ============================================

export async function getCities(prefectureId?: string): Promise<City[]> {
    let query = supabase.from('cities').select('*, prefecture:prefecture_id(*, region:region_id(*))');
    
    if (prefectureId) {
        query = query.eq('prefecture_id', prefectureId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
    return data || [];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
    const { data, error } = await supabase
        .from('cities')
        .select('*, prefecture:prefecture_id(*, region:region_id(*))')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching city:', error);
        return null;
    }
    return data;
}

export async function createCity(city: Partial<City>): Promise<City | null> {
    const { data, error } = await supabase
        .from('cities')
        .insert([city])
        .select()
        .single();

    if (error) {
        console.error('Error creating city:', error);
        return null;
    }
    return data;
}

export async function updateCity(id: string, city: Partial<City>): Promise<City | null> {
    const { data, error } = await supabase
        .from('cities')
        .update(city)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating city:', error);
        return null;
    }
    return data;
}

export async function deleteCity(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting city:', error);
        return false;
    }
    return true;
}

// ============================================
// Footer Settings API
// ============================================

export async function getFooterSettings(): Promise<any> {
    const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    if (error) {
        console.error('Error fetching footer settings:', error);
        return null;
    }

    // Transform array to object by section
    const settings: any = {};
    data?.forEach((item: any) => {
        settings[item.section] = item.content;
    });

    return settings;
}

export async function getFooterSettingBySection(section: string): Promise<any> {
    const { data, error} = await supabase
        .from('footer_settings')
        .select('*')
        .eq('section', section)
        .single();

    if (error) {
        console.error(`Error fetching footer setting for ${section}:`, error);
        return null;
    }

    return data;
}

export async function updateFooterSetting(section: string, content: any): Promise<boolean> {
    const { error } = await supabase
        .from('footer_settings')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('section', section);

    if (error) {
        console.error(`Error updating footer setting for ${section}:`, error);
        return false;
    }

    return true;
}

// Homepage Settings API
export async function getHomepageSettings(): Promise<Record<string, any> | null> {
    const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    if (error) {
        console.error('Error fetching homepage settings:', error);
        return null;
    }

    // Transform array to object with section as key
    const settings: Record<string, any> = {};
    data?.forEach(item => {
        settings[item.section] = item.content;
    });

    return settings;
}

export async function getHomepageSettingBySection(section: string): Promise<any | null> {
    const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .eq('section', section)
        .single();

    if (error) {
        console.error(`Error fetching homepage setting for ${section}:`, error);
        return null;
    }

    return data;
}

export async function updateHomepageSetting(section: string, content: any): Promise<boolean> {
    const { error } = await supabase
        .from('homepage_settings')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('section', section);

    if (error) {
        console.error(`Error updating homepage setting for ${section}:`, error);
        return false;
    }

    return true;
}

// ==========================================
// HOME SECTIONS API (New Dynamic System)
// ==========================================

export async function getHomeSections(): Promise<HomeSection[]> {
    const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

    if (error) {
        console.error('Error fetching home sections:', error);
        return [];
    }

    return data || [];
}

export async function getAllHomeSections(): Promise<HomeSection[]> {
    const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .order('display_order');

    if (error) {
        console.error('Error fetching all home sections:', error);
        return [];
    }

    return data || [];
}

export async function getHomeSectionById(id: string): Promise<HomeSection | null> {
    const { data, error} = await supabase
        .from('home_sections')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching home section:', error);
        return null;
    }

    return data;
}

export async function createHomeSection(section: Omit<HomeSection, 'id' | 'created_at' | 'updated_at'>): Promise<HomeSection | null> {
    const { data, error } = await supabase
        .from('home_sections')
        .insert([section])
        .select()
        .single();

    if (error) {
        console.error('Error creating home section:', error);
        return null;
    }

    return data;
}

export async function updateHomeSection(id: string, updates: Partial<HomeSection>): Promise<boolean> {
    const { error } = await supabase
        .from('home_sections')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating home section:', error);
        return false;
    }

    return true;
}

export async function deleteHomeSection(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('home_sections')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting home section:', error);
        return false;
    }

    return true;
}

export async function reorderHomeSections(sections: Array<{ id: string; display_order: number }>): Promise<boolean> {
    try {
        const promises = sections.map(({ id, display_order }) =>
            supabase
                .from('home_sections')
                .update({ display_order })
                .eq('id', id)
        );

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('Error reordering home sections:', error);
        return false;
    }
}

export async function toggleHomeSectionActive(id: string, is_active: boolean): Promise<boolean> {
    const { error } = await supabase
        .from('home_sections')
        .update({ is_active })
        .eq('id', id);

    if (error) {
        console.error('Error toggling home section:', error);
        return false;
    }

    return true;
}

// ==========================================
// SITE SETTINGS API (Design Customization)
// ==========================================

export async function getAllSiteSettings(): Promise<SiteSetting[]> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('is_active', true)
        .order('setting_group');

    if (error) {
        console.error('Error fetching site settings:', error);
        return [];
    }

    return data || [];
}

export async function getSiteSettingByKey(key: string): Promise<SiteSetting | null> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', key)
        .single();

    if (error) {
        console.error('Error fetching site setting:', error);
        return null;
    }

    return data;
}

export async function getSiteSettingsByGroup(group: string): Promise<SiteSetting[]> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_group', group)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching site settings by group:', error);
        return [];
    }

    return data || [];
}

export async function updateSiteSetting(key: string, value: Record<string, any>): Promise<boolean> {
    const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('setting_key', key);

    if (error) {
        console.error('Error updating site setting:', error);
        return false;
    }

    return true;
}

export async function resetSiteSettingToDefault(key: string): Promise<boolean> {
    const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('default_value')
        .eq('setting_key', key)
        .single();

    if (fetchError || !data) {
        console.error('Error fetching default value:', fetchError);
        return false;
    }

    const { error: updateError } = await supabase
        .from('site_settings')
        .update({ value: data.default_value })
        .eq('setting_key', key);

    if (updateError) {
        console.error('Error resetting to default:', updateError);
        return false;
    }

    return true;
}

export async function applyThemePreset(presetName: string): Promise<boolean> {
    try {
        const themeSettings = await getSiteSettingByKey('theme_presets');
        if (!themeSettings) return false;

        const preset = themeSettings.value.presets[presetName];
        if (!preset) return false;

        const success = await updateSiteSetting('colors', {
            ...preset,
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#06b6d4'
        });

        if (success) {
            await updateSiteSetting('theme_presets', {
                ...themeSettings.value,
                current: presetName
            });
        }

        return success;
    } catch (error) {
        console.error('Error applying theme preset:', error);
        return false;
    }
}

// ============================================================================
// PAGES API
// ============================================================================

/**
 * Get all pages with optional filters
 */
export async function getPages(filters?: {
    status?: 'draft' | 'published' | 'archived';
    template?: string;
    display_in_menu?: boolean;
}): Promise<Page[]> {
    try {
        let query = supabase
            .from('pages')
            .select('*')
            .order('menu_order', { ascending: true });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.template) {
            query = query.eq('template', filters.template);
        }
        if (filters?.display_in_menu !== undefined) {
            query = query.eq('display_in_menu', filters.display_in_menu);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching pages:', error);
        return [];
    }
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
    try {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

/**
 * Get page by ID
 */
export async function getPageById(id: string): Promise<Page | null> {
    try {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

/**
 * Get the homepage
 */
export async function getHomepage(): Promise<Page | null> {
    try {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('is_homepage', true)
            .eq('status', 'published')
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching homepage:', error);
        return null;
    }
}

/**
 * Create a new page
 */
export async function createPage(pageData: Partial<Page>): Promise<Page | null> {
    try {
        const { data, error } = await supabase
            .from('pages')
            .insert([{
                ...pageData,
                content: pageData.content || { blocks: [] }
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating page:', error);
        return null;
    }
}

/**
 * Update a page
 */
export async function updatePage(id: string, pageData: Partial<Page>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('pages')
            .update(pageData)
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating page:', error);
        return false;
    }
}

/**
 * Delete a page
 */
export async function deletePage(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('pages')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting page:', error);
        return false;
    }
}

/**
 * Publish a page
 */
export async function publishPage(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('pages')
            .update({
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error publishing page:', error);
        return false;
    }
}

/**
 * Set a page as homepage
 */
export async function setHomepage(id: string): Promise<boolean> {
    try {
        // First, unset all other homepages
        await supabase
            .from('pages')
            .update({ is_homepage: false })
            .neq('id', id);

        // Then set this page as homepage
        const { error } = await supabase
            .from('pages')
            .update({ is_homepage: true })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error setting homepage:', error);
        return false;
    }
}

/**
 * Duplicate a page
 */
export async function duplicatePage(id: string): Promise<Page | null> {
    try {
        const original = await getPageById(id);
        if (!original) return null;

        const { data, error } = await supabase
            .from('pages')
            .insert([{
                ...original,
                id: undefined,
                title: `${original.title} (Copy)`,
                slug: `${original.slug}-copy-${Date.now()}`,
                status: 'draft',
                is_homepage: false,
                published_at: null
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error duplicating page:', error);
        return null;
    }
}

// ============================================================================
// MENU ITEMS API
// ============================================================================

/**
 * Get menu items by location
 */
export async function getMenuItems(location?: string): Promise<MenuItem[]> {
    try {
        let query = supabase
            .from('menu_items')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (location) {
            query = query.eq('menu_location', location);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Build hierarchical structure
        const items = data || [];
        const itemMap = new Map<string, MenuItem>();
        const rootItems: MenuItem[] = [];

        // First pass: create map
        items.forEach(item => {
            itemMap.set(item.id, { ...item, children: [] });
        });

        // Second pass: build hierarchy
        items.forEach(item => {
            const menuItem = itemMap.get(item.id)!;
            if (item.parent_id && itemMap.has(item.parent_id)) {
                const parent = itemMap.get(item.parent_id)!;
                if (!parent.children) parent.children = [];
                parent.children.push(menuItem);
            } else {
                rootItems.push(menuItem);
            }
        });

        return rootItems;
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

/**
 * Get all menu items (flat list for admin)
 */
export async function getAllMenuItems(): Promise<MenuItem[]> {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('menu_location', { ascending: true })
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching all menu items:', error);
        return [];
    }
}

/**
 * Get menu item by ID
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching menu item:', error);
        return null;
    }
}

/**
 * Create a new menu item
 */
export async function createMenuItem(itemData: Partial<MenuItem>): Promise<MenuItem | null> {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .insert([itemData])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating menu item:', error);
        return null;
    }
}

/**
 * Update a menu item
 */
export async function updateMenuItem(id: string, itemData: Partial<MenuItem>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('menu_items')
            .update(itemData)
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating menu item:', error);
        return false;
    }
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return false;
    }
}

/**
 * Reorder menu items
 */
export async function reorderMenuItems(items: { id: string; display_order: number }[]): Promise<boolean> {
    try {
        const updates = items.map(item =>
            supabase
                .from('menu_items')
                .update({ display_order: item.display_order })
                .eq('id', item.id)
        );

        await Promise.all(updates);
        return true;
    } catch (error) {
        console.error('Error reordering menu items:', error);
        return false;
    }
}

/**
 * Toggle menu item active status
 */
export async function toggleMenuItem(id: string, is_active: boolean): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('menu_items')
            .update({ is_active })
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error toggling menu item:', error);
        return false;
    }
}




