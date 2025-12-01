"use client";

import { useShoppingList } from "@/context/ShoppingListContext";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare, Square } from "lucide-react";
import Link from "next/link";

export default function ShoppingListPage() {
    const { items, toggleItem, removeItem, clearList } = useShoppingList();

    const groupedItems = items.reduce((acc, item) => {
        const key = item.recipeTitle || "Misc";
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {} as Record<string, typeof items>);

    return (
        <div className="space-y-8">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">Shopping List</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Manage your ingredients for your upcoming cooking sessions.
                </p>
            </GlassPanel>

            {items.length > 0 ? (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <Button variant="destructive" onClick={clearList} size="sm">
                            <Trash2 className="w-4 h-4 mr-2" /> Clear All
                        </Button>
                    </div>

                    {Object.entries(groupedItems).map(([category, categoryItems]) => (
                        <GlassPanel key={category} className="p-6">
                            <h3 className="text-xl font-bold mb-4 border-b border-border/50 pb-2">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {categoryItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/20 transition-colors group"
                                    >
                                        <div
                                            className="flex items-center gap-3 cursor-pointer flex-grow"
                                            onClick={() => toggleItem(item.id)}
                                        >
                                            {item.checked ? (
                                                <CheckSquare className="w-5 h-5 text-primary" />
                                            ) : (
                                                <Square className="w-5 h-5 text-muted-foreground" />
                                            )}
                                            <span
                                                className={`text-lg ${item.checked
                                                        ? "line-through text-muted-foreground"
                                                        : "text-foreground"
                                                    }`}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            ) : (
                <GlassPanel className="p-16 text-center flex flex-col items-center justify-center">
                    <p className="text-xl text-muted-foreground mb-6">Your shopping list is empty.</p>
                    <Button asChild size="lg" className="rounded-full">
                        <Link href="/recipes">Browse Recipes</Link>
                    </Button>
                </GlassPanel>
            )}
        </div>
    );
}
