"use client";

import { useState } from "react";
import { Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface EquipmentListProps {
    equipment?: string[];
}

const equipmentIcons: Record<string, string> = {
    'oven': '🔥',
    'stove': '🔥',
    'blender': '🔀',
    'mixer': '🔀',
    'knife': '🔪',
    'cutting board': '📋',
    'pot': '🍲',
    'pan': '🍳',
    'baking dish': '🥘',
    'bowl': '🥣',
    'whisk': '🥄',
    'spatula': '🥄',
    'spoon': '🥄',
    'fork': '🍴',
    'measuring cup': '📏',
    'measuring spoon': '📏',
    'grater': '⚡',
    'peeler': '✂️',
    'colander': '⏬',
    'strainer': '⏬',
    'food processor': '⚙️',
    'grill': '🔥',
    'microwave': '📻',
    'refrigerator': '❄️',
    'freezer': '❄️',
};

export function EquipmentList({ equipment }: EquipmentListProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!equipment || equipment.length === 0) return null;

    const getIcon = (item: string) => {
        const itemLower = item.toLowerCase();
        for (const [key, icon] of Object.entries(equipmentIcons)) {
            if (itemLower.includes(key)) {
                return icon;
            }
        }
        return '🔧';
    };

    const displayedEquipment = isExpanded ? equipment : equipment.slice(0, 6);
    const hasMore = equipment.length > 6;

    return (
        <GlassPanel className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Equipment Needed</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayedEquipment.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="text-2xl">{getIcon(item)}</span>
                        <span className="text-sm">{item}</span>
                    </div>
                ))}
            </div>

            {hasMore && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-3 w-full"
                >
                    {isExpanded ? 'Show Less' : `Show ${equipment.length - 6} More`}
                </Button>
            )}
        </GlassPanel>
    );
}
