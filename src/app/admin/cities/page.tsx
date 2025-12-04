import { getCities } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";

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
                                    <Link href={`/admin/cities/${city.id}/edit`}>
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
