"use client";

import { useShoppingList } from "@/context/ShoppingListContext";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare, Square, ShoppingCart, ChefHat, Download, Plus, Minus, CheckCheck } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, IngredientCategory } from "@/lib/ingredientCategories";
import { exportShoppingListToPDF } from "@/lib/pdfExport";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function ShoppingListPage() {
    const { t } = useTranslations();
    const { items, toggleItem, toggleCategory, removeItem, clearList, clearChecked, updateQuantity } = useShoppingList();
    const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(new Set(Object.keys(CATEGORIES) as IngredientCategory[]));

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<IngredientCategory, typeof items>);

    const toggleCategoryExpand = (category: IngredientCategory) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const handleExportPDF = () => {
        exportShoppingListToPDF(items);
    };

    const categoryOrder: IngredientCategory[] = ['produce', 'dairy', 'meat', 'seafood', 'pantry', 'spices', 'other'];

    return (
        <div className="space-y-8 pt-24">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">{t('ShoppingList.title')}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('ShoppingList.description')}
                </p>
            </GlassPanel>

            {items.length > 0 ? (
                <div className="space-y-6">
                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 justify-end">
                        <Button 
                            variant="outline" 
                            onClick={handleExportPDF}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Εξαγωγή PDF
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={clearChecked}
                            className="gap-2"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Καθαρισμός Επιλεγμένων
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={clearList}
                            className="gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Καθαρισμός Όλων
                        </Button>
                    </div>

                    {/* Categories */}
                    {categoryOrder.map(categoryKey => {
                        const categoryItems = groupedItems[categoryKey];
                        if (!categoryItems || categoryItems.length === 0) return null;

                        const category = CATEGORIES[categoryKey];
                        const allChecked = categoryItems.every(item => item.checked);
                        const someChecked = categoryItems.some(item => item.checked);
                        const isExpanded = expandedCategories.has(categoryKey);

                        return (
                            <GlassPanel key={categoryKey} className="overflow-hidden">
                                {/* Category Header */}
                                <div 
                                    className="p-4 bg-white/20 border-b border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
                                    onClick={() => toggleCategoryExpand(categoryKey)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{category.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold">{category.label}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {categoryItems.length} προϊόντα
                                                    {someChecked && ` • ${categoryItems.filter(i => i.checked).length} επιλεγμένα`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCategory(categoryKey);
                                                }}
                                                className="gap-2"
                                            >
                                                {allChecked ? (
                                                    <>
                                                        <CheckSquare className="w-4 h-4" />
                                                        Αποεπιλογή Όλων
                                                    </>
                                                ) : (
                                                    <>
                                                        <Square className="w-4 h-4" />
                                                        Επιλογή Όλων
                                                    </>
                                                )}
                                            </Button>
                                            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Items */}
                                {isExpanded && (
                                    <div className="p-4 space-y-2">
                                        {categoryItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/20 transition-colors group"
                                            >
                                                <div className="flex items-center gap-3 flex-grow">
                                                    {/* Checkbox */}
                                                    <button
                                                        onClick={() => toggleItem(item.id)}
                                                        className="flex-shrink-0"
                                                    >
                                                        {item.checked ? (
                                                            <CheckSquare className="w-5 h-5 text-primary" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-muted-foreground" />
                                                        )}
                                                    </button>

                                                    {/* Quantity controls */}
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>

                                                    {/* Item name */}
                                                    <div className="flex-grow">
                                                        <span
                                                            className={`text-lg ${
                                                                item.checked
                                                                    ? "line-through text-muted-foreground"
                                                                    : "text-foreground"
                                                            }`}
                                                        >
                                                            {item.name}
                                                        </span>
                                                        {item.recipeTitle && (
                                                            <p className="text-sm text-muted-foreground">
                                                                από: {item.recipeTitle}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Delete button */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </GlassPanel>
                        );
                    })}

                    {/* Summary */}
                    <GlassPanel className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold">Σύνολο</h3>
                                <p className="text-sm text-muted-foreground">
                                    {items.length} προϊόντα • {items.filter(i => !i.checked).length} απομένουν
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">
                                    {Math.round((items.filter(i => i.checked).length / items.length) * 100)}%
                                </div>
                                <p className="text-sm text-muted-foreground">Ολοκληρώθηκε</p>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            ) : (
                <GlassPanel className="p-16 text-center flex flex-col items-center justify-center gap-6 min-h-[400px]">
                    <div className="relative">
                        <ShoppingCart className="w-24 h-24 text-muted-foreground/20" />
                        <ChefHat className="w-12 h-12 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Η λίστα αγορών σας είναι άδεια</h2>
                        <p className="text-lg text-muted-foreground">
                            Ξεκινήστε να προσθέτετε υλικά από τις αγαπημένες σας συνταγές!
                        </p>
                    </div>
                    <Button asChild size="lg" className="rounded-full mt-4">
                        <Link href="/recipes">Περιήγηση Συνταγών</Link>
                    </Button>
                </GlassPanel>
            )}
        </div>
    );
}
