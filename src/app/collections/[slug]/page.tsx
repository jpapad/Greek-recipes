import { getCollectionBySlug } from '@/lib/collections-api';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookMarked } from 'lucide-react';
import Link from 'next/link';
import { RecipeCard } from '@/components/recipes/RecipeCard';

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Public collections don't require auth - pass null as userId
  const collection = await getCollectionBySlug(null, slug);

  if (!collection) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Η συλλογή δεν βρέθηκε</h1>
          <Link href="/collections">
            <Button>Πίσω στις Συλλογές</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Only show public collections on frontend
  if (!collection.is_public) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Η συλλογή είναι ιδιωτική</h1>
          <Link href="/collections">
            <Button>Πίσω στις Συλλογές</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-600/20" />
        
        <div className="container mx-auto relative z-10">
          <Link href="/collections">
            <Button variant="outline" className="mb-6 bg-white/10 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω στις Συλλογές
            </Button>
          </Link>

          <GlassPanel className="overflow-hidden">
            {collection.image_url && (
              <div className="aspect-[21/9] w-full overflow-hidden">
                <img
                  src={collection.image_url}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {collection.name}
              </h1>

              {collection.description && (
                <p className="text-lg text-foreground/80 mb-6 max-w-3xl">
                  {collection.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  <span>{collection.recipes?.length || 0} συνταγές</span>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* Recipes Grid */}
      <div className="container mx-auto px-4 pb-16">
        {collection.recipes && collection.recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collection.recipes.map((item) => (
              item.recipe && (
                <div key={item.id}>
                  <RecipeCard recipe={item.recipe} />
                  {item.notes && (
                    <GlassPanel className="mt-2 p-4">
                      <p className="text-sm italic text-muted-foreground">
                        📝 {item.notes}
                      </p>
                    </GlassPanel>
                  )}
                </div>
              )
            ))}
          </div>
        ) : (
          <GlassPanel className="p-16 text-center max-w-2xl mx-auto">
            <BookMarked className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Δεν υπάρχουν συνταγές ακόμα</h3>
            <p className="text-muted-foreground mb-6">
              Οι συνταγές αυτής της συλλογής θα εμφανιστούν σύντομα
            </p>
            <Link href="/recipes">
              <Button>
                Περιηγηθείτε σε Συνταγές
              </Button>
            </Link>
          </GlassPanel>
        )}
      </div>
    </div>
  );
}
