'use client';

import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getRecipes } from '@/lib/api';
import type { Recipe, MealType } from '@/lib/types';

interface AddRecipeToMealModalProps {
  date: Date;
  mealType: MealType;
  onSelect: (recipeId: string) => void;
  onClose: () => void;
}

export function AddRecipeToMealModal({ date, mealType, onSelect, onClose }: AddRecipeToMealModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, [search]);

  async function loadRecipes() {
    setLoading(true);
    const data = await getRecipes({ search });
    setRecipes(data.slice(0, 20));
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">Επιλογή Συνταγής</h3>
              <p className="text-sm text-muted-foreground">
                {date.toLocaleDateString('el-GR')} - {mealType}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-2xl hover:text-primary transition-colors"
            >
              ×
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Αναζήτηση συνταγής..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">Φόρτωση...</div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Δεν βρέθηκαν συνταγές
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onSelect(recipe.id)}
                  className="text-left group"
                >
                  <GlassPanel className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    {recipe.image_url && (
                      <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {recipe.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {recipe.short_description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{recipe.time_minutes} λεπτά</span>
                        <span>•</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </GlassPanel>
                </button>
              ))}
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
