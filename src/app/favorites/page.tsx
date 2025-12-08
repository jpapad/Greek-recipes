"use client";

import { useEffect, useState } from "react";
import { getRecipes } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { Recipe } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, ChefHat } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FavoritesPage() {
    const t = useTranslations();
    const { favorites } = useFavorites();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecipes() {
            const allRecipes = await getRecipes();
            setRecipes(allRecipes.filter((r) => favorites.includes(r.id)));
            setLoading(false);
        }
        fetchRecipes();
    }, [favorites]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <GlassPanel className="p-12 flex flex-col items-center gap-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground text-lg">{t('Common.loading')}</p>
                </GlassPanel>
            </div>
        );
    }

    return (
        <div className="space-y-8 pt-24">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">{t('Pages.favoritesTitle')}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('Pages.favoritesDescription')}
                </p>
            </GlassPanel>

            {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <GlassPanel className="p-16 text-center flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="relative">
                        <Heart className="w-24 h-24 text-muted-foreground/20" />
                        <ChefHat className="w-12 h-12 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">No favorites yet</h2>
                        <p className="text-lg text-muted-foreground">
                            Start exploring and save your favorite Greek recipes!
                        </p>
                    </div>
                    <Button asChild size="lg" className="rounded-full mt-4">
                        <Link href="/recipes">Browse Recipes</Link>
                    </Button>
                </GlassPanel>
            )}
        </div>
    );
}
