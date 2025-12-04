"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AllergenBadgesProps {
  allergens?: string[];
  className?: string;
}

const allergenEmojis: Record<string, string> = {
  "Nuts": "🥜",
  "Dairy": "🥛",
  "Gluten": "🌾",
  "Eggs": "🥚",
  "Shellfish": "🦐",
  "Fish": "🐟",
  "Soy": "🫘",
  "Sesame": "🫘",
  "Peanuts": "🥜",
  "Tree Nuts": "🌰",
  "Wheat": "🌾",
  "Milk": "🥛",
};

export function AllergenBadges({ allergens, className = "" }: AllergenBadgesProps) {
  if (!allergens || allergens.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-semibold text-foreground/80">
          Αλλεργιογόνα:
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allergens.map((allergen) => (
          <Badge
            key={allergen}
            variant="destructive"
            className="gap-1 bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            <span>{allergenEmojis[allergen] || "⚠️"}</span>
            <span>{allergen}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
