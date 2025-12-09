"use client";

import { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    useMap,
} from "react-leaflet";
import type { Region, Prefecture, City } from "@/lib/types";
import { getRegions, getPrefectures } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

const GREECE_CENTER: [number, number] = [39.0742, 21.8243];
const ZOOM_COUNTRY = 6;
const ZOOM_REGION = 7;
const ZOOM_PREFECTURE = 9;

type Level = "country" | "region" | "prefecture";

interface MapViewState {
    center: [number, number];
    zoom: number;
}

interface MapState {
    level: Level;
    selectedRegion?: Region | null;
    selectedPrefecture?: Prefecture | null;
}

// Μικρό helper component για να κάνουμε flyTo όταν αλλάζει το κέντρο / zoom
function MapViewController({ view }: { view: MapViewState }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(view.center, view.zoom, {
            duration: 0.7,
        });
    }, [view.center[0], view.center[1], view.zoom, map]);

    return null;
}

export function MapExplorer() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    const [mapState, setMapState] = useState<MapState>({
        level: "country",
        selectedRegion: undefined,
        selectedPrefecture: undefined,
    });

    const [view, setView] = useState<MapViewState>({
        center: GREECE_CENTER,
        zoom: ZOOM_COUNTRY,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Φόρτωση Regions, Prefectures, Cities από Supabase
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const [regionsData, prefecturesData, citiesData] = await Promise.all([
                    getRegions(),
                    getPrefectures(),
                    fetchAllCities(),
                ]);

                // "Ενεργά" = όσα έχουν γεωγραφικές συντεταγμένες
                setRegions(
                    (regionsData || []).filter(
                        (r) => r.latitude !== null && r.latitude !== undefined && r.longitude !== null && r.longitude !== undefined,
                    ),
                );

                setPrefectures(
                    (prefecturesData || []).filter(
                        (p) => p.latitude !== null && p.latitude !== undefined && p.longitude !== null && p.longitude !== undefined,
                    ),
                );

                setCities(
                    (citiesData || []).filter(
                        (c) => c.latitude !== null && c.latitude !== undefined && c.longitude !== null && c.longitude !== undefined,
                    ),
                );
            } catch (err) {
                console.error("Error loading map data", err);
                setError("Κάτι πήγε στραβά κατά τη φόρτωση των δεδομένων του χάρτη.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Helper για cities από Supabase (δεν υπάρχει ακόμα στο api.ts)
    async function fetchAllCities(): Promise<City[]> {
        const { data, error } = await supabase
            .from("cities")
            .select("*")
            .order("name");

        if (error) {
            console.error("Error fetching cities:", error);
            return [];
        }

        return (data || []) as City[];
    }

    // 🔹 Τι φαίνεται ανά επίπεδο
    const visibleRegions = useMemo(
        () => regions,
        [regions],
    );

    const visiblePrefectures = useMemo(() => {
        if (!mapState.selectedRegion) return [];
        return prefectures.filter(
            (p) => p.region_id === mapState.selectedRegion!.id,
        );
    }, [prefectures, mapState.selectedRegion]);

    const visibleCities = useMemo(() => {
        if (!mapState.selectedPrefecture) return [];
        return cities.filter(
            (c) => c.prefecture_id === mapState.selectedPrefecture!.id,
        );
    }, [cities, mapState.selectedPrefecture]);

    // 🔹 Counters (περιοχές / νομοί / πόλεις)
    const totalRegions = regions.length;
    const totalPrefectures = prefectures.length;
    const totalCities = cities.length;

    const currentRegionPrefecturesCount =
        mapState.selectedRegion
            ? prefectures.filter((p) => p.region_id === mapState.selectedRegion!.id)
                .length
            : 0;

    const currentRegionCitiesCount =
        mapState.selectedRegion
            ? cities.filter((c) =>
                prefectures
                    .filter((p) => p.region_id === mapState.selectedRegion!.id)
                    .some((p) => p.id === c.prefecture_id),
            ).length
            : 0;

    const currentPrefectureCitiesCount =
        mapState.selectedPrefecture
            ? cities.filter(
                (c) => c.prefecture_id === mapState.selectedPrefecture!.id,
            ).length
            : 0;

    // 🔹 Handlers

    function resetToCountry() {
        setMapState({
            level: "country",
            selectedRegion: undefined,
            selectedPrefecture: undefined,
        });
        setView({
            center: GREECE_CENTER,
            zoom: ZOOM_COUNTRY,
        });
    }

    function handleRegionClick(region: Region) {
        if (!region.latitude || !region.longitude) return;

        setMapState({
            level: "region",
            selectedRegion: region,
            selectedPrefecture: undefined,
        });

        setView({
            center: [region.latitude as number, region.longitude as number],
            zoom: ZOOM_REGION,
        });
    }

    function handlePrefectureClick(prefecture: Prefecture) {
        if (!prefecture.latitude || !prefecture.longitude) return;

        setMapState((prev) => ({
            level: "prefecture",
            selectedRegion: prev.selectedRegion,
            selectedPrefecture: prefecture,
        }));

        setView({
            center: [
                prefecture.latitude as number,
                prefecture.longitude as number,
            ],
            zoom: ZOOM_PREFECTURE,
        });
    }

    function goUpOneLevel() {
        if (mapState.level === "prefecture" && mapState.selectedRegion) {
            // Πίσω στο επίπεδο Περιοχή
            setMapState({
                level: "region",
                selectedRegion: mapState.selectedRegion,
                selectedPrefecture: undefined,
            });
            const r = mapState.selectedRegion;
            setView({
                center: [r.latitude as number, r.longitude as number],
                zoom: ZOOM_REGION,
            });
        } else if (mapState.level === "region") {
            // Πίσω στη Χώρα
            resetToCountry();
        }
    }

    const levelLabel =
        mapState.level === "country"
            ? "Ελλάδα"
            : mapState.level === "region"
                ? mapState.selectedRegion?.name || "Περιοχή"
                : mapState.selectedPrefecture?.name || "Νομός";

    const levelSubtitle =
        mapState.level === "country"
            ? "Πάτησε σε μια περιοχή για να δεις τους νομούς."
            : mapState.level === "region"
                ? "Πάτησε σε έναν νομό για να δεις πόλεις και χωριά."
                : "Εστίαση σε πόλεις / χωριά του νομού.";

    return (
        <GlassPanel
            className="w-full h-[520px] md:h-[600px] flex flex-col gap-4"
            variant="card"
            hoverEffect
            gradientBorder
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
                        <MapPin className="h-3 w-3" />
                        Διαδραστικός Χάρτης
                    </div>
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Γαστρονομικός Χάρτης Ελλάδας
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Εξερεύνησε Περιοχές → Νομούς → Πόλεις &amp; Χωριά.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* Τρέχον επίπεδο */}
                    <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        Επίπεδο:&nbsp;
                        <span className="text-primary">{levelLabel}</span>
                    </div>

                    {/* Counters */}
                    <div className="flex flex-wrap gap-1.5 justify-end text-[11px] md:text-xs">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5">
                            Περιοχές: <strong>{totalRegions}</strong>
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5">
                            Νομοί: <strong>{totalPrefectures}</strong>
                        </span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5">
                            Πόλεις/Χωριά: <strong>{totalCities}</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtitle για το τρέχον επίπεδο */}
            <p className="text-xs text-muted-foreground -mt-2">{levelSubtitle}</p>

            {/* Χάρτης */}
            <div className="relative flex-1 rounded-xl overflow-hidden border border-border/60">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-xs text-muted-foreground">
                            Φόρτωση περιοχών, νομών και πόλεων...
                        </p>
                    </div>
                ) : error ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur">
                        <p className="text-sm text-destructive">{error}</p>
                        <Button size="sm" variant="outline" onClick={resetToCountry}>
                            Προσπάθεια ξανά
                        </Button>
                    </div>
                ) : (
                    <>
                        <MapContainer
                            center={view.center}
                            zoom={view.zoom}
                            scrollWheelZoom={true}
                            className="h-full w-full"
                            minZoom={5}
                            maxZoom={13}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <MapViewController view={view} />

                            {/* Επίπεδο Χώρα → μαρκαδόροι για Περιοχές */}
                            {mapState.level === "country" &&
                                visibleRegions.map((region) => (
                                    <CircleMarker
                                        key={region.id}
                                        center={[region.latitude as number, region.longitude as number]}
                                        radius={10}
                                        pathOptions={{
                                            color: "#2563eb",
                                            fillColor: "#3b82f6",
                                            fillOpacity: 0.7,
                                        }}
                                        eventHandlers={{
                                            click: () => handleRegionClick(region),
                                        }}
                                    >
                                        <Popup>
                                            <div className="space-y-1 text-sm">
                                                <div className="font-semibold">{region.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Νομοί:{" "}
                                                    <strong>
                                                        {
                                                            prefectures.filter(
                                                                (p) => p.region_id === region.id,
                                                            ).length
                                                        }
                                                    </strong>{" "}
                                                    • Πόλεις/Χωριά:{" "}
                                                    <strong>
                                                        {cities.filter((c) =>
                                                            prefectures
                                                                .filter(
                                                                    (p) => p.region_id === region.id,
                                                                )
                                                                .some((p) => p.id === c.prefecture_id),
                                                        ).length}
                                                    </strong>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="mt-1 h-7 px-2 text-xs"
                                                    onClick={() => handleRegionClick(region)}
                                                >
                                                    Ζουμ στην περιοχή
                                                </Button>

                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}

                            {/* Επίπεδο Περιοχή → μαρκαδόροι για Νομούς */}
                            {mapState.level !== "country" &&
                                visiblePrefectures.map((pref) => (
                                    <CircleMarker
                                        key={pref.id}
                                        center={[pref.latitude as number, pref.longitude as number]}
                                        radius={8}
                                        pathOptions={{
                                            color: "#16a34a",
                                            fillColor: "#22c55e",
                                            fillOpacity: 0.75,
                                        }}
                                        eventHandlers={{
                                            click: () => handlePrefectureClick(pref),
                                        }}
                                    >
                                        <Popup>
                                            <div className="space-y-1 text-sm">
                                                <div className="font-semibold">{pref.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Πόλεις/Χωριά:{" "}
                                                    <strong>
                                                        {cities.filter(
                                                            (c) => c.prefecture_id === pref.id,
                                                        ).length}
                                                    </strong>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="mt-1 h-7 px-2 text-xs"
                                                    onClick={() => handlePrefectureClick(pref)}
                                                >
                                                    Ζουμ στον νομό
                                                </Button>

                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}

                            {/* Επίπεδο Νομός → μαρκαδόροι για Πόλεις/Χωριά */}
                            {mapState.level === "prefecture" &&
                                visibleCities.map((city) => (
                                    <CircleMarker
                                        key={city.id}
                                        center={[city.latitude as number, city.longitude as number]}
                                        radius={6}
                                        pathOptions={{
                                            color: "#a855f7",
                                            fillColor: "#d946ef",
                                            fillOpacity: 0.8,
                                        }}
                                    >
                                        <Popup>
                                            <div className="space-y-1 text-sm">
                                                <div className="font-semibold">{city.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    Ανήκει στον νομό{" "}
                                                    {mapState.selectedPrefecture?.name || "—"}
                                                </div>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                        </MapContainer>

                        {/* Floating panel κάτω αριστερά με context */}
                        <div className="pointer-events-none absolute left-3 bottom-3 flex flex-col gap-2">
                            <div className="pointer-events-auto rounded-lg bg-background/90 backdrop-blur px-3 py-2 shadow-lg border border-border/70 max-w-xs">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {mapState.level === "country" && (
                                        <>
                                            Περίμενε πάνω από τις κουκκίδες ή πάτησε σε μια περιοχή
                                            για zoom.
                                        </>
                                    )}
                                    {mapState.level === "region" &&
                                        mapState.selectedRegion && (
                                            <>
                                                Περιοχή{" "}
                                                <span className="font-semibold text-foreground">
                                                    {mapState.selectedRegion.name}
                                                </span>
                                                : {currentRegionPrefecturesCount} νομοί,{" "}
                                                {currentRegionCitiesCount} πόλεις/χωριά.
                                            </>
                                        )}
                                    {mapState.level === "prefecture" &&
                                        mapState.selectedPrefecture && (
                                            <>
                                                Νομός{" "}
                                                <span className="font-semibold text-foreground">
                                                    {mapState.selectedPrefecture.name}
                                                </span>
                                                : {currentPrefectureCitiesCount} πόλεις/χωριά.
                                            </>
                                        )}
                                </p>
                            </div>

                            {mapState.level !== "country" && (
                                <div className="pointer-events-auto">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7"
                                        onClick={goUpOneLevel}
                                    >
                                        Πίσω ένα επίπεδο
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </GlassPanel>
    );
}
