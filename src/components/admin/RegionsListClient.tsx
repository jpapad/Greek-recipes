"use client";

import React, { useRef, useState, useEffect } from "react";
import { Region, Prefecture } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { DeleteRegionButton } from "@/components/admin/DeleteRegionButton";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getPrefectures } from "@/lib/api";

interface Props {
    initialRegions: Region[];
}

export default function RegionsListClient({ initialRegions }: Props) {
    const [items, setItems] = useState<Region[]>(initialRegions || []);
    const [prefecturesByRegion, setPrefecturesByRegion] = useState<Record<string, Prefecture[]>>({});
    const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
    const [loadingPrefectures, setLoadingPrefectures] = useState<Set<string>>(new Set());
    const lastRemovedRef = useRef<{ item: Region | null; index: number | null }>({ item: null, index: null });

    const handleBeforeDelete = (id: string) => {
        setItems((prev) => {
            const idx = prev.findIndex((r) => r.id === id);
            if (idx === -1) return prev;
            const removed = prev[idx];
            lastRemovedRef.current = { item: removed, index: idx };
            const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
            return next;
        });
    };

    const handleDeleteFailed = () => {
        const removed = lastRemovedRef.current.item;
        const index = lastRemovedRef.current.index;
        if (!removed || index === null) return;
        setItems((prev) => {
            const copy = [...prev];
            copy.splice(index, 0, removed);
            return copy;
        });
        lastRemovedRef.current = { item: null, index: null };
    };

    const handleDeleted = () => {
        lastRemovedRef.current = { item: null, index: null };
    };

    const toggleRegionExpand = async (regionId: string) => {
        const isExpanded = expandedRegions.has(regionId);

        if (isExpanded) {
            // Collapse
            setExpandedRegions(prev => {
                const next = new Set(prev);
                next.delete(regionId);
                return next;
            });
        } else {
            // Expand and fetch prefectures if not already loaded
            setExpandedRegions(prev => new Set(prev).add(regionId));

            if (!prefecturesByRegion[regionId]) {
                setLoadingPrefectures(prev => new Set(prev).add(regionId));
                try {
                    const prefectures = await getPrefectures(regionId);
                    setPrefecturesByRegion(prev => ({ ...prev, [regionId]: prefectures }));
                } catch (error) {
                    console.error('Error fetching prefectures:', error);
                } finally {
                    setLoadingPrefectures(prev => {
                        const next = new Set(prev);
                        next.delete(regionId);
                        return next;
                    });
                }
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Regions</h1>
                    <p className="text-muted-foreground">Manage Greek regions</p>
                </div>
                <Button asChild size="lg">
                    <Link href="/admin/regions/new">
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Region
                    </Link>
                </Button>
            </div>

            <GlassPanel className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((region) => {
                        const isExpanded = expandedRegions.has(region.id);
                        const prefectures = prefecturesByRegion[region.id] || [];
                        const isLoading = loadingPrefectures.has(region.id);

                        return (
                            <GlassPanel key={region.id} className="p-6 bg-white/20">
                                <h3 className="text-xl font-bold mb-2">{region.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {region.description}
                                </p>

                                {/* Prefecture count and expand button */}
                                <button
                                    onClick={() => toggleRegionExpand(region.id)}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
                                >
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                        {isLoading ? 'Loading...' :
                                            isExpanded && prefectures.length > 0 ? `${prefectures.length} Prefecture${prefectures.length !== 1 ? 's' : ''}` :
                                                'Show Prefectures'}
                                    </span>
                                </button>

                                {/* Expandable prefecture list */}
                                {isExpanded && !isLoading && (
                                    <div className="mb-4 pl-6 space-y-1">
                                        {prefectures.length === 0 ? (
                                            <p className="text-xs text-muted-foreground">No prefectures found</p>
                                        ) : (
                                            prefectures.map(prefecture => (
                                                <div key={prefecture.id} className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">•</span>
                                                    <Link
                                                        href={`/admin/prefectures/${prefecture.id}/edit`}
                                                        className="hover:underline hover:text-primary"
                                                    >
                                                        {prefecture.name}
                                                    </Link>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button asChild variant="outline" size="sm" className="flex-1">
                                        <Link href={`/admin/regions/${region.id}/edit`}>
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <DeleteRegionButton
                                        id={region.id}
                                        name={region.name}
                                        onBeforeDelete={() => handleBeforeDelete(region.id)}
                                        onDeleteFailed={handleDeleteFailed}
                                        onDeleted={handleDeleted}
                                    />
                                </div>
                            </GlassPanel>
                        )
                    })}

                    {items.length === 0 && (
                        <div className="p-4 col-span-full">
                            <p className="text-center text-muted-foreground">No regions found.</p>
                        </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
}
