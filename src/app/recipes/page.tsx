"use client";

import { useState, useEffect, useMemo } from "react";
import { getRecipes } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AdvancedFilters, FilterOptions } from "@/components/recipes/AdvancedFilters";
import { Recipe } from "@/lib/types";
import { Grid, List, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IngredientSearchWidget } from "@/components/recipes/IngredientSearchWidget";
import { useTranslations } from "next-intl";

export default function RecipesPage() {
    const t = useTranslations();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterOptions>({});
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        async function fetchRecipes() {
            setLoading(true);
            const data = await getRecipes();
            setRecipes(data);
            setLoading(false);
        }
        fetchRecipes();
    }, []);

    // Client-side filtering and sorting
    const filteredAndSortedRecipes = useMemo(() => {
        let result = [...recipes];

        // Apply filters
        if (filters.difficulty) {
            result = result.filter(r => r.difficulty === filters.difficulty);
        }
        if (filters.category) {
            result = result.filter(r =>
                r.category?.toLowerCase().replace(/\s+/g, '-') === filters.category
            );
        }
        if (filters.minTime) {
            result = result.filter(r => r.time_minutes >= filters.minTime!);
        }
        if (filters.maxTime) {
            result = result.filter(r => r.time_minutes <= filters.maxTime!);
        }
        if (filters.minServings) {
            result = result.filter(r => r.servings >= filters.minServings!);
        }
        if (filters.maxServings) {
            result = result.filter(r => r.servings <= filters.maxServings!);
        }

        // Apply sorting
        const sortBy = filters.sortBy || 'newest';
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                case 'oldest':
                    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                case 'time-asc':
                    return a.time_minutes - b.time_minutes;
                case 'time-desc':
                    return b.time_minutes - a.time_minutes;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return result;
    }, [recipes, filters]);

    return (
        <div className="space-y-8 pt-24">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">Όλες οι Συνταγές</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                    Περιηγηθείτε στην πλήρη συλλογή μας από παραδοσιακά ελληνικά πιάτα.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/recipes/search">
                        <Button size="lg" className="gap-2">
                            <Search className="w-5 h-5" />
                            Έξυπνη Αναζήτηση
                        </Button>
                    </Link>
                </div>
            </GlassPanel>

            {/* Ingredient Search Widget */}
            <div className="max-w-2xl mx-auto">
                <IngredientSearchWidget />
            </div>

            {/* Filters & View Toggle */}
            <div className="flex items-center justify-between gap-4">
                <AdvancedFilters filters={filters} onFiltersChange={setFilters} />

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className="rounded-full"
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className="rounded-full"
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Recipe Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <GlassPanel key={n} className="h-[400px] animate-pulse bg-white/20" />
                    ))}
                </div>
            ) : filteredAndSortedRecipes.length === 0 ? (
                <GlassPanel className="p-12 text-center">
                    <p className="text-muted-foreground text-lg">
                        {t('Pages.noRecipesFound')}. {t('Pages.tryDifferentFilters')}.
                    </p>
                </GlassPanel>
            ) : (
                <>
                    <div className="text-sm text-muted-foreground mb-4">
                        Βρέθηκαν {filteredAndSortedRecipes.length} συνταγές
                    </div>
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }>
                        {filteredAndSortedRecipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
