"use client";

import { ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

interface DifficultyIconProps {
    difficulty: 'easy' | 'medium' | 'hard';
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const difficultyConfig = {
    easy: {
        count: 1,
        color: 'text-green-500',
        label: 'Easy'
    },
    medium: {
        count: 2,
        color: 'text-yellow-500',
        label: 'Medium'
    },
    hard: {
        count: 3,
        color: 'text-red-500',
        label: 'Hard'
    }
};

const sizeConfig = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
};

export function DifficultyIcon({ difficulty, showLabel = false, size = 'md' }: DifficultyIconProps) {
    const config = difficultyConfig[difficulty];
    const iconSize = sizeConfig[size];

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {Array.from({ length: config.count }).map((_, i) => (
                    <ChefHat
                        key={i}
                        className={cn(iconSize, config.color)}
                        fill="currentColor"
                    />
                ))}
                {Array.from({ length: 3 - config.count }).map((_, i) => (
                    <ChefHat
                        key={`empty-${i}`}
                        className={cn(iconSize, 'text-muted-foreground/30')}
                    />
                ))}
            </div>
            {showLabel && (
                <span className={cn(
                    "font-medium",
                    size === 'sm' && "text-xs",
                    size === 'md' && "text-sm",
                    size === 'lg' && "text-base",
                    config.color
                )}>
                    {config.label}
                </span>
            )}
        </div>
    );
}
