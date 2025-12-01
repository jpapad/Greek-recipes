"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat, Heart } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
    id: string;
    title: string;
    slug: string;
    image_url: string;
    time_minutes: number;
    difficulty: string;
    servings: number;
    category?: string;
}

export function RecipeCard({
    id,
    title,
    slug,
    image_url,
    time_minutes,
    difficulty,
    servings,
    category,
}: RecipeCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(id);

    return (
        <GlassPanel variant="card" hoverEffect className="h-full overflow-hidden flex flex-col relative group">
            <div className="relative w-full">
                <Link href={`/recipes/${slug}`}>
                    <AspectRatio ratio={4 / 3}>
                        <Image
                            src={image_url || "/placeholder-recipe.jpg"}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </AspectRatio>
                </Link>
                {category && (
                    <Badge className="absolute top-3 right-3 bg-white/80 text-primary hover:bg-white backdrop-blur-md border-0 pointer-events-none">
                        {category}
                    </Badge>
                )}
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "absolute top-3 left-3 rounded-full backdrop-blur-md transition-all hover:bg-white/90",
                        favorite ? "bg-white/90 text-red-500 hover:text-red-600" : "bg-black/20 text-white hover:text-red-500"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(id);
                    }}
                >
                    <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
                </Button>
            </div>

            <Link href={`/recipes/${slug}`} className="flex flex-col flex-grow">
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">{title}</h3>

                    <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{time_minutes}m</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ChefHat className="w-4 h-4" />
                            <span className="capitalize">{difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{servings}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </GlassPanel>
    );
}
