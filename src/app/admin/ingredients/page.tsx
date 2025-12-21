import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Ingredients Library | Admin Dashboard",
    description: "Master ingredients database",
};

async function getIngredients() {
    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name_el', { ascending: true });

    return { ingredients: data || [], error };
}

export default async function IngredientsPage() {
    const { user } = await requireAdminServer();
    const { ingredients, error } = await getIngredients();

    // Group by category
    const grouped = ingredients.reduce((acc: any, ing: any) => {
        if (!acc[ing.category]) acc[ing.category] = [];
        acc[ing.category].push(ing);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Ingredients Library
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Master database of ingredients with nutritional info
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/ingredients/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ingredient
                    </Link>
                </Button>
            </div>

            {error ? (
                <GlassPanel>
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Ingredients library not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                            Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ingredients-dietary-schema.sql</code> in Supabase
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto text-left">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                Creates:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                                <li>ingredients table - Master ingredient database</li>
                                <li>ingredient_substitutions - Alternative ingredients</li>
                                <li>dietary_tags - Vegan, Gluten-Free, etc.</li>
                                <li>recipe_ingredients_normalized - Structured recipe ingredients</li>
                                <li>10+ pre-populated Greek ingredients</li>
                                <li>10 dietary tags with icons</li>
                            </ul>
                        </div>
                    </div>
                </GlassPanel>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([category, items]: [string, any]) => (
                        <GlassPanel key={category}>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                                {category}
                            </h2>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {items.map((ingredient: any) => (
                                    <Link
                                        key={ingredient.id}
                                        href={`/admin/ingredients/${ingredient.id}/edit`}
                                        className="p-4 bg-background/50 rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {ingredient.image_url && (
                                                <img
                                                    src={ingredient.image_url}
                                                    alt={ingredient.name_el}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {ingredient.name_el}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {ingredient.name_en}
                                                </p>
                                                {ingredient.subcategory && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {ingredient.subcategory}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </GlassPanel>
                    ))}

                    {ingredients.length === 0 && (
                        <GlassPanel>
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">
                                    No ingredients yet. Run the SQL migration to populate with Greek ingredients.
                                </p>
                            </div>
                        </GlassPanel>
                    )}
                </div>
            )}
        </div>
    );
}
