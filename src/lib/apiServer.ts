// src/lib/apiServer.ts
import 'server-only';

import { getSupabaseServerClient } from './supabaseServer';
import { Recipe, Region, Prefecture, City } from './types';
import { HomeSection } from './types/home-sections';
import { SiteSetting } from './types/site-settings';
import { Page, MenuItem } from './types/pages';

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

// ============================================
// READ-ONLY DATA (SERVER) — SSR/SEO safe
// ============================================

export async function getRegions(): Promise<Region[]> {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.from('regions').select('*');

    if (error) {
        console.error('Error fetching regions:', error);
        return [];
    }

    return data || [];
}

export async function getRecipes(options: GetRecipesOptions = {}): Promise<Recipe[]> {
    const supabase = await getSupabaseServerClient();

    let query = supabase
        .from('recipes')
        .select('*, region:regions(*), prefecture:prefectures(*), city:cities(*)')
        .order('created_at', { ascending: false });

    if (options.category) query = query.eq('category', options.category);
    if (options.difficulty) query = query.eq('difficulty', options.difficulty);

    if (options.search) {
        query = query.ilike('title', `%${options.search}%`);
    }

    if (options.minTime !== undefined) query = query.gte('time_minutes', options.minTime);
    if (options.maxTime !== undefined) query = query.lte('time_minutes', options.maxTime);

    if (options.time) {
        if (options.time === 'Under 30m') query = query.lt('time_minutes', 30);
        else if (options.time === '30m - 60m') query = query.gte('time_minutes', 30).lte('time_minutes', 60);
        else if (options.time === 'Over 60m') query = query.gt('time_minutes', 60);
    }

    if (options.isVegetarian) query = query.eq('is_vegetarian', true);
    if (options.isVegan) query = query.eq('is_vegan', true);
    if (options.isGlutenFree) query = query.eq('is_gluten_free', true);
    if (options.isDairyFree) query = query.eq('is_dairy_free', true);

    if (options.regionId) query = query.eq('region_id', options.regionId);
    if (options.prefectureId) query = query.eq('prefecture_id', options.prefectureId);
    if (options.cityId) query = query.eq('city_id', options.cityId);

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }

    return data || [];
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from('recipes')
        .select('*, region:regions(*), prefecture:prefectures(*), city:cities(*)')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.error('Error fetching recipe by slug:', error);
        return null;
    }

    return data;
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.error('Error fetching region by slug:', error);
        return null;
    }

    return data;
}

export async function getRecipesByRegion(regionId: string): Promise<Recipe[]> {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from('recipes')
        .select('*, region:regions(*)')
        .eq('region_id', regionId);

    if (error) {
        console.error('Error fetching recipes by region:', error);
        return [];
    }

    return data || [];
}

export async function getReviews(recipeId: string): Promise<any[]> {
    const supabase = await getSupabaseServerClient();

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

// ============================================
// PREFECTURES (READ)
// ============================================

export async function getPrefectures(regionId?: string): Promise<Prefecture[]> {
    const supabase = await getSupabaseServerClient();

    let query = supabase.from('prefectures').select('*, region:region_id(*)');

    if (regionId) query = query.eq('region_id', regionId);

    const { data, error } = await query.order('name');

    if (error) {
        console.error('Error fetching prefectures:', error);
        return [];
    }

    // same defensive sanitization you had
    const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
    const safeData = (data || []).map((row: any) => {
        try {
            const rawId = String(row.id ?? '');
            const m = rawId.match(uuidRegex);
            row.id = m ? m[0] : rawId;
        } catch (e) {
            console.error('Error sanitizing prefecture id', e);
        }
        return row;
    });

    return safeData;
}

export async function getPrefectureBySlug(slug: string): Promise<Prefecture | null> {
    const supabase = await getSupabaseServerClient();

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

export async function getPrefectureById(id: string): Promise<Prefecture | null> {
    const uuidExact =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!id || typeof id !== 'string' || !uuidExact.test(id)) {
        console.warn('getPrefectureById called with invalid id, skipping DB call:', String(id));
        return null;
    }

    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
        .from('prefectures')
        .select('*, region:region_id(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching prefecture by id:', error);
        return null;
    }
    return data;
}

// ============================================
// CITIES (READ)
// ============================================

export async function getCities(prefectureId?: string): Promise<City[]> {
    const supabase = await getSupabaseServerClient();

    let query = supabase
        .from('cities')
        .select('*, prefecture:prefecture_id(*, region:region_id(*))');

    if (prefectureId) query = query.eq('prefecture_id', prefectureId);

    const { data, error } = await query.order('name');

    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }
    return data || [];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
    const supabase = await getSupabaseServerClient();

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

// ============================================
// HOME / SETTINGS / PAGES (READ)
// ============================================

export async function getHomeSections(): Promise<HomeSection[]> {
    const supabase = await getSupabaseServerClient();

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

export async function getHomepage(): Promise<Page | null> {
    const supabase = await getSupabaseServerClient();

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

export async function getPageBySlug(slug: string): Promise<Page | null> {
    const supabase = await getSupabaseServerClient();

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
