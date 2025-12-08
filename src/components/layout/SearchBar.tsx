"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && mounted) {
      // Small timeout to ensure Portal is rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mounted]);

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

  const searchModalContent = (
    <>
      {/* Backdrop - starts below navbar */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={() => setIsOpen(false)}
        style={{ top: '0px' }}
      />

      {/* Search Panel */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-4" style={{ zIndex: 10000 }}>
        <div className="bg-white dark:bg-black border-2 border-orange-500 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden text-black dark:text-white">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Αναζήτηση συνταγών..."
                className="w-full pl-16 pr-12 py-4 bg-transparent text-xl font-medium focus:outline-none text-black dark:text-white placeholder:text-gray-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
          </form>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto bg-white dark:bg-black">
            {loading && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mx-auto" />
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Δεν βρέθηκαν αποτελέσματα για "{query}"
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {results.slice(0, 5).map((recipe) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={recipe.image_url || '/placeholder-recipe.jpg'}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate text-black dark:text-white text-lg">{recipe.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
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
                    className="block p-4 text-center text-white bg-orange-500 hover:bg-orange-600 transition-colors font-medium border-t border-gray-100 dark:border-gray-800"
                  >
                    Δείτε όλα τα {results.length} αποτελέσματα →
                  </Link>
                )}
              </div>
            )}

            {query.length > 0 && query.length < 2 && (
              <div className="p-8 text-center text-gray-500 text-sm">
                Πληκτρολογήστε τουλάχιστον 2 χαρακτήρες...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

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

      {/* Search Modal Portal */}
      {isOpen && mounted && createPortal(searchModalContent, document.body)}
    </div>
  );
}
