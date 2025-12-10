"use client";

import { useMemo, useRef, useState } from "react";
import RegionDetailMap from "./RegionDetailMap";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RecipeCard } from "@/components/recipes/RecipeCard";

type RegionForClient = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

type PrefectureForClient = {
    id: string;
    name: string;
    slug?: string;
    lat: number;
    lng: number;
    recipeCount: number;
};

interface RegionDetailInteractiveSectionProps {
    region: RegionForClient;
    prefectures: PrefectureForClient[];
    recipes: any[];
}

export default function RegionDetailInteractiveSection({
    region,
    prefectures,
    recipes,
}: RegionDetailInteractiveSectionProps) {
    const [selectedPrefectureId, setSelectedPrefectureId] = useState<string | null>(
        null,
    );
    const recipesSectionRef = useRef<HTMLDivElement | null>(null);

    const filteredRecipes = useMemo(() => {
        if (!selectedPrefectureId) return recipes;
        return recipes.filter((r: any) => {
            const prefId = r.prefecture_id || r.prefectureId;
            return prefId === selectedPrefectureId;
        });
    }, [recipes, selectedPrefectureId]);

    const handlePrefectureClick = (id: string) => {
        setSelectedPrefectureId((prev) => (prev === id ? null : id));

        setTimeout(() => {
            recipesSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 150);
    };

    const activePrefecture = selectedPrefectureId
        ? prefectures.find((p) => p.id === selectedPrefectureId)
        : null;

    return (
        <div className="space-y-10">
            {/* Χάρτης */}
            {prefectures.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold pl-2 border-l-4 border-primary">
                        Γαστρονομικός Χάρτης της {region.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-2xl pl-2">
                        Πάτησε σε έναν νομό πάνω στον χάρτη ή στην λίστα για να δεις τις
                        συνταγές που προέρχονται από εκεί.
                    </p>

                    <RegionDetailMap
                        region={region}
                        prefectures={prefectures}
                        onPrefectureClick={handlePrefectureClick}
                    />
                </section>
            )}

            {/* Λίστα νομών */}
            {prefectures.length > 0 && (
                <section>
                    <h2 className="text-3xl font-bold mb-6 pl-2 border-l-4 border-primary">
                        Νομοί στην {region.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prefectures.map((pref) => {
                            const isActive = pref.id === selectedPrefectureId;
                            return (
                                <GlassPanel
                                    key={pref.id}
                                    className={`p-6 hover:shadow-lg transition-shadow cursor-pointer ${isActive ? "ring-2 ring-primary shadow-lg" : ""
                                        }`}
                                    onClick={() => handlePrefectureClick(pref.id)}
                                >
                                    <h3 className="text-xl font-semibold mb-2">{pref.name}</h3>

                                    <p className="text-xs text-muted-foreground mb-2">
                                        {pref.recipeCount} συνταγές από αυτόν τον νομό
                                    </p>

                                    {pref.slug && (
                                        <a
                                            href={`/prefectures/${pref.slug}`}
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
                        Recipes from {region.name}
                    </h2>

                    {activePrefecture && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                Φιλτράρονται συνταγές από τον νομό {activePrefecture.name} ·{" "}
                                {filteredRecipes.length} συνταγές
                            </span>
                            <button
                                onClick={() => setSelectedPrefectureId(null)}
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
