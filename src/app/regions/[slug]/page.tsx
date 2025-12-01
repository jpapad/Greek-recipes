import { getRegionBySlug, getRecipesByRegion } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function RegionDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const region = await getRegionBySlug(slug);

    if (!region) {
        notFound();
    }

    const recipes = await getRecipesByRegion(region.id);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                    src={region.image_url || "/placeholder-region.jpg"}
                    alt={region.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4 text-center">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{region.name}</h1>
                        <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">
                            {region.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <section>
                <h2 className="text-3xl font-bold mb-8 pl-2 border-l-4 border-primary">
                    Recipes from {region.name}
                </h2>

                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} {...recipe} />
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-8 text-center">
                        <p className="text-muted-foreground">No recipes found for this region yet.</p>
                    </GlassPanel>
                )}
            </section>
        </div>
    );
}
