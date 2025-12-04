"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    showNumber?: boolean;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
}

export function StarRating({ 
    rating, 
    maxRating = 5, 
    size = "md",
    showNumber = true,
    interactive = false,
    onRatingChange 
}: StarRatingProps) {
    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-5 h-5",
        lg: "w-7 h-7"
    };

    const textSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base"
    };

    const handleStarClick = (starRating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(starRating);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: maxRating }, (_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= Math.floor(rating);
                    const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0;
                    const fillPercentage = isPartial ? (rating % 1) * 100 : 0;

                    return (
                        <div 
                            key={index} 
                            className="relative"
                            onClick={() => handleStarClick(starValue)}
                            style={{ cursor: interactive ? 'pointer' : 'default' }}
                        >
                            {/* Background star (empty) */}
                            <Star 
                                className={cn(
                                    sizeClasses[size],
                                    "text-gray-300 dark:text-gray-600",
                                    interactive && "hover:scale-110 transition-transform"
                                )}
                            />
                            
                            {/* Foreground star (filled) */}
                            {(isFilled || isPartial) && (
                                <div 
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ width: isPartial ? `${fillPercentage}%` : '100%' }}
                                >
                                    <Star 
                                        className={cn(
                                            sizeClasses[size],
                                            "text-yellow-500 fill-yellow-500"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {showNumber && (
                <span className={cn(
                    "font-semibold text-foreground/80",
                    textSizeClasses[size]
                )}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
