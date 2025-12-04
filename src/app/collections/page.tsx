"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { BookMarked } from 'lucide-react';
import Link from "next/link";
import { getCollections } from "@/lib/collections-api";
import type { Collection } from "@/lib/types";

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCollections();
    }, []);

    async function loadCollections() {
        try {
            // Frontend loads only PUBLIC collections
            const data = await getCollections({ isPublic: true });
            setCollections(data);
        } catch (error) {
            console.error('Error loading collections:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">Φόρτωση...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section with Gradient Background */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-600/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                        Recipe Collections
                    </h1>
                    <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
                        Ανακαλύψτε θεματικές συλλογές με τις καλύτερες ελληνικές συνταγές
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 pb-16 relative z-10">
                {collections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection) => (
                            <Link href={`/collections/${collection.slug}`} key={collection.id}>
                                <GlassPanel className="overflow-hidden group hover:shadow-2xl transition-all cursor-pointer h-full">
                                    {collection.image_url && (
                                        <div className="aspect-video w-full overflow-hidden">
                                            <img
                                                src={collection.image_url}
                                                alt={collection.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {collection.name}
                                        </h3>

                                        {collection.description && (
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                                {collection.description}
                                            </p>
                                        )}

                                        <div className="pt-4 border-t border-white/10">
                                            <span className="text-sm font-medium text-primary">
                                                {collection.recipe_count || 0} συνταγές →
                                            </span>
                                        </div>
                                    </div>
                                </GlassPanel>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-16 text-center max-w-2xl mx-auto">
                        <BookMarked className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Δεν υπάρχουν συλλογές ακόμα</h3>
                        <p className="text-muted-foreground">
                            Οι θεματικές συλλογές συνταγών θα εμφανιστούν εδώ
                        </p>
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
