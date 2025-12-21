import { requireAdminServer } from "@/lib/adminServerGuard";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Eye, Users, Search, Heart, Star } from "lucide-react";

export const metadata = {
    title: "Analytics | Admin Dashboard",
    description: "Site analytics and statistics",
};

async function getAnalytics() {
    const supabase = await getSupabaseServerClient();
    
    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    
    const [pageViewsResult, recipeViewsResult, searchQueriesResult, popularRecipesResult] = await Promise.all([
        supabase
            .from('page_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today),
        supabase
            .from('recipe_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today),
        supabase
            .from('search_queries')
            .select('query', { count: 'exact' })
            .gte('created_at', today)
            .limit(10)
            .order('created_at', { ascending: false }),
        supabase
            .from('popular_recipes')
            .select('*')
            .limit(10)
    ]);

    return {
        todayPageViews: pageViewsResult.count || 0,
        todayRecipeViews: recipeViewsResult.count || 0,
        recentSearches: searchQueriesResult.data || [],
        popularRecipes: popularRecipesResult.data || [],
        error: pageViewsResult.error || recipeViewsResult.error
    };
}

export default async function AnalyticsPage() {
    const { user } = await requireAdminServer();
    const analytics = await getAnalytics();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Analytics Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Track site performance and user behavior
                </p>
            </div>

            {analytics.error ? (
                <GlassPanel>
                    <div className="text-center py-12">
                        <p className="text-amber-600 dark:text-amber-400 mb-4">
                            Analytics tables not configured yet
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                            Run <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">analytics-schema.sql</code> in Supabase SQL Editor
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto text-left">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                This will create:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                                <li>page_views table - Track all page visits</li>
                                <li>recipe_views table - Track recipe views</li>
                                <li>search_queries table - Track search behavior</li>
                                <li>Materialized views for fast stats</li>
                                <li>RLS policies for admin-only access</li>
                            </ul>
                        </div>
                    </div>
                </GlassPanel>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.todayPageViews}</div>
                                <p className="text-xs text-muted-foreground">Page views today</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Recipe Views</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.todayRecipeViews}</div>
                                <p className="text-xs text-muted-foreground">Recipes viewed today</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Searches</CardTitle>
                                <Search className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.recentSearches.length}</div>
                                <p className="text-xs text-muted-foreground">Search queries today</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Popular</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{analytics.popularRecipes.length}</div>
                                <p className="text-xs text-muted-foreground">Top recipes</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Popular Recipes */}
                    <GlassPanel>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Most Popular Recipes
                        </h2>
                        <div className="space-y-3">
                            {analytics.popularRecipes.map((recipe: any) => (
                                <div
                                    key={recipe.id}
                                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {recipe.image_url && (
                                            <img
                                                src={recipe.image_url}
                                                alt={recipe.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {recipe.title}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {recipe.view_count || 0} views
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart className="h-3 w-3" />
                                                    {recipe.favorite_count || 0} favorites
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Star className="h-3 w-3" />
                                                    {recipe.avg_rating ? recipe.avg_rating.toFixed(1) : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>

                    {/* Recent Searches */}
                    <GlassPanel>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Recent Searches
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {analytics.recentSearches.map((search: any, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    {search.query}
                                </span>
                            ))}
                        </div>
                    </GlassPanel>
                </>
            )}
        </div>
    );
}
