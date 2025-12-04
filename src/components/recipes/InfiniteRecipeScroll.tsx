"use client";

import { useEffect, useRef, useState } from "react";
import { Recipe } from "@/lib/types";
import { RecipeCard } from "./RecipeCard";

interface InfiniteRecipeScrollProps {
    initialRecipes: Recipe[];
    filters?: any;
    pageSize?: number;
}

export function InfiniteRecipeScroll({ 
    initialRecipes, 
    filters = {},
    pageSize = 12 
}: InfiniteRecipeScrollProps) {
    const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialRecipes.length === pageSize);
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadMore = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: pageSize.toString(),
                ...Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
                ),
            });

            const response = await fetch(`/api/recipes?${queryParams}`);
            const data = await response.json();

            if (data.recipes && data.recipes.length > 0) {
                setRecipes((prev) => [...prev, ...data.recipes]);
                setPage((prev) => prev + 1);
                setHasMore(data.recipes.length === pageSize);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more recipes:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, page, filters]);

    // Reset when filters change
    useEffect(() => {
        setRecipes(initialRecipes);
        setPage(1);
        setHasMore(initialRecipes.length === pageSize);
    }, [initialRecipes, pageSize]);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            className="h-[400px] bg-white/20 dark:bg-white/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Intersection Observer Target */}
            <div ref={observerTarget} className="h-10 mt-6" />

            {/* End Message */}
            {!hasMore && recipes.length > 0 && (
                <p className="text-center text-muted-foreground mt-8">
                    No more recipes to load
                </p>
            )}

            {recipes.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">
                        No recipes found matching your filters.
                    </p>
                </div>
            )}
        </div>
    );
}
