"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { getRecipes } from "@/lib/api";
import { Recipe } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
import { User, Heart, BookMarked, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const { favorites } = useFavorites();
    const router = useRouter();

    useEffect(() => {
        loadUserData();
    }, [favorites]);

    async function loadUserData() {
        try {
            const userData = await getUser();
            if (!userData) {
                router.push('/login');
                return;
            }

            setUser(userData);

            // Load favorite recipes
            if (favorites.length > 0) {
                const allRecipes = await getRecipes();
                const favRecipes = allRecipes.filter(r => favorites.includes(r.id));
                setFavoriteRecipes(favRecipes);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 pt-24">
                <GlassPanel className="h-48 animate-pulse" />
                <GlassPanel className="h-96 animate-pulse" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-8 pt-24">
            {/* Profile Header */}
            <GlassPanel className="p-8 bg-white/40">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Χρήστης'}
                            </h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex gap-6 mt-4 text-sm">
                                <div>
                                    <span className="font-semibold text-primary">{favorites.length}</span>
                                    <span className="text-muted-foreground ml-1">Αγαπημένες</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-primary">0</span>
                                    <span className="text-muted-foreground ml-1">Συλλογές</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Ρυθμίσεις
                    </Button>
                </div>
            </GlassPanel>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/favorites">
                    <GlassPanel className="p-6 hover:scale-105 transition-transform cursor-pointer h-full">
                        <Heart className="w-8 h-8 text-red-500 mb-3" />
                        <h3 className="text-lg font-bold mb-1">Αγαπημένες Συνταγές</h3>
                        <p className="text-sm text-muted-foreground">
                            {favorites.length} αποθηκευμένες συνταγές
                        </p>
                    </GlassPanel>
                </Link>

                <Link href="/collections">
                    <GlassPanel className="p-6 hover:scale-105 transition-transform cursor-pointer h-full">
                        <BookMarked className="w-8 h-8 text-blue-500 mb-3" />
                        <h3 className="text-lg font-bold mb-1">Οι Συλλογές μου</h3>
                        <p className="text-sm text-muted-foreground">
                            Οργανώστε τις συνταγές σας
                        </p>
                    </GlassPanel>
                </Link>

                <Link href="/meal-plan">
                    <GlassPanel className="p-6 hover:scale-105 transition-transform cursor-pointer h-full">
                        <Calendar className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="text-lg font-bold mb-1">Εβδομαδιαίο Πρόγραμμα</h3>
                        <p className="text-sm text-muted-foreground">
                            Προγραμματίστε τα γεύματά σας
                        </p>
                    </GlassPanel>
                </Link>
            </div>

            {/* Favorite Recipes */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Αγαπημένες Συνταγές</h2>
                    {favorites.length > 4 && (
                        <Link href="/favorites">
                            <Button variant="outline">Προβολή Όλων</Button>
                        </Link>
                    )}
                </div>

                {favoriteRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favoriteRecipes.slice(0, 4).map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                ) : (
                    <GlassPanel className="p-16 text-center">
                        <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Δεν έχετε αγαπημένες ακόμα</h3>
                        <p className="text-muted-foreground mb-6">
                            Ανακαλύψτε συνταγές και αποθηκεύστε τις αγαπημένες σας
                        </p>
                        <Link href="/recipes">
                            <Button>Εξερεύνηση Συνταγών</Button>
                        </Link>
                    </GlassPanel>
                )}
            </div>
        </div>
    );
}
