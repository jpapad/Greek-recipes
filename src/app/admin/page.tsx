import { getRecipes, getRegions } from "@/lib/api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { UtensilsCrossed, MapPin, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
    const recipes = await getRecipes();
    const regions = await getRegions();

    const stats = [
        {
            label: "Total Recipes",
            value: recipes.length,
            icon: UtensilsCrossed,
            href: "/admin/recipes",
        },
        {
            label: "Total Regions",
            value: regions.length,
            icon: MapPin,
            href: "/admin/regions",
        },
        {
            label: "Avg. Difficulty",
            value: "Medium",
            icon: TrendingUp,
            href: "#",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your Greek recipes and regions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link key={stat.label} href={stat.href}>
                        <GlassPanel className="p-6 hover:scale-105 transition-transform cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                </div>
                                <stat.icon className="w-12 h-12 text-primary/20" />
                            </div>
                        </GlassPanel>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                <div className="flex gap-4">
                    <Button asChild size="lg">
                        <Link href="/admin/recipes/new">Add New Recipe</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/admin/regions/new">Add New Region</Link>
                    </Button>
                </div>
            </GlassPanel>

            {/* Recent Recipes */}
            <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6">Recent Recipes</h2>
                <div className="space-y-4">
                    {recipes.slice(0, 5).map((recipe) => (
                        <div key={recipe.id} className="flex items-center justify-between p-4 bg-white/20 rounded-lg">
                            <div>
                                <h3 className="font-semibold">{recipe.title}</h3>
                                <p className="text-sm text-muted-foreground">{recipe.category}</p>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={`/admin/recipes/${recipe.id}/edit`}>Edit</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </GlassPanel>
        </div>
    );
}
