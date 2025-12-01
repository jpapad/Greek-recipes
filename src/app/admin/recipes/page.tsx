import { getRecipes } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteRecipeButton } from "@/components/admin/DeleteRecipeButton";

export default async function AdminRecipesPage() {
    const recipes = await getRecipes();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Recipes</h1>
                    <p className="text-muted-foreground">Manage all recipes</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/admin/recipes/new">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Recipe
                    </Link>
                </Button>
            </div>

            <GlassPanel className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="text-left p-4 font-semibold">Title</th>
                                <th className="text-left p-4 font-semibold">Category</th>
                                <th className="text-left p-4 font-semibold">Difficulty</th>
                                <th className="text-left p-4 font-semibold">Time</th>
                                <th className="text-right p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipes.map((recipe) => (
                                <tr key={recipe.id} className="border-b border-border/30 hover:bg-white/20 transition-colors">
                                    <td className="p-4 font-medium">{recipe.title}</td>
                                    <td className="p-4 text-muted-foreground">{recipe.category}</td>
                                    <td className="p-4">
                                        <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                            {recipe.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{recipe.time_minutes}m</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href={`/admin/recipes/${recipe.id}/edit`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <DeleteRecipeButton id={recipe.id} title={recipe.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassPanel>
        </div>
    );
}
