import {
    getPrefectureBySlug,
    getRecipes,
    getCities,
} from "@/lib/api";
import PrefectureDetailInteractiveSection from "@/components/regions/PrefectureDetailInteractiveSection";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const prefecture = await getPrefectureBySlug(slug);

    if (!prefecture) {
        return { title: "Prefecture Not Found" };
    }

    return {
        title: `${prefecture.name} - Traditional Greek Recipes`,
        description:
            prefecture.description ||
            `Discover authentic Greek recipes from ${prefecture.name}`,
        openGraph: {
            title: `${prefecture.name} - Traditional Greek Recipes`,
            description:
                prefecture.description ||
                `Discover authentic Greek recipes from ${prefecture.name}`,
            images: prefecture.image_url
                ? [
                    {
                        url: prefecture.image_url,
                        width: 1200,
                        height: 630,
                        alt: prefecture.name,
                    },
                ]
                : [],
        },
    };
}

export default async function PrefectureDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const prefecture = await getPrefectureBySlug(slug);

    if (!prefecture) {
        notFound();
    }

    // Συνταγές για τον συγκεκριμένο νομό
    const recipes = await getRecipes({ prefectureId: prefecture.id });

    // Πόλεις / χωριά του νομού (το API σου ήδη έχει φίλτρο prefectureId)
    const citiesOfPrefecture = await getCities(prefecture.id);

    // Συντεταγμένες: από τη βάση ή fallback στην Ελλάδα
    const prefLat = (prefecture as any).latitude ?? 38.5;
    const prefLng = (prefecture as any).longitude ?? 23.5;

    // Πλήθος συνταγών ανά πόλη
    const recipesByCity: Record<string, number> = {};
    (recipes as any[]).forEach((r) => {
        const cityId = r.city_id || r.cityId;
        if (!cityId) return;
        recipesByCity[cityId] = (recipesByCity[cityId] || 0) + 1;
    });

    const citiesForMap = (citiesOfPrefecture as any[]).map((city) => ({
        id: city.id,
        name: city.name,
        slug: city.slug,
        lat: city.latitude ?? prefLat,
        lng: city.longitude ?? prefLng,
        recipeCount: recipesByCity[city.id] || 0,
    }));

    return (
        <div className="space-y-12 pt-24">
            {/* Hero */}
            <div className="relative h-[260px] md:h-[320px] rounded-3xl overflow-hidden shadow-xl">
                <Image
                    src={prefecture.image_url || "/placeholder-prefecture.jpg"}
                    alt={prefecture.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                        {prefecture.name}
                    </h1>
                </div>
            </div>

            {/* Περιγραφή νομού */}
            {prefecture.description && (
                <GlassPanel className="p-8 bg-white/60 backdrop-blur-md">
                    <p className="text-lg md:text-xl text-foreground leading-relaxed">
                        {prefecture.description}
                    </p>
                </GlassPanel>
            )}

            {/* 🔗 Χάρτης + Πόλεις/Χωριά + Συνταγές (διαδραστικά) */}
            <PrefectureDetailInteractiveSection
                prefecture={{
                    id: prefecture.id,
                    name: prefecture.name,
                    lat: prefLat,
                    lng: prefLng,
                }}
                cities={citiesForMap}
                recipes={recipes}
            />
        </div>
    );
}
