"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RecipeCard } from "./RecipeCard";
import { getRecipes } from "@/lib/api";
import type { Recipe } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface SimilarRecipesAdvancedProps {
  currentRecipe: Recipe;
  limit?: number;
}

export function SimilarRecipesAdvanced({
  currentRecipe,
  limit = 3,
}: SimilarRecipesAdvancedProps) {
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    findSimilarRecipes();
  }, [currentRecipe.id]);

  async function findSimilarRecipes() {
    try {
      // Get all recipes
      const allRecipes = await getRecipes({});

      // Filter out current recipe
      const otherRecipes = allRecipes.filter((r) => r.id !== currentRecipe.id);

      // Calculate similarity scores
      const scoredRecipes = otherRecipes.map((recipe) => ({
        recipe,
        score: calculateSimilarity(currentRecipe, recipe),
      }));

      // Sort by score and take top N
      const topSimilar = scoredRecipes
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.recipe);

      setSimilarRecipes(topSimilar);
    } catch (error) {
      console.error("Error finding similar recipes:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateSimilarity(recipe1: Recipe, recipe2: Recipe): number {
    let score = 0;

    // 1. Same category (high weight)
    if (recipe1.category === recipe2.category) {
      score += 30;
    }

    // 2. Same region (medium weight)
    if (recipe1.region_id && recipe1.region_id === recipe2.region_id) {
      score += 20;
    }

    // 3. Similar difficulty (low weight)
    if (recipe1.difficulty === recipe2.difficulty) {
      score += 10;
    }

    // 4. Similar cooking time (medium weight)
    const timeDiff = Math.abs(recipe1.time_minutes - recipe2.time_minutes);
    if (timeDiff <= 15) {
      score += 15;
    } else if (timeDiff <= 30) {
      score += 10;
    } else if (timeDiff <= 60) {
      score += 5;
    }

    // 5. Shared ingredients (high weight)
    if (recipe1.ingredients && recipe2.ingredients) {
      const ingredients1 = recipe1.ingredients.map((ing) => 
        ing.toLowerCase().split(" ").filter(word => word.length > 3)
      ).flat();
      
      const ingredients2 = recipe2.ingredients.map((ing) => 
        ing.toLowerCase().split(" ").filter(word => word.length > 3)
      ).flat();

      const sharedIngredients = ingredients1.filter((ing1) =>
        ingredients2.some((ing2) => 
          ing1.includes(ing2) || ing2.includes(ing1)
        )
      );

      // Award 5 points per shared ingredient (up to 40 points)
      score += Math.min(sharedIngredients.length * 5, 40);
    }

    // 6. Similar serving size (low weight)
    const servingsDiff = Math.abs(recipe1.servings - recipe2.servings);
    if (servingsDiff <= 1) {
      score += 5;
    }

    return score;
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">Φόρτωση παρόμοιων συνταγών...</div>
      </div>
    );
  }

  if (similarRecipes.length === 0) {
    return null;
  }

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-3xl font-bold">Παρόμοιες Συνταγές</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Βασισμένες σε συστατικά, κατηγορία και περιοχή
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
