import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/StatCard";
import { Plus, ArrowRight, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
    const supabase = await getSupabaseServerClient();

    const [recipesResult, regionsResult, prefecturesResult, citiesResult] =
        await Promise.all([
            supabase.from("recipes").select("id", { count: "exact", head: true }),
            supabase.from("regions").select("id", { count: "exact", head: true }),
            supabase
                .from("prefectures")
                .select("id", { count: "exact", head: true }),
            supabase.from("cities").select("id", { count: "exact", head: true }),
        ]);

    return {
        recipes: recipesResult.count || 0,
        regions: regionsResult.count || 0,
        prefectures: prefecturesResult.count || 0,
        cities: citiesResult.count || 0,
    };
}

async function getRecentRecipes() {
    const supabase = await getSupabaseServerClient();

    const { data: recipes } = await supabase
        .from("recipes")
        .select("id, title, category, created_at, image_url")
        .order("created_at", { ascending: false })
        .limit(5);

    return recipes || [];
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();
    const recentRecipes = await getRecentRecipes();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here's an overview of your content.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Recipes"
                    value={stats.recipes}
                    iconName="recipe"
                    description="Published recipes"
                />
                <StatCard
                    title="Regions"
                    value={stats.regions}
                    iconName="region"
                    description="Greek regions"
                />
                <StatCard
                    title="Prefectures"
                    value={stats.prefectures}
                    iconName="prefecture"
                    description="Administrative divisions"
                />
                <StatCard
                    title="Cities"
                    value={stats.cities}
                    iconName="city"
                    description="Cities & towns"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Recipes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Recipes</CardTitle>
                        <Link href="/admin/recipes">
                            <Button variant="ghost" size="sm">
                                View all
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentRecipes.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No recipes yet. Create your first one!
                                </div>
                            ) : (
                                recentRecipes.map((recipe) => (
                                    <Link
                                        key={recipe.id}
                                        href={`/admin/recipes/${recipe.id}/edit`}
                                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        {recipe.image_url ? (
                                            <img
                                                src={recipe.image_url}
                                                alt={recipe.title}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                                <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {recipe.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {recipe.category || "Uncategorized"}
                                            </p>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(
                                                recipe.created_at
                                            ).toLocaleDateString()}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/admin/recipes/new">
                            <Button className="w-full justify-start gap-2" size="lg">
                                <Plus className="h-5 w-5" />
                                Create New Recipe
                            </Button>
                        </Link>
                        <Link href="/admin/regions/new">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                size="lg"
                            >
                                <Plus className="h-5 w-5" />
                                Add New Region
                            </Button>
                        </Link>
                        <Link href="/admin/media">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                size="lg"
                            >
                                <Plus className="h-5 w-5" />
                                Upload Media
                            </Button>
                        </Link>
                        <Link href="/admin/settings">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                size="lg"
                            >
                                <ArrowRight className="h-5 w-5" />
                                Site Settings
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
