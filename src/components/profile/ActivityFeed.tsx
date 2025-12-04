"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Heart, Star, ChefHat } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { supabase } from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
    id: string;
    user_id: string;
    activity_type: string;
    recipe_id: string;
    created_at: string;
    user_profiles?: {
        display_name: string;
        avatar_url: string;
    };
    recipes?: {
        title: string;
        slug: string;
    };
}

interface ActivityFeedProps {
    userId?: string; // If provided, show only this user's activity
    followingOnly?: boolean; // If true, show only activity from users you follow
}

export function ActivityFeed({ userId, followingOnly = false }: ActivityFeedProps) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, [userId, followingOnly]);

    const loadActivities = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('user_activities')
                .select(`
                    *,
                    user_profiles!inner(display_name, avatar_url),
                    recipes(title, slug)
                `)
                .order('created_at', { ascending: false })
                .limit(20);

            if (userId) {
                query = query.eq('user_id', userId);
            }

            // TODO: Add following filter when user auth is available
            // if (followingOnly) {
            //     const { data: following } = await supabase
            //         .from('user_follows')
            //         .select('following_id')
            //         .eq('follower_id', currentUser.id);
            //     query = query.in('user_id', following.map(f => f.following_id));
            // }

            const { data, error } = await query;

            if (error) throw error;
            setActivities(data || []);
        } catch (error) {
            console.error('Failed to load activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'favorited':
                return <Heart className="w-5 h-5 text-red-500" />;
            case 'reviewed':
                return <Star className="w-5 h-5 text-yellow-500" />;
            case 'cooked':
                return <ChefHat className="w-5 h-5 text-green-500" />;
            case 'created':
                return <Activity className="w-5 h-5 text-blue-500" />;
            default:
                return <Activity className="w-5 h-5" />;
        }
    };

    const getActivityText = (activity: ActivityItem) => {
        const name = activity.user_profiles?.display_name || 'Someone';
        const recipeTitle = activity.recipes?.title || 'a recipe';

        switch (activity.activity_type) {
            case 'favorited':
                return `${name} favorited ${recipeTitle}`;
            case 'reviewed':
                return `${name} reviewed ${recipeTitle}`;
            case 'cooked':
                return `${name} cooked ${recipeTitle}`;
            case 'created':
                return `${name} created ${recipeTitle}`;
            default:
                return `${name} interacted with ${recipeTitle}`;
        }
    };

    if (loading) {
        return (
            <GlassPanel className="p-6">
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="flex gap-3 animate-pulse">
                            <div className="w-12 h-12 bg-white/20 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/20 rounded w-3/4" />
                                <div className="h-3 bg-white/20 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </GlassPanel>
        );
    }

    if (activities.length === 0) {
        return (
            <GlassPanel className="p-12 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No recent activity</p>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
            </h3>

            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 items-start">
                        <div className="flex-shrink-0">
                            {getActivityIcon(activity.activity_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm">
                                {activity.recipes ? (
                                    <Link
                                        href={`/recipes/${activity.recipes.slug}`}
                                        className="hover:underline"
                                    >
                                        {getActivityText(activity)}
                                    </Link>
                                ) : (
                                    getActivityText(activity)
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
}
