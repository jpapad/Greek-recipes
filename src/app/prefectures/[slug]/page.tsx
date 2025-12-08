import { getPrefectureBySlug, getRecipes, getCities } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function PrefecturePage({ params }: { params: { slug: string } }) {
    const prefecture = await getPrefectureBySlug(params.slug);

    if (!prefecture) {
        notFound();
    }

    // Get recipes for this prefecture
    const allRecipes = await getRecipes({});
    const recipes = allRecipes.filter(r => r.prefecture_id === prefecture.id);

    // Get cities for this prefecture
    const cities = await getCities(prefecture.id);

    return (
        <div className="space-y-12 pt-24">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/regions" className="hover:text-foreground">Regions</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href={`/regions/${prefecture.region?.slug}`} className="hover:text-foreground">
                    {prefecture.region?.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">{prefecture.name}</span>
            </div>

            {/* Prefecture Header */}
            <GlassPanel className="p-8 bg-white/40">
                {prefecture.image_url && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                        <img
                            src={prefecture.image_url}
                            alt={prefecture.name}
                            className="w-full h-64 object-cover"
                        />
                    </div>
                )}
                <h1 className="text-4xl font-bold mb-4">{prefecture.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                    Prefecture in {prefecture.region?.name}
                </p>
                {prefecture.description && (
                    <p className="text-lg">{prefecture.description}</p>
                )}
            </GlassPanel>

            {/* Cities in this Prefecture */}
            {cities.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-primary">
                        Πόλεις στον νομό {prefecture.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cities.map((city) => (
                            <GlassPanel key={city.id} className="p-4 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold mb-2">{city.name}</h3>
                                {city.description && (
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                        {city.description}
                                    </p>
                                )}
                                <a
                                    href={`/cities/${city.slug}`}
                                    className="text-primary hover:underline text-sm font-medium"
                                >
                                    Δείτε περισσότερα →
                                </a>
                            </GlassPanel>
                        ))}
                    </div>
                </section>
            )}

            {/* Recipes */}
            <section>
                <h2 className="text-3xl font-bold mb-8">Recipes from {prefecture.name}</h2>
                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-12 text-center">
                        <p className="text-muted-foreground text-lg">
                            No recipes available for this prefecture yet.
                        </p>
                    </GlassPanel>
                )}
            </section>
        </div>
    );
}
