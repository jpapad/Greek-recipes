"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Label } from "@/components/ui/label";
import { Tag } from "@/components/ui/Tag";

interface FilterPanelProps {
    selectedDifficulty: string | null;
    onDifficultyChange: (difficulty: string | null) => void;
    selectedTime: string | null;
    onTimeChange: (time: string | null) => void;
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

export function FilterPanel({
    selectedDifficulty,
    onDifficultyChange,
    selectedTime,
    onTimeChange,
    selectedCategory,
    onCategoryChange,
}: FilterPanelProps) {
    const difficulties = ["easy", "medium", "hard"];
    const times = ["Under 30m", "30m - 60m", "Over 60m"];
    const categories = ["Main Dish", "Salad", "Pie", "Dip", "Dessert"];

    return (
        <GlassPanel className="p-6 space-y-6 bg-white/40">
            <div>
                <Label className="text-base font-semibold mb-3 block">Category</Label>
                <div className="flex flex-wrap gap-2">
                    <Tag
                        label="All"
                        active={selectedCategory === null}
                        onClick={() => onCategoryChange(null)}
                    />
                    {categories.map((cat) => (
                        <Tag
                            key={cat}
                            label={cat}
                            active={selectedCategory === cat}
                            onClick={() => onCategoryChange(selectedCategory === cat ? null : cat)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Difficulty</Label>
                <div className="flex flex-wrap gap-2">
                    <Tag
                        label="All"
                        active={selectedDifficulty === null}
                        onClick={() => onDifficultyChange(null)}
                    />
                    {difficulties.map((diff) => (
                        <Tag
                            key={diff}
                            label={diff.charAt(0).toUpperCase() + diff.slice(1)}
                            active={selectedDifficulty === diff}
                            onClick={() => onDifficultyChange(selectedDifficulty === diff ? null : diff)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">Time</Label>
                <div className="flex flex-wrap gap-2">
                    <Tag
                        label="Any"
                        active={selectedTime === null}
                        onClick={() => onTimeChange(null)}
                    />
                    {times.map((time) => (
                        <Tag
                            key={time}
                            label={time}
                            active={selectedTime === time}
                            onClick={() => onTimeChange(selectedTime === time ? null : time)}
                        />
                    ))}
                </div>
            </div>
        </GlassPanel>
    );
}
