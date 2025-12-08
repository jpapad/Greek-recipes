import { NextRequest, NextResponse } from 'next/server';
import { getRecipes } from '@/lib/api';
import { flattenIngredients } from '@/lib/recipeHelpers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';

  if (!query || query.length < 2) {
    return NextResponse.json({ recipes: [] });
  }

  try {
    const allRecipes = await getRecipes();

    // Search in title, description, category, ingredients
    const results = allRecipes.filter(recipe => {
      const searchTerm = query.toLowerCase();
      const ingredients = flattenIngredients(recipe.ingredients);

      return (
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.short_description?.toLowerCase().includes(searchTerm) ||
        recipe.category?.toLowerCase().includes(searchTerm) ||
        ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
      );
    });

    // Sort by relevance (title matches first)
    const sorted = results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitle = b.title.toLowerCase().includes(query.toLowerCase());

      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      return 0;
    });

    return NextResponse.json({
      recipes: sorted,
      count: sorted.length
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ recipes: [], error: 'Search failed' }, { status: 500 });
  }
}
