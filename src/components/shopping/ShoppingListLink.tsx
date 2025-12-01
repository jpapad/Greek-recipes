"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShoppingList } from "@/context/ShoppingListContext";
import { Badge } from "@/components/ui/badge";

export function ShoppingListLink() {
    const { itemCount } = useShoppingList();

    return (
        <Link href="/shopping-list" className="relative hover:text-primary transition-colors flex items-center gap-1">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">List</span>
            {itemCount > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-3 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                >
                    {itemCount}
                </Badge>
            )}
        </Link>
    );
}
