// Collections API functions for Supabase
import { supabase } from './supabaseClient';
import type { Collection, CollectionRecipe } from './types';

// ==================== COLLECTIONS ====================

export async function getCollections(options?: {
  userId?: string;
  isPublic?: boolean;
  limit?: number;
}): Promise<Collection[]> {
  try {
    let query = supabase
      .from('collections')
      .select(`
        *,
        collection_recipes(
          id,
          recipe_id,
          added_at,
          notes,
          recipe:recipes(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }

    if (options?.isPublic !== undefined) {
      query = query.eq('is_public', options.isPublic);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to match Collection interface
    return (data || []).map((collection: any) => ({
      ...collection,
      recipes: collection.collection_recipes || [],
      recipe_count: collection.collection_recipes?.length || 0,
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function getCollectionBySlug(
  userId: string | null,
  slug: string
): Promise<Collection | null> {
  try {
    let query = supabase
      .from('collections')
      .select(`
        *,
        collection_recipes(
          id,
          recipe_id,
          added_at,
          notes,
          recipe:recipes(*)
        )
      `)
      .eq('slug', slug);

    // If userId is provided, filter by user
    // Otherwise, only return public collections
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('is_public', true);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    // Transform data to match Collection interface
    return {
      ...data,
      recipes: data.collection_recipes || [],
      recipe_count: data.collection_recipes?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}

export async function createCollection(
  collection: Omit<Collection, 'id' | 'created_at' | 'updated_at'>
): Promise<Collection | null> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .insert(collection)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating collection:', error);
    return null;
  }
}

export async function updateCollection(
  id: string,
  updates: Partial<Omit<Collection, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Collection | null> {
  try {
    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating collection:', error);
    return null;
  }
}

export async function deleteCollection(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting collection:', error);
    return false;
  }
}

// ==================== COLLECTION RECIPES ====================

export async function addRecipeToCollection(
  collectionId: string,
  recipeId: string,
  notes?: string
): Promise<CollectionRecipe | null> {
  try {
    const { data, error } = await supabase
      .from('collection_recipes')
      .insert({
        collection_id: collectionId,
        recipe_id: recipeId,
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding recipe to collection:', error);
    return null;
  }
}

export async function removeRecipeFromCollection(
  collectionId: string,
  recipeId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('collection_recipes')
      .delete()
      .eq('collection_id', collectionId)
      .eq('recipe_id', recipeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing recipe from collection:', error);
    return false;
  }
}

export async function updateCollectionRecipeNotes(
  collectionId: string,
  recipeId: string,
  notes: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('collection_recipes')
      .update({ notes })
      .eq('collection_id', collectionId)
      .eq('recipe_id', recipeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating recipe notes:', error);
    return false;
  }
}

export async function getCollectionRecipes(collectionId: string): Promise<CollectionRecipe[]> {
  try {
    const { data, error } = await supabase
      .from('collection_recipes')
      .select(`
        *,
        recipe:recipes(*)
      `)
      .eq('collection_id', collectionId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching collection recipes:', error);
    return [];
  }
}
