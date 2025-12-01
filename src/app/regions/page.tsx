import { getRegions } from "@/lib/api";
import { RegionCard } from "@/components/regions/RegionCard";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default async function RegionsPage() {
    const regions = await getRegions();

    return (
        <div className="space-y-8">
            <GlassPanel className="p-8 text-center bg-white/40">
                <h1 className="text-4xl font-bold mb-4">Culinary Regions of Greece</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore the diverse flavors and traditions from different parts of Greece.
                </p>
            </GlassPanel>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regions.map((region) => (
                    <RegionCard key={region.id} {...region} />
                ))}
            </div>
        </div>
    );
}
