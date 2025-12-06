"use client";

import { useEffect, useState } from "react";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Recipe } from "@/lib/types";
import { getSimilarRecipes } from "@/lib/recommendations";
import { getRecipes } from "@/lib/api";
import { Sparkles } from "lucide-react";

interface SimilarRecipesProps {
    recipe: Recipe;
}

export function SimilarRecipes({ recipe }: SimilarRecipesProps) {
    const [similar, setSimilar] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSimilar() {
            try {
                const allRecipes = await getRecipes();
                const similarRecipes = getSimilarRecipes(recipe, allRecipes, 4);
                setSimilar(similarRecipes);
            } catch (error) {
                console.error('Error loading similar recipes:', error);
            } finally {
                setLoading(false);
            }
        }

        loadSimilar();
    }, [recipe]);

    if (loading || similar.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Παρόμοιες Συνταγές</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similar.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
