import { Suspense } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AuthorCard } from "@/components/community/AuthorCard";
import { getAuthors } from "@/lib/blog-api";
import { supabase } from "@/lib/supabaseClient";
import { ChefHat, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const revalidate = 3600; // Revalidate every hour

async function getAuthorsWithStats() {
    // 1. Get authors from user_roles
    const authors = await getAuthors();

    // 2. Get recipe counts for each author
    // We do this by fetching all recipes and aggregating (or using rpc if available, but for now client-side agg is fine for MVP)
    // Note: In production with many users, we should use a Supabase Function or view.
    const { data: recipes } = await supabase
        .from('recipes')
        .select('user_id');

    const recipeCounts = new Map<string, number>();
    recipes?.forEach(r => {
        if (r.user_id) {
            recipeCounts.set(r.user_id, (recipeCounts.get(r.user_id) || 0) + 1);
        }
    });

    // Merge stats
    return authors.map(author => ({
        ...author,
        recipe_count: recipeCounts.get(author.user_id) || 0
    })).sort((a, b) => (b.recipe_count || 0) - (a.recipe_count || 0)); // Sort by recipe count
}

export default async function AuthorsPage() {
    const authors = await getAuthorsWithStats();

    return (
        <div className="min-h-screen py-12 container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-16 space-y-4 animate-in slide-in-from-bottom-5 duration-700 fade-in">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <Users className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 pb-2">
                    Η Κοινότητά μας
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Γνωρίστε τους ταλαντούχους δημιουργούς πίσω από τις αγαπημένες σας συνταγές.
                    Ανακαλύψτε το πάθος τους για την ελληνική κουζίνα!
                </p>
            </div>

            {/* Grid */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <GlassPanel key={i} className="h-64" />
                    ))}
                </div>
            }>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {authors.length > 0 ? (
                        authors.map((author, index) => (
                            <div
                                key={author.user_id}
                                className="animate-in zoom-in duration-500 fill-mode-backwards"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <AuthorCard author={author} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-xl">Δεν βρέθηκαν δημιουργοί ακόμα.</p>
                        </div>
                    )}
                </div>
            </Suspense>
        </div>
    );
}
