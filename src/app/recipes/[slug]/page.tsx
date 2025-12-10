import { getRecipeBySlug, getReviews } from "@/lib/api";
import { Metadata } from "next";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { notFound } from "next/navigation";
import { Clock, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecipeReviews } from "@/components/reviews/RecipeReviews";
import { ShoppingListButton } from "@/components/shopping/ShoppingListButton";
import { RecipeShareButton } from "@/components/recipes/RecipeShareButton";
import { RecipePrintButton } from "@/components/recipes/RecipePrintButton";
import { NutritionFacts } from "@/components/recipes/NutritionFacts";
import { EquipmentList } from "@/components/recipes/EquipmentList";
import { ServingsCalculator } from "@/components/recipes/ServingsCalculator";
import { VideoEmbed } from "@/components/recipes/VideoEmbed";
import { RelatedRecipes } from "@/components/recipes/RelatedRecipes";
import { ProgressiveImage } from "@/components/ui/ProgressiveImage";
import { DifficultyIcon } from "@/components/ui/DifficultyIcon";
import { StarRating } from "@/components/ui/StarRating";
import { PhotoUploadButton } from "@/components/recipes/PhotoUploadButton";
import { IngredientSubstitutions } from "@/components/recipes/IngredientSubstitutions";
import { RecentlyViewedWidget } from "@/components/recipes/RecentlyViewedWidget";
import { RecentlyViewedTracker } from "@/components/recipes/RecentlyViewedTracker";
import { GroupedIngredientsDisplay } from "@/components/recipes/GroupedIngredientsDisplay";
import { GroupedStepsDisplay } from "@/components/recipes/GroupedStepsDisplay";
import { flattenIngredients } from "@/lib/recipeHelpers";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
    generateRecipeSchema,
    generateBreadcrumbSchema,
} from "@/lib/schema";

