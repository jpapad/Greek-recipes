"use client";

import { useEffect, useState } from "react";
import { getRecipes, getRegions, getPrefectures, getCities } from "@/lib/api";
import { getArticles } from "@/lib/blog-api";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { UtensilsCrossed, MapPin, TrendingUp, Building2, Home, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApiUsageTracker } from "@/components/admin/ApiUsageTracker";
import { useTranslations } from "@/hooks/useTranslations";
import { Recipe, Region, Prefecture, City } from "@/lib/types";

export default function AdminDashboard() {
    const { t } = useTranslations();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [articles, setArticles] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            const [recipesData, regionsData, prefecturesData, citiesData, articlesData] = await Promise.all([
                getRecipes(),
                getRegions(),
                getPrefectures(),
                getCities(),
                getArticles()
            ]);
            setRecipes(recipesData);
            setRegions(regionsData);
            setPrefectures(prefecturesData);
            setCities(citiesData);
            setArticles(articlesData);
        }
        loadData();
    }, []);

    const stats = [
        {
            label: t('Dashboard.totalRecipes'),
            value: recipes.length,
            icon: UtensilsCrossed,
            href: "/admin/recipes",
        },
        {
            label: t('Dashboard.totalArticles'),
            value: articles.length,
            icon: FileText,
            href: "/admin/articles",
        },
        {
            label: t('Dashboard.totalRegions'),
            value: regions.length,
            icon: MapPin,
            href: "/admin/regions",
        },
        {
            label: t('Dashboard.totalPrefectures'),
            value: prefectures.length,
            icon: Building2,
            href: "/admin/prefectures",
        },
        {
            label: t('Dashboard.totalCities'),
            value: cities.length,
            icon: Home,
            href: "/admin/cities",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">{t('Dashboard.title')}</h1>
                <p className="text-muted-foreground">{t('Dashboard.subtitle')}</p>
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

            {/* API Usage Tracker - Admin Only */}
            <ApiUsageTracker />

            {/* Quick Actions */}
            <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6">{t('Dashboard.quickActions')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild size="lg">
                        <Link href="/admin/recipes/new">{t('Dashboard.addRecipe')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/admin/articles/new">{t('Dashboard.addArticle')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/admin/regions/new">{t('Dashboard.addRegion')}</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/admin/authors">{t('Dashboard.manageAuthors')}</Link>
                    </Button>
                </div>
            </GlassPanel>

            {/* Recent Recipes */}
            <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6">{t('Dashboard.recentRecipes')}</h2>
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
