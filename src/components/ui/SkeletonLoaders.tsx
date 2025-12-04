import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function SkeletonRecipeCard() {
    return (
        <Card className="overflow-hidden group">
            {/* Image skeleton */}
            <div className="relative aspect-[4/3] bg-muted">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Category badge */}
                <Skeleton className="h-5 w-20 rounded-full" />

                {/* Meta info */}
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </Card>
    );
}

export function SkeletonRecipeGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonRecipeCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonRecipeDetail() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero image */}
                <Skeleton className="w-full aspect-[21/9] rounded-3xl mb-8" />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <Skeleton className="h-px w-full" />

                        <div className="space-y-3">
                            <Skeleton className="h-6 w-32" />
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-4 w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-40" />
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonRegionCard() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <div className="p-6 space-y-3">
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center gap-4 pt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </Card>
    );
}
