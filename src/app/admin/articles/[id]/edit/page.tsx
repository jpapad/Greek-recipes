'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { getArticles } from '@/lib/blog-api';
import type { Article } from '@/lib/types';

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        const articles = await getArticles();
        const found = articles.find(a => a.id === params.id);
        if (!found) {
          router.push('/admin/articles');
          return;
        }
        setArticle(found);
      } catch (error) {
        console.error('Error loading article:', error);
        router.push('/admin/articles');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center">Φόρτωση...</div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-8">Επεξεργασία Άρθρου</h1>
      <ArticleForm article={article} />
    </div>
  );
}
