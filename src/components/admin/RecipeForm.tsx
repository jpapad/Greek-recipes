"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecipe, updateRecipe } from "@/lib/api";
import { Recipe, Region } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Save } from "lucide-react";

interface RecipeFormProps {
    recipe?: Recipe;
    regions: Region[];
}

export function RecipeForm({ recipe, regions }: RecipeFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: recipe?.title || "",
        slug: recipe?.slug || "",
        region_id: recipe?.region_id || "",
        short_description: recipe?.short_description || "",
        time_minutes: recipe?.time_minutes || 30,
        difficulty: recipe?.difficulty || "medium",
        servings: recipe?.servings || 4,
        image_url: recipe?.image_url || "",
        category: recipe?.category || "",
    });

    const [ingredients, setIngredients] = useState<string[]>(
        recipe?.ingredients || [""]
    );

    const [steps, setSteps] = useState<string[]>(
        Array.isArray(recipe?.steps) ? recipe.steps : [""]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const recipeData = {
            ...formData,
            ingredients: ingredients.filter(i => i.trim() !== ""),
            steps: steps.filter(s => s.trim() !== ""),
        };

        try {
            if (recipe?.id) {
                await updateRecipe(recipe.id, recipeData);
            } else {
                await createRecipe(recipeData as any);
            }
            router.push("/admin/recipes");
            router.refresh();
        } catch (error) {
            alert("Failed to save recipe");
            setIsSubmitting(false);
        }
    };

    const addIngredient = () => setIngredients([...ingredients, ""]);
    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };
    const updateIngredient = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addStep = () => setSteps([...steps, ""]);
    const removeStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };
    const updateStep = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    return (
        <form onSubmit={handleSubmit}>
            <GlassPanel className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="region">Region *</Label>
                        <select
                            id="region"
                            value={formData.region_id}
                            onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            required
                        >
                            <option value="">Select a region</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label htmlFor="time">Time (minutes) *</Label>
                        <Input
                            id="time"
                            type="number"
                            value={formData.time_minutes}
                            onChange={(e) => setFormData({ ...formData, time_minutes: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="difficulty">Difficulty *</Label>
                        <select
                            id="difficulty"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            required
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="servings">Servings *</Label>
                        <Input
                            id="servings"
                            type="number"
                            value={formData.servings}
                            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="image">Image URL *</Label>
                        <Input
                            id="image"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                        id="description"
                        value={formData.short_description}
                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        rows={3}
                    />
                </div>

                {/* Ingredients */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label>Ingredients *</Label>
                        <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" /> Add Ingredient
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={ingredient}
                                    onChange={(e) => updateIngredient(index, e.target.value)}
                                    placeholder={`Ingredient ${index + 1}`}
                                />
                                {ingredients.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label>Steps *</Label>
                        <Button type="button" onClick={addStep} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" /> Add Step
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg font-bold">
                                    {index + 1}
                                </div>
                                <Textarea
                                    value={step}
                                    onChange={(e) => updateStep(index, e.target.value)}
                                    placeholder={`Step ${index + 1}`}
                                    rows={2}
                                />
                                {steps.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeStep(index)}
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        <Save className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Saving..." : recipe ? "Update Recipe" : "Create Recipe"}
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </GlassPanel>
        </form>
    );
}
