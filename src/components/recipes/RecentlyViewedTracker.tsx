"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Recipe } from "@/lib/types";

interface RecentlyViewedTrackerProps {
    recipe: Recipe;
}

export function RecentlyViewedTracker({ recipe }: RecentlyViewedTrackerProps) {
    const { addRecentRecipe } = useRecentlyViewed();

    useEffect(() => {
        addRecentRecipe({
            id: recipe.id,
            slug: recipe.slug,
            title: recipe.title,
            image_url: recipe.image_url
        });
    }, [recipe.id, addRecentRecipe]);

    return null;
}
