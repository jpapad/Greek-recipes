import { getPrefectures } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PrefectureEditButtonClient from "@/components/admin/PrefectureEditButtonClient";

// Force dynamic rendering so admin sees fresh DB data after edits/creates.
export const dynamic = 'force-dynamic';

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
                    prefectures.map((prefecture) => {
                        // Defensive: ensure id is a plain UUID string. In some preview cases
                        // an id value was observed to contain a full URL (likely from
                        // accidental client mutation or caching). Extract a UUID if present
                        // so the Link href is always well-formed.
                        const rawId = String(prefecture.id ?? '');
                        const uuidMatch = rawId.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
                        const safeId = uuidMatch ? uuidMatch[0] : encodeURIComponent(rawId);

                        return (
                        <GlassPanel key={prefecture.id} className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{prefecture.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Region: {prefecture.region?.name || 'N/A'} • Slug: {prefecture.slug}
                                    </p>
                                        <p className="text-xs text-muted-foreground mt-1">ID: {String(prefecture.id)}</p>
                                    {prefecture.description && (
                                        <p className="text-sm mt-2">{prefecture.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <PrefectureEditButtonClient prefecture={prefecture} />
                                </div>
                            </div>
                        </GlassPanel>
                    )})
                )}
            </div>
        </div>
    );
}
