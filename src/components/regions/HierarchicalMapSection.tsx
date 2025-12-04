"use client";

import dynamic from "next/dynamic";
import { Region, Prefecture, City } from "@/lib/types";

// Import hierarchical map dynamically
const HierarchicalMap = dynamic(
    () => import("@/components/regions/HierarchicalMap").then((mod) => mod.HierarchicalMap),
    { 
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full bg-gradient-to-br from-primary/10 to-blue-100/50 rounded-2xl animate-pulse flex items-center justify-center">
                <p className="text-muted-foreground">Loading interactive map...</p>
            </div>
        )
    }
);

interface HierarchicalMapSectionProps {
    regions: (Region & { lat: number; lng: number })[];
    prefectures: (Prefecture & { lat: number; lng: number })[];
    cities: (City & { lat: number; lng: number })[];
}

export function HierarchicalMapSection({ regions, prefectures, cities }: HierarchicalMapSectionProps) {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                🗺️ Interactive Map
            </h2>
            <HierarchicalMap
                regions={regions}
                prefectures={prefectures}
                cities={cities}
                onCityClick={(slug) => {
                    window.location.href = `/cities/${slug}`;
                }}
            />
        </section>
    );
}
