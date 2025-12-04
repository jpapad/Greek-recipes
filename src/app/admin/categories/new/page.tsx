'use client';

import { CategoryForm } from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold mb-8">Νέα Κατηγορία</h1>
      <CategoryForm />
    </div>
  );
}
