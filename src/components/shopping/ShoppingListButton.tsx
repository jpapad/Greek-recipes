"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShoppingList } from "@/context/ShoppingListContext";

interface ShoppingListButtonProps {
    ingredients: string[];
    recipeId: string;
    recipeTitle: string;
}

export function ShoppingListButton({ ingredients, recipeId, recipeTitle }: ShoppingListButtonProps) {
    const { addItems } = useShoppingList();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItems(ingredients, recipeId, recipeTitle);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Button
            onClick={handleAdd}
            variant={added ? "secondary" : "default"}
            className="w-full md:w-auto transition-all"
        >
            {added ? (
                <>
                    <Check className="mr-2 h-4 w-4" /> Added to List
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add Ingredients to List
                </>
            )}
        </Button>
    );
}
