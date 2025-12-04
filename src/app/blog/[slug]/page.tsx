import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getArticles } from '@/lib/blog-api';
import { getRecipes } from '@/lib/api';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { Calendar, Clock, Eye, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Άρθρο δεν βρέθηκε',
    };
  }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    keywords: article.keywords,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  // Get related recipes if any
  let relatedRecipes: any[] = [];
  if (article.related_recipe_ids && article.related_recipe_ids.length > 0) {
    const allRecipes = await getRecipes({});
    relatedRecipes = allRecipes.filter((r) =>
      article.related_recipe_ids?.includes(r.id)
    );
  }

  // Get similar articles from same category
  const similarArticles = article.category_id
    ? (await getArticles({ status: 'published', category: article.category_id, limit: 3 }))
        .filter((a) => a.id !== article.id)
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Image */}
      {article.featured_image && (
        <div className="w-full h-[400px] relative">
          <img
            src={article.featured_image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Πίσω στα Άρθρα
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GlassPanel className="p-8">
              {/* Category */}
              {article.category && (
                <Badge
                  className="mb-4"
                  style={
                    article.category.color
                      ? { backgroundColor: article.category.color }
                      : {}
                  }
                >
                  {article.category.name}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                {article.author && (
                  <div className="flex items-center gap-2">
                    {article.author.avatar_url ? (
                      <img
                        src={article.author.avatar_url}
                        alt="Author"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span>{article.author.email}</span>
                  </div>
                )}
                {article.published_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.published_at).toLocaleDateString('el-GR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                )}
                {article.reading_time_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.reading_time_minutes} λεπτά ανάγνωσης
                  </div>
                )}
                {article.views_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.views_count} προβολές
                  </div>
                )}
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 italic">
                  {article.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-3">Ετικέτες</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${tag}`}>
                        <Badge variant="outline">{tag}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </GlassPanel>

            {/* Related Recipes */}
            {relatedRecipes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Συνταγές που σχετίζονται</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            {article.author && (
              <GlassPanel className="p-6">
                <h3 className="font-semibold mb-4">Συντάκτης</h3>
                <div className="flex items-start gap-3">
                  {article.author.avatar_url ? (
                    <img
                      src={article.author.avatar_url}
                      alt="Author"
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{article.author.email}</p>
                    {article.author.bio && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {article.author.bio}
                      </p>
                    )}
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Similar Articles */}
            {similarArticles.length > 0 && (
              <GlassPanel className="p-6">
                <h3 className="font-semibold mb-4">Σχετικά Άρθρα</h3>
                <div className="space-y-4">
                  {similarArticles.map((similar) => (
                    <Link key={similar.id} href={`/blog/${similar.slug}`}>
                      <div className="group">
                        {similar.featured_image && (
                          <div className="aspect-video w-full overflow-hidden rounded-lg mb-2">
                            <img
                              src={similar.featured_image}
                              alt={similar.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {similar.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {similar.reading_time_minutes} λεπτά ανάγνωσης
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
