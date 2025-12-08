"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  Filter,
  Clock,
  ChefHat,
  Utensils,
  MapPin,
  Plus,
  Sparkles
} from "lucide-react";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { getRecipes, getRegions } from "@/lib/api";
import type { Recipe, Region } from "@/lib/types";
import { flattenIngredients } from "@/lib/recipeHelpers";

export default function AdvancedSearchPage() {
  const searchParams = useSearchParams();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");

  // Filter state
  const [showFilters, setShowFilters] = useState(true);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isDairyFree, setIsDairyFree] = useState(false);

  // Data state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"title" | "ingredients">("title");

  // Initialize from URL params
  useEffect(() => {
    const mode = searchParams.get("mode");
    const urlIngredients = searchParams.getAll("ingredient");

    if (mode === "ingredients" && urlIngredients.length > 0) {
      setSearchMode("ingredients");
      setIngredients(urlIngredients);
    }
  }, [searchParams]);

  useEffect(() => {
    loadRegions();
    performSearch();
  }, [ingredients, searchMode]);

  async function loadRegions() {
    const data = await getRegions();
    setRegions(data);
  }

  async function performSearch() {
    setLoading(true);
    try {
      let allRecipes = await getRecipes({
        search: searchMode === "title" ? searchQuery : undefined,
        category: category || undefined,
        difficulty: difficulty as "easy" | "medium" | "hard" | undefined,
      });

      // Filter by region
      if (regionId) {
        allRecipes = allRecipes.filter((r) => r.region_id === regionId);
      }

      // Filter by max time
      if (maxTime) {
        allRecipes = allRecipes.filter((r) => r.time_minutes <= maxTime);
      }

      // Filter by dietary preferences
      if (isVegetarian) {
        allRecipes = allRecipes.filter((r) => r.is_vegetarian);
      }
      if (isVegan) {
        allRecipes = allRecipes.filter((r) => r.is_vegan);
      }
      if (isGlutenFree) {
        allRecipes = allRecipes.filter((r) => r.is_gluten_free);
      }
      if (isDairyFree) {
        allRecipes = allRecipes.filter((r) => r.is_dairy_free);
      }

      // Filter by ingredients (if in ingredient search mode)
      if (searchMode === "ingredients" && ingredients.length > 0) {
        allRecipes = allRecipes.filter((recipe) => {
          if (!recipe.ingredients || recipe.ingredients.length === 0) return false;

          const recipeIngredients = flattenIngredients(recipe.ingredients).map((ing) =>
            ing.toLowerCase()
          );

          // Check if recipe contains ALL specified ingredients
          return ingredients.every((ing) =>
            recipeIngredients.some((recipeIng) =>
              recipeIng.includes(ing.toLowerCase())
            )
          );
        });
      }

      setRecipes(allRecipes);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  function addIngredient() {
    const trimmed = currentIngredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setCurrentIngredient("");
    }
  }

  function removeIngredient(ing: string) {
    setIngredients(ingredients.filter((i) => i !== ing));
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (searchMode === "ingredients") {
        addIngredient();
      } else {
        performSearch();
      }
    }
  }

  function clearAllFilters() {
    setSearchQuery("");
    setIngredients([]);
    setCurrentIngredient("");
    setMaxTime(null);
    setDifficulty(null);
    setCategory(null);
    setRegionId(null);
    setSearchMode("title");
    setIsVegetarian(false);
    setIsVegan(false);
    setIsGlutenFree(false);
    setIsDairyFree(false);
  }

  const activeFiltersCount = [
    searchQuery,
    ingredients.length > 0,
    maxTime,
    difficulty,
    category,
    regionId,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isDairyFree,
  ].filter(Boolean).length;

  const categories = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Salad",
    "Soup",
    "Breakfast",
    "Snack",
  ];

  return (
    <div className="min-h-screen pt-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-2 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-1">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-orange-400 bg-clip-text text-transparent leading-tight">
              Advanced Search
            </h1>
          </div>

          {/* Search Mode Toggle */}
          <div className="flex justify-center gap-2 mb-2">
            <Button
              variant={searchMode === "title" ? "default" : "outline"}
              onClick={() => setSearchMode("title")}
              className="gap-2"
            >
              <Search className="w-4 h-4" />
              Αναζήτηση τίτλου
            </Button>
            <Button
              variant={searchMode === "ingredients" ? "default" : "outline"}
              onClick={() => setSearchMode("ingredients")}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Αναζήτηση συστατικών
            </Button>
          </div>

          {/* Main Search Box */}
          <GlassPanel className="p-4 max-w-4xl mx-auto">
            {searchMode === "title" ? (
              <div className="flex gap-3">
                <Input
                  placeholder="Ψάξτε για συνταγές..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="text-lg h-14"
                />
                <Button onClick={performSearch} size="lg" className="px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Αναζήτηση
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex gap-3 mb-4">
                  <Input
                    placeholder="Προσθέστε συστατικό (π.χ. ντομάτα, φέτα)..."
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="text-lg h-14"
                  />
                  <Button onClick={addIngredient} size="lg" className="px-8">
                    <Plus className="w-5 h-5 mr-2" />
                    Προσθήκη
                  </Button>
                </div>

                {/* Ingredients Tags */}
                {ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ingredients.map((ing) => (
                      <Badge
                        key={ing}
                        variant="secondary"
                        className="text-base px-4 py-2 gap-2 cursor-pointer hover:bg-destructive/20"
                        onClick={() => removeIngredient(ing)}
                      >
                        {ing}
                        <X className="w-4 h-4" />
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  onClick={performSearch}
                  size="lg"
                  className="w-full"
                  disabled={ingredients.length === 0}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Βρες συνταγές με αυτά τα συστατικά ({ingredients.length})
                </Button>
              </div>
            )}
          </GlassPanel>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4"
          >
            <Filter className="w-4 h-4 mr-2" />
            Φίλτρα {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>

          {showFilters && (
            <GlassPanel className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Max Time Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Clock className="w-4 h-4" />
                    Μέγιστος χρόνος
                  </label>
                  <div className="space-y-2">
                    {[15, 30, 45, 60, 90].map((time) => (
                      <button
                        key={time}
                        onClick={() => setMaxTime(maxTime === time ? null : time)}
                        className={`w-full px-4 py-2 rounded-lg border transition-all ${maxTime === time
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                          }`}
                      >
                        ≤ {time} λεπτά
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <ChefHat className="w-4 h-4" />
                    Δυσκολία
                  </label>
                  <div className="space-y-2">
                    {["easy", "medium", "hard"].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(difficulty === diff ? null : diff)}
                        className={`w-full px-4 py-2 rounded-lg border transition-all ${difficulty === diff
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                          }`}
                      >
                        {diff === "easy" && "Εύκολο"}
                        {diff === "medium" && "Μέτριο"}
                        {diff === "hard" && "Δύσκολο"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Utensils className="w-4 h-4" />
                    Κατηγορία
                  </label>
                  <select
                    value={category || ""}
                    onChange={(e) => setCategory(e.target.value || null)}
                    className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <option value="">Όλες</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Region Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <MapPin className="w-4 h-4" />
                    Περιοχή
                  </label>
                  <select
                    value={regionId || ""}
                    onChange={(e) => setRegionId(e.target.value || null)}
                    className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <option value="">Όλες</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dietary Filters */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    🥗 Διατροφικά
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVegetarian}
                        onChange={(e) => setIsVegetarian(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20"
                      />
                      <span className="text-sm">Χορτοφαγικό</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVegan}
                        onChange={(e) => setIsVegan(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20"
                      />
                      <span className="text-sm">Vegan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGlutenFree}
                        onChange={(e) => setIsGlutenFree(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20"
                      />
                      <span className="text-sm">Χωρίς γλουτένη</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDairyFree}
                        onChange={(e) => setIsDairyFree(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20"
                      />
                      <span className="text-sm">Χωρίς γαλακτοκομικά</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button onClick={performSearch} className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Εφαρμογή φίλτρων
                </Button>
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Καθαρισμός
                </Button>
              </div>
            </GlassPanel>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            {loading ? (
              "Αναζήτηση..."
            ) : (
              <>
                Βρέθηκαν {recipes.length} συνταγές
                {searchMode === "ingredients" && ingredients.length > 0 && (
                  <span className="text-muted-foreground text-lg ml-2">
                    με {ingredients.join(", ")}
                  </span>
                )}
              </>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <GlassPanel className="p-16 text-center">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Δεν βρέθηκαν συνταγές</h3>
            <p className="text-muted-foreground mb-6">
              Δοκιμάστε διαφορετικά φίλτρα ή συστατικά
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Καθαρισμός φίλτρων
            </Button>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
