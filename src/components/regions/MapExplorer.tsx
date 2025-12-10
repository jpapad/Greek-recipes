"use client";

import { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { Region, Prefecture, City } from "@/lib/types";
import { getRegions, getPrefectures } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipes/RecipeCard";


const GREECE_CENTER: [number, number] = [39.0742, 21.8243];

type Level = "country" | "region" | "prefecture";
type MapStyle = "default" | "light" | "dark";

interface MapViewState {
    center: [number, number];
    zoom: number;
}

type MapRecipe = {
    id: string;
    title: string;
    slug?: string | null;
    region_id?: string | null;
    prefecture_id?: string | null;
    city_id?: string | null;
};

interface MapExplorerProps {
    /** αν το δώσεις, ο χάρτης ξεκινά κατευθείαν σε αυτή την περιοχή */
    initialRegionId?: string;
}

export function MapExplorer({ initialRegionId }: MapExplorerProps) {
    const [regions, setRegions] = useState<Region[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [recipes, setRecipes] = useState<MapRecipe[]>([]);

    const [level, setLevel] = useState<Level>("country");
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [selectedPrefecture, setSelectedPrefecture] =
        useState<Prefecture | null>(null);

    const [view, setView] = useState<MapViewState>({
        center: GREECE_CENTER,
        zoom: 6,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedRecipes, setSelectedRecipes] = useState<MapRecipe[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

    const [initialRegionApplied, setInitialRegionApplied] = useState(false);

    const [mapStyle, setMapStyle] = useState<MapStyle>("default");

    // ---------- Φόρτωση δεδομένων από backend ----------

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const [regionsData, prefecturesData, citiesData, recipesData] =
                    await Promise.all([
                        getRegions(),
                        getPrefectures(),
                        supabase.from("cities").select("*").order("name"),
                        supabase
                            .from("recipes")
                            .select("id, title, slug, region_id, prefecture_id, city_id"),
                    ]);

                setRegions(
                    (regionsData || []).filter(
                        (r: any) => r.latitude != null && r.longitude != null,
                    ),
                );

                setPrefectures(
                    (prefecturesData || []).filter(
                        (p: any) => p.latitude != null && p.longitude != null,
                    ),
                );

                setCities(
                    ((citiesData as any)?.data || []).filter(
                        (c: any) => c.latitude != null && c.longitude != null,
                    ),
                );

                setRecipes(((recipesData as any)?.data || []) as MapRecipe[]);
            } catch (err) {
                console.error("Map load error", err);
                setError(
                    "Κάτι πήγε στραβά κατά τη φόρτωση των δεδομένων του χάρτη.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // ---------- Visible λίστες ανά επίπεδο ----------

    const visibleRegions = useMemo(() => regions, [regions]);

    const visiblePrefectures = useMemo(() => {
        if (!selectedRegion) return [];
        return prefectures.filter(
            (p: any) => p.region_id === (selectedRegion as any).id,
        );
    }, [prefectures, selectedRegion]);

    const visibleCities = useMemo(() => {
        if (!selectedPrefecture) return [];
        return cities.filter(
            (c: any) => c.prefecture_id === (selectedPrefecture as any).id,
        );
    }, [cities, selectedPrefecture]);

    // ---------- Counters ----------

    const totalRegions = regions.length;
    const totalPrefectures = prefectures.length;
    const totalCities = cities.length;
    const totalRecipes = recipes.length;

    function getRegionRecipeCount(regionId: string) {
        const regionPrefIds = prefectures
            .filter((p: any) => p.region_id === regionId)
            .map((p: any) => p.id);

        const regionCityIds = cities
            .filter((c: any) => regionPrefIds.includes(c.prefecture_id))
            .map((c: any) => c.id);

        return recipes.filter((r) => {
            if (r.region_id === regionId) return true;
            if (r.prefecture_id && regionPrefIds.includes(r.prefecture_id)) {
                return true;
            }
            if (r.city_id && regionCityIds.includes(r.city_id)) {
                return true;
            }
            return false;
        }).length;
    }

    function getPrefectureRecipeCount(prefectureId: string) {
        const prefectureCityIds = cities
            .filter((c: any) => c.prefecture_id === prefectureId)
            .map((c: any) => c.id);

        return recipes.filter((r) => {
            if (r.prefecture_id === prefectureId) return true;
            if (r.city_id && prefectureCityIds.includes(r.city_id)) return true;
            return false;
        }).length;
    }

    function getCityRecipeCount(cityId: string) {
        return recipes.filter((r) => r.city_id === cityId).length;
    }

    // ---------- Επιλογή συνταγών για κάτω λίστα ----------

    function selectRegionRecipes(region: Region) {
        const regionPrefIds = prefectures
            .filter((p: any) => p.region_id === (region as any).id)
            .map((p: any) => p.id);

        const regionCityIds = cities
            .filter((c: any) => regionPrefIds.includes(c.prefecture_id))
            .map((c: any) => c.id);

        const items = recipes.filter((r) => {
            if (r.region_id === (region as any).id) return true;
            if (r.prefecture_id && regionPrefIds.includes(r.prefecture_id)) {
                return true;
            }
            if (r.city_id && regionCityIds.includes(r.city_id)) return true;
            return false;
        });

        setSelectedRecipes(items);
        setSelectedLabel(`Συνταγές από την περιοχή ${region.name}`);
    }

    function selectPrefectureRecipes(pref: Prefecture) {
        const prefectureCityIds = cities
            .filter((c: any) => c.prefecture_id === (pref as any).id)
            .map((c: any) => c.id);

        const items = recipes.filter((r) => {
            if (r.prefecture_id === (pref as any).id) return true;
            if (r.city_id && prefectureCityIds.includes(r.city_id)) return true;
            return false;
        });

        setSelectedRecipes(items);
        setSelectedLabel(`Συνταγές από τον νομό ${pref.name}`);
    }

    function selectCityRecipes(city: City) {
        const items = recipes.filter((r) => r.city_id === (city as any).id);
        setSelectedRecipes(items);
        setSelectedLabel(`Συνταγές από ${city.name}`);
    }

    function clearSelection() {
        setSelectedRecipes([]);
        setSelectedLabel(null);
    }

    // ---------- Handlers drill-down ----------

    function resetToCountry() {
        setLevel("country");
        setSelectedRegion(null);
        setSelectedPrefecture(null);
        setView({ center: GREECE_CENTER, zoom: 6 });
        clearSelection();
    }

    function handleRegionClick(region: Region) {
        const lat = (region as any).latitude;
        const lng = (region as any).longitude;
        if (!lat || !lng) return;

        setLevel("region");
        setSelectedRegion(region);
        setSelectedPrefecture(null);
        setView({
            center: [lat, lng],
            zoom: 7,
        });

        selectRegionRecipes(region);
    }

    function handlePrefectureClick(pref: Prefecture) {
        const lat = (pref as any).latitude;
        const lng = (pref as any).longitude;
        if (!lat || !lng) return;

        setLevel("prefecture");
        setSelectedPrefecture(pref);
        setView({
            center: [lat, lng],
            zoom: 9,
        });

        selectPrefectureRecipes(pref);
    }

    function handleCityClick(city: City) {
        const lat = (city as any).latitude;
        const lng = (city as any).longitude;

        if (lat && lng) {
            setView({
                center: [lat, lng],
                zoom: 11,
            });
        }
        selectCityRecipes(city);
    }

    function goUpOneLevel() {
        if (level === "prefecture" && selectedRegion) {
            handleRegionClick(selectedRegion);
        } else if (level === "region") {
            resetToCountry();
        }
    }

    // ---------- Εστίαση σε συγκεκριμένη περιοχή (π.χ. /regions/[slug]) ----------

    useEffect(() => {
        if (!initialRegionId) return;
        if (initialRegionApplied) return;
        if (!regions.length || !prefectures.length || !recipes.length) return;

        const region = regions.find((r: any) => r.id === initialRegionId);
        if (!region) return;

        handleRegionClick(region);
        setInitialRegionApplied(true);
    }, [
        initialRegionId,
        initialRegionApplied,
        regions,
        prefectures,
        recipes,
    ]);

    // ---------- Map tile styles ----------

    const tileConfig = useMemo(() => {
        switch (mapStyle) {
            case "light":
                return {
                    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                };
            case "dark":
                return {
                    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
                };
            case "default":
            default:
                return {
                    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                };
        }
    }, [mapStyle]);

    // ---------- UI helpers ----------

    const levelLabel =
        level === "country"
            ? "Ελλάδα"
            : level === "region"
                ? selectedRegion?.name
                : selectedPrefecture?.name;

    const visiblePrefCount =
        level === "region" && selectedRegion
            ? prefectures.filter(
                (p: any) => p.region_id === (selectedRegion as any).id,
            ).length
            : 0;

    const visibleCityCount =
        level === "prefecture" && selectedPrefecture
            ? cities.filter(
                (c: any) => c.prefecture_id === (selectedPrefecture as any).id,
            ).length
            : 0;

    // ---------- Render ----------

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Header / counters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 flex-wrap">
                <div>
                    <h2 className="text-xl font-semibold">Γαστρονομικός Χάρτης Ελλάδας</h2>
                    <p className="text-sm text-muted-foreground">
                        Εξερεύνησε Περιοχές → Νομούς → Πόλεις &amp; Χωριά με τις συνταγές τους.
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Στυλ χάρτη:</span>
                        <div className="inline-flex rounded-full border border-white/20 bg-background/60 p-1">
                            <button
                                type="button"
                                onClick={() => setMapStyle("default")}
                                className={`px-2 py-0.5 rounded-full text-xs ${mapStyle === "default"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Default
                            </button>
                            <button
                                type="button"
                                onClick={() => setMapStyle("light")}
                                className={`px-2 py-0.5 rounded-full text-xs ${mapStyle === "light"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Light
                            </button>
                            <button
                                type="button"
                                onClick={() => setMapStyle("dark")}
                                className={`px-2 py-0.5 rounded-full text-xs ${mapStyle === "dark"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-xs">
                        <div>
                            Επίπεδο: <span className="font-semibold">{levelLabel}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <span>Περιοχές: {totalRegions}</span>
                            <span>Νομοί: {totalPrefectures}</span>
                            <span>Πόλεις/Χωριά: {totalCities}</span>
                            <span>Συνταγές: {totalRecipes}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Χάρτης */}
            <div className="w-full h-[500px] border border-white/20 rounded-xl overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur">
                        <div className="text-sm">Φόρτωση δεδομένων χάρτη...</div>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur">
                        <div className="text-sm text-red-400">{error}</div>
                        <Button size="sm" onClick={resetToCountry}>
                            Προσπάθεια ξανά
                        </Button>
                    </div>
                )}

                <MapContainer
                    key={`${view.center[0]}-${view.center[1]}-${view.zoom}-${mapStyle}`}
                    center={view.center}
                    zoom={view.zoom}
                    scrollWheelZoom={true}
                    style={{ width: "100%", height: "100%" }}
                    minZoom={5}
                    maxZoom={13}
                >
                    <TileLayer
                        attribution={
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
                            'contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        }
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />


                    {/* Χώρα → Περιοχές */}
                    {level === "country" &&
                        visibleRegions.map((region: any) => {
                            const recipeCount = getRegionRecipeCount(region.id);
                            const prefCount = prefectures.filter(
                                (p: any) => p.region_id === region.id,
                            ).length;
                            const cityCount = cities.filter((c: any) =>
                                prefectures
                                    .filter((p: any) => p.region_id === region.id)
                                    .map((p: any) => p.id)
                                    .includes(c.prefecture_id),
                            ).length;

                            const hasRecipes = recipeCount > 0;

                            return (
                                <CircleMarker
                                    key={region.id}
                                    center={[region.latitude, region.longitude]}
                                    radius={hasRecipes ? 10 : 8}
                                    pathOptions={{
                                        color: hasRecipes ? "#2563eb" : "#6b7280",
                                        fillColor: hasRecipes ? "#3b82f6" : "#9ca3af",
                                        fillOpacity: hasRecipes ? 0.8 : 0.4,
                                    }}
                                    eventHandlers={{
                                        click: () => handleRegionClick(region),
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                        <span>
                                            {region.name} · {recipeCount} συνταγές
                                        </span>
                                    </Tooltip>
                                    <Popup>
                                        <div className="space-y-2 text-sm">
                                            <div className="font-semibold">{region.name}</div>
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                <div>Νομοί: {prefCount}</div>
                                                <div>Πόλεις/Χωριά: {cityCount}</div>
                                                <div>Συνταγές: {recipeCount}</div>
                                                {!hasRecipes && (
                                                    <div className="italic">
                                                        Χωρίς συνταγές (ακόμη).
                                                    </div>
                                                )}
                                            </div>
                                            {region.slug && (
                                                <a
                                                    href={`/regions/${region.slug}`}
                                                    className="text-xs text-blue-500 hover:underline font-medium"
                                                >
                                                    Περισσότερα για την {region.name} →
                                                </a>
                                            )}
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}

                    {/* Περιοχή → Νομοί */}
                    {level !== "country" &&
                        visiblePrefectures.map((pref: any) => {
                            const cityCount = cities.filter(
                                (c: any) => c.prefecture_id === pref.id,
                            ).length;
                            const recipeCount = getPrefectureRecipeCount(pref.id);
                            const hasRecipes = recipeCount > 0;

                            return (
                                <CircleMarker
                                    key={pref.id}
                                    center={[pref.latitude, pref.longitude]}
                                    radius={hasRecipes ? 8 : 7}
                                    pathOptions={{
                                        color: hasRecipes ? "#16a34a" : "#6b7280",
                                        fillColor: hasRecipes ? "#22c55e" : "#9ca3af",
                                        fillOpacity: hasRecipes ? 0.85 : 0.45,
                                    }}
                                    eventHandlers={{
                                        click: () => handlePrefectureClick(pref),
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                        <span>
                                            {pref.name} · {recipeCount} συνταγές
                                        </span>
                                    </Tooltip>
                                    <Popup>
                                        <div className="space-y-2 text-sm">
                                            <div className="font-semibold">{pref.name}</div>
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                <div>Πόλεις/Χωριά: {cityCount}</div>
                                                <div>Συνταγές: {recipeCount}</div>
                                                {!hasRecipes && (
                                                    <div className="italic">
                                                        Χωρίς συνταγές (ακόμη).
                                                    </div>
                                                )}
                                            </div>
                                            {pref.slug && (
                                                <a
                                                    href={`/prefectures/${pref.slug}`}
                                                    className="text-xs text-blue-500 hover:underline font-medium"
                                                >
                                                    Περισσότερα για τον νομό {pref.name} →
                                                </a>
                                            )}
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}

                    {/* Νομός → Πόλεις */}
                    {level === "prefecture" &&
                        visibleCities.map((city: any) => {
                            const recipeCount = getCityRecipeCount(city.id);
                            const hasRecipes = recipeCount > 0;

                            return (
                                <CircleMarker
                                    key={city.id}
                                    center={[city.latitude, city.longitude]}
                                    radius={hasRecipes ? 6 : 5}
                                    pathOptions={{
                                        color: hasRecipes ? "#a855f7" : "#6b7280",
                                        fillColor: hasRecipes ? "#d946ef" : "#9ca3af",
                                        fillOpacity: hasRecipes ? 0.9 : 0.5,
                                    }}
                                    eventHandlers={{
                                        click: () => handleCityClick(city),
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                                        <span>
                                            {city.name} · {recipeCount} συνταγές
                                        </span>
                                    </Tooltip>
                                    <Popup>
                                        <div className="space-y-2 text-sm">
                                            <div className="font-semibold">{city.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Συνταγές: {recipeCount}
                                                {!hasRecipes && (
                                                    <span className="italic"> (χωρίς συνταγές ακόμη)</span>
                                                )}
                                            </div>
                                            {city.slug && (
                                                <a
                                                    href={`/cities/${city.slug}`}
                                                    className="text-xs text-purple-500 hover:underline font-medium"
                                                >
                                                    Περισσότερα για {city.name} →
                                                </a>
                                            )}
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            );
                        })}
                </MapContainer>
            </div>

            {/* Legend / Πληροφορίες επιπέδου + back button */}
            <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-muted-foreground">
                        Κλίκαρε σε περιοχή / νομό / πόλη για να δεις τις συνταγές από εκεί.
                        {level === "region" && selectedRegion && (
                            <>
                                {" "}
                                Περιοχή {selectedRegion.name}: {visiblePrefCount} νομοί.
                            </>
                        )}
                        {level === "prefecture" && selectedPrefecture && (
                            <>
                                {" "}
                                Νομός {selectedPrefecture.name}: {visibleCityCount} πόλεις/χωριά.
                            </>
                        )}
                    </p>
                    {level !== "country" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={goUpOneLevel}
                            className="h-7 text-xs"
                        >
                            Πίσω ένα επίπεδο
                        </Button>
                    )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-1">
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-500" />
                        <span>Περιοχές με συνταγές</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
                        <span>Νομοί με συνταγές</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-full bg-fuchsia-500" />
                        <span>Πόλεις/Χωριά με συνταγές</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 rounded-full bg-gray-400" />
                        <span>Χωρίς συνταγές (ακόμη)</span>
                    </div>
                </div>
            </div>

            {/* Λίστα συνταγών κάτω από τον χάρτη */}
            {selectedLabel && (
                <div className="mt-4 border border-white/10 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-semibold">{selectedLabel}</p>
                        <span className="text-xs text-muted-foreground">
                            {selectedRecipes.length} συνταγές
                        </span>
                    </div>

                    {selectedRecipes.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            Δεν υπάρχουν ακόμη συνταγές για αυτή την περιοχή.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {selectedRecipes.slice(0, 6).map((r) => (
                                <RecipeCard
                                    key={r.id}
                                    // RecipeCard περιμένει full recipe object,
                                    // αν εδώ έχεις μόνο id/title/slug, μπορείς να περάσεις partial
                                    // ανάλογα με τον ορισμό του component.
                                    // Αν ο τύπος απαιτεί περισσότερα πεδία, μπορούμε να το
                                    // προσαρμόσουμε, αλλά συχνά το recipeCard παίρνει κάτι σαν:
                                    recipe={{
                                        id: r.id,
                                        title: r.title,
                                        slug: r.slug,
                                    } as any}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
