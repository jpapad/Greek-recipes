"use client";

import { Recipe } from "@/lib/types";

interface NutritionFactsProps {
    recipe: Recipe;
}

export function NutritionFacts({ recipe }: NutritionFactsProps) {
    const hasNutritionData = recipe.calories || recipe.protein_g || recipe.carbs_g || recipe.fat_g;

    if (!hasNutritionData) return null;

    return (
        <div className="border-2 border-foreground dark:border-white rounded-lg p-4 bg-white dark:bg-gray-900">
            <h3 className="text-2xl font-bold border-b-8 border-foreground dark:border-white pb-1 mb-2">
                Nutrition Facts
            </h3>
            <div className="border-b-4 border-foreground dark:border-white pb-2 mb-2">
                <p className="text-sm">Serving size: 1 serving</p>
                <p className="text-sm">Servings: {recipe.servings}</p>
            </div>

            {recipe.calories && (
                <div className="border-b-8 border-foreground dark:border-white py-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-xl">Calories</span>
                        <span className="font-bold text-3xl">{recipe.calories}</span>
                    </div>
                </div>
            )}

            <div className="border-b-4 border-foreground dark:border-white py-2">
                <p className="text-sm font-bold text-right">% Daily Value*</p>
            </div>

            {recipe.fat_g !== undefined && (
                <div className="border-b border-gray-400 py-1">
                    <div className="flex justify-between">
                        <span><strong>Total Fat</strong> {recipe.fat_g}g</span>
                        <span className="font-bold">{Math.round((recipe.fat_g / 78) * 100)}%</span>
                    </div>
                </div>
            )}

            {recipe.carbs_g !== undefined && (
                <div className="border-b border-gray-400 py-1">
                    <div className="flex justify-between">
                        <span><strong>Total Carbohydrate</strong> {recipe.carbs_g}g</span>
                        <span className="font-bold">{Math.round((recipe.carbs_g / 275) * 100)}%</span>
                    </div>
                </div>
            )}

            {recipe.fiber_g !== undefined && (
                <div className="border-b border-gray-400 py-1 pl-4">
                    <div className="flex justify-between">
                        <span>Dietary Fiber {recipe.fiber_g}g</span>
                        <span className="font-bold">{Math.round((recipe.fiber_g / 28) * 100)}%</span>
                    </div>
                </div>
            )}

            {recipe.sugar_g !== undefined && (
                <div className="border-b border-gray-400 py-1 pl-4">
                    <div className="flex justify-between">
                        <span>Total Sugars {recipe.sugar_g}g</span>
                    </div>
                </div>
            )}

            {recipe.protein_g !== undefined && (
                <div className="border-b-8 border-foreground dark:border-white py-1">
                    <div className="flex justify-between">
                        <span><strong>Protein</strong> {recipe.protein_g}g</span>
                        <span className="font-bold">{Math.round((recipe.protein_g / 50) * 100)}%</span>
                    </div>
                </div>
            )}

            {recipe.sodium_mg !== undefined && (
                <div className="border-b border-gray-400 py-1">
                    <div className="flex justify-between">
                        <span><strong>Sodium</strong> {recipe.sodium_mg}mg</span>
                        <span className="font-bold">{Math.round((recipe.sodium_mg / 2300) * 100)}%</span>
                    </div>
                </div>
            )}

            <div className="text-xs mt-3 pt-2 border-t border-gray-400">
                <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
            </div>

            {recipe.allergens && recipe.allergens.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-foreground dark:border-white">
                    <p className="font-bold text-sm mb-1">Allergens:</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {recipe.allergens.join(', ')}
                    </p>
                </div>
            )}
        </div>
    );
}
