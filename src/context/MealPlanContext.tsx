"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealSlot {
    day: number; // 0-6 (Monday-Sunday)
    mealType: MealType;
    recipeId?: string;
    recipeTitle?: string;
    recipeSlug?: string;
}

interface MealPlanContextType {
    meals: MealSlot[];
    addMeal: (slot: MealSlot) => void;
    removeMeal: (day: number, mealType: MealType) => void;
    getMeal: (day: number, mealType: MealType) => MealSlot | undefined;
    clearWeek: () => void;
    weekOffset: number;
    setWeekOffset: (offset: number) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export function MealPlanProvider({ children }: { children: ReactNode }) {
    const [meals, setMeals] = useState<MealSlot[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('mealPlan');
        if (saved) {
            try {
                setMeals(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading meal plan:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('mealPlan', JSON.stringify(meals));
    }, [meals]);

    const addMeal = (slot: MealSlot) => {
        setMeals(prev => {
            const filtered = prev.filter(
                m => !(m.day === slot.day && m.mealType === slot.mealType)
            );
            return [...filtered, slot];
        });
    };

    const removeMeal = (day: number, mealType: MealType) => {
        setMeals(prev => prev.filter(
            m => !(m.day === day && m.mealType === mealType)
        ));
    };

    const getMeal = (day: number, mealType: MealType) => {
        return meals.find(m => m.day === day && m.mealType === mealType);
    };

    const clearWeek = () => {
        setMeals([]);
    };

    return (
        <MealPlanContext.Provider value={{
            meals,
            addMeal,
            removeMeal,
            getMeal,
            clearWeek,
            weekOffset,
            setWeekOffset
        }}>
            {children}
        </MealPlanContext.Provider>
    );
}

export function useMealPlan() {
    const context = useContext(MealPlanContext);
    if (!context) {
        throw new Error('useMealPlan must be used within MealPlanProvider');
    }
    return context;
}
