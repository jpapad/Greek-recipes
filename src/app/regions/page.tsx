"use client";

import { useEffect, useState } from "react";
import { getRegions } from "@/lib/api";
import { RegionCard } from "@/components/regions/RegionCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useTranslations } from "next-intl";
import type { Region } from "@/lib/types";
import { MapExplorerClient } from "@/components/regions/MapExplorerClient";

export default function RegionsPage() {
    const t = useTranslations();
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const regionsData = await getRegions();
                setRegions(regionsData);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="pt-24 text-center">{t("Common.loading")}</div>
        );
    }

    return (
        <div className="space-y-12 pt-32 md:pt-40">
            {/* Hero / Intro */}
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">
                    {t("Region.pageTitle")}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t("Region.pageDescription")}
                </p>
            </GlassPanel>

            {/* Γαστρονομικός Χάρτης Ελλάδας */}
            <section className="mt-8 lg:mt-10">
                <MapExplorerClient />
            </section>

            {/* Λίστα Περιοχών */}
            <section>
                <h2 className="text-3xl font-bold mb-8">
                    {t("Region.allRegions")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regions.map((region) => (
                        <RegionCard key={region.id} {...region} />
                    ))}
                </div>
            </section>
        </div>
    );
}
