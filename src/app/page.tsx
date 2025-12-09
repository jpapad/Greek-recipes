import { getRecipes, getRegions, getHomepageSettings } from "@/lib/api";
import { getArticles } from "@/lib/blog-api";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { GlassPanel } from "@/components/ui/GlassPanel";
import Link from "next/link";
import { ArrowRight, ChefHat, MapPin, Star, BookOpen, Utensils, Cake, Salad, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/layout/HeroSlider";
import type { StatsContent, CategoriesContent, NewsletterContent } from "@/lib/types/homepage";
import dynamic from "next/dynamic";

const MapExplorer = dynamic(
  () => import("@/components/regions/MapExplorer").then(mod => mod.MapExplorer),
  { ssr: false }
);

// Icon mapping
const iconMap: Record<string, any> = {
  ChefHat,
  MapPin,
  Star,
  Salad,
  Utensils,
  Cake,
  Coffee,
  BookOpen
};

export default async function Home() {
  const recipes = await getRecipes();
  const regions = await getRegions();
  const homepageSettings = await getHomepageSettings();
  const articles = await getArticles({ status: 'published', limit: 3 });

  const recentRecipes = recipes.slice(0, 8);

  // Get settings from database or use defaults
  const statsContent: StatsContent = homepageSettings?.stats || {
    title: "Τα Νούμερά μας",
    subtitle: "Η ελληνική κουζίνα σε αριθμούς",
    stats: [
      { label: "Αυθεντικές Συνταγές", value: `${recipes.length}+`, icon: "ChefHat", color: "from-orange-500 to-pink-500" },
      { label: "Ελληνικές Περιοχές", value: `${regions.length}`, icon: "MapPin", color: "from-blue-500 to-cyan-500" },
      { label: "Μέση Αξιολόγηση", value: "4.8", icon: "Star", color: "from-purple-500 to-pink-500" }
    ]
  };

  const categoriesContent: CategoriesContent = homepageSettings?.categories || {
    title: "Κατηγορίες Φαγητού",
    subtitle: "Εξερευνήστε την ελληνική κουζίνα ανά κατηγορία",
    categories: [
      { name: "Ορεκτικά", slug: "appetizer", icon: "Salad", color: "from-green-500 to-emerald-500", description: "Νόστιμα ορεκτικά" },
      { name: "Κυρίως Πιάτα", slug: "main-dish", icon: "Utensils", color: "from-orange-500 to-red-500", description: "Παραδοσιακά πιάτα" },
      { name: "Γλυκά", slug: "dessert", icon: "Cake", color: "from-pink-500 to-purple-500", description: "Ελληνικά γλυκά" },
      { name: "Σαλάτες", slug: "salad", icon: "Coffee", color: "from-cyan-500 to-blue-500", description: "Υγιεινές σαλάτες" }
    ]
  };

  const newsletterContent: NewsletterContent = homepageSettings?.newsletter || {
    badge: "Newsletter",
    title: "Λάβετε τις καλύτερες συνταγές στο inbox σας",
    subtitle: "Κάθε εβδομάδα μοιραζόμαστε νέες αυθεντικές ελληνικές συνταγές, tips μαγειρικής και ιστορίες από την παράδοση μας.",
    placeholder: "Το email σας...",
    buttonText: "Εγγραφή",
    privacyText: "🔒 Δεν θα μοιραστούμε ποτέ το email σας με τρίτους"
  };

  // Add recipe counts to categories
  const categoriesWithCounts = categoriesContent.categories.map(cat => ({
    ...cat,
    count: recipes.filter(r => r.category?.toLowerCase().replace(/\s+/g, '-') === cat.slug).length
  }));

  return (
    <div className="relative -mt-24">
      {/* Hero Slider */}
      <HeroSlider recipes={recipes} regions={regions} totalRecipes={recipes.length} />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4">
          {statsContent.title && (
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3">{statsContent.title}</h2>
              {statsContent.subtitle && (
                <p className="text-xl text-muted-foreground">{statsContent.subtitle}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsContent.stats.map((stat, index) => {
              const Icon = iconMap[stat.icon] || ChefHat;
              return (
                <GlassPanel key={index} className="p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-lg text-muted-foreground mt-2">{stat.label}</div>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      </section>
      {/* Interactive Map Section */}
      <section className="mt-12 lg:mt-16">
        <MapExplorer />
      </section>


      {/* Featured Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {categoriesContent.title.split(' ')[0]}
              </span>
              {" "}
              <span className="text-foreground">{categoriesContent.title.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {categoriesContent.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesWithCounts.map((category, index) => {
              const Icon = iconMap[category.icon] || Utensils;
              return (
                <Link
                  key={category.slug}
                  href={`/recipes?category=${category.slug}`}
                  className="group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: 'slideInUp 0.6s ease-out forwards'
                  }}
                >
                  <GlassPanel className="p-0 overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white/30" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Count Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold">
                        {category.count} συνταγές
                      </div>
                    </div>

                    <div className="p-6 text-center space-y-2">
                      <h3 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                      <div className="flex items-center justify-center text-muted-foreground text-sm group-hover:text-orange-500 transition-colors">
                        <span>Εξερευνήστε</span>
                        <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </GlassPanel>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Articles Section */}
      {articles.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full text-sm font-semibold text-primary border border-primary/20">
                  📚 Blog
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-orange-400 bg-clip-text text-transparent">
                Ιστορίες & Άρθρα
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Ανακαλύψτε την ιστορία και τα μυστικά της ελληνικής κουζίνας
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <GlassPanel className="group h-full hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 overflow-hidden hover:-translate-y-2">
                    {article.featured_image && (
                      <div className="aspect-video w-full overflow-hidden relative">
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {article.category && (
                          <div className="absolute top-4 left-4">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm"
                              style={{
                                backgroundColor: article.category.color || '#3B82F6',
                              }}
                            >
                              {article.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </GlassPanel>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <Button size="lg" className="group">
                  Δείτε Όλα τα Άρθρα
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4">
          <GlassPanel className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative p-12 md:p-20 text-center space-y-8">
              <div className="space-y-4">
                {newsletterContent.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
                    <BookOpen className="w-4 h-4" />
                    {newsletterContent.badge}
                  </div>
                )}
                <h2 className="text-4xl md:text-6xl font-bold">
                  <span className="text-foreground">{newsletterContent.title.split('συνταγές')[0]}συνταγές</span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                    {newsletterContent.title.split('συνταγές')[1]}
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {newsletterContent.subtitle}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder={newsletterContent.placeholder}
                  className="flex-1 px-6 py-4 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                />
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {newsletterContent.buttonText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {newsletterContent.privacyText && (
                <p className="text-sm text-muted-foreground">
                  {newsletterContent.privacyText}
                </p>
              )}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="text-foreground">Latest</span>
              {" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Recipes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fresh additions to our collection of authentic Greek cuisine
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentRecipes.map((recipe, i) => (
              <div key={recipe.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0" asChild>
              <Link href="/recipes">
                View All Recipes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
