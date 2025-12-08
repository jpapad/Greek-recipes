"use client";

import Link from "next/link";
import { Clock, Users, Heart, Leaf, Wheat, ShoppingCart } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useFavorites } from "@/hooks/useFavorites";
import { useSwipe } from "@/hooks/useSwipe";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Recipe } from "@/lib/types";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import { DifficultyIcon } from "@/components/ui/DifficultyIcon";
import { StarRating } from "@/components/ui/StarRating";
import { useTranslations } from "@/hooks/useTranslations";
import { useState } from "react";
import { flattenIngredients } from "@/lib/recipeHelpers";

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    const { t } = useTranslations();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addItems } = useShoppingList();
    const favorite = isFavorite(recipe.id);
    const [swipeFeedback, setSwipeFeedback] = useState<'favorite' | 'shopping' | null>(null);

    const { handlers, isSwiping, swipeDirection } = useSwipe({
        onSwipeLeft: () => {
            toggleFavorite(recipe.id);
            setSwipeFeedback('favorite');
            setTimeout(() => setSwipeFeedback(null), 1000);
        },
        onSwipeRight: () => {
            if (recipe.ingredients) {
                addItems(flattenIngredients(recipe.ingredients), recipe.id, recipe.title);
                setSwipeFeedback('shopping');
                setTimeout(() => setSwipeFeedback(null), 1000);
            }
        },
        threshold: 80
    });

    return (
        <GlassPanel
            variant="card"
            hoverEffect
            className={cn(
                "h-full overflow-hidden flex flex-col relative group transition-all duration-300",
                "shadow-lg hover:shadow-[0_8px_30px_rgba(16,45,99,0.4),0_12px_40px_rgba(16,45,99,0.25)]",
                isSwiping && swipeDirection === 'left' && "-translate-x-2 scale-[0.98]",
                isSwiping && swipeDirection === 'right' && "translate-x-2 scale-[0.98]"
            )}
            {...handlers}
        >
            {/* Swipe Feedback */}
            {swipeFeedback && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md animate-in fade-in duration-300">
                    {swipeFeedback === 'favorite' ? (
                        <div className="text-white text-center animate-in zoom-in duration-300">
                            <div className="bg-white/20 rounded-full p-4 mb-3 backdrop-blur-sm">
                                <Heart className="w-12 h-12 mx-auto fill-red-500 text-red-500 animate-pulse" />
                            </div>
                            <p className="font-semibold text-lg">{favorite ? t('Recipe.addedToFavorites') : t('Recipe.removedFromFavorites')}</p>
                        </div>
                    ) : (
                        <div className="text-white text-center animate-in zoom-in duration-300">
                            <div className="bg-white/20 rounded-full p-4 mb-3 backdrop-blur-sm">
                                <ShoppingCart className="w-12 h-12 mx-auto animate-bounce" />
                            </div>
                            <p className="font-semibold text-lg">{t('Recipe.addedToShoppingList')}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="relative w-full overflow-hidden">
                <Link href={`/recipes/${recipe.slug}`}>
                    <AspectRatio ratio={4 / 3}>
                        <ProgressiveImage
                            src={recipe.image_url || "/placeholder-recipe.jpg"}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </AspectRatio>
                </Link>
                <div className="absolute top-3 right-3 flex gap-2">
                    {recipe.category && (
                        <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-md border-0 pointer-events-none font-semibold shadow-lg">
                            {recipe.category}
                        </Badge>
                    )}
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "absolute top-3 left-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg hover:scale-110",
                        favorite ? "bg-white/95 text-red-500 hover:text-red-600 hover:bg-white" : "bg-black/30 text-white hover:text-red-500 hover:bg-white/95"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(recipe.id);
                    }}
                >
                    <Heart className={cn("w-5 h-5 transition-all", favorite && "fill-current scale-110")} />
                </Button>
            </div>

            <Link href={`/recipes/${recipe.slug}`} className="flex flex-col flex-grow">
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300">{recipe.title}</h3>

                    {/* Dietary Tags */}
                    {(recipe.is_vegetarian || recipe.is_vegan || recipe.is_gluten_free || recipe.is_dairy_free) && (
                        <div className="flex gap-1.5 mb-3 flex-wrap">
                            {recipe.is_vegan && (
                                <Badge variant="outline" className="text-xs gap-1 bg-green-500/15 text-green-700 border-green-500/40 font-medium">
                                    <Leaf className="w-3 h-3" /> {t('Recipe.vegan')}
                                </Badge>
                            )}
                            {recipe.is_vegetarian && !recipe.is_vegan && (
                                <Badge variant="outline" className="text-xs gap-1 bg-green-500/15 text-green-700 border-green-500/40 font-medium">
                                    <Leaf className="w-3 h-3" /> {t('Recipe.vegetarian')}
                                </Badge>
                            )}
                            {recipe.is_gluten_free && (
                                <Badge variant="outline" className="text-xs gap-1 bg-amber-500/15 text-amber-700 border-amber-500/40 font-medium">
                                    <Wheat className="w-3 h-3" /> {t('Recipe.gf')}
                                </Badge>
                            )}
                            {recipe.is_dairy_free && (
                                <Badge variant="outline" className="text-xs gap-1 bg-blue-500/15 text-blue-700 border-blue-500/40 font-medium">
                                    {t('Recipe.df')}
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{recipe.time_minutes}m</span>
                            </div>
                            <DifficultyIcon difficulty={recipe.difficulty} size="sm" />
                            <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{recipe.servings}</span>
                            </div>
                        </div>
                        <StarRating rating={recipe.average_rating || 0} size="sm" showNumber />
                    </div>
                </div>
            </Link>
        </GlassPanel>
    );
}
