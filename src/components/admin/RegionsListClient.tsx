"use client";

import React, { useRef, useState } from "react";
import { Region } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteRegionButton } from "@/components/admin/DeleteRegionButton";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Props {
    initialRegions: Region[];
}

export default function RegionsListClient({ initialRegions }: Props) {
    const [items, setItems] = useState<Region[]>(initialRegions || []);
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
                    {items.map((region) => (
                        <GlassPanel key={region.id} className="p-6 bg-white/20">
                            <h3 className="text-xl font-bold mb-2">{region.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {region.description}
                            </p>
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
                    ))}

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
