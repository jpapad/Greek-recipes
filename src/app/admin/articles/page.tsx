import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { getArticles } from '@/lib/blog-api';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Διαχείριση Άρθρων</h1>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Νέο Άρθρο
          </Button>
        </Link>
      </div>

      <GlassPanel className="p-6">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Δεν υπάρχουν άρθρα ακόμα</p>
            <Link href="/admin/articles/new">
              <Button>Δημιουργήστε το πρώτο άρθρο</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Τίτλος</th>
                  <th className="text-left py-3 px-4">Κατηγορία</th>
                  <th className="text-left py-3 px-4">Κατάσταση</th>
                  <th className="text-left py-3 px-4">Προβολές</th>
                  <th className="text-left py-3 px-4">Ημερομηνία</th>
                  <th className="text-right py-3 px-4">Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-accent/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{article.title}</p>
                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {article.excerpt}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {article.category?.name || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          article.status === 'published'
                            ? 'default'
                            : article.status === 'draft'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {article.status === 'published' && 'Δημοσιευμένο'}
                        {article.status === 'draft' && 'Πρόχειρο'}
                        {article.status === 'archived' && 'Αρχειοθετημένο'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {article.views_count || 0}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {article.created_at
                        ? new Date(article.created_at).toLocaleDateString('el-GR')
                        : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        {article.status === 'published' && (
                          <Link href={`/blog/${article.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
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

      {/* Categories Management Link */}
      <div className="mt-6 flex justify-end">
        <Link href="/admin/articles/categories">
          <Button variant="outline">Διαχείριση Κατηγοριών</Button>
        </Link>
      </div>
    </div>
  );
}