import { AllergenBadges } from "@/components/recipes/AllergenBadges";
import { AIRecipeAssistant } from "@/components/recipes/AIRecipeAssistant";
import { RecipeOriginMap } from "@/components/recipes/RecipeOriginMap";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
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

    // Generate structured data schemas
    const recipeSchema = generateRecipeSchema(recipe);
    const breadcrumbItems = [
        { name: "Συνταγές", url: "/recipes" },
        ...(recipe.region
            ? [
                {
                    name: recipe.region.name,
                    url: `/regions/${recipe.region.slug}`,
                },
            ]
            : []),
        { name: recipe.title, url: `/recipes/${recipe.slug}` },
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    // Συντεταγμένες περιοχής (fallback στο κέντρο Ελλάδας αν λείπουν)
    const regionLat =
        (recipe.region as any)?.latitude ?? 38.5;
    const regionLng =
        (recipe.region as any)?.longitude ?? 23.5;

    return (
        <div className="space-y-8 pt-24">
            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(recipeSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />

            <RecentlyViewedTracker recipe={recipe} />

            {/* Breadcrumbs */}
            <Breadcrumbs
                items={breadcrumbItems
                    .slice(0, -1)
                    .map((item) => ({ label: item.name, href: item.url }))}
            />

            {/* Hero Section */}
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <ProgressiveImage
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
                            <Badge className="bg-primary hover:bg-primary/90 text-lg px-4 py-1">
                                {recipe.category}
                            </Badge>
                        )}
                        {recipe.region && (
                            <Link href={`/regions/${recipe.region.slug}`}>
                                <Badge
                                    variant="outline"
                                    className="text-white border-white/50 hover:bg-white/20 text-lg px-4 py-1 flex items-center gap-2 cursor-pointer"
                                >
                                    <MapPin className="w-4 h-4" />{" "}
                                    {recipe.region.name}
                                </Badge>
                            </Link>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg">
                        {recipe.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                        <StarRating
                            rating={recipe.average_rating || 0}
                            size="lg"
                            showNumber
                        />
                    </div>
                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl drop-shadow-md mb-8">
                        {recipe.short_description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Link href={`/recipes/${recipe.slug}/cook`}>
                            <Button
                                size="lg"
                                className="rounded-full text-lg px-8 bg-white text-primary hover:bg-gray-100 border-0 shadow-lg"
                            >
                                Start Cooking
                            </Button>
                        </Link>
                        <PhotoUploadButton
                            recipeId={recipe.id}
                            recipeTitle={recipe.title}
                        />
                        {recipe.ingredients && (
                            <ShoppingListButton
                                ingredients={flattenIngredients(
                                    recipe.ingredients,
                                )}
                                recipeId={recipe.id}
                                recipeTitle={recipe.title}
                            />
                        )}
                        <RecipeShareButton recipe={recipe} />
                        <RecipePrintButton />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Ingredients */}
                <div className="lg:col-span-1 space-y-8">
                    <GlassPanel className="p-6 space-y-6">
                        <h3 className="text-xl font-bold border-b border-border/50 pb-2">
                            Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl">
                                <Clock className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    Time
                                </span>
                                <span className="font-bold">
                                    {recipe.time_minutes}m
                                </span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl">
                                <Users className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-sm text-muted-foreground">
                                    Servings
                                </span>
                                <span className="font-bold">
                                    {recipe.servings}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl">
                            <span className="text-sm text-muted-foreground mb-2">
                                Difficulty
                            </span>
                            <DifficultyIcon
                                difficulty={recipe.difficulty}
                                showLabel
                                size="lg"
                            />
                        </div>
                    </GlassPanel>

                    {/* Servings Calculator */}
                    {recipe.ingredients && (
                        <ServingsCalculator
                            originalServings={recipe.servings}
                            ingredients={flattenIngredients(
                                recipe.ingredients,
                            )}
                        />
                    )}

                    {/* Ingredients List */}
                    <GlassPanel className="p-6">
                        <h3 className="text-xl font-bold border-b border-border/50 pb-4 mb-4">
                            Ingredients
                        </h3>
                        <GroupedIngredientsDisplay
                            ingredients={recipe.ingredients}
                        />
                    </GlassPanel>

                    {/* Nutrition Facts */}
                    <NutritionFacts recipe={recipe} />

                    {/* Allergen Information */}
                    {recipe.allergens &&
                        recipe.allergens.length > 0 && (
                            <GlassPanel className="p-6">
                                <AllergenBadges
                                    allergens={recipe.allergens}
                                />
                            </GlassPanel>
                        )}

                    {/* Equipment List */}
                    <EquipmentList equipment={recipe.equipment} />

                    {/* Ingredient Substitutions */}
                    <IngredientSubstitutions
                        ingredients={flattenIngredients(
                            recipe.ingredients,
                        )}
                    />

                    {/* Recently Viewed Widget */}
                    <RecentlyViewedWidget />
                </div>

                {/* Right Column: Steps & Reviews */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Video Tutorial */}
                    <VideoEmbed videoUrl={recipe.video_url} />

                    <GlassPanel className="p-8">
                        <h3 className="text-2xl font-bold border-b border-border/50 pb-4 mb-6">
                            Instructions
                        </h3>
                        <GroupedStepsDisplay steps={recipe.steps} />
                    </GlassPanel>

                    {/* Reviews Section */}
                    <GlassPanel className="p-8">
                        <RecipeReviews
                            recipeId={recipe.id}
                            initialReviews={reviews}
                        />
                    </GlassPanel>
                </div>
            </div>

            {/* 🔎 Προέλευση συνταγής + Χάρτης */}
            {recipe.region && (
                <GlassPanel className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-2xl font-bold">
                                Προέλευση Συνταγής
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground">
                                Η συνταγή αυτή συνδέεται με την περιοχή{" "}
                                <span className="font-semibold">
                                    {recipe.region.name}
                                </span>
                                {". "}
                                Ανακάλυψε περισσότερες γεύσεις από την{" "}
                                <Link
                                    href={`/regions/${recipe.region.slug}`}
                                    className="text-primary hover:underline font-medium"
                                >
                                    {recipe.region.name}
                                </Link>
                                .
                            </p>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {recipe.region.name}
                                </span>
                            </div>
                        </div>
                        <div className="h-[260px] md:h-[300px]">
                            <RecipeOriginMap
                                lat={regionLat}
                                lng={regionLng}
                                regionName={recipe.region.name}
                            />
                        </div>
                    </div>
                </GlassPanel>
            )}

            {/* AI Recipe Assistant */}
            <AIRecipeAssistant recipe={recipe} />

            {/* Similar Recipes */}
            <RelatedRecipes currentRecipe={recipe} />
        </div>
    );
}
