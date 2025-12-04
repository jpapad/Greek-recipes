"use client";

import dynamic from "next/dynamic";
import { Region } from "@/lib/types";

// Import map dynamically to avoid SSR issues with Leaflet
const GreeceMap = dynamic(
    () => import("@/components/regions/GreeceMap").then((mod) => mod.GreeceMap),
    { 
        ssr: false, 
        loading: () => (
            <div className="h-[600px] w-full bg-gradient-to-br from-primary/10 to-blue-100/50 rounded-2xl animate-pulse flex items-center justify-center">
                <p className="text-muted-foreground">Loading map...</p>
            </div>
        ) 
    }
);

interface RegionsMapSectionProps {
    regions: (Region & { lat: number; lng: number })[];
}

export function RegionsMapSection({ regions }: RegionsMapSectionProps) {
    return (
        <section>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                🗺️ Interactive Map
            </h2>
            <GreeceMap
                regions={regions}
                onRegionClick={(slug) => {
                    window.location.href = `/regions/${slug}`;
                }}
            />
        </section>
    );
}
