"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Recipe } from "@/lib/types";

interface ImportRecipeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ImportRecipeModal({ open, onOpenChange }: ImportRecipeModalProps) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [importedRecipe, setImportedRecipe] = useState<Partial<Recipe> | null>(null);
    const router = useRouter();

    const handleImport = async () => {
        if (!url.trim()) {
            setError("Please enter a URL");
            return;
        }

        setLoading(true);
        setError(null);
        setImportedRecipe(null);

        try {
            const response = await fetch("/api/import-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.error || "Failed to import recipe";
                const details = data.details ? `\n\nDetails:\n${data.details}` : "";
                throw new Error(errorMsg + details);
            }

            setImportedRecipe(data.recipe);
        } catch (err: any) {
            console.error("Import error:", err);
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleUseRecipe = () => {
        if (!importedRecipe) return;

        // Store in sessionStorage to pass to new recipe page
        sessionStorage.setItem("importedRecipe", JSON.stringify(importedRecipe));

        // Navigate to new recipe page
        router.push("/admin/recipes/new");

        // Close modal
        onOpenChange(false);

        // Reset state
        setUrl("");
        setImportedRecipe(null);
        setError(null);
    };

    const handleClose = () => {
        onOpenChange(false);
        setUrl("");
        setImportedRecipe(null);
        setError(null);
    };

    const getIngredientCount = (ingredients: any): number => {
        if (!ingredients) return 0;
        if (Array.isArray(ingredients)) {
            if (ingredients.length === 0) return 0;
            if (typeof ingredients[0] === "string") return ingredients.length;
            return ingredients.reduce((acc, group) => acc + (group.items?.length || 0), 0);
        }
        return 0;
    };

    const getStepCount = (steps: any): number => {
        if (!steps) return 0;
        if (Array.isArray(steps)) {
            if (steps.length === 0) return 0;
            if (typeof steps[0] === "string") return steps.length;
            return steps.reduce((acc, group) => acc + (group.items?.length || 0), 0);
        }
        return 0;
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Import Recipe from URL
                    </DialogTitle>
                    <DialogDescription>
                        Paste a recipe URL to automatically import its details. Works with most recipe websites.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    {/* URL Input */}
                    <div className="space-y-2">
                        <label htmlFor="recipe-url" className="text-sm font-medium">
                            Recipe URL
                        </label>
                        <div className="flex gap-2">
                            <Input
                                id="recipe-url"
                                type="url"
                                placeholder="https://example.com/recipe"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                disabled={loading}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !loading) {
                                        handleImport();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleImport}
                                disabled={loading || !url.trim()}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    "Import"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium">Import Failed</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Success State - Preview */}
                    {importedRecipe && (
                        <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-green-900">Recipe Imported Successfully!</p>
                                    <p className="text-sm text-green-700 mt-1">
                                        Review the details below and click "Use This Recipe" to continue.
                                    </p>
                                </div>
                            </div>

                            {/* Recipe Preview */}
                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex items-center justify-between p-2 bg-white rounded">
                                    <span className="font-medium">Title:</span>
                                    <span className="text-gray-700">{importedRecipe.title}</span>
                                </div>

                                {importedRecipe.short_description && (
                                    <div className="p-2 bg-white rounded">
                                        <span className="font-medium">Description:</span>
                                        <p className="text-gray-700 mt-1 text-xs">{importedRecipe.short_description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center justify-between p-2 bg-white rounded">
                                        <span className="font-medium">Ingredients:</span>
                                        <span className="text-gray-700">{getIngredientCount(importedRecipe.ingredients)}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2 bg-white rounded">
                                        <span className="font-medium">Steps:</span>
                                        <span className="text-gray-700">{getStepCount(importedRecipe.steps)}</span>
                                    </div>

                                    {importedRecipe.time_minutes && (
                                        <div className="flex items-center justify-between p-2 bg-white rounded">
                                            <span className="font-medium">Time:</span>
                                            <span className="text-gray-700">{importedRecipe.time_minutes} min</span>
                                        </div>
                                    )}

                                    {importedRecipe.servings && (
                                        <div className="flex items-center justify-between p-2 bg-white rounded">
                                            <span className="font-medium">Servings:</span>
                                            <span className="text-gray-700">{importedRecipe.servings}</span>
                                        </div>
                                    )}
                                </div>

                                {importedRecipe.source_attribution && (
                                    <div className="p-2 bg-white rounded text-xs text-gray-500">
                                        <span className="font-medium">Source:</span> {importedRecipe.source_attribution}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                                <Button
                                    onClick={handleUseRecipe}
                                    className="flex-1"
                                    size="lg"
                                >
                                    Use This Recipe
                                </Button>
                                <Button
                                    onClick={() => {
                                        setImportedRecipe(null);
                                        setUrl("");
                                    }}
                                    variant="outline"
                                    size="lg"
                                >
                                    Import Another
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Help Text */}
                    {!importedRecipe && !loading && !error && (
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p>💡 <strong>Tip:</strong> Works best with popular recipe websites like:</p>
                            <ul className="list-disc list-inside ml-3 space-y-0.5">
                                <li>AllRecipes, Food Network, BBC Good Food</li>
                                <li>Greek sites: akispetretzikis.com, argiro.gr, cookpad.com</li>
                                <li>Many international recipe sites</li>
                            </ul>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
