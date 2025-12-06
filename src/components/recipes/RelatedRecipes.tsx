"use client";

import { useEffect, useState } from "react";
import { Recipe } from "@/lib/types";
import { RecipeCard } from "./RecipeCard";
import { supabase } from "@/lib/supabaseClient";

interface RelatedRecipesProps {
    currentRecipe: Recipe;
    limit?: number;
}

export function RelatedRecipes({ currentRecipe, limit = 4 }: RelatedRecipesProps) {
    const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRelatedRecipes();
    }, [currentRecipe.id]);

    const loadRelatedRecipes = async () => {
        setLoading(true);
        try {
            // Strategy: Find recipes with same category, region, or similar difficulty
            let query = supabase
                .from('recipes')
                .select('*')
                .neq('id', currentRecipe.id);

            // Prioritize same category
            if (currentRecipe.category) {
                query = query.eq('category', currentRecipe.category);
            }

            // Then same region
            if (currentRecipe.region_id) {
                query = query.eq('region_id', currentRecipe.region_id);
            }

            // Same difficulty
            if (currentRecipe.difficulty) {
                query = query.eq('difficulty', currentRecipe.difficulty);
            }

            const { data, error } = await query.limit(limit);

            if (error) throw error;

            // If we don't have enough, fetch more without filters
            if (data && data.length < limit) {
                const { data: moreData } = await supabase
                    .from('recipes')
                    .select('*')
                    .neq('id', currentRecipe.id)
                    .limit(limit - data.length);

                setRelatedRecipes([...data, ...(moreData || [])]);
            } else {
                setRelatedRecipes(data || []);
            }
        } catch (error) {
            console.error('Failed to load related recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-[400px] bg-white/10 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (relatedRecipes.length === 0) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
