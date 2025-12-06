'use client';

import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { getAuthors, updateUserRole } from '@/lib/blog-api';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { UserPlus, UserMinus } from 'lucide-react';

export default function AuthorsManagementPage() {
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { showToast } = useToast();

  const loadAuthors = async () => {
    setLoading(true);
    const data = await getAuthors();
    setAuthors(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const toggleAuthorRole = async (userId: string, currentStatus: boolean) => {
    const result = await updateUserRole(userId, { is_author: !currentStatus });
    if (result) {
      showToast(currentStatus ? 'Αφαιρέθηκε ο ρόλος author' : 'Προστέθηκε ο ρόλος author', 'success');
      loadAuthors();
    } else {
      showToast('Σφάλμα κατά την ενημέρωση', 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Διαχείριση Συντακτών</h1>

      {/* Add New Author Section */}
      <GlassPanel className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Προσθήκη Νέου Συντάκτη</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Για να δώσεις δικαιώματα author σε χρήστη, πρέπει πρώτα να έχει κάνει εγγραφή στην εφαρμογή.
          Μετά, μπορείς να του δώσεις τον ρόλο από τη λίστα παρακάτω.
        </p>
      </GlassPanel>

      {/* Current Authors */}
      <GlassPanel className="p-6">
        <h2 className="text-xl font-semibold mb-4">Τρέχοντες Συντάκτες</h2>
        
        {loading ? (
          <p className="text-muted-foreground">Φόρτωση...</p>
        ) : authors.length === 0 ? (
          <p className="text-muted-foreground">Δεν υπάρχουν συντάκτες ακόμα</p>
        ) : (
          <div className="space-y-4">
            {authors.map((author) => (
              <div
                key={author.user_id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt={author.email || 'Author'}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      {author.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{author.name || author.email || 'Χωρίς όνομα'}</p>
                    {author.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{author.bio}</p>
                    )}
                    <div className="flex gap-2 mt-1">
                      {author.is_admin && (
                        <span className="text-xs px-2 py-0.5 bg-primary/20 rounded-full">
                          Admin
                        </span>
                      )}
                      {author.is_author && (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full">
                          Author
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!author.is_admin && (
                    <Button
                      variant={author.is_author ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleAuthorRole(author.user_id, author.is_author || false)}
                    >
                      {author.is_author ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Αφαίρεση Author
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ορισμός ως Author
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Οδηγίες</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Οι <strong>Admins</strong> έχουν αυτόματα δικαιώματα author και δεν μπορούν να τα χάσουν</li>
          <li>• Οι <strong>Authors</strong> μπορούν να δημιουργούν και επεξεργάζονται τα δικά τους άρθρα</li>
          <li>• Μόνο οι admins μπορούν να διαγράφουν άρθρα και να διαχειρίζονται κατηγορίες</li>
        </ul>
      </div>
    </div>
  );
}
