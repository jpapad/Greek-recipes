import { getPrefectures } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminPrefecturesPage() {
    const prefectures = await getPrefectures();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Prefectures</h1>
                    <p className="text-muted-foreground mt-1">Greek prefectures (νομοί)</p>
                </div>
                <Link href="/admin/prefectures/new">
                    <Button size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Prefecture
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {prefectures.length === 0 ? (
                    <GlassPanel className="p-8 text-center">
                        <p className="text-muted-foreground">No prefectures found. Create one to get started!</p>
                    </GlassPanel>
                ) : (
                    prefectures.map((prefecture) => (
                        <GlassPanel key={prefecture.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{prefecture.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Region: {prefecture.region?.name || 'N/A'} • Slug: {prefecture.slug}
                                    </p>
                                    {prefecture.description && (
                                        <p className="text-sm mt-2">{prefecture.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/prefectures/${prefecture.id}/edit`}>
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
