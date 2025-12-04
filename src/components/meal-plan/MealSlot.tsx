"use client";

import { useMealPlan, MealType } from "@/context/MealPlanContext";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MealSlotProps {
    day: number;
    mealType: MealType;
    onAddClick: () => void;
}

const MEAL_LABELS: Record<MealType, string> = {
    breakfast: 'Πρωινό',
    lunch: 'Μεσημεριανό',
    dinner: 'Βραδινό',
    snack: 'Σνακ'
};

export function MealSlot({ day, mealType, onAddClick }: MealSlotProps) {
    const { getMeal, removeMeal } = useMealPlan();
    const meal = getMeal(day, mealType);

    return (
        <GlassPanel 
            className="p-3 h-24 relative group hover:scale-102 transition-transform"
            variant={meal ? "default" : "card"}
        >
            {meal ? (
                <>
                    <Link href={`/recipes/${meal.recipeSlug}`} className="block h-full">
                        <div className="text-xs text-muted-foreground mb-1">
                            {MEAL_LABELS[mealType]}
                        </div>
                        <div className="font-medium line-clamp-2 text-sm">
                            {meal.recipeTitle}
                        </div>
                    </Link>
                    <button
                        onClick={() => removeMeal(day, mealType)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </>
            ) : (
                <button
                    onClick={onAddClick}
                    className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs">{MEAL_LABELS[mealType]}</span>
                </button>
            )}
        </GlassPanel>
    );
}
