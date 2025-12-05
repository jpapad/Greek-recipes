import { getRecipes } from "@/lib/api";
import RecipesListClient from "@/components/admin/RecipesListClient";

export default async function AdminRecipesPage() {
    const recipes = await getRecipes();

    return <RecipesListClient initialRecipes={recipes} />;
}
