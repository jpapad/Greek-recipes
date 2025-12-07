import { getCities } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";

function safeId(id: string | undefined) {
    if (!id) return "";
    try {
        const dec = decodeURIComponent(String(id));
        const match = dec.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        if (match) return match[0];
        return encodeURIComponent(dec);
    } catch (e) {
        return encodeURIComponent(String(id));
    }
}

// Force dynamic rendering so admin sees fresh DB data after edits/creates.
export const dynamic = 'force-dynamic';

export default async function AdminCitiesPage() {
    const cities = await getCities();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Cities</h1>
                    <p className="text-muted-foreground mt-1">Greek cities and villages (πόλεις/χωριά)</p>
                </div>
                <Link href="/admin/cities/new">
                    <Button size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Add City
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {cities.length === 0 ? (
                    <GlassPanel className="p-8 text-center">
                        <p className="text-muted-foreground">No cities found. Create one to get started!</p>
                    </GlassPanel>
                ) : (
                    cities.map((city) => (
                        <GlassPanel key={city.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{city.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Prefecture: {city.prefecture?.name || 'N/A'} • 
                                        Region: {city.prefecture?.region?.name || 'N/A'} • 
                                        Slug: {city.slug}
                                    </p>
                                    {city.description && (
                                        <p className="text-sm mt-2">{city.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                        <Link href={`/admin/cities/${safeId(city.id)}/edit?id=${safeId(city.id)}`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </GlassPanel>
                    ))
                )}
            </div>
        </div>
    );
}
