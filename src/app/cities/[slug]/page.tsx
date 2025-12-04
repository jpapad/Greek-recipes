import { getCityBySlug, getRecipes } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function CityPage({ params }: { params: { slug: string } }) {
    const city = await getCityBySlug(params.slug);

    if (!city) {
        notFound();
    }

    // Get recipes for this city
    const allRecipes = await getRecipes({});
    const recipes = allRecipes.filter(r => r.city_id === city.id);

    return (
        <div className="space-y-12 pt-24">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <Link href="/regions" className="hover:text-foreground">Regions</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/regions/${city.prefecture?.region?.slug}`} className="hover:text-foreground">
                    {city.prefecture?.region?.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/prefectures/${city.prefecture?.slug}`} className="hover:text-foreground">
                    {city.prefecture?.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{city.name}</span>
            </div>

            {/* City Header */}
            <GlassPanel className="p-8 bg-white/40">
                {city.image_url && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                        <img 
                            src={city.image_url} 
                            alt={city.name}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                )}
                <h1 className="text-4xl font-bold mb-4">{city.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                    City in {city.prefecture?.name}, {city.prefecture?.region?.name}
                </p>
                {city.description && (
                    <p className="text-lg">{city.description}</p>
                )}
            </GlassPanel>

            {/* Recipes */}
            <section>
                <h2 className="text-3xl font-bold mb-8">Recipes from {city.name}</h2>
                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-12 text-center">
                        <p className="text-muted-foreground text-lg">
                            No recipes available for this city yet.
                        </p>
                    </GlassPanel>
                )}
            </section>
        </div>
    );
}
