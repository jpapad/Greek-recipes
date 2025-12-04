"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Recipe } from "@/lib/types";
import { getRecipes } from "@/lib/api";
import { Search, X } from "lucide-react";
import { useMealPlan, MealType } from "@/context/MealPlanContext";

interface RecipeSelectorProps {
    day: number;
    mealType: MealType;
    onClose: () => void;
}

export function RecipeSelector({ day, mealType, onClose }: RecipeSelectorProps) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { addMeal } = useMealPlan();

    useEffect(() => {
        loadRecipes();
    }, []);

    async function loadRecipes() {
        try {
            const data = await getRecipes();
            setRecipes(data);
        } catch (error) {
            console.error('Error loading recipes:', error);
        } finally {
            setLoading(false);
        }
    }

    const filtered = recipes.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (recipe: Recipe) => {
        addMeal({
            day,
            mealType,
            recipeId: recipe.id,
            recipeTitle: recipe.title,
            recipeSlug: recipe.slug
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Επιλέξτε Συνταγή</h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 border-b border-border/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Αναζήτηση συνταγής..."
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center text-muted-foreground py-8">Φόρτωση...</div>
                    ) : filtered.length > 0 ? (
                        <div className="space-y-2">
                            {filtered.map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => handleSelect(recipe)}
                                    className="w-full text-left p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <div className="font-medium">{recipe.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {recipe.time_minutes} λεπτά • {recipe.difficulty}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Δεν βρέθηκαν συνταγές
                        </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
}
