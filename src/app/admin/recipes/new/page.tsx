"use client";

import { useEffect, useState } from "react";
import { RecipeForm } from "@/components/admin/RecipeForm";
import { Download, X } from "lucide-react";
import type { Recipe, Region } from "@/lib/types";

export default function NewRecipePage() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [importedRecipe, setImportedRecipe] = useState<Partial<Recipe> | null>(null);
    const [showImportBanner, setShowImportBanner] = useState(false);

    useEffect(() => {
        // Load regions
        async function loadRegions() {
            const response = await fetch("/api/regions");
            const data = await response.json();
            setRegions(data);
        }
        loadRegions();

        // Check for imported recipe data
        const importedData = sessionStorage.getItem("importedRecipe");
        if (importedData) {
            try {
                const recipe = JSON.parse(importedData);
                console.log("Imported recipe data:", recipe);
                setImportedRecipe(recipe);
                setShowImportBanner(true);
                // Clear from sessionStorage
                sessionStorage.removeItem("importedRecipe");
            } catch (error) {
                console.error("Failed to parse imported recipe", error);
            }
        }
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">Add New Recipe</h1>
                <p className="text-muted-foreground">Create a new traditional Greek recipe</p>
            </div>

            {showImportBanner && importedRecipe?.source_attribution && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="font-medium text-blue-900">Imported from URL</p>
                            <p className="text-sm text-blue-700">{importedRecipe.source_attribution}</p>
                            <p className="text-xs text-blue-600 mt-1">
                                Please review and adjust the imported data before saving.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowImportBanner(false)}
                        className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <RecipeForm regions={regions} initialData={importedRecipe || undefined} />
        </div>
    );
}
