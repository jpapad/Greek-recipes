'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export interface AdvancedFilters {
    search?: string;
    difficulty?: string;
    category?: string;
    minTime?: number;
    maxTime?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isDairyFree?: boolean;
    regionId?: string;
    prefectureId?: string;
    cityId?: string;
}

interface AdvancedFilterPanelProps {
    filters: AdvancedFilters;
    onFiltersChange: (filters: AdvancedFilters) => void;
    regions?: Array<{ id: string; name: string }>;
    prefectures?: Array<{ id: string; name: string; region_id: string }>;
    cities?: Array<{ id: string; name: string; prefecture_id: string }>;
}

export function AdvancedFilterPanel({
    filters,
    onFiltersChange,
    regions = [],
    prefectures = [],
    cities = []
}: AdvancedFilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const updateFilter = (key: keyof AdvancedFilters, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFiltersChange({});
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== false).length;

    const filteredPrefectures = filters.regionId
        ? prefectures.filter(p => p.region_id === filters.regionId)
        : prefectures;

    const filteredCities = filters.prefectureId
        ? cities.filter(c => c.prefecture_id === filters.prefectureId)
        : cities;

    return (
        <GlassPanel className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">Advanced Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                            {activeFilterCount} active
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-1" /> Clear
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4 mr-1" /> Hide
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4 mr-1" /> Show
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                    {/* Search */}
                    <div>
                        <Label htmlFor="search">Search in ingredients</Label>
                        <Input
                            id="search"
                            placeholder="e.g., tomato, olive oil..."
                            value={filters.search || ''}
                            onChange={(e) => updateFilter('search', e.target.value)}
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <select
                            id="difficulty"
                            value={filters.difficulty || ''}
                            onChange={(e) => updateFilter('difficulty', e.target.value)}
                            className="w-full p-2 rounded-lg border border-border bg-background"
                        >
                            <option value="">All</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            placeholder="e.g., Appetizer, Main..."
                            value={filters.category || ''}
                            onChange={(e) => updateFilter('category', e.target.value)}
                        />
                    </div>

                    {/* Time Range */}
                    <div>
                        <Label htmlFor="minTime">Min Time (minutes)</Label>
                        <Input
                            id="minTime"
                            type="number"
                            placeholder="0"
                            value={filters.minTime || ''}
                            onChange={(e) => updateFilter('minTime', e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="maxTime">Max Time (minutes)</Label>
                        <Input
                            id="maxTime"
                            type="number"
                            placeholder="120"
                            value={filters.maxTime || ''}
                            onChange={(e) => updateFilter('maxTime', e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                    </div>

                    {/* Region Filter */}
                    {regions.length > 0 && (
                        <div>
                            <Label htmlFor="region">Region</Label>
                            <select
                                id="region"
                                value={filters.regionId || ''}
                                onChange={(e) => {
                                    updateFilter('regionId', e.target.value);
                                    updateFilter('prefectureId', '');
                                    updateFilter('cityId', '');
                                }}
                                className="w-full p-2 rounded-lg border border-border bg-background"
                            >
                                <option value="">All Regions</option>
                                {regions.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Prefecture Filter */}
                    {prefectures.length > 0 && (
                        <div>
                            <Label htmlFor="prefecture">Prefecture</Label>
                            <select
                                id="prefecture"
                                value={filters.prefectureId || ''}
                                onChange={(e) => {
                                    updateFilter('prefectureId', e.target.value);
                                    updateFilter('cityId', '');
                                }}
                                disabled={!filters.regionId}
                                className="w-full p-2 rounded-lg border border-border bg-background disabled:opacity-50"
                            >
                                <option value="">All Prefectures</option>
                                {filteredPrefectures.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* City Filter */}
                    {cities.length > 0 && (
                        <div>
                            <Label htmlFor="city">City</Label>
                            <select
                                id="city"
                                value={filters.cityId || ''}
                                onChange={(e) => updateFilter('cityId', e.target.value)}
                                disabled={!filters.prefectureId}
                                className="w-full p-2 rounded-lg border border-border bg-background disabled:opacity-50"
                            >
                                <option value="">All Cities</option>
                                {filteredCities.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Dietary Tags */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <Label>Dietary Preferences</Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isVegetarian || false}
                                    onChange={(e) => updateFilter('isVegetarian', e.target.checked || undefined)}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">Vegetarian</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isVegan || false}
                                    onChange={(e) => updateFilter('isVegan', e.target.checked || undefined)}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">Vegan</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isGlutenFree || false}
                                    onChange={(e) => updateFilter('isGlutenFree', e.target.checked || undefined)}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">Gluten Free</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.isDairyFree || false}
                                    onChange={(e) => updateFilter('isDairyFree', e.target.checked || undefined)}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">Dairy Free</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </GlassPanel>
    );
}
