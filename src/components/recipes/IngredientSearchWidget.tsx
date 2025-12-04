"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Sparkles, Plus, X, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function IngredientSearchWidget() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");

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

  function searchRecipes() {
    // Navigate to advanced search with ingredient params
    const params = new URLSearchParams();
    params.set("mode", "ingredients");
    ingredients.forEach((ing) => params.append("ingredient", ing));
    router.push(`/recipes/search?${params.toString()}`);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      addIngredient();
    }
  }

  return (
    <GlassPanel className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold">Τι έχεις στο ψυγείο;</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Προσθέστε συστατικά που έχετε και βρείτε τέλειες συνταγές
      </p>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Προσθέστε συστατικό..."
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={addIngredient} size="icon" variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {ingredients.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ing) => (
              <Badge
                key={ing}
                variant="secondary"
                className="px-3 py-1 gap-2 cursor-pointer hover:bg-destructive/20"
                onClick={() => removeIngredient(ing)}
              >
                {ing}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>

          <Button onClick={searchRecipes} className="w-full gap-2">
            <Search className="w-4 h-4" />
            Βρες συνταγές ({ingredients.length} συστατικά)
          </Button>
        </>
      )}
    </GlassPanel>
  );
}
