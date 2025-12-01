"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ShoppingItem {
    id: string;
    name: string;
    checked: boolean;
    recipeId?: string;
    recipeTitle?: string;
}

interface ShoppingListContextType {
    items: ShoppingItem[];
    addItem: (name: string, recipeId?: string, recipeTitle?: string) => void;
    addItems: (names: string[], recipeId?: string, recipeTitle?: string) => void;
    removeItem: (id: string) => void;
    toggleItem: (id: string) => void;
    clearList: () => void;
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

    const clearList = () => {
        setItems([]);
    };

    return (
        <ShoppingListContext.Provider
            value={{
                items,
                addItem,
                addItems,
                removeItem,
                toggleItem,
                clearList,
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
