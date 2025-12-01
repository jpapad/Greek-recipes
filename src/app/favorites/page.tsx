"use client";

import { useEffect, useState } from "react";
import { getRecipes } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useFavorites } from "@/hooks/useFavorites";
import { Recipe } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
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
        return <div className="p-8 text-center">Loading favorites...</div>;
    }

    return (
        <div className="space-y-8">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">My Favorites</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Your personal collection of loved recipes.
                </p>
            </GlassPanel>

            {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} {...recipe} />
                    ))}
                </div>
            ) : (
                <GlassPanel className="p-16 text-center flex flex-col items-center justify-center">
                    <p className="text-xl text-muted-foreground mb-6">You haven't saved any recipes yet.</p>
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/recipes">Browse Recipes</Link>
                    </Button>
                </GlassPanel>
            )}
        </div>
    );
}
