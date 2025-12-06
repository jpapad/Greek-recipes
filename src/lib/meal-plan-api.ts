// Meal Planning API functions for Supabase
import { supabase } from './supabaseClient';
import type { MealPlan, MealPlanItem, ShoppingList, ShoppingListItem } from './types';

// ==================== MEAL PLANS ====================

export async function getMealPlans(userId: string): Promise<MealPlan[]> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        items:meal_plan_items(
          id,
          recipe_id,
          date,
          meal_type,
          servings,
          notes,
          is_completed,
          recipe:recipes(*)
        )
      `)
      .eq('user_id', userId)
      .order('week_start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    return [];
  }
}

export async function getMealPlanById(id: string): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        items:meal_plan_items(
          id,
          recipe_id,
          date,
          meal_type,
          servings,
          notes,
          is_completed,
          created_at,
          recipe:recipes(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return null;
  }
}

export async function getCurrentWeekMealPlan(userId: string): Promise<MealPlan | null> {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    const { data, error } = await supabase
      .from('meal_plans')
      .select(`
        *,
        items:meal_plan_items(
          id,
          recipe_id,
          date,
          meal_type,
          servings,
          notes,
          is_completed,
          created_at,
          recipe:recipes(*)
        )
      `)
      .eq('user_id', userId)
      .eq('week_start_date', startOfWeek.toISOString().split('T')[0])
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data || null;
  } catch (error) {
    console.error('Error fetching current week meal plan:', error);
    return null;
  }
}

export async function createMealPlan(
  mealPlan: Omit<MealPlan, 'id' | 'created_at' | 'updated_at' | 'items'>
): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(mealPlan)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return null;
  }
}

export async function updateMealPlan(
  id: string,
  updates: Partial<Omit<MealPlan, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'items'>>
): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating meal plan:', error);
    return null;
  }
}

export async function deleteMealPlan(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return false;
  }
}

// ==================== MEAL PLAN ITEMS ====================

export async function addMealPlanItem(
  item: Omit<MealPlanItem, 'id' | 'created_at' | 'recipe'>
): Promise<MealPlanItem | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plan_items')
      .insert(item)
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding meal plan item:', error);
    return null;
  }
}

export async function updateMealPlanItem(
  id: string,
  updates: Partial<Omit<MealPlanItem, 'id' | 'meal_plan_id' | 'created_at' | 'recipe'>>
): Promise<MealPlanItem | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plan_items')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        recipe:recipes(*)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating meal plan item:', error);
    return null;
  }
}

export async function deleteMealPlanItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meal_plan_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting meal plan item:', error);
    return false;
  }
}

export async function toggleMealCompleted(id: string, isCompleted: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meal_plan_items')
      .update({ is_completed: isCompleted })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling meal completion:', error);
    return false;
  }
}

// ==================== SHOPPING LISTS ====================

export async function getShoppingLists(userId: string): Promise<ShoppingList[]> {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select(`
        *,
        items:shopping_list_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    return [];
  }
}

export async function createShoppingList(
  shoppingList: Omit<ShoppingList, 'id' | 'created_at' | 'updated_at' | 'items'>
): Promise<ShoppingList | null> {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert(shoppingList)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating shopping list:', error);
    return null;
  }
}

export async function generateShoppingListFromMealPlan(
  mealPlanId: string,
  userId: string
): Promise<ShoppingList | null> {
  try {
    // Get meal plan with all items
    const mealPlan = await getMealPlanById(mealPlanId);
    if (!mealPlan || !mealPlan.items) return null;

    // Create shopping list
    const shoppingList = await createShoppingList({
      meal_plan_id: mealPlanId,
      user_id: userId,
      name: `Shopping List - ${mealPlan.name}`,
      is_active: true,
    });

    if (!shoppingList) return null;

    // Collect all ingredients from recipes
    const ingredientMap = new Map<string, { quantity: string; recipeId: string; category?: string }>();

    for (const item of mealPlan.items) {
      if (!item.recipe || !item.recipe.ingredients) continue;

      for (const ingredient of item.recipe.ingredients) {
        const key = ingredient.toLowerCase().trim();
        if (!ingredientMap.has(key)) {
          ingredientMap.set(key, {
            quantity: '',
            recipeId: item.recipe_id,
            category: item.recipe.category,
          });
        }
      }
    }

    // Add items to shopping list
    const items = Array.from(ingredientMap.entries()).map(([ingredient, data]) => ({
      shopping_list_id: shoppingList.id,
      ingredient,
      quantity: data.quantity,
      category: data.category,
      recipe_id: data.recipeId,
      is_checked: false,
    }));

    const { error } = await supabase
      .from('shopping_list_items')
      .insert(items);

    if (error) throw error;

    return shoppingList;
  } catch (error) {
    console.error('Error generating shopping list:', error);
    return null;
  }
}

export async function addShoppingListItem(
  item: Omit<ShoppingListItem, 'id' | 'created_at' | 'recipe'>
): Promise<ShoppingListItem | null> {
  try {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding shopping list item:', error);
    return null;
  }
}

export async function toggleShoppingItem(id: string, isChecked: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shopping_list_items')
      .update({ is_checked: isChecked })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error toggling shopping item:', error);
    return false;
  }
}

export async function deleteShoppingListItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shopping_list_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    return false;
  }
}

export async function deleteShoppingList(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    return false;
  }
}
