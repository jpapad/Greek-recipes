import { Recipe } from "./types";

interface RecipeScore {
    recipe: Recipe;
    score: number;
}

export function getSimilarRecipes(recipe: Recipe, allRecipes: Recipe[], limit = 4): Recipe[] {
    const scores: RecipeScore[] = allRecipes
        .filter(r => r.id !== recipe.id)
        .map(r => ({
            recipe: r,
            score: calculateSimilarityScore(recipe, r)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scores.map(s => s.recipe);
}

function calculateSimilarityScore(recipe1: Recipe, recipe2: Recipe): number {
    let score = 0;

    // Same category: +3 points
    if (recipe1.category === recipe2.category) {
        score += 3;
    }

    // Same region: +2 points
    if (recipe1.region_id === recipe2.region_id) {
        score += 2;
    }

    // Same difficulty: +1 point
    if (recipe1.difficulty === recipe2.difficulty) {
        score += 1;
    }

    // Similar cooking time: +1 point (within 15 minutes)
    if (Math.abs(recipe1.time_minutes - recipe2.time_minutes) <= 15) {
        score += 1;
    }

    // Common ingredients: +0.5 points per shared ingredient
    const ingredients1 = recipe1.ingredients?.map(i => i.toLowerCase()) || [];
    const ingredients2 = recipe2.ingredients?.map(i => i.toLowerCase()) || [];
    const commonIngredients = ingredients1.filter(i => 
        ingredients2.some(i2 => i.includes(i2) || i2.includes(i))
    );
    score += commonIngredients.length * 0.5;

    return score;
}

export function getRecommendedRecipes(
    userFavorites: Recipe[],
    allRecipes: Recipe[],
    limit = 6
): Recipe[] {
    if (userFavorites.length === 0) {
        // Return random selection of recipes
        return allRecipes
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);
    }

    // Calculate aggregate scores based on favorites
    const favoriteIds = new Set(userFavorites.map(r => r.id));
    const scores: RecipeScore[] = allRecipes
        .filter(r => !favoriteIds.has(r.id))
        .map(recipe => {
            const scores = userFavorites.map(fav => 
                calculateSimilarityScore(fav, recipe)
            );
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            
            return {
                recipe,
                score: avgScore
            };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    return scores.map(s => s.recipe);
}
