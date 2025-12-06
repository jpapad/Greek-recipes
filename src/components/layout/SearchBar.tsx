"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
 

interface Recipe {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  category: string;
  time_minutes: number;
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await response.json();
          setResults(data.recipes || []);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop - starts below navbar */}
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={() => setIsOpen(false)} />
          
          {/* Search Panel */}
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[70] px-4">
            <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <form onSubmit={handleSubmit} className="p-4 border-b border-border/50">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Αναζήτηση συνταγών..."
                    className="w-full pl-12 pr-12 py-3 bg-transparent text-lg focus:outline-none"
                    autoFocus
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {loading && (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
                  </div>
                )}

                {!loading && query.length >= 2 && results.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    Δεν βρέθηκαν αποτελέσματα για "{query}"
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="divide-y divide-border/50">
                    {results.slice(0, 5).map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/recipes/${recipe.slug}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recipe.image_url || '/placeholder-recipe.jpg'}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{recipe.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className="capitalize">{recipe.category}</span>
                            <span>•</span>
                            <span>{recipe.time_minutes} λεπτά</span>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {results.length > 5 && (
                      <Link
                        href={`/recipes?search=${encodeURIComponent(query)}`}
                        onClick={() => {
                          setIsOpen(false);
                          setQuery("");
                        }}
                        className="block p-4 text-center text-primary hover:bg-muted/50 transition-colors font-medium"
                      >
                        Δείτε όλα τα {results.length} αποτελέσματα →
                      </Link>
                    )}
                  </div>
                )}

                {query.length > 0 && query.length < 2 && (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Πληκτρολογήστε τουλάχιστον 2 χαρακτήρες...
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
