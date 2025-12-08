"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { IngredientGroup } from "@/lib/types";
import { migrateIngredientsToGroups } from "@/lib/recipeHelpers";

interface GroupedIngredientsDisplayProps {
    ingredients: IngredientGroup[] | string[] | undefined;
}

export function GroupedIngredientsDisplay({ ingredients }: GroupedIngredientsDisplayProps) {
    const groups = migrateIngredientsToGroups(ingredients);
    const [expandedGroups, setExpandedGroups] = useState<Set<number>>(
        new Set(groups.map((_, i) => i)) // All expanded by default
    );

    const toggleGroup = (index: number) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    // If there's only one group with no title, show simple list
    if (groups.length === 1 && !groups[0].title) {
        return (
            <ul className="space-y-3">
                {groups[0].items.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/20 transition-colors">
                        <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-foreground/90">{ingredient}</span>
                    </li>
                ))}
            </ul>
        );
    }

    // Show grouped display
    return (
        <div className="space-y-4">
            {groups.map((group, groupIndex) => {
                const isExpanded = expandedGroups.has(groupIndex);

                return (
                    <div key={groupIndex} className="border-l-2 border-primary/30 pl-4">
                        {group.title && (
                            <button
                                onClick={() => toggleGroup(groupIndex)}
                                className="flex items-center gap-2 mb-3 text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-5 h-5" />
                                ) : (
                                    <ChevronRight className="w-5 h-5" />
                                )}
                                {group.title}
                            </button>
                        )}
                        {isExpanded && (
                            <ul className="space-y-2">
                                {group.items.map((ingredient, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/20 transition-colors">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                        <span className="text-foreground/90">{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
