"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRecipe, updateRecipe, getRecipeBySlug, getPrefectures, getCities } from "@/lib/api";
import { Recipe, Region, Prefecture, City, IngredientGroup, StepGroup } from "@/lib/types";
import { migrateIngredientsToGroups, migrateStepsToGroups } from "@/lib/recipeHelpers";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ImageSearchModal } from "@/components/admin/ImageSearchModal";
import { GroupedIngredientsEditor } from "@/components/admin/GroupedIngredientsEditor";
import { GroupedStepsEditor } from "@/components/admin/GroupedStepsEditor";
import { Plus, X, Save, Search, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

interface RecipeFormProps {
    recipe?: Recipe;
    regions: Region[];
}

export function RecipeForm({ recipe, regions }: RecipeFormProps) {
    const t = useTranslations();
    const router = useRouter();
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slugError, setSlugError] = useState("");
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [filteredPrefectures, setFilteredPrefectures] = useState<Prefecture[]>([]);
    const [filteredCities, setFilteredCities] = useState<City[]>([]);
    const [imageSearchOpen, setImageSearchOpen] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const [formData, setFormData] = useState({
        title: recipe?.title || "",
        slug: recipe?.slug || "",
        region_id: recipe?.region_id || "",
        prefecture_id: recipe?.prefecture_id || "",
        city_id: recipe?.city_id || "",
        short_description: recipe?.short_description || "",
        time_minutes: recipe?.time_minutes || 30,
        difficulty: recipe?.difficulty || "medium",
        servings: recipe?.servings || 4,
        image_url: recipe?.image_url || "",
        category: recipe?.category || "",
        is_vegetarian: recipe?.is_vegetarian || false,
        is_vegan: recipe?.is_vegan || false,
        is_gluten_free: recipe?.is_gluten_free || false,
        is_dairy_free: recipe?.is_dairy_free || false,
    });

    const [ingredientGroups, setIngredientGroups] = useState<IngredientGroup[]>(
        migrateIngredientsToGroups(recipe?.ingredients)
    );

    const [stepGroups, setStepGroups] = useState<StepGroup[]>(
        migrateStepsToGroups(recipe?.steps)
    );

    const [allergens, setAllergens] = useState<string[]>(
        recipe?.allergens || []
    );

    const allergenOptions = [
        "Nuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Fish",
        "Soy", "Sesame", "Peanuts", "Tree Nuts", "Wheat", "Milk"
    ];

    // Load prefectures and cities
    useEffect(() => {
        async function loadData() {
            const [prefecturesData, citiesData] = await Promise.all([
                getPrefectures(),
                getCities()
            ]);
            setPrefectures(prefecturesData);
            setCities(citiesData);
        }
        loadData();
    }, []);

    // Filter prefectures when region changes
    useEffect(() => {
        if (formData.region_id) {
            setFilteredPrefectures(prefectures.filter(p => p.region_id === formData.region_id));
        } else {
            setFilteredPrefectures([]);
        }
        // Reset prefecture and city when region changes
        if (!recipe) {
            setFormData(prev => ({ ...prev, prefecture_id: "", city_id: "" }));
        }
    }, [formData.region_id, prefectures, recipe]);

    // Filter cities when prefecture changes
    useEffect(() => {
        if (formData.prefecture_id) {
            setFilteredCities(cities.filter(c => c.prefecture_id === formData.prefecture_id));
        } else {
            setFilteredCities([]);
        }
        // Reset city when prefecture changes
        if (!recipe) {
            setFormData(prev => ({ ...prev, city_id: "" }));
        }
    }, [formData.prefecture_id, cities, recipe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSlugError("");

        // Validate slug uniqueness
        const existingRecipe = await getRecipeBySlug(formData.slug);
        if (existingRecipe && existingRecipe.id !== recipe?.id) {
            setSlugError("This slug already exists. Please use a different one.");
            setIsSubmitting(false);
            showToast("Slug already exists", "error");
            return;
        }

        // Clean up groups: remove empty items
        const cleanedIngredients = ingredientGroups.map(group => ({
            ...group,
            items: group.items.filter(item => item.trim() !== '')
        })).filter(group => group.items.length > 0);

        const cleanedSteps = stepGroups.map(group => ({
            ...group,
            items: group.items.filter(item => item.trim() !== '')
        })).filter(group => group.items.length > 0);

        const recipeData: Omit<Recipe, 'id' | 'created_at'> = {
            title: formData.title,
            slug: formData.slug,
            region_id: formData.region_id || undefined,
            prefecture_id: formData.prefecture_id || undefined,
            city_id: formData.city_id || undefined,
            short_description: formData.short_description || undefined,
            steps: cleanedSteps,
            ingredients: cleanedIngredients,
            time_minutes: formData.time_minutes,
            difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
            servings: formData.servings,
            image_url: formData.image_url,
            category: formData.category || undefined,
            allergens: allergens.length > 0 ? allergens : undefined,
        };

        try {
            if (recipe?.id) {
                const result = await updateRecipe(recipe.id, recipeData);
                if (result) {
                    showToast("Recipe updated successfully!", "success");
                } else {
                    throw new Error("Failed to update recipe");
                }
            } else {
                const result = await createRecipe(recipeData);
                if (result) {
                    showToast("Recipe created successfully!", "success");
                } else {
                    throw new Error("Failed to create recipe");
                }
            }
            router.push("/admin/recipes");
            router.refresh();
        } catch (error) {
            console.error("Error saving recipe:", error);
            showToast("Failed to save recipe. Please try again.", "error");
            setIsSubmitting(false);
        }
    };



    const handleGenerateImage = async () => {
        if (!formData.title) {
            alert("Παρακαλώ εισάγετε πρώτα το όνομα της συνταγής");
            return;
        }

        setIsGeneratingImage(true);
        try {
            const response = await fetch("/api/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipeName: formData.title,
                    type: "food"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || "Image generation failed");
            }

            const data = await response.json();

            if (data.imageUrl) {
                setFormData({ ...formData, image_url: data.imageUrl });
                alert("Η εικόνα δημιουργήθηκε επιτυχώς με AI! 🎨");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Αποτυχία δημιουργίας εικόνας: ${message}`);
            console.error("Image generation error:", error);
        } finally {
            setIsGeneratingImage(false);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <GlassPanel className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="title">{t('Admin.recipeTitle')} *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="slug">{t('Admin.slug')} *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                        {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
                    </div>

                    <div>
                        <Label htmlFor="category">{t('Admin.category')}</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g. Main Dish, Dessert"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="time">{t('Admin.prepTime')} (min)</Label>
                            <Input
                                id="time"
                                type="number"
                                value={formData.time_minutes}
                                onChange={(e) => setFormData({ ...formData, time_minutes: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="servings">{t('Admin.servings')}</Label>
                            <Input
                                id="servings"
                                type="number"
                                value={formData.servings}
                                onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="difficulty">{t('Admin.difficulty')}</Label>
                            <select
                                id="difficulty"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            >
                                <option value="easy">{t('Recipe.easy')}</option>
                                <option value="medium">{t('Recipe.medium')}</option>
                                <option value="hard">{t('Recipe.hard')}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">{t('Admin.description')}</Label>
                    <Textarea
                        id="description"
                        value={formData.short_description}
                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        rows={3}
                    />
                </div>

                {/* Region/Prefecture/City Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/20 rounded-lg">
                    <div>
                        <Label htmlFor="region">{t('Admin.region')}</Label>
                        <select
                            id="region"
                            value={formData.region_id}
                            onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                            <option value="">{t('Admin.selectRegion')}</option>
                            {regions.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="prefecture">{t('Admin.prefecture')}</Label>
                        <select
                            id="prefecture"
                            value={formData.prefecture_id}
                            onChange={(e) => setFormData({ ...formData, prefecture_id: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            disabled={!formData.region_id}
                        >
                            <option value="">{t('Admin.selectPrefecture')}</option>
                            {filteredPrefectures.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="city">{t('Admin.city')}</Label>
                        <select
                            id="city"
                            value={formData.city_id}
                            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            disabled={!formData.prefecture_id}
                        >
                            <option value="">{t('Admin.selectCity')}</option>
                            {filteredCities.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dietary Info */}
                <div className="p-4 bg-white/20 rounded-lg space-y-3">
                    <Label>Dietary Information</Label>
                    <div className="flex flex-wrap gap-4">
                        {[
                            { key: 'is_vegetarian', label: 'Vegetarian' },
                            { key: 'is_vegan', label: 'Vegan' },
                            { key: 'is_gluten_free', label: 'Gluten Free' },
                            { key: 'is_dairy_free', label: 'Dairy Free' }
                        ].map((diet) => (
                            <label key={diet.key} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(formData as any)[diet.key]}
                                    onChange={(e) => setFormData({ ...formData, [diet.key]: e.target.checked })}
                                    className="rounded border-gray-300"
                                />
                                <span>{diet.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Allergens */}
                <div className="p-4 bg-white/20 rounded-lg space-y-3">
                    <Label>Allergens</Label>
                    <div className="flex flex-wrap gap-2">
                        {allergenOptions.map((allergen) => (
                            <label key={allergen} className="flex items-center gap-2 cursor-pointer bg-white/40 px-3 py-1 rounded-full">
                                <input
                                    type="checkbox"
                                    checked={allergens.includes(allergen)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setAllergens([...allergens, allergen]);
                                        } else {
                                            setAllergens(allergens.filter(a => a !== allergen));
                                        }
                                    }}
                                    className="rounded border-gray-300"
                                />
                                <span>{allergen}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <Label>{t('Admin.recipeImage')}</Label>
                    <div className="flex items-start gap-4 mt-2">
                        <div className="flex-1">
                            <ImageUpload
                                bucket="recipe-images"
                                currentImage={formData.image_url}
                                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setImageSearchOpen(true)}
                                className="gap-2"
                            >
                                <Search className="w-4 h-4" />
                                {t('Admin.searchImages')}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGenerateImage}
                                disabled={isGeneratingImage || !formData.title}
                                className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-200"
                            >
                                {isGeneratingImage ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                                ) : (
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                )}
                                {t('Admin.generateAIImage')}
                            </Button>
                        </div>
                    </div>
                    <ImageSearchModal
                        isOpen={imageSearchOpen}
                        onClose={() => setImageSearchOpen(false)}
                        onSelect={(url) => {
                            setFormData({ ...formData, image_url: url });
                            setImageSearchOpen(false);
                        }}
                        initialQuery={formData.title}
                    />
                </div>

                {/* Ingredients & Steps */}
                <div className="space-y-8">
                    <GroupedIngredientsEditor
                        groups={ingredientGroups}
                        onChange={setIngredientGroups}
                    />

                    <GroupedStepsEditor
                        groups={stepGroups}
                        onChange={setStepGroups}
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        {t('Admin.cancel')}
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? t('Admin.saving') : t('Admin.saveRecipe')}
                    </Button>
                </div>
            </GlassPanel>
        </form>
    );
}
