"use client";

import React, { useRef, useState } from "react";
import { Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteRecipeButton } from "@/components/admin/DeleteRecipeButton";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Props {
    initialRecipes: Recipe[];
}

export default function RecipesListClient({ initialRecipes }: Props) {
    const [items, setItems] = useState<Recipe[]>(initialRecipes || []);
    // store last removed item to allow restore on failure
    const lastRemovedRef = useRef<{ item: Recipe | null; index: number | null }>({ item: null, index: null });

    const handleBeforeDelete = (id: string) => {
        setItems((prev) => {
            const idx = prev.findIndex((r) => r.id === id);
            if (idx === -1) return prev;
            const removed = prev[idx];
            lastRemovedRef.current = { item: removed, index: idx };
            const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
            return next;
        });
    };

    const handleDeleteFailed = () => {
        const removed = lastRemovedRef.current.item;
        const index = lastRemovedRef.current.index;
        if (!removed || index === null) return;
        setItems((prev) => {
            const copy = [...prev];
            copy.splice(index, 0, removed);
            return copy;
        });
        lastRemovedRef.current = { item: null, index: null };
    };

    const handleDeleted = () => {
        // clear stored removed item on success
        lastRemovedRef.current = { item: null, index: null };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Recipes</h1>
                    <p className="text-muted-foreground">Manage all recipes</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/admin/recipes/new">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Recipe
                    </Link>
                </Button>
            </div>

            <GlassPanel className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left p-4 font-semibold">Title</th>
                                <th className="text-left p-4 font-semibold">Category</th>
                                <th className="text-left p-4 font-semibold">Difficulty</th>
                                <th className="text-left p-4 font-semibold">Time</th>
                                <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((recipe) => (
                                <tr key={recipe.id} className="border-b border-border/30 hover:bg-white/20 transition-colors">
                                    <td className="p-4 font-medium">{recipe.title}</td>
                                    <td className="p-4 text-muted-foreground">{recipe.category}</td>
                                    <td className="p-4">
                                        <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                            {recipe.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{recipe.time_minutes}m</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/recipes/${recipe.id}/edit`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <DeleteRecipeButton
                                                id={recipe.id}
                                                title={recipe.title}
                                                onBeforeDelete={() => handleBeforeDelete(recipe.id)}
                                                onDeleteFailed={handleDeleteFailed}
                                                onDeleted={handleDeleted}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {items.length === 0 && (
                                <tr>
                                    <td className="p-4" colSpan={5}>
                                        <p className="text-center text-muted-foreground">No recipes found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>
        </div>
    );
}
