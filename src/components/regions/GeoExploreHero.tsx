"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getRegions, getPrefectures, getCities } from "@/lib/api";
import type { Region, Prefecture, City } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "ready";

export function GeoExploreHero() {
    const router = useRouter();

    const [regions, setRegions] = useState<Region[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [status, setStatus] = useState<Status>("loading");

    const [selectedRegionId, setSelectedRegionId] = useState<string>("");
    const [selectedPrefectureId, setSelectedPrefectureId] =
        useState<string>("");
    const [selectedCityId, setSelectedCityId] = useState<string>("");

    useEffect(() => {
        async function load() {
            try {
                setStatus("loading");
                const [regionsData, prefecturesData, citiesData] =
                    await Promise.all([getRegions(), getPrefectures(), getCities()]);

                setRegions(regionsData || []);
                setPrefectures(prefecturesData || []);
                setCities(citiesData || []);
                setStatus("ready");
            } catch (e) {
                console.error("GeoExploreHero load error", e);
                setStatus("idle");
            }
        }

        load();
    }, []);

    // Φιλτράρισμα ανά επιλογή
    const filteredPrefectures = useMemo(() => {
        if (!selectedRegionId) return [];
        return prefectures.filter(
            (p: any) => p.region_id === selectedRegionId,
        );
    }, [prefectures, selectedRegionId]);

    const filteredCities = useMemo(() => {
        if (!selectedPrefectureId) return [];
        return cities.filter(
            (c: any) => c.prefecture_id === selectedPrefectureId,
        );
    }, [cities, selectedPrefectureId]);

    const selectedRegion = regions.find((r) => r.id === selectedRegionId);
    const selectedPrefecture = prefectures.find(
        (p) => p.id === selectedPrefectureId,
    );
    const selectedCity = cities.find((c) => c.id === selectedCityId);

    function handleRegionChange(value: string) {
        setSelectedRegionId(value);
        setSelectedPrefectureId("");
        setSelectedCityId("");
    }

    function handlePrefectureChange(value: string) {
        setSelectedPrefectureId(value);
        setSelectedCityId("");
    }

    function handleCityChange(value: string) {
        setSelectedCityId(value);
    }

    function handleGo() {
        if (selectedCity && (selectedCity as any).slug) {
            router.push(`/cities/${(selectedCity as any).slug}`);
            return;
        }

        if (selectedPrefecture && (selectedPrefecture as any).slug) {
            router.push(`/prefectures/${(selectedPrefecture as any).slug}`);
            return;
        }

        if (selectedRegion && (selectedRegion as any).slug) {
            router.push(`/regions/${(selectedRegion as any).slug}`);
            return;
        }
    }

    const canGo =
        !!(selectedCity && (selectedCity as any).slug) ||
        !!(selectedPrefecture && (selectedPrefecture as any).slug) ||
        !!(selectedRegion && (selectedRegion as any).slug);

    const totalRegions = regions.length;
    const totalPrefectures = prefectures.length;
    const totalCities = cities.length;

    return (
        <GlassPanel className="p-6 md:p-8 bg-white/50 backdrop-blur-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Εξερεύνησε την Ελλάδα στο Πιάτο
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                        Διάλεξε Περιοχή, Νομό ή Πόλη και ανακάλυψε παραδοσιακές συνταγές
                        και γαστρονομικές ιστορίες από όλη την Ελλάδα.
                    </p>
                </div>

                <div className="text-xs md:text-sm text-right text-muted-foreground">
                    <div>
                        Περιοχές: <span className="font-semibold">{totalRegions}</span>
                    </div>
                    <div>
                        Νομοί: <span className="font-semibold">{totalPrefectures}</span>
                    </div>
                    <div>
                        Πόλεις / Χωριά:{" "}
                        <span className="font-semibold">{totalCities}</span>
                    </div>
                </div>
            </div>

            {/* Επιλογές */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Περιοχή */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Περιοχή
                    </label>
                    <select
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedRegionId}
                        onChange={(e) => handleRegionChange(e.target.value)}
                        disabled={status === "loading"}
                    >
                        <option value="">Όλες οι περιοχές</option>
                        {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Νομός */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Νομός
                    </label>
                    <select
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm text-gray-900 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedPrefectureId}
                        onChange={(e) => handlePrefectureChange(e.target.value)}
                        disabled={!selectedRegionId || status === "loading"}
                    >
                        <option value="">
                            {selectedRegionId
                                ? "Όλοι οι νομοί της περιοχής"
                                : "Πρώτα διάλεξε περιοχή"}
                        </option>
                        {filteredPrefectures.map((pref) => (
                            <option key={pref.id} value={pref.id}>
                                {pref.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Πόλη / Χωριό */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Πόλη / Χωριό
                    </label>
                    <select
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm text-gray-900 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedCityId}
                        onChange={(e) => handleCityChange(e.target.value)}
                        disabled={!selectedPrefectureId || status === "loading"}
                    >
                        <option value="">
                            {selectedPrefectureId
                                ? "Όλες οι πόλεις / χωριά του νομού"
                                : "Πρώτα διάλεξε νομό"}
                        </option>
                        {filteredCities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Κουμπί */}
            <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                    Μπορείς να πας κατευθείαν σε σελίδα περιοχής, νομού ή πόλης – ανάλογα
                    με το τι έχεις επιλέξει.
                </p>
                <Button
                    size="sm"
                    disabled={!canGo || status === "loading"}
                    onClick={handleGo}
                >
                    Μετάβαση στην περιοχή →
                </Button>
            </div>
        </GlassPanel>
    );
}

// default export ώστε οποιοδήποτε import pattern να δουλεύει
export default GeoExploreHero;
