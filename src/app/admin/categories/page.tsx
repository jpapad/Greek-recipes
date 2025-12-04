'use client';

import { useEffect, useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getArticleCategories, deleteArticleCategory } from '@/lib/blog-api';
import type { ArticleCategory } from '@/lib/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getArticleCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την κατηγορία;')) {
      return;
    }

    try {
      await deleteArticleCategory(id);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Σφάλμα κατά τη διαγραφή');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Κατηγορίες Άρθρων</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Νέα Κατηγορία
          </Button>
        </Link>
      </div>

      <GlassPanel>
        {loading ? (
          <div className="text-center py-12">Φόρτωση...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Δεν υπάρχουν κατηγορίες</p>
            <Link href="/admin/categories/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Δημιουργία πρώτης κατηγορίας
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4">Χρώμα</th>
                  <th className="text-left p-4">Όνομα</th>
                  <th className="text-left p-4">Slug</th>
                  <th className="text-left p-4">Περιγραφή</th>
                  <th className="text-right p-4">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: category.color || '#666' }}
                      />
                    </td>
                    <td className="p-4 font-medium">{category.name}</td>
                    <td className="p-4 text-gray-400 font-mono text-sm">{category.slug}</td>
                    <td className="p-4 text-gray-400 text-sm">
                      {category.description || '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
