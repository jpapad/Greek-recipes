"use client";

import { GlassPanel } from "./GlassPanel";

export function RecipeCardSkeleton() {
    return (
        <GlassPanel className="h-[400px] overflow-hidden">
            <div className="relative h-48 bg-white/20 animate-pulse" />
            <div className="p-6 space-y-4">
                <div className="flex gap-2">
                    <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-white/20 rounded-full animate-pulse" />
                </div>
                <div className="h-7 bg-white/20 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-white/20 rounded animate-pulse w-full" />
                <div className="h-4 bg-white/20 rounded animate-pulse w-5/6" />
                <div className="flex gap-4 pt-4">
                    <div className="h-10 bg-white/20 rounded animate-pulse flex-1" />
                    <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse" />
                </div>
            </div>
        </GlassPanel>
    );
}

export function RecipeDetailSkeleton() {
    return (
        <div className="space-y-8">
            {/* Hero Skeleton */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-white/20 animate-pulse" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <GlassPanel className="p-6 space-y-4">
                        <div className="h-6 bg-white/20 rounded animate-pulse w-1/3" />
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-20 bg-white/20 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6 space-y-4">
                        <div className="h-6 bg-white/20 rounded animate-pulse w-1/2" />
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-4 bg-white/20 rounded animate-pulse" />
                        ))}
                    </GlassPanel>
                </div>

                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassPanel className="p-6 space-y-4">
                        <div className="h-6 bg-white/20 rounded animate-pulse w-1/4" />
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-5 bg-white/20 rounded animate-pulse" />
                        ))}
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}

export function RegionCardSkeleton() {
    return (
        <GlassPanel className="h-[300px] overflow-hidden">
            <div className="relative h-full bg-white/20 animate-pulse" />
        </GlassPanel>
    );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="h-10 bg-white/20 rounded animate-pulse" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, colIdx) => (
                        <div key={colIdx} className="h-12 bg-white/20 rounded animate-pulse" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="space-y-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-24" />
                    <div className="h-10 bg-white/20 rounded animate-pulse w-full" />
                </div>
            ))}
            <div className="flex gap-3">
                <div className="h-10 bg-white/20 rounded animate-pulse w-32" />
                <div className="h-10 bg-white/20 rounded animate-pulse w-24" />
            </div>
        </div>
    );
}
