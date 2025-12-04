"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { categorizeIngredient, IngredientCategory } from "@/lib/ingredientCategories";

export interface ShoppingItem {
    id: string;
    name: string;
    checked: boolean;
    quantity: number;
    category: IngredientCategory;
    recipeId?: string;
    recipeTitle?: string;
}

interface ShoppingListContextType {
    items: ShoppingItem[];
    addItem: (name: string, recipeId?: string, recipeTitle?: string) => void;
    addItems: (names: string[], recipeId?: string, recipeTitle?: string) => void;
    removeItem: (id: string) => void;
    toggleItem: (id: string) => void;
    toggleCategory: (category: IngredientCategory) => void;
    clearList: () => void;
    clearChecked: () => void;
    updateQuantity: (id: string, delta: number) => void;
    itemCount: number;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ShoppingItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("shopping-list");
        if (stored) {
            setItems(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("shopping-list", JSON.stringify(items));
    }, [items]);

    const addItem = (name: string, recipeId?: string, recipeTitle?: string) => {
        setItems((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name,
                checked: false,
                quantity: 1,
                category: categorizeIngredient(name),
                recipeId,
                recipeTitle,
            },
        ]);
    };

    const addItems = (names: string[], recipeId?: string, recipeTitle?: string) => {
        const newItems = names.map((name) => ({
            id: crypto.randomUUID(),
            name,
            checked: false,
            quantity: 1,
            category: categorizeIngredient(name),
            recipeId,
            recipeTitle,
        }));
        setItems((prev) => [...prev, ...newItems]);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const toggleItem = (id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const toggleCategory = (category: IngredientCategory) => {
        setItems((prev) => {
            const categoryItems = prev.filter(item => item.category === category);
            const allChecked = categoryItems.every(item => item.checked);
            return prev.map(item => 
                item.category === category 
                    ? { ...item, checked: !allChecked }
                    : item
            );
        });
    };

    const clearList = () => {
        setItems([]);
    };

    const clearChecked = () => {
        setItems((prev) => prev.filter(item => !item.checked));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    return (
        <ShoppingListContext.Provider
            value={{
                items,
                addItem,
                addItems,
                removeItem,
                toggleItem,
                toggleCategory,
                clearList,
                clearChecked,
                updateQuantity,
                itemCount: items.filter(i => !i.checked).length,
            }}
        >
            {children}
        </ShoppingListContext.Provider>
    );
}

export function useShoppingList() {
    const context = useContext(ShoppingListContext);
    if (context === undefined) {
        throw new Error("useShoppingList must be used within a ShoppingListProvider");
    }
    return context;
}
