"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRecipe, updateRecipe, getRecipeBySlug, getPrefectures, getCities } from "@/lib/api";
import { Recipe, Region, Prefecture, City } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ImageSearchModal } from "@/components/admin/ImageSearchModal";
import { Plus, X, Save, Search, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "@/hooks/useTranslations";

interface RecipeFormProps {
    recipe?: Recipe;
    regions: Region[];
}

export function RecipeForm({ recipe, regions }: RecipeFormProps) {
    const { t } = useTranslations();
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

    const [ingredients, setIngredients] = useState<string[]>(
        recipe?.ingredients || [""]
    );

    const [steps, setSteps] = useState<string[]>(
        Array.isArray(recipe?.steps) ? recipe.steps : [""]
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

        const recipeData: Omit<Recipe, 'id' | 'created_at'> = {
            title: formData.title,
            slug: formData.slug,
            region_id: formData.region_id || undefined,
            prefecture_id: formData.prefecture_id || undefined,
            city_id: formData.city_id || undefined,
            short_description: formData.short_description || undefined,
            steps: steps.filter(s => s.trim() !== ""),
            ingredients: ingredients.filter(i => i.trim() !== ""),
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
                        <Label htmlFor="slug">{t('Admin.recipeSlug')} *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => {
                                setFormData({ ...formData, slug: e.target.value });
                                setSlugError("");
                            }}
                            required
                        />
                        {slugError && <p className="text-red-500 text-sm mt-1">{slugError}</p>}
                    </div>

                    <div>
                        <Label htmlFor="region">{t('Admin.region')}</Label>
                        <select
                            id="region"
                            value={formData.region_id}
                            onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                            className="w-full p-2 rounded-lg border border-border bg-background"
                        >
                            <option value="">{t('Admin.selectRegion')}</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.id}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="prefecture">{t('Admin.prefecture')}</Label>
                        <select
                            id="prefecture"
                            value={formData.prefecture_id}
                            onChange={(e) => setFormData({ ...formData, prefecture_id: e.target.value })}
                            disabled={!formData.region_id}
                            className="w-full p-2 rounded-lg border border-border bg-background disabled:opacity-50"
                        >
                            <option value="">{t('Admin.selectPrefecture')}</option>
                            {filteredPrefectures.map((prefecture) => (
                                <option key={prefecture.id} value={prefecture.id}>
                                    {prefecture.name}
                                </option>
                            ))}
                        </select>
                        {!formData.region_id && (
                            <p className="text-xs text-muted-foreground mt-1">{t('Admin.selectRegion')} first</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="city">{t('Admin.city')}</Label>
                        <select
                            id="city"
                            value={formData.city_id}
                            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                            disabled={!formData.prefecture_id}
                            className="w-full p-2 rounded-lg border border-border bg-background disabled:opacity-50"
                        >
                            <option value="">{t('Admin.selectCity')}</option>
                            {filteredCities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {!formData.prefecture_id && (
                            <p className="text-xs text-muted-foreground mt-1">{t('Admin.selectPrefecture')} first</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="category">{t('Admin.category')}</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    {/* Dietary Tags */}
                    <div className="col-span-2">
                        <Label>{t('Filters.dietary')}</Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_vegetarian}
                                    onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">{t('Admin.isVegetarian')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_vegan}
                                    onChange={(e) => setFormData({ ...formData, is_vegan: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">{t('Admin.isVegan')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_gluten_free}
                                    onChange={(e) => setFormData({ ...formData, is_gluten_free: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">{t('Admin.isGlutenFree')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_dairy_free}
                                    onChange={(e) => setFormData({ ...formData, is_dairy_free: e.target.checked })}
                                    className="w-4 h-4 rounded border-border"
                                />
                                <span className="text-sm">{t('Admin.isDairyFree')}</span>
                            </label>
                        </div>
                    </div>

                    {/* Allergens */}
                    <div>
                        <Label>Αλλεργιογόνα</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2 p-4 border border-border/50 rounded-lg bg-background/50">
                            {allergenOptions.map((allergen) => (
                                <label key={allergen} className="flex items-center gap-2 cursor-pointer">
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
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <span className="text-sm">{allergen}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="time">{t('Admin.timeMinutes')} *</Label>
                        <Input
                            id="time"
                            type="number"
                            value={formData.time_minutes}
                            onChange={(e) => setFormData({ ...formData, time_minutes: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="difficulty">{t('Admin.difficulty')} *</Label>
                        <select
                            id="difficulty"
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                            className="w-full p-2 rounded-lg border border-border bg-background"
                            required
                        >
                            <option value="easy">{t('Recipe.easy')}</option>
                            <option value="medium">{t('Recipe.medium')}</option>
                            <option value="hard">{t('Recipe.hard')}</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="servings">{t('Admin.servings')} *</Label>
                        <Input
                            id="servings"
                            type="number"
                            value={formData.servings}
                            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="image">{t('Admin.recipeImage')} *</Label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setImageSearchOpen(true)}
                                    className="gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    {t('Admin.searchImages')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerateImage}
                                    disabled={isGeneratingImage || !formData.title}
                                    className="gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20"
                                >
                                    {isGeneratingImage ? (
                                        <>
                                            <Sparkles className="w-4 h-4 animate-pulse" />
                                            {t('Admin.loading')}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            {t('Admin.generateImage')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                        <ImageUpload
                            onUpload={(url: string) => setFormData({ ...formData, image_url: url })}
                        />
                        {formData.image_url && (
                            <div className="mt-4">
                                <img 
                                    src={formData.image_url} 
                                    alt="Recipe preview" 
                                    className="w-full h-48 object-cover rounded-lg border-2 border-primary/20"
                                    onError={(e) => {
                                        console.error("Image failed to load:", formData.image_url);
                                    }}
                                />
                                <p className="text-xs text-muted-foreground mt-2 truncate">
                                    {formData.image_url}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">{t('Admin.shortDescription')}</Label>
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
                        <Label>{t('Admin.ingredients')} *</Label>
                        <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" /> {t('Admin.addIngredient')}
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
                        <Label>{t('Admin.steps')} *</Label>
                        <Button type="button" onClick={addStep} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" /> {t('Admin.addStep')}
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
                        {isSubmitting ? t('Admin.saving') : recipe ? t('Admin.editRecipe') : t('Admin.createRecipe')}
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        {t('Admin.cancel')}
                    </Button>
                </div>
            </GlassPanel>

            {/* Image Search Modal */}
            <ImageSearchModal
                isOpen={imageSearchOpen}
                onClose={() => setImageSearchOpen(false)}
                onSelect={(url) => setFormData({ ...formData, image_url: url })}
                initialQuery={formData.title}
                type="food"
            />
        </form>
    );
}
