'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCollections, updateCollection, getCollectionRecipes, addRecipeToCollection, removeRecipeFromCollection } from '@/lib/collections-api';
import { getRecipes } from '@/lib/api';
import { ArrowLeft, Globe, Lock, Plus, X, Search } from 'lucide-react';
import Link from 'next/link';
import type { Recipe, CollectionRecipe } from '@/lib/types';

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  const [collectionRecipes, setCollectionRecipes] = useState<CollectionRecipe[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      loadCollection(p.id);
    });
  }, []);

  useEffect(() => {
    if (showAddModal) {
      loadAvailableRecipes();
    }
  }, [showAddModal, search]);

  async function loadCollection(collectionId: string) {
    try {
      const collections = await getCollections({});
      const collection = collections.find(c => c.id === collectionId);
      
      if (!collection) {
        alert('Η συλλογή δεν βρέθηκε');
        router.push('/admin/collections');
        return;
      }

      setName(collection.name);
      setSlug(collection.slug);
      setDescription(collection.description || '');
      setImageUrl(collection.image_url || '');
      setIsPublic(collection.is_public);
      
      const recipes = await getCollectionRecipes(collectionId);
      setCollectionRecipes(recipes);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableRecipes() {
    const recipes = await getRecipes({ search });
    setAvailableRecipes(recipes.slice(0, 20));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateCollection(id, {
        name,
        slug,
        description: description || undefined,
        image_url: imageUrl || undefined,
        is_public: isPublic,
      });

      if (updated) {
        router.push('/admin/collections');
      } else {
        alert('Σφάλμα κατά την ενημέρωση');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('Σφάλμα κατά την ενημέρωση');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddRecipe(recipeId: string) {
    const result = await addRecipeToCollection(id, recipeId);
    if (result) {
      const recipes = await getCollectionRecipes(id);
      setCollectionRecipes(recipes);
      setShowAddModal(false);
    }
  }

  async function handleRemoveRecipe(recipeId: string) {
    if (!confirm('Αφαίρεση αυτής της συνταγής από τη συλλογή;')) return;
    
    const success = await removeRecipeFromCollection(id, recipeId);
    if (success) {
      setCollectionRecipes(collectionRecipes.filter(cr => cr.recipe_id !== recipeId));
    }
  }

  if (loading) {
    return <div className="text-center py-12">Φόρτωση...</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/collections">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Πίσω στις Συλλογές
        </Button>
      </Link>

      <h1 className="text-3xl font-bold">Επεξεργασία Συλλογής</h1>

      <form onSubmit={handleSubmit}>
        <GlassPanel className="p-8 space-y-6 mb-8">
          <div>
            <Label htmlFor="name">Όνομα Συλλογής *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              pattern="[a-z0-9-]+"
            />
          </div>

          <div>
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">URL Εικόνας</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <Label>Ορατότητα</Label>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  isPublic ? 'border-primary bg-primary/10' : 'border-white/10'
                }`}
              >
                <Globe className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Δημόσια</div>
              </button>
              
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  !isPublic ? 'border-primary bg-primary/10' : 'border-white/10'
                }`}
              >
                <Lock className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Ιδιωτική</div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
            </Button>
            <Link href="/admin/collections">
              <Button type="button" variant="outline">
                Ακύρωση
              </Button>
            </Link>
          </div>
        </GlassPanel>
      </form>

      {/* Recipes Management */}
      <GlassPanel className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Συνταγές στη Συλλογή</h2>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Προσθήκη Συνταγής
          </Button>
        </div>

        {collectionRecipes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Δεν υπάρχουν συνταγές σε αυτή τη συλλογή
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionRecipes.map((cr) => cr.recipe && (
              <div key={cr.id} className="relative group">
                <GlassPanel className="p-4">
                  {cr.recipe.image_url && (
                    <img
                      src={cr.recipe.image_url}
                      alt={cr.recipe.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold mb-2">{cr.recipe.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {cr.recipe.short_description}
                  </p>
                </GlassPanel>
                <button
                  onClick={() => handleRemoveRecipe(cr.recipe_id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Add Recipe Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <GlassPanel className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Προσθήκη Συνταγής</h3>
                <button onClick={() => setShowAddModal(false)} className="text-2xl">×</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Αναζήτηση συνταγής..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {availableRecipes.map((recipe) => {
                  const isAdded = collectionRecipes.some(cr => cr.recipe_id === recipe.id);
                  return (
                    <button
                      key={recipe.id}
                      onClick={() => !isAdded && handleAddRecipe(recipe.id)}
                      disabled={isAdded}
                      className="text-left disabled:opacity-50"
                    >
                      <GlassPanel className="overflow-hidden hover:shadow-xl transition-all">
                        {recipe.image_url && (
                          <img src={recipe.image_url} alt={recipe.title} className="w-full h-32 object-cover" />
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold mb-1">{recipe.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {recipe.short_description}
                          </p>
                          {isAdded && (
                            <div className="text-xs text-green-500 mt-2">✓ Ήδη στη συλλογή</div>
                          )}
                        </div>
                      </GlassPanel>
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
