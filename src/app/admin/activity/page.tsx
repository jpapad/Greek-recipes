import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { el } from "date-fns/locale";
import { 
    Activity, FileText, User, MapPin, Tag, 
    Plus, Edit, Trash2, CheckCircle, XCircle 
} from "lucide-react";

export const metadata = {
    title: "Activity Timeline | Admin Dashboard",
    description: "Real-time activity feed",
};

const actionIcons = {
    created: Plus,
    updated: Edit,
    deleted: Trash2,
    published: CheckCircle,
    unpublished: XCircle,
};

const entityIcons = {
    recipe: FileText,
    article: FileText,
    region: MapPin,
    user: User,
    ingredient: Tag,
};

async function getActivities() {
    const supabase = await getSupabaseServerClient();
    
    const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

    return { activities: data || [], error };
}

export default async function ActivityTimelinePage() {
    const { user } = await requireAdminServer();
    const { activities, error } = await getActivities();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-8 w-8" />
                    Activity Timeline
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Real-time feed of all admin actions
                </p>
            </div>

            {error ? (
                <GlassPanel>
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Activity log not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">activity-notifications-schema.sql</code> in Supabase
                        </p>
                    </div>
                </GlassPanel>
            ) : (
                <GlassPanel>
                    <div className="space-y-4">
                        {activities.map((activity: any) => {
                            const ActionIcon = actionIcons[activity.action as keyof typeof actionIcons] || Activity;
                            const EntityIcon = entityIcons[activity.entity_type as keyof typeof entityIcons] || FileText;
                            
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-4 bg-background/50 rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <ActionIcon className="h-5 w-5 text-primary" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <EntityIcon className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {activity.user_email || 'System'}
                                            </p>
                                            <Badge variant="outline" className="text-xs">
                                                {activity.action}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {activity.entity_type}
                                            </Badge>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {activity.entity_title || `${activity.entity_type} #${activity.entity_id?.slice(0, 8)}`}
                                        </p>
                                        
                                        {activity.changes && Object.keys(activity.changes).length > 0 && (
                                            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                                <pre className="overflow-x-auto">
                                                    {JSON.stringify(activity.changes, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(activity.created_at), { 
                                            addSuffix: true,
                                            locale: el 
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {activities.length === 0 && (
                            <div className="text-center py-12">
                                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    No activity yet
                                </p>
                            </div>
                        )}
                    </div>
                </GlassPanel>
            )}
        </div>
    );
}
