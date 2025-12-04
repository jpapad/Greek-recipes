'use client';

import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import { getCollections, deleteCollection } from '@/lib/collections-api';
import type { Collection } from '@/lib/types';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      // Admin loads ALL collections (no userId filter)
      const data = await getCollections({});
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Διαγραφή της συλλογής "${name}";`)) {
      return;
    }

    const success = await deleteCollection(id);
    if (success) {
      setCollections(collections.filter(c => c.id !== id));
    } else {
      alert('Σφάλμα κατά τη διαγραφή');
    }
  }

  if (loading) {
    return <div className="text-center py-12">Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Συλλογές Συνταγών</h1>
          <p className="text-muted-foreground">
            Δημιουργήστε θεματικές συλλογές που θα εμφανίζονται στους χρήστες
          </p>
        </div>
        <Link href="/admin/collections/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Νέα Συλλογή
          </Button>
        </Link>
      </div>

      {collections.length === 0 ? (
        <GlassPanel className="p-16 text-center">
          <h3 className="text-xl font-bold mb-2">Δεν υπάρχουν συλλογές ακόμα</h3>
          <p className="text-muted-foreground mb-6">
            Δημιουργήστε την πρώτη συλλογή για να οργανώσετε τις συνταγές
          </p>
          <Link href="/admin/collections/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Δημιουργία Συλλογής
            </Button>
          </Link>
        </GlassPanel>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <GlassPanel key={collection.id} className="overflow-hidden">
              {collection.image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={collection.image_url}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold">{collection.name}</h3>
                  {collection.is_public ? (
                    <Globe className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}

                <div className="text-sm text-muted-foreground mb-4">
                  {collection.recipe_count || 0} συνταγές
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/collections/${collection.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Επεξεργασία
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(collection.id, collection.name)}
                    className="text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
