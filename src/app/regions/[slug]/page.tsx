import { getRegionBySlug, getRecipesByRegion } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import PhotoGallery from "@/components/regions/PhotoGallery";
import AttractionsList from "@/components/regions/AttractionsList";
import EventsList from "@/components/regions/EventsList";
import LocalProducts from "@/components/regions/LocalProducts";
import AccessInfo from "@/components/regions/AccessInfo";
import TouristInfoPanel from "@/components/regions/TouristInfoPanel";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const region = await getRegionBySlug(slug);

    if (!region) {
        return {
            title: "Region Not Found",
        };
    }

    return {
        title: `${region.name} - Traditional Greek Recipes`,
        description: region.description || `Discover authentic Greek recipes from ${region.name}`,
        openGraph: {
            title: `${region.name} - Traditional Greek Recipes`,
            description: region.description || `Discover authentic Greek recipes from ${region.name}`,
            images: region.image_url ? [
                {
                    url: region.image_url,
                    width: 1200,
                    height: 630,
                    alt: region.name,
                },
            ] : [],
        },
    };
}

export default async function RegionDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const region = await getRegionBySlug(slug);

    if (!region) {
        notFound();
    }

    const recipes = await getRecipesByRegion(region.id);

    return (
        <div className="space-y-12 pt-24">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                    src={region.image_url || "/placeholder-region.jpg"}
                    alt={region.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
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

            {/* Tourist Information Sections */}
            <div className="space-y-8">
                <PhotoGallery photos={region.photo_gallery || []} title={`Φωτογραφίες από ${region.name}`} />
                
                <AccessInfo howToGetThere={region.how_to_get_there || ""} />
                
                <TouristInfoPanel touristInfo={region.tourist_info || ""} />
                
                <AttractionsList attractions={region.attractions || []} />
                
                <EventsList events={region.events_festivals || []} />
                
                <LocalProducts products={region.local_products || []} />
            </div>

            {/* Recipes Grid */}
            <section>
                <h2 className="text-3xl font-bold mb-8 pl-2 border-l-4 border-primary">
                    Recipes from {region.name}
                </h2>

                {recipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
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
