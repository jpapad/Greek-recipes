// src/app/recipes/[slug]/page.tsx
import { getRecipeBySlug as getRecipeBySlugRaw, getReviews } from "@/lib/apiServer";
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
import { generateRecipeSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { AllergenBadges } from "@/components/recipes/AllergenBadges";
import { AIRecipeAssistant } from "@/components/recipes/AIRecipeAssistant";
import { RecipeOriginMap } from "@/components/recipes/RecipeOriginMap";
import { cache } from "react";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

const getRecipeBySlug = cache(async (slug: string) => getRecipeBySlugRaw(slug));

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) return { title: "Recipe Not Found" };

    const imageUrl = recipe.image_url || "/placeholder-recipe.jpg";
    const description = recipe.short_description ?? undefined;

    return {
        title: recipe.title,
        description,
        alternates: { canonical: `/recipes/${recipe.slug}` },
        openGraph: {
            title: recipe.title,
            description,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: recipe.title }],
        },
        twitter: {
            card: "summary_large_image",
            title: recipe.title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function RecipeDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const recipe = await getRecipeBySlug(slug);

    if (!recipe) notFound();

    const reviews = await getReviews(recipe.id);

    const recipeSchema = generateRecipeSchema(recipe);
    const breadcrumbItems = [
        { name: "Συνταγές", url: "/recipes" },
        ...(recipe.region ? [{ name: recipe.region.name, url: `/regions/${recipe.region.slug}` }] : []),
        { name: recipe.title, url: `/recipes/${recipe.slug}` },
    ];
    const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

    const region = (recipe as any).region as
        | { name: string; slug: string; latitude?: number; longitude?: number }
        | undefined;
    const prefecture = (recipe as any).prefecture as
        | { name: string; slug: string; latitude?: number; longitude?: number }
        | undefined;
    const city = (recipe as any).city as
        | { name: string; slug: string; latitude?: number; longitude?: number }
        | undefined;

    const originLat = city?.latitude ?? prefecture?.latitude ?? region?.latitude ?? 38.5;
    const originLng = city?.longitude ?? prefecture?.longitude ?? region?.longitude ?? 23.5;

    const regionName = region?.name;
    const prefectureName = prefecture?.name;
    const cityName = city?.name;

    return (
        <div className="space-y-8 pt-24">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <RecentlyViewedTracker recipe={recipe} />

            <Breadcrumbs items={breadcrumbItems.slice(0, -1).map((item) => ({ label: item.name, href: item.url }))} />

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
                        {region && (
                            <Link href={`/regions/${region.slug}`}>
                                <Badge
                                    variant="outline"
                                    className="text-white border-white/50 hover:bg-white/20 text-lg px-4 py-1 flex items-center gap-2 cursor-pointer"
                                >
                                    <MapPin className="w-4 h-4" /> {region.name}
                                </Badge>
                            </Link>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg">{recipe.title}</h1>

                    <div className="flex items-center gap-4 mb-4">
                        <StarRating rating={recipe.average_rating || 0} size="lg" showNumber />
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

                        <PhotoUploadButton recipeId={recipe.id} recipeTitle={recipe.title} />

                        {recipe.ingredients && (
                            <ShoppingListButton
                                ingredients={flattenIngredients(recipe.ingredients)}
                                recipeId={recipe.id}
                                recipeTitle={recipe.title}
                            />
                        )}

                        <RecipeShareButton recipe={recipe} />
                        <RecipePrintButton />
                    </div>
                </div>
            </div>

            {region && (
                <GlassPanel className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="text-2xl font-bold">Προέλευση Συνταγής</h3>
                            <p className="text-sm md:text-base text-muted-foreground">
                                Η συνταγή αυτή συνδέεται με{" "}
                                {cityName && (
                                    <>
                                        την περιοχή <span className="font-semibold">{cityName}</span>
                                        {prefectureName || regionName ? ", " : "."}{" "}
                                    </>
                                )}
                                {prefectureName && (
                                    <>
                                        τον νομό <span className="font-semibold">{prefectureName}</span>
                                        {regionName ? ", " : "."}{" "}
                                    </>
                                )}
                                {regionName && (
                                    <>
                                        την <span className="font-semibold">{regionName}</span>.
                                    </>
                                )}
                            </p>

                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                {region && (
                                    <Link
                                        href={`/regions/${region.slug}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        {region.name}
                                    </Link>
                                )}
                                {prefecture && (
                                    <Link
                                        href={`/prefectures/${prefecture.slug}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                                    >
                                        {prefecture.name}
                                    </Link>
                                )}
                                {city && (
                                    <Link
                                        href={`/cities/${city.slug}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
                                    >
                                        {city.name}
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="h-[260px] md:h-[300px]">
                            <RecipeOriginMap
                                lat={originLat}
                                lng={originLng}
                                regionName={regionName}
                                prefectureName={prefectureName}
                                cityName={cityName}
                            />
                        </div>
                    </div>
                </GlassPanel>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                                <Users className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-sm text-muted-foreground">Servings</span>
                                <span className="font-bold">{recipe.servings}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white/30 rounded-xl">
                            <span className="text-sm text-muted-foreground mb-2">Difficulty</span>
                            <DifficultyIcon difficulty={recipe.difficulty} showLabel size="lg" />
                        </div>
                    </GlassPanel>

                    {recipe.ingredients && (
                        <ServingsCalculator
                            originalServings={recipe.servings}
                            ingredients={flattenIngredients(recipe.ingredients)}
                        />
                    )}

                    <GlassPanel className="p-6">
                        <h3 className="text-xl font-bold border-b border-border/50 pb-4 mb-4">Ingredients</h3>
                        <GroupedIngredientsDisplay ingredients={recipe.ingredients} />
                    </GlassPanel>

                    <NutritionFacts recipe={recipe} />

                    {recipe.allergens && recipe.allergens.length > 0 && (
                        <GlassPanel className="p-6">
                            <AllergenBadges allergens={recipe.allergens} />
                        </GlassPanel>
                    )}

                    <EquipmentList equipment={recipe.equipment} />

                    <IngredientSubstitutions ingredients={flattenIngredients(recipe.ingredients)} />

                    <RecentlyViewedWidget />
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <VideoEmbed videoUrl={recipe.video_url} />

                    <GlassPanel className="p-8">
                        <h3 className="text-2xl font-bold border-b border-border/50 pb-4 mb-6">Instructions</h3>
                        <GroupedStepsDisplay steps={recipe.steps} />
                    </GlassPanel>

                    <GlassPanel className="p-8">
                        <RecipeReviews recipeId={recipe.id} initialReviews={reviews} />
                    </GlassPanel>
                </div>
            </div>

            <AIRecipeAssistant recipe={recipe} />

            <RelatedRecipes currentRecipe={recipe} />
        </div>
    );
}
