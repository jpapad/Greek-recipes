import Link from 'next/link';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getArticles, getArticleCategories } from '@/lib/blog-api';
import { Calendar, Clock, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; search?: string }>;
}) {
  const params = await searchParams;
  
  const articles = await getArticles({
    status: 'published',
    category: params.category,
    tag: params.tag,
    search: params.search,
  });

  const categories = await getArticleCategories();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Design */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-orange-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)]" />
        
        {/* Decorative Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-6">
            <span className="px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold text-primary border border-primary/30 shadow-lg">
              📚 Blog & Άρθρα
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-orange-400 bg-clip-text text-transparent leading-tight">
            Ιστορίες & Άρθρα
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Ανακαλύψτε την ιστορία, τις παραδόσεις και τα μυστικά της ελληνικής κουζίνας
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        {/* Category Filter Pills */}
        <div className="mb-12">
          <GlassPanel className="p-6">
            <h3 className="text-sm font-semibold text-foreground/60 mb-4 uppercase tracking-wider">
              Φίλτρα Κατηγοριών
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/blog">
                <button
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    !params.category
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-foreground/70 hover:text-foreground'
                  }`}
                >
                  📋 Όλες οι Κατηγορίες
                </button>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/blog?category=${cat.id}`}>
                  <button
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
                      params.category === cat.id
                        ? 'text-white shadow-lg scale-105 border-transparent'
                        : 'bg-white/5 hover:bg-white/10 text-foreground/70 hover:text-foreground border-white/10 hover:border-white/20'
                    }`}
                    style={
                      params.category === cat.id && cat.color
                        ? {
                            backgroundColor: cat.color,
                            boxShadow: `0 8px 24px ${cat.color}40`,
                          }
                        : {}
                    }
                  >
                    {cat.name}
                  </button>
                </Link>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <GlassPanel className="p-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-muted-foreground">Δεν βρέθηκαν άρθρα</p>
            <p className="text-sm text-muted-foreground mt-2">Δοκιμάστε διαφορετική κατηγορία</p>
          </GlassPanel>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                            className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg backdrop-blur-sm"
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
                    <h2 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t border-white/10">
                      {article.published_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(article.published_at).toLocaleDateString('el-GR')}
                        </div>
                      )}
                      {article.reading_time_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.reading_time_minutes} λεπτά
                        </div>
                      )}
                      {article.views_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views_count}
                        </div>
                      )}
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-primary/10 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassPanel>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
