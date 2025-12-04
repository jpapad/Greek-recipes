'use client';

import { ArticleForm } from '@/components/admin/ArticleForm';
import { GlassPanel } from '@/components/ui/GlassPanel';

export default function NewArticlePage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-8">Νέο Άρθρο</h1>
      <ArticleForm />
    </div>
  );
}
