"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Clock,
  TrendingUp,
  Star,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  search?: string;
  difficulty?: string;
  category?: string;
  minTime?: number;
  maxTime?: number;
  minServings?: number;
  maxServings?: number;
  sortBy?: 'newest' | 'oldest' | 'time-asc' | 'time-desc' | 'rating' | 'title';
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CATEGORIES = [
  { value: 'appetizer', label: 'Ορεκτικά' },
  { value: 'main-dish', label: 'Κυρίως Πιάτα' },
  { value: 'dessert', label: 'Γλυκά' },
  { value: 'salad', label: 'Σαλάτες' },
  { value: 'soup', label: 'Σούπες' },
  { value: 'bread', label: 'Ψωμιά' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Νεότερα Πρώτα', icon: Calendar },
  { value: 'oldest', label: 'Παλαιότερα Πρώτα', icon: Calendar },
  { value: 'time-asc', label: 'Λιγότερος Χρόνος', icon: Clock },
  { value: 'time-desc', label: 'Περισσότερος Χρόνος', icon: Clock },
  { value: 'rating', label: 'Καλύτερα Βαθμολογημένα', icon: Star },
  { value: 'title', label: 'Αλφαβητικά', icon: TrendingUp }
];

export function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => key !== 'sortBy' && filters[key as keyof FilterOptions]
  ).length;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Filter Toggle Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="gap-2 rounded-full"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Φίλτρα
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )} />
        </Button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">Ταξινόμηση:</Label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
            Καθαρισμός
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <GlassPanel className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Difficulty */}
            <div className="space-y-2">
              <Label>Δυσκολία</Label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(diff => (
                  <button
                    key={diff}
                    onClick={() => updateFilter('difficulty', filters.difficulty === diff ? undefined : diff)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all",
                      filters.difficulty === diff
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {diff === 'easy' ? 'Εύκολο' : diff === 'medium' ? 'Μέτριο' : 'Δύσκολο'}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Κατηγορία</Label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value || undefined)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Όλες</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cooking Time */}
            <div className="space-y-2">
              <Label>Χρόνος Μαγειρέματος (λεπτά)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.minTime || ''}
                  onChange={(e) => updateFilter('minTime', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Από"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  value={filters.maxTime || ''}
                  onChange={(e) => updateFilter('maxTime', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Έως"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>

            {/* Servings */}
            <div className="space-y-2">
              <Label>Μερίδες</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.minServings || ''}
                  onChange={(e) => updateFilter('minServings', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Από"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  value={filters.maxServings || ''}
                  onChange={(e) => updateFilter('maxServings', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Έως"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
              </div>
            </div>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
