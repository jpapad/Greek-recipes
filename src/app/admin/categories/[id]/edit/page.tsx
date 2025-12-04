'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { getArticleCategories } from '@/lib/blog-api';
import type { ArticleCategory } from '@/lib/types';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [category, setCategory] = useState<ArticleCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      try {
        const categories = await getArticleCategories();
        const found = categories.find(c => c.id === params.id);
        if (!found) {
          router.push('/admin/categories');
          return;
        }
        setCategory(found);
      } catch (error) {
        console.error('Error loading category:', error);
        router.push('/admin/categories');
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center">Φόρτωση...</div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-8">Επεξεργασία Κατηγορίας</h1>
      <CategoryForm category={category} />
    </div>
  );
}
