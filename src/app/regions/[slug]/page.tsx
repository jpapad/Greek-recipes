import {
    getRegionBySlug,
    getRecipesByRegion,
    getPrefectures,
    getCities,
} from "@/lib/api";
import PhotoGallery from "@/components/regions/PhotoGallery";
import AttractionsList from "@/components/regions/AttractionsList";
import EventsList from "@/components/regions/EventsList";
import LocalProducts from "@/components/regions/LocalProducts";
import AccessInfo from "@/components/regions/AccessInfo";
import TouristInfoPanel from "@/components/regions/TouristInfoPanel";
import RegionDetailInteractiveSection from "@/components/regions/RegionDetailInteractiveSection";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const region = await getRegionBySlug(slug);

    if (!region) {
        return {
            title: "Region Not Found",
        };
    }

    return {
        title: `${region.name} - Traditional Greek Recipes`,
        description:
            region.description ||
            `Discover authentic Greek recipes from ${region.name}`,
        openGraph: {
            title: `${region.name} - Traditional Greek Recipes`,
            description:
                region.description ||
                `Discover authentic Greek recipes from ${region.name}`,
            images: region.image_url
                ? [
                    {
                        url: region.image_url,
                        width: 1200,
                        height: 630,
                        alt: region.name,
                    },
                ]
                : [],
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
    const prefectures = await getPrefectures(region.id);
    const allCities = await getCities(); // προς το παρόν δεν το χρησιμοποιούμε

    const regionLat = (region as any).latitude ?? 38.5;
    const regionLng = (region as any).longitude ?? 23.5;

    const recipesByPrefecture: Record<string, number> = {};
    (recipes as any[]).forEach((r) => {
        const prefId = r.prefecture_id || r.prefectureId;
        if (!prefId) return;
        recipesByPrefecture[prefId] = (recipesByPrefecture[prefId] || 0) + 1;
    });

    const prefecturesForMap = (prefectures as any[]).map((pref) => ({
        id: pref.id,
        name: pref.name,
        slug: pref.slug,
        lat: pref.latitude ?? regionLat,
        lng: pref.longitude ?? regionLng,
        recipeCount: recipesByPrefecture[pref.id] || 0,
    }));

    return (
        <div className="space-y-12 pt-24">
            {/* Hero */}
            <div className="relative h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                    src={region.image_url || "/placeholder-region.jpg"}
                    alt={region.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                        {region.name}
                    </h1>
                </div>
            </div>

            {/* Περιγραφή */}
            <GlassPanel className="p-8 bg-white/60 backdrop-blur-md">
                <p className="text-lg md:text-xl text-foreground leading-relaxed">
                    {region.description}
                </p>
            </GlassPanel>

            {/* 🔗 Χάρτης + Νομοί + Συνταγές (διαδραστικά) */}
            <RegionDetailInteractiveSection
                region={{
                    id: region.id,
                    name: region.name,
                    lat: regionLat,
                    lng: regionLng,
                }}
                prefectures={prefecturesForMap}
                recipes={recipes}
            />

            {/* Τουριστικές πληροφορίες */}
            <div className="space-y-8">
                <PhotoGallery
                    photos={region.photo_gallery || []}
                    title={`Φωτογραφίες από ${region.name}`}
                />

                <AccessInfo howToGetThere={region.how_to_get_there || ""} />

                <TouristInfoPanel touristInfo={region.tourist_info || ""} />

                <AttractionsList attractions={region.attractions || []} />

                <EventsList events={region.events_festivals || []} />

                <LocalProducts products={region.local_products || []} />
            </div>
        </div>
    );
}
