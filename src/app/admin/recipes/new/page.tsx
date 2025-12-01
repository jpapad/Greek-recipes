import { getRegions } from "@/lib/api";
import { RecipeForm } from "@/components/admin/RecipeForm";

export default async function NewRecipePage() {
    const regions = await getRegions();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">Add New Recipe</h1>
                <p className="text-muted-foreground">Create a new traditional Greek recipe</p>
            </div>

            <RecipeForm regions={regions} />
        </div>
    );
}
