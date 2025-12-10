"use client";

import { useMemo, useRef, useState } from "react";
import PrefectureDetailMap from "./PrefectureDetailMap";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RecipeCard } from "@/components/recipes/RecipeCard";

type PrefectureForClient = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

type CityForClient = {
    id: string;
    name: string;
    slug?: string;
    lat: number;
    lng: number;
    recipeCount: number;
};

interface PrefectureDetailInteractiveSectionProps {
    prefecture: PrefectureForClient;
    cities: CityForClient[];
    recipes: any[];
}

export default function PrefectureDetailInteractiveSection({
    prefecture,
    cities,
    recipes,
}: PrefectureDetailInteractiveSectionProps) {
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
    const recipesSectionRef = useRef<HTMLDivElement | null>(null);

    const filteredRecipes = useMemo(() => {
        if (!selectedCityId) return recipes;
        return recipes.filter((r: any) => {
            const cityId = r.city_id || r.cityId;
            return cityId === selectedCityId;
        });
    }, [recipes, selectedCityId]);

    const handleCityClick = (id: string) => {
        setSelectedCityId((prev) => (prev === id ? null : id));

        setTimeout(() => {
            recipesSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 150);
    };

    const activeCity = selectedCityId
        ? cities.find((c) => c.id === selectedCityId)
        : null;

    return (
        <div className="space-y-10">
            {/* Χάρτης */}
            {cities.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold pl-2 border-l-4 border-primary">
                        Γαστρονομικός Χάρτης του νομού {prefecture.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-2xl pl-2">
                        Πάτησε σε μια πόλη ή χωριό πάνω στον χάρτη ή στη λίστα για να δεις
                        τις συνταγές που προέρχονται από εκεί.
                    </p>

                    <PrefectureDetailMap
                        prefecture={prefecture}
                        cities={cities}
                        onCityClick={handleCityClick}
                    />
                </section>
            )}

            {/* Λίστα πόλεων / χωριών */}
            {cities.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-primary">
                        Πόλεις & Χωριά του νομού {prefecture.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cities.map((city) => {
                            const isActive = city.id === selectedCityId;
                            return (
                                <GlassPanel
                                    key={city.id}
                                    className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${isActive ? "ring-2 ring-primary shadow-lg" : ""
                                        }`}
                                    onClick={() => handleCityClick(city.id)}
                                >
                                    <h3 className="text-xl font-semibold mb-2">{city.name}</h3>

                                    <p className="text-xs text-muted-foreground mb-2">
                                        {city.recipeCount} συνταγές από εδώ
                                    </p>

                                    {city.slug && (
                                        <a
                                            href={`/cities/${city.slug}`}
                                            className="text-primary hover:underline text-sm font-medium"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Δείτε περισσότερα →
                                        </a>
                                    )}
                                </GlassPanel>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Συνταγές (φιλτραρισμένες) */}
            <section ref={recipesSectionRef}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h2 className="text-3xl font-bold pl-2 border-l-4 border-primary">
                        Συνταγές από τον νομό {prefecture.name}
                    </h2>

                    {activeCity && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                Φιλτράρονται συνταγές από {activeCity.name} ·{" "}
                                {filteredRecipes.length} συνταγές
                            </span>
                            <button
                                onClick={() => setSelectedCityId(null)}
                                className="text-xs text-muted-foreground hover:text-primary underline"
                            >
                                Καθαρισμός φίλτρου
                            </button>
                        </div>
                    )}
                </div>

                {filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRecipes.map((recipe: any) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-8 text-center">
                        <p className="text-muted-foreground">
                            Δεν βρέθηκαν συνταγές για αυτή την επιλογή.
                        </p>
                    </GlassPanel>
                )}
            </section>
        </div>
    );
}
