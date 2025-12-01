import { getRegions } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DeleteRegionButton } from "@/components/admin/DeleteRegionButton";

export default async function AdminRegionsPage() {
    const regions = await getRegions();

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
                    {regions.map((region) => (
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
                                <DeleteRegionButton id={region.id} name={region.name} />
                            </div>
                        </GlassPanel>
                    ))}
                </div>
            </GlassPanel>
        </div>
    );
}
