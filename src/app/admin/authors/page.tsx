'use client';

import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { getAuthors, updateUserRole, searchUsers } from '@/lib/blog-api';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { UserPlus, UserMinus, Edit2, X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AuthorsManagementPage() {
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  // Edit State
  const [editingAuthor, setEditingAuthor] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    avatar_url: ''
  });

  const loadAuthors = async () => {
    setLoading(true);
    const data = await getAuthors();
    setAuthors(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleEditClick = (author: UserProfile) => {
    setEditingAuthor(author);
    setEditForm({
      name: author.name || author.email?.split('@')[0] || '',
      bio: author.bio || '',
      avatar_url: author.avatar_url || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingAuthor) return;

    const result = await updateUserRole(editingAuthor.user_id, {
      name: editForm.name,
      bio: editForm.bio,
      avatar_url: editForm.avatar_url,
      // Maintain author status when editing
      is_author: editingAuthor.is_author
    });

    if (result) {
      showToast('Τα στοιχεία ενημερώθηκαν επιτυχώς', 'success');
      setEditingAuthor(null);
      loadAuthors();
    } else {
      showToast('Σφάλμα κατά την ενημέρωση', 'error');
    }
  };

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await searchUsers(query);
    setSearchResults(results);
  };

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
          Αναζήτηση χρήστη με βάση το όνομα (από το προφίλ τους).
        </p>

        <div className="relative max-w-md">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Αναζήτηση με όνομα..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-md shadow-md z-10 overflow-hidden">
              {searchResults.map(user => (
                <div key={user.user_id} className="p-3 hover:bg-muted/50 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {user.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <span className="font-medium text-sm">{user.name || 'Χωρίς όνομα'}</span>
                  </div>
                  {authors.some(a => a.user_id === user.user_id) ? (
                    <span className="text-xs text-muted-foreground">Ήδη στη λίστα</span>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => toggleAuthorRole(user.user_id, false)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Προσθήκη
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(author)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Επεξεργασία
                  </Button>

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

      {/* Edit Modal */}
      {editingAuthor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <GlassPanel className="w-full max-w-lg p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Επεξεργασία Συντάκτη</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditingAuthor(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Όνομα Εμφάνισης</Label>
                <Input
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="π.χ. Μαρία Παπαδοπούλου"
                />
              </div>

              <div className="space-y-2">
                <Label>Βιογραφικό</Label>
                <Textarea
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Σύντομο βιογραφικό..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <div className="flex gap-3">
                  <Input
                    value={editForm.avatar_url}
                    onChange={e => setEditForm({ ...editForm, avatar_url: e.target.value })}
                    placeholder="https://..."
                  />
                  {editForm.avatar_url && (
                    <img src={editForm.avatar_url} alt="Preview" className="w-10 h-10 rounded-full object-cover border" />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setEditingAuthor(null)}>
                  Ακύρωση
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-2" />
                  Αποθήκευση
                </Button>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
