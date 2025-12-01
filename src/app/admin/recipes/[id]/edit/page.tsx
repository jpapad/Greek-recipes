import { getRecipeById, getRegions } from "@/lib/api";
import { RecipeForm } from "@/components/admin/RecipeForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditRecipePage({ params }: PageProps) {
    const { id } = await params;
    const [recipe, regions] = await Promise.all([
        getRecipeById(id),
        getRegions(),
    ]);

    if (!recipe) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">Edit Recipe</h1>
                <p className="text-muted-foreground">Update {recipe.title}</p>
            </div>

            <RecipeForm recipe={recipe} regions={regions} />
        </div>
    );
}
