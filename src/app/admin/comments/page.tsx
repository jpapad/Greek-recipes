import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Check, X, Flag, Trash2 } from "lucide-react";

export const metadata = {
    title: "Comments Moderation | Admin Dashboard",
    description: "Moderate user comments",
};

async function getComments() {
    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('recipe_comments')
        .select(`
            *,
            recipe:recipes(title, slug),
            user:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

    return { comments: data || [], error };
}

export default async function CommentsPage() {
    const { user } = await requireAdminServer();
    const { comments, error } = await getComments();

    const pending = comments.filter((c: any) => c.status === 'pending');
    const approved = comments.filter((c: any) => c.status === 'approved');
    const rejected = comments.filter((c: any) => c.status === 'rejected');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="h-8 w-8" />
                    Comments Moderation
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Review and moderate user comments
                </p>
            </div>

            {error ? (
                <GlassPanel>
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Comments system not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">activity-notifications-schema.sql</code> in Supabase
                        </p>
                    </div>
                </GlassPanel>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                        <GlassPanel className="text-center">
                            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
                            <p className="text-sm text-muted-foreground">Pending</p>
                        </GlassPanel>
                        <GlassPanel className="text-center">
                            <p className="text-2xl font-bold text-green-600">{approved.length}</p>
                            <p className="text-sm text-muted-foreground">Approved</p>
                        </GlassPanel>
                        <GlassPanel className="text-center">
                            <p className="text-2xl font-bold text-red-600">{rejected.length}</p>
                            <p className="text-sm text-muted-foreground">Rejected</p>
                        </GlassPanel>
                        <GlassPanel className="text-center">
                            <p className="text-2xl font-bold">{comments.length}</p>
                            <p className="text-sm text-muted-foreground">Total</p>
                        </GlassPanel>
                    </div>

                    {/* Pending Comments */}
                    {pending.length > 0 && (
                        <GlassPanel>
                            <h2 className="text-xl font-semibold mb-4 text-amber-600 flex items-center gap-2">
                                <Flag className="h-5 w-5" />
                                Pending Review ({pending.length})
                            </h2>
                            <div className="space-y-4">
                                {pending.map((comment: any) => (
                                    <div key={comment.id} className="p-4 bg-background/50 rounded-lg border border-amber-200 dark:border-amber-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {comment.user?.full_name || 'Anonymous'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    on {comment.recipe?.title}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-amber-600">
                                                Pending
                                            </Badge>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {comment.content}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                <Check className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive">
                                                <X className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Flag className="h-4 w-4 mr-1" />
                                                Spam
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassPanel>
                    )}

                    {/* All Comments */}
                    <GlassPanel>
                        <h2 className="text-xl font-semibold mb-4">All Comments</h2>
                        <div className="space-y-3">
                            {comments.map((comment: any) => (
                                <div key={comment.id} className="p-3 bg-background/50 rounded-lg flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium text-sm">{comment.user?.full_name || 'Anonymous'}</p>
                                            <Badge variant={
                                                comment.status === 'approved' ? 'default' :
                                                comment.status === 'pending' ? 'secondary' :
                                                'destructive'
                                            } className="text-xs">
                                                {comment.status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {comment.content}
                                        </p>
                                    </div>
                                    <Button size="icon" variant="ghost">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </>
            )}
        </div>
    );
}
