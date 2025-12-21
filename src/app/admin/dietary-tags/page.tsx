import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Dietary Tags | Admin Dashboard",
    description: "Manage dietary filters and tags",
};

async function getDietaryTags() {
    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('dietary_tags')
        .select(`
            *,
            recipe_dietary_tags(count)
        `)
        .order('name_el', { ascending: true });

    return { tags: data || [], error };
}

export default async function DietaryTagsPage() {
    const { user } = await requireAdminServer();
    const { tags, error } = await getDietaryTags();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dietary Tags
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage dietary filters (Vegan, Gluten-Free, etc.)
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/dietary-tags/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tag
                    </Link>
                </Button>
            </div>

            {error ? (
                <GlassPanel>
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Dietary tags not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ingredients-dietary-schema.sql</code> to create dietary tags
                        </p>
                    </div>
                </GlassPanel>
            ) : (
                <GlassPanel>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tags.map((tag: any) => (
                            <Link
                                key={tag.id}
                                href={`/admin/dietary-tags/${tag.id}/edit`}
                                className="p-4 bg-background/50 rounded-lg hover:bg-accent transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl">{tag.icon}</span>
                                    <Badge
                                        style={{ backgroundColor: tag.color }}
                                        className="text-white"
                                    >
                                        {tag.recipe_dietary_tags?.[0]?.count || 0} recipes
                                    </Badge>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {tag.name_el}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {tag.name_en}
                                </p>
                                {tag.description && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {tag.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>

                    {tags.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">
                                No dietary tags yet. Run the SQL migration to add default tags.
                            </p>
                        </div>
                    )}
                </GlassPanel>
            )}
        </div>
    );
}
