import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { MediaUploader, MediaGrid } from "@/components/admin/MediaManager";

async function getMediaFiles() {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.storage.from("media").list();

    if (error || !data) {
        console.error("Error fetching media:", error);
        return [];
    }

    const filesWithUrls = await Promise.all(
        data.map(async (file) => {
            const {
                data: { publicUrl },
            } = supabase.storage.from("media").getPublicUrl(file.name);

            return {
                name: file.name,
                url: publicUrl,
                size: file.metadata?.size || 0,
                created_at: file.created_at,
            };
        })
    );

    return filesWithUrls;
}

export default async function MediaPage() {
    await requireAdminServer();

    const files = await getMediaFiles();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
                <p className="text-muted-foreground mt-1">
                    Upload and manage images for recipes and regions
                </p>
            </div>

            {/* Upload */}
            <MediaUploader />

            {/* Gallery */}
            <MediaGrid files={files} />
        </div>
    );
}
