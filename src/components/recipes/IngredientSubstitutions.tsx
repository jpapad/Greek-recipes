"use client";

import { useState, useMemo } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Search, ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Substitution {
    id: string;
    ingredient_name: string;
    substitute_name: string;
    substitute_ratio: string;
    notes?: string;
    category: string;
}

// Mock data - replace with Supabase query
const mockSubstitutions: Substitution[] = [
    { id: '1', ingredient_name: 'feta cheese', substitute_name: 'ricotta cheese', substitute_ratio: '1:1', notes: 'Use salted ricotta for closer flavor', category: 'dairy' },
    { id: '2', ingredient_name: 'feta cheese', substitute_name: 'goat cheese', substitute_ratio: '1:1', notes: 'Tangier flavor, similar texture', category: 'dairy' },
    { id: '3', ingredient_name: 'olive oil', substitute_name: 'butter', substitute_ratio: '3:4', notes: 'Use 3/4 cup butter for 1 cup oil', category: 'oils' },
    { id: '4', ingredient_name: 'fresh oregano', substitute_name: 'dried oregano', substitute_ratio: '3:1', notes: '1 tbsp fresh = 1 tsp dried', category: 'herbs' },
    { id: '5', ingredient_name: 'greek yogurt', substitute_name: 'sour cream', substitute_ratio: '1:1', notes: 'Similar consistency', category: 'dairy' },
    { id: '6', ingredient_name: 'lamb', substitute_name: 'beef', substitute_ratio: '1:1', notes: 'Similar cooking methods', category: 'proteins' },
    { id: '7', ingredient_name: 'honey', substitute_name: 'maple syrup', substitute_ratio: '1:1', notes: 'Vegan sweetener option', category: 'vegan' },
];

interface IngredientSubstitutionsProps {
    ingredients?: string[];
}

export function IngredientSubstitutions({ ingredients = [] }: IngredientSubstitutionsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = ['all', 'dairy', 'oils', 'herbs', 'vegetables', 'grains', 'proteins', 'vegan'];

    const filteredSubstitutions = useMemo(() => {
        let results = mockSubstitutions;

        // Filter by category
        if (selectedCategory && selectedCategory !== 'all') {
            results = results.filter(s => s.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(s => 
                s.ingredient_name.toLowerCase().includes(query) ||
                s.substitute_name.toLowerCase().includes(query)
            );
        }

        // Prioritize ingredients from recipe
        if (ingredients.length > 0) {
            const recipeIngredients = ingredients.map(i => i.toLowerCase());
            results.sort((a, b) => {
                const aMatch = recipeIngredients.some(ri => ri.includes(a.ingredient_name.toLowerCase()));
                const bMatch = recipeIngredients.some(ri => ri.includes(b.ingredient_name.toLowerCase()));
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
            });
        }

        return results;
    }, [searchQuery, selectedCategory, ingredients]);

    return (
        <GlassPanel className="p-6 space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-2">Ingredient Substitutions</h3>
                <p className="text-sm text-muted-foreground">
                    Find alternative ingredients for dietary needs or availability
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat === 'all' ? null : cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            (cat === 'all' && !selectedCategory) || selectedCategory === cat
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-white/20 hover:bg-white/30'
                        }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Results */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSubstitutions.length > 0 ? (
                    filteredSubstitutions.map((sub) => (
                        <div
                            key={sub.id}
                            className="p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium">{sub.ingredient_name}</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-primary">{sub.substitute_name}</span>
                                <Badge variant="outline" className="ml-auto text-xs">
                                    {sub.substitute_ratio}
                                </Badge>
                            </div>
                            {sub.notes && (
                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <p>{sub.notes}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No substitutions found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                )}
            </div>
        </GlassPanel>
    );
}
