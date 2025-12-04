"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Link from "next/link";
import { Clock, X } from "lucide-react";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";

export function RecentlyViewedWidget() {
    const { recentRecipes, clearRecentRecipes } = useRecentlyViewed();

    if (recentRecipes.length === 0) {
        return null;
    }

    return (
        <GlassPanel className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Recently Viewed</h3>
                <button
                    onClick={clearRecentRecipes}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-3">
                {recentRecipes.map((recipe) => (
                    <Link
                        key={recipe.id}
                        href={`/recipes/${recipe.slug}`}
                        className="flex gap-3 p-2 rounded-lg hover:bg-white/20 transition-colors group"
                    >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <ProgressiveImage
                                src={recipe.image_url || '/placeholder-recipe.jpg'}
                                alt={recipe.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {recipe.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(recipe.viewedAt)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </GlassPanel>
    );
}

function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
}
