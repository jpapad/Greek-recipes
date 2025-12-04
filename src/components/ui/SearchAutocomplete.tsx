"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Recipe } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

type SearchRecipe = Pick<Recipe, 'id' | 'title' | 'slug' | 'image_url' | 'category' | 'time_minutes' | 'difficulty'>;

interface SearchAutocompleteProps {
    placeholder?: string;
    className?: string;
}

export function SearchAutocomplete({ 
    placeholder = "Search recipes...",
    className 
}: SearchAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchRecipe[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const searchRecipes = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('recipes')
                    .select('id, title, slug, image_url, category, time_minutes, difficulty')
                    .ilike('title', `%${query}%`)
                    .limit(6);

                if (error) throw error;
                setResults(data || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchRecipes, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, results.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    router.push(`/recipes/${results[selectedIndex].slug}`);
                    setIsOpen(false);
                    setQuery("");
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleSelectRecipe = (slug: string) => {
        router.push(`/recipes/${slug}`);
        setIsOpen(false);
        setQuery("");
    };

    const handleClear = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={dropdownRef} className={cn("relative", className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 rounded-full border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-muted-foreground">
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {results.map((recipe, index) => (
                                <button
                                    key={recipe.id}
                                    onClick={() => handleSelectRecipe(recipe.slug)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 hover:bg-primary/10 transition-colors text-left",
                                        selectedIndex === index && "bg-primary/10"
                                    )}
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={recipe.image_url || '/placeholder-recipe.jpg'}
                                            alt={recipe.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{recipe.title}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                            {recipe.category && <span>{recipe.category}</span>}
                                            {recipe.time_minutes && <span>• {recipe.time_minutes}m</span>}
                                            {recipe.difficulty && <span>• {recipe.difficulty}</span>}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </>
                    ) : query.length >= 2 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>No recipes found for "{query}"</p>
                            <p className="text-xs mt-2">Try a different search term</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
