"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StepGroup } from "@/lib/types";
import { migrateStepsToGroups } from "@/lib/recipeHelpers";

interface GroupedStepsDisplayProps {
    steps: StepGroup[] | string[];
}

export function GroupedStepsDisplay({ steps }: GroupedStepsDisplayProps) {
    const groups = migrateStepsToGroups(steps);
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

    // Calculate step number across all groups
    const getStepNumber = (groupIndex: number, itemIndex: number): number => {
        let count = 0;
        for (let g = 0; g < groupIndex; g++) {
            count += groups[g].items.length;
        }
        return count + itemIndex + 1;
    };

    // If there's only one group with no title, show simple list
    if (groups.length === 1 && !groups[0].title) {
        return (
            <div className="space-y-8">
                {groups[0].items.map((step, index) => (
                    <div key={index} className="flex gap-6 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                            {index + 1}
                        </div>
                        <div className="pt-1">
                            <p className="text-lg leading-relaxed text-foreground/90">{step}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Show grouped display
    return (
        <div className="space-y-8">
            {groups.map((group, groupIndex) => {
                const isExpanded = expandedGroups.has(groupIndex);

                return (
                    <div key={groupIndex} className="border-l-4 border-primary/30 pl-6">
                        {group.title && (
                            <button
                                onClick={() => toggleGroup(groupIndex)}
                                className="flex items-center gap-2 mb-4 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
                            >
                                {isExpanded ? (
                                    <ChevronDown className="w-6 h-6" />
                                ) : (
                                    <ChevronRight className="w-6 h-6" />
                                )}
                                {group.title}
                            </button>
                        )}
                        {isExpanded && (
                            <div className="space-y-6">
                                {group.items.map((step, itemIndex) => (
                                    <div key={itemIndex} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                            {getStepNumber(groupIndex, itemIndex)}
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-lg leading-relaxed text-foreground/90">{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
