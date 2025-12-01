"use client";

import { useState, useEffect } from "react";
import { getRecipes } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterPanel } from "@/components/recipes/FilterPanel";
import { Recipe } from "@/lib/types";

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRecipes() {
            setLoading(true);
            // We can now pass filters directly to the API
            // This allows for server-side filtering if implemented in Supabase
            const data = await getRecipes({
                search: searchQuery,
                difficulty: selectedDifficulty,
                time: selectedTime,
                category: selectedCategory
            });
            setRecipes(data);
            setLoading(false);
        }

        // Debounce the API call slightly to avoid too many requests while typing
        const timer = setTimeout(() => {
            fetchRecipes();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedDifficulty, selectedTime, selectedCategory]);

    return (
        <div className="space-y-8">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">All Recipes</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    Browse our complete collection of traditional Greek dishes. From hearty mains to sweet delights.
                </p>

                <div className="max-w-md mx-auto">
                    <SearchBar
                        onSearch={setSearchQuery}
                        placeholder="Search by title..."
                    />
                </div>
            </GlassPanel>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <FilterPanel
                            selectedDifficulty={selectedDifficulty}
                            onDifficultyChange={setSelectedDifficulty}
                            selectedTime={selectedTime}
                            onTimeChange={setSelectedTime}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </div>
                </div>

                {/* Recipe Grid */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((n) => (
                                <GlassPanel key={n} className="h-[400px] animate-pulse bg-white/20" />
                            ))}
                        </div>
                    ) : recipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} {...recipe} />
                            ))}
                        </div>
                    ) : (
                        <GlassPanel className="p-12 text-center">
                            <p className="text-lg text-muted-foreground">No recipes found matching your criteria.</p>
                        </GlassPanel>
                    )}
                </div>
            </div>
        </div>
    );
}
