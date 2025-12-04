"use client";

import { useEffect, useState, useCallback } from "react";

const MAX_RECENT_RECIPES = 10;

interface RecentRecipe {
    id: string;
    slug: string;
    title: string;
    image_url: string;
    viewedAt: number;
}

export function useRecentlyViewed() {
    const [recentRecipes, setRecentRecipes] = useState<RecentRecipe[]>([]);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('recentlyViewedRecipes');
        if (stored) {
            try {
                setRecentRecipes(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse recently viewed recipes:', error);
                localStorage.removeItem('recentlyViewedRecipes');
            }
        }
    }, []);

    const addRecentRecipe = useCallback((recipe: Omit<RecentRecipe, 'viewedAt'>) => {
        setRecentRecipes(prev => {
            // Remove existing entry if present
            const filtered = prev.filter(r => r.id !== recipe.id);
            
            // Add new entry at the beginning
            const updated = [
                { ...recipe, viewedAt: Date.now() },
                ...filtered
            ].slice(0, MAX_RECENT_RECIPES);

            // Persist to localStorage
            localStorage.setItem('recentlyViewedRecipes', JSON.stringify(updated));
            
            return updated;
        });
    }, []);

    const clearRecentRecipes = useCallback(() => {
        setRecentRecipes([]);
        localStorage.removeItem('recentlyViewedRecipes');
    }, []);

    return {
        recentRecipes,
        addRecentRecipe,
        clearRecentRecipes
    };
}
