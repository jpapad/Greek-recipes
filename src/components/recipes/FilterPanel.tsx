"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Label } from "@/components/ui/label";
import { Tag } from "@/components/ui/Tag";
import { useTranslations } from "next-intl";

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
    const t = useTranslations();

    const difficulties = ["easy", "medium", "hard"];
    const times = [
        { key: "under30m", label: t('Filters.under30m') },
        { key: "30to60m", label: t('Filters.30to60m') },
        { key: "over60m", label: t('Filters.over60m') }
    ];
    const categories = [
        { key: "Main Dish", label: t('Filters.mainDish') },
        { key: "Salad", label: t('Filters.salad') },
        { key: "Pie", label: t('Filters.pie') },
        { key: "Dip", label: t('Filters.dip') },
        { key: "Dessert", label: t('Admin.dessert') }
    ];

    return (
        <GlassPanel className="p-6 space-y-6 bg-white/40">
            <div>
                <Label className="text-base font-semibold mb-3 block">{t('Filters.category')}</Label>
                <div className="flex flex-wrap gap-2">
                    <Tag
                        label={t('Filters.all')}
                        active={selectedCategory === null}
                        onClick={() => onCategoryChange(null)}
                    />
                    {categories.map((cat) => (
                        <Tag
                            key={cat.key}
                            label={cat.label}
                            active={selectedCategory === cat.key}
                            onClick={() => onCategoryChange(selectedCategory === cat.key ? null : cat.key)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">{t('Filters.difficulty')}</Label>
                <div className="flex flex-wrap gap-2">
                    <Tag
                        label={t('Filters.all')}
                        active={selectedDifficulty === null}
                        onClick={() => onDifficultyChange(null)}
                    />
                    {difficulties.map((diff) => (
                        <Tag
                            key={diff}
                            label={t(`Recipe.${diff}` as any)}
                            active={selectedDifficulty === diff}
                            onClick={() => onDifficultyChange(selectedDifficulty === diff ? null : diff)}
                        />
                    ))}
                </div>
            </div>

            <div>
                <Label className="text-base font-semibold mb-3 block">{t('Recipe.time')}</Label>
                <div className="flex flex-wrap gap-2">
                    <Tag
                        label={t('Filters.any')}
                        active={selectedTime === null}
                        onClick={() => onTimeChange(null)}
                    />
                    {times.map((time) => (
                        <Tag
                            key={time.key}
                            label={time.label}
                            active={selectedTime === time.key}
                            onClick={() => onTimeChange(selectedTime === time.key ? null : time.key)}
                        />
                    ))}
                </div>
            </div>
        </GlassPanel>
    );
}
