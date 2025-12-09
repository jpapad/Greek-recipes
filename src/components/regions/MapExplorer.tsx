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
import { MapPin, Loader2, UtensilsCrossed, ChevronRight } from "lucide-react";
import Link from "next/link";
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

// ⚠️ Αν το recipes table έχει άλλα ονόματα πεδίων,
// προσαρμόζεις αντίστοιχα αυτό το type και το select() πιο κάτω.
type MapRecipe = {
    id: string;
    title: string; // π.χ. "Μουσακάς"
    slug: string; // για /recipes/[slug]
    main_image_url?: string | null;
    region_id?: string | null;
    prefecture_id?: string | null;
    city_id?: string | null;
};

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
    const [recipes, setRecipes] = useState<MapRecipe[]>([]);

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

    // λίστα συνταγών που αντιστοιχούν στο τελευταίο click
    const [selectedRecipes, setSelectedRecipes] = useState<MapRecipe[]>([]);
    const [selectedRecipesLabel, setSelectedRecipesLabel] = useState<
        string | null
    >(null);

    // helper: cities από Supabase (δεν υπάρχει στο api.ts)
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

    // helper: recipes για τον χάρτη
    async function fetchRecipesForMap(): Promise<MapRecipe[]> {
        const { data, error } = await supabase
            .from("recipes")
            // ⚠️ Αν τα πεδία λέγονται αλλιώς, προσαρμόζεις εδώ
            .select(
                "id, title, slug, main_image_url, region_id, prefecture_id, city_id",
            );

        if (error) {
            console.error("Error fetching recipes for map:", error);
            return [];
        }

        return (data || []) as MapRecipe[];
    }

    // 🔹 Φόρτωση Regions, Prefectures, Cities, Recipes
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const [regionsData, prefecturesData, citiesData, recipesData] =
                    await Promise.all([
                        getRegions(),
                        getPrefectures(),
                        fetchAllCities(),
                        fetchRecipesForMap(),
                    ]);

                setRegions(
                    (regionsData || []).filter(
                        (r) =>
                            r.latitude !== null &&
                            r.latitude !== undefined &&
                            r.longitude !== null &&
                            r.longitude !== undefined,
                    ),
                );

                setPrefectures(
                    (prefecturesData || []).filter(
                        (p) =>
                            p.latitude !== null &&
                            p.latitude !== undefined &&
                            p.longitude !== null &&
                            p.longitude !== undefined,
                    ),
                );

                setCities(
                    (citiesData || []).filter(
                        (c) =>
                            c.latitude !== null &&
                            c.latitude !== undefined &&
                            c.longitude !== null &&
                            c.longitude !== undefined,
                    ),
                );

                setRecipes(recipesData || []);
            } catch (err) {
                console.error("Error loading map data", err);
                setError("Κάτι πήγε στραβά κατά τη φόρτωση των δεδομένων του χάρτη.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🔹 Τι φαίνεται ανά επίπεδο
    const visibleRegions = useMemo(() => regions, [regions]);

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

    // 🔹 Global counters
    const totalRegions = regions.length;
    const totalPrefectures = prefectures.length;
    const totalCities = cities.length;
    const totalRecipes = recipes.length;

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

    // 🔹 Helpers για μετρητές συνταγών

    function getRegionRecipeCount(regionId: string) {
        const regionPrefectureIds = prefectures
            .filter((p) => p.region_id === regionId)
            .map((p) => p.id);

        const regionCityIds = cities
            .filter((c) => regionPrefectureIds.includes(c.prefecture_id))
            .map((c) => c.id);

        return recipes.filter((r) => {
            if (r.region_id && r.region_id === regionId) return true;
            if (r.prefecture_id && regionPrefectureIds.includes(r.prefecture_id))
                return true;
            if (r.city_id && regionCityIds.includes(r.city_id)) return true;
            return false;
        }).length;
    }

    function getPrefectureRecipeCount(prefectureId: string) {
        const prefectureCityIds = cities
            .filter((c) => c.prefecture_id === prefectureId)
            .map((c) => c.id);

        return recipes.filter((r) => {
            if (r.prefecture_id && r.prefecture_id === prefectureId) return true;
            if (r.city_id && prefectureCityIds.includes(r.city_id)) return true;
            return false;
        }).length;
    }

    function getCityRecipeCount(cityId: string) {
        return recipes.filter((r) => r.city_id === cityId).length;
    }

    // 🔹 Επιλογή συνταγών για κάτω λίστα

    function selectRegionRecipes(region: Region) {
        const regionPrefectureIds = prefectures
            .filter((p) => p.region_id === region.id)
            .map((p) => p.id);

        const regionCityIds = cities
            .filter((c) => regionPrefectureIds.includes(c.prefecture_id))
            .map((c) => c.id);

        const items = recipes.filter((r) => {
            if (r.region_id && r.region_id === region.id) return true;
            if (r.prefecture_id && regionPrefectureIds.includes(r.prefecture_id))
                return true;
            if (r.city_id && regionCityIds.includes(r.city_id)) return true;
            return false;
        });

        setSelectedRecipes(items);
        setSelectedRecipesLabel(`Συνταγές από την περιοχή ${region.name}`);
    }

    function selectPrefectureRecipes(prefecture: Prefecture) {
        const prefectureCityIds = cities
            .filter((c) => c.prefecture_id === prefecture.id)
            .map((c) => c.id);

        const items = recipes.filter((r) => {
            if (r.prefecture_id && r.prefecture_id === prefecture.id) return true;
            if (r.city_id && prefectureCityIds.includes(r.city_id)) return true;
            return false;
        });

        setSelectedRecipes(items);
        setSelectedRecipesLabel(`Συνταγές από τον νομό ${prefecture.name}`);
    }

    function selectCityRecipes(city: City) {
        const items = recipes.filter((r) => r.city_id === city.id);
        setSelectedRecipes(items);
        setSelectedRecipesLabel(`Συνταγές από ${city.name}`);
    }

    function clearSelection() {
        setSelectedRecipes([]);
        setSelectedRecipesLabel(null);
    }

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
        clearSelection();
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

        selectRegionRecipes(region);
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

        selectPrefectureRecipes(prefecture);
    }

    function handleCityClick(city: City) {
        // δεν αλλάζουμε level, απλά δείχνουμε συνταγές
        selectCityRecipes(city);
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
            // Ξαναδείχνουμε συνταγές για την περιοχή
            selectRegionRecipes(r);
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
            ? "Πάτησε σε μια περιοχή για να δεις τους νομούς και τις συνταγές της."
            : mapState.level === "region"
                ? "Πάτησε σε έναν νομό για να δεις πόλεις, χωριά και συνταγές."
                : "Εστίαση σε πόλεις / χωριά του νομού και τις συνταγές τους.";

    return (
        <GlassPanel
            className="w-full min-h-[520px] md:min-h-[620px] flex flex-col gap-4"
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
                        Εξερεύνησε Περιοχές → Νομούς → Πόλεις &amp; Χωριά με τις
                        παραδοσιακές συνταγές τους.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        Επίπεδο:&nbsp;
                        <span className="text-primary">{levelLabel}</span>
                    </div>

                    {/* Global Counters */}
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
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 flex items-center gap-1">
                            <UtensilsCrossed className="h-3 w-3" />
                            Συνταγές: <strong>{totalRecipes}</strong>
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-xs text-muted-foreground -mt-2">{levelSubtitle}</p>

            {/* Χάρτης */}
            <div className="relative z-[1] flex-1 rounded-xl overflow-hidden border border-border/60 bg-transparent">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 backdrop-blur">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-xs text-muted-foreground">
                            Φόρτωση περιοχών, νομών, πόλεων και συνταγών...
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
                                visibleRegions.map((region) => {
                                    const recipeCount = getRegionRecipeCount(region.id);
                                    const regionPrefCount = prefectures.filter(
                                        (p) => p.region_id === region.id,
                                    ).length;
                                    const regionCityCount = cities.filter((c) =>
                                        prefectures
                                            .filter((p) => p.region_id === region.id)
                                            .some((p) => p.id === c.prefecture_id),
                                    ).length;

                                    return (
                                        <CircleMarker
                                            key={region.id}
                                            center={[
                                                region.latitude as number,
                                                region.longitude as number,
                                            ]}
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
                                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                                        <div>
                                                            Νομοί: <strong>{regionPrefCount}</strong>
                                                        </div>
                                                        <div>
                                                            Πόλεις/Χωριά:{" "}
                                                            <strong>{regionCityCount}</strong>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <UtensilsCrossed className="h-3 w-3" />
                                                            Συνταγές:{" "}
                                                            <strong>{recipeCount}</strong>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="mt-1 h-7 px-2 text-xs"
                                                        onClick={() => handleRegionClick(region)}
                                                    >
                                                        Ζουμ &amp; συνταγές
                                                    </Button>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}

                            {/* Επίπεδο Περιοχή/Νομός → μαρκαδόροι για Νομούς */}
                            {mapState.level !== "country" &&
                                visiblePrefectures.map((pref) => {
                                    const prefCityCount = cities.filter(
                                        (c) => c.prefecture_id === pref.id,
                                    ).length;
                                    const recipeCount = getPrefectureRecipeCount(pref.id);

                                    return (
                                        <CircleMarker
                                            key={pref.id}
                                            center={[
                                                pref.latitude as number,
                                                pref.longitude as number,
                                            ]}
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
                                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                                        <div>
                                                            Πόλεις/Χωριά:{" "}
                                                            <strong>{prefCityCount}</strong>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <UtensilsCrossed className="h-3 w-3" />
                                                            Συνταγές:{" "}
                                                            <strong>{recipeCount}</strong>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="mt-1 h-7 px-2 text-xs"
                                                        onClick={() => handlePrefectureClick(pref)}
                                                    >
                                                        Ζουμ &amp; συνταγές
                                                    </Button>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}

                            {/* Επίπεδο Νομός → μαρκαδόροι για Πόλεις/Χωριά */}
                            {mapState.level === "prefecture" &&
                                visibleCities.map((city) => {
                                    const recipeCount = getCityRecipeCount(city.id);
                                    return (
                                        <CircleMarker
                                            key={city.id}
                                            center={[
                                                city.latitude as number,
                                                city.longitude as number,
                                            ]}
                                            radius={6}
                                            pathOptions={{
                                                color: "#a855f7",
                                                fillColor: "#d946ef",
                                                fillOpacity: 0.8,
                                            }}
                                            eventHandlers={{
                                                click: () => handleCityClick(city),
                                            }}
                                        >
                                            <Popup>
                                                <div className="space-y-1 text-sm">
                                                    <div className="font-semibold">{city.name}</div>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <UtensilsCrossed className="h-3 w-3" />
                                                        Συνταγές:{" "}
                                                        <strong>{recipeCount}</strong>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </CircleMarker>
                                    );
                                })}
                        </MapContainer>

                        {/* Floating panel κάτω αριστερά */}
                        <div className="pointer-events-none absolute left-3 bottom-3 flex flex-col gap-2">
                            <div className="pointer-events-auto rounded-lg bg-background/90 backdrop-blur px-3 py-2 shadow-lg border border-border/70 max-w-xs">
                                <p className="text-xs font-medium text-muted-foreground">
                                    {mapState.level === "country" && (
                                        <>
                                            Πέρασε πάνω από τις κουκκίδες ή πάτησε σε μια περιοχή για
                                            να δεις νομούς και συνταγές.
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

            {/* ΛΙΣΤΑ ΣΥΝΤΑΓΩΝ ΚΑΤΩ ΑΠΟ ΤΟΝ ΧΑΡΤΗ */}
            {selectedRecipesLabel && (
                <div className="mt-3 border-t border-border/60 pt-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                                <UtensilsCrossed className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    {selectedRecipesLabel}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Βρέθηκαν {selectedRecipes.length} συνταγές.
                                </p>
                            </div>
                        </div>

                        {selectedRecipes.length > 0 && (
                            <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="hidden md:inline-flex text-xs h-7"
                            >
                                {/* ⚠️ Αν έχεις σελίδα /recipes με φίλτρα, μπορείς να περάσεις query params εδώ */}
                                <Link href="/recipes">
                                    Όλες οι συνταγές
                                    <ChevronRight className="h-3 w-3 ml-1" />
                                </Link>
                            </Button>
                        )}
                    </div>

                    {selectedRecipes.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            Δεν υπάρχουν ακόμα συνταγές για αυτή την περιοχή.
                        </p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                            {selectedRecipes.slice(0, 9).map((recipe) => (
                                <Link
                                    key={recipe.id}
                                    href={`/recipes/${recipe.slug}`}
                                    className="group flex flex-col rounded-lg border border-border/70 bg-background/80 p-3 hover:border-primary/60 hover:bg-primary/5 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm font-semibold line-clamp-2">
                                            {recipe.title}
                                        </h3>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>Παραδοσιακή συνταγή</span>
                                        <span className="inline-flex items-center gap-1">
                                            Περισσότερα
                                            <ChevronRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </GlassPanel>
    );
}
