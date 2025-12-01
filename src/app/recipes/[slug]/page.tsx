import { getRecipeBySlug, getReviews } from "@/lib/api";
import { Metadata } from "next";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Users, ChefHat, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecipeReviews } from "@/components/reviews/RecipeReviews";
import { ShoppingListButton } from "@/components/shopping/ShoppingListButton";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        return {
            title: "Recipe Not Found",
        };
    }

    return {
        title: recipe.title,
        description: recipe.short_description,
        openGraph: {
            title: recipe.title,
            description: recipe.short_description,
            images: [
                {
                    url: recipe.image_url,
                    width: 1200,
                    height: 630,
                    alt: recipe.title,
                },
            ],
        },
    };
}

export default async function RecipeDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) {
        notFound();
    }

    const reviews = await getReviews(recipe.id);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                    src={recipe.image_url || "/placeholder-recipe.jpg"}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <div className="flex flex-wrap gap-3 mb-4">
                        {recipe.category && (
                            <Badge className="bg-primary hover:bg-primary/90 text-lg px-4 py-1">{recipe.category}</Badge>
                        )}
                        {recipe.region && (
                            <Link href={`/regions/${recipe.region.slug}`}>
                                <Badge variant="outline" className="text-white border-white/50 hover:bg-white/20 text-lg px-4 py-1 flex items-center gap-2 cursor-pointer">
                                    <MapPin className="w-4 h-4" /> {recipe.region.name}
                                </Badge>
                            </Link>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{recipe.title}</h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl drop-shadow-md mb-8">
                        {recipe.short_description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href={`/recipes/${recipe.slug}/cook`}>
                            <Button size="lg" className="rounded-full text-lg px-8 bg-white text-primary hover:bg-gray-100 border-0 shadow-lg">
                                Start Cooking Mode <ChefHat className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        {recipe.ingredients && (
                            <ShoppingListButton
                                ingredients={recipe.ingredients}
                                recipeId={recipe.id}
                                recipeTitle={recipe.title}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Ingredients */}
                <div className="lg:col-span-1 space-y-8">
                    <GlassPanel className="p-6 space-y-6">
                        <h3 className="text-xl font-bold border-b border-border/50 pb-2">Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl">
                                <Clock className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-sm text-muted-foreground">Time</span>
                                <span className="font-bold">{recipe.time_minutes}m</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl">
                                <ChefHat className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-sm text-muted-foreground">Difficulty</span>
                                <span className="font-bold capitalize">{recipe.difficulty}</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl col-span-2">
                                <Users className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-sm text-muted-foreground">Servings</span>
                                <span className="font-bold">{recipe.servings} People</span>
                            </div>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6">
                        <h3 className="text-xl font-bold border-b border-border/50 pb-4 mb-4">Ingredients</h3>
                        <ul className="space-y-3">
                            {recipe.ingredients?.map((ingredient, index) => (
                                <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/20 transition-colors">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                    <span className="text-foreground/90">{ingredient}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassPanel>
                </div>

                {/* Right Column: Steps & Reviews */}
                <div className="lg:col-span-2 space-y-8">
                    <GlassPanel className="p-8">
                        <h3 className="text-2xl font-bold border-b border-border/50 pb-4 mb-6">Instructions</h3>
                        <div className="space-y-8">
                            {Array.isArray(recipe.steps) ? (
                                recipe.steps.map((step, index) => (
                                    <div key={index} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="pt-1">
                                            <p className="text-lg leading-relaxed text-foreground/90">{step}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="prose prose-lg dark:prose-invert">
                                    {/* Fallback if steps is JSON or string */}
                                    {JSON.stringify(recipe.steps)}
                                </div>
                            )}
                        </div>
                    </GlassPanel>

                    {/* Reviews Section */}
                    <GlassPanel className="p-8">
                        <RecipeReviews recipeId={recipe.id} initialReviews={reviews} />
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
}
