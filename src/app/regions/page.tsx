"use client";

import { useEffect, useState } from "react";
import { getRegions, getPrefectures, getCities } from "@/lib/api";
import { RegionCard } from "@/components/regions/RegionCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { HierarchicalMapSection } from "@/components/regions/HierarchicalMapSection";
import { useTranslations } from "next-intl";
import type { Region, Prefecture, City } from "@/lib/types";
import { MapExplorerClient } from "@/components/regions/MapExplorerClient";


export default function RegionsPage() {
    const t = useTranslations();
    const [regions, setRegions] = useState<Region[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [regionsData, prefecturesData, citiesData] = await Promise.all([
                getRegions(),
                getPrefectures(),
                getCities()
            ]);
            setRegions(regionsData);
            setPrefectures(prefecturesData);
            setCities(citiesData);
            setLoading(false);
        }
        fetchData();
    }, []);

    // Use database coordinates or fallback to defaults
    const regionsWithCoords = regions.map((region) => ({
        ...region,
        lat: region.latitude || 38.5,
        lng: region.longitude || 23.5,
    }));

    const prefecturesWithCoords = prefectures.map((prefecture) => ({
        ...prefecture,
        lat: prefecture.latitude || 38.5,
        lng: prefecture.longitude || 23.5,
    }));

    const citiesWithCoords = cities.map((city) => ({
        ...city,
        lat: city.latitude || 38.5,
        lng: city.longitude || 23.5,
    }));

    if (loading) {
        return <div className="pt-24 text-center">{t('Common.loading')}</div>;
    }

    return (
        <div className="space-y-12 pt-24">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">{t('Region.pageTitle')}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('Region.pageDescription')}
                </p>
            </GlassPanel>

            <section className="mt-8 lg:mt-10">
                <MapExplorerClient />
            </section>

            {/* Interactive Hierarchical Map */}
            <HierarchicalMapSection
                regions={regionsWithCoords}
                prefectures={prefecturesWithCoords}
                cities={citiesWithCoords}
            />

            {/* Regions Grid */}
            <section>
                <h2 className="text-3xl font-bold mb-8">{t('Region.allRegions')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regions.map((region) => (
                        <RegionCard key={region.id} {...region} />
                    ))}
                </div>
            </section>
        </div>
    );
}
