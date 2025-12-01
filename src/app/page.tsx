import { getRecipes, getRegions } from "@/lib/api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RegionCard } from "@/components/regions/RegionCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  const recipes = await getRecipes();
  const regions = await getRegions();

  const featuredRecipe = recipes[0];
  const recentRecipes = recipes.slice(0, 6);
  const featuredRegions = regions.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero / Featured Section */}
      <section>
        <GlassPanel className="p-0 overflow-hidden relative min-h-[500px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={featuredRecipe?.image_url || "/placeholder-hero.jpg"}
              alt="Featured"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white">
            <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-primary/90 rounded-full backdrop-blur-md">
              Recipe of the Day
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {featuredRecipe?.title || "Discover Greek Flavors"}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3">
              {featuredRecipe?.short_description || "Explore our collection of authentic traditional recipes."}
            </p>
            <Button size="lg" className="rounded-full text-lg px-8" asChild>
              <Link href={`/recipes/${featuredRecipe?.slug}`}>
                Start Cooking <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </GlassPanel>
      </section>

      {/* Regions / Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Explore by Region</h2>
          <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
            <Link href="/regions">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRegions.map((region) => (
            <RegionCard key={region.id} {...region} />
          ))}
        </div>
      </section>

      {/* Recent Recipes */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Fresh from the Kitchen</h2>
          <Button variant="ghost" asChild className="text-primary hover:text-primary/80">
            <Link href="/recipes">View All Recipes <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      </section>
    </div>
  );
}
