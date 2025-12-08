'use client';

import { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { getAuthors, updateUserRole, searchUsers } from '@/lib/blog-api';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { UserPlus, UserMinus, Edit2, X, Save, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AuthorsManagementPage() {
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [step, setStep] = useState<'search' | 'form'>('search');

  // Data State
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    is_author: false,
    is_admin: false
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

  // --- Handlers ---

  const openAddModal = () => {
    setModalMode('add');
    setStep('search');
    setSelectedUser(null);
    setSearchQuery('');
    setSearchResults([]);
    setFormData({ name: '', bio: '', avatar_url: '', is_author: true, is_admin: false });
    setIsModalOpen(true);
  };

  const openEditModal = (author: UserProfile) => {
    setModalMode('edit');
    setStep('form');
    setSelectedUser(author);
    setFormData({
      name: author.name || author.email?.split('@')[0] || '',
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      is_author: author.is_author || false,
      is_admin: author.is_admin || false
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await searchUsers(query);
    setSearchResults(results);
  };

  const handleSelectUser = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || user.email?.split('@')[0] || '',
      bio: user.bio || '',
      avatar_url: user.avatar_url || '',
      is_author: user.is_author || true, // Default to true if adding
      is_admin: user.is_admin || false
    });
    setStep('form');
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    const result = await updateUserRole(selectedUser.user_id, {
      name: formData.name,
      bio: formData.bio,
      avatar_url: formData.avatar_url,
      is_author: formData.is_author,
      is_admin: formData.is_admin
    });

    if (result) {
      showToast(
        modalMode === 'add' ? 'Ο συντάκτης προστέθηκε επιτυχώς' : 'Τα στοιχεία ενημερώθηκαν',
        'success'
      );
      closeModal();
      loadAuthors();
    } else {
      showToast('Σφάλμα κατά την αποθήκευση', 'error');
    }
  };

  const handleRemoveRole = async (userId: string) => {
    // Quick remove author role
    const result = await updateUserRole(userId, { is_author: false });
    if (result) {
      showToast('Ο ρόλος αφαιρέθηκε', 'success');
      loadAuthors();
    } else {
      showToast('Σφάλμα κατά την ενημέρωση', 'error');
    }
  };

  // --- Render ---

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Διαχείριση Συντακτών</h1>
        <Button onClick={openAddModal} className="bg-primary text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Προσθήκη Συντάκτη
        </Button>
      </div>

      <GlassPanel className="p-6">
        <h2 className="text-xl font-semibold mb-4">Τρέχοντες Συντάκτες</h2>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Φόρτωση...</div>
        ) : authors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Δεν υπάρχουν συντάκτες ακόμα</div>
        ) : (
          <div className="space-y-4">
            {authors.map((author) => (
              <div key={author.user_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  {author.avatar_url ? (
                    <img src={author.avatar_url} alt={author.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {author.name?.charAt(0).toUpperCase() || author.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-lg">{author.name || 'Χωρίς όνομα'}</span>
                      {author.is_admin && <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-600 rounded-full border border-purple-200">Admin</span>}
                      {author.is_author && <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full border border-green-200">Author</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{author.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(author)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Επεξεργασία
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <GlassPanel className="w-full max-w-lg p-0 overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-lg font-bold">
                {modalMode === 'add' ? 'Προσθήκη Νέου Συντάκτη' : 'Επεξεργασία Συντάκτη'}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6">
              {/* STEP 1: SEARCH (Only for Add Mode) */}
              {modalMode === 'add' && step === 'search' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Αναζήτηση χρήστη (όνομα)..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2 bg-background/50">
                    {searchResults.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-4">
                        {searchQuery.length < 2 ? 'Πληκτρολογήστε τουλάχιστον 2 χαρακτήρες' : 'Δεν βρέθηκαν χρήστες'}
                      </p>
                    ) : (
                      searchResults.map(user => (
                        <button
                          key={user.user_id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 rounded-md transition-colors text-left group"
                        >
                          {user.avatar_url ? (
                            <img src={user.avatar_url} className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors">{user.name || 'Χωρίς όνομα'}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                          {user.is_author && (
                            <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              Ήδη Author
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: FORM (For Add & Edit) */}
              {step === 'form' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-200">
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-12 h-12 rounded-full object-cover border-2 border-background" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-lg font-bold">{formData.name?.[0] || '?'}</span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">Επεξεργασία προφίλ για:</div>
                      <div className="font-semibold text-lg">{selectedUser?.email}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Όνομα Εμφάνισης <span className="text-red-500">*</span></Label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="π.χ. Μαρία Παπαδοπούλου"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Βιογραφικό</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Γράψτε λίγα λόγια για τον συντάκτη..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Avatar URL (Εικόνα προφίλ)</Label>
                    <Input
                      value={formData.avatar_url}
                      onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  <div className="flex items-center gap-4 py-4 border-t border-b border-border my-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_author"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={formData.is_author}
                        onChange={e => setFormData({ ...formData, is_author: e.target.checked })}
                      />
                      <Label htmlFor="is_author" className="font-medium cursor-pointer">Author</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_admin"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={formData.is_admin}
                        onChange={e => setFormData({ ...formData, is_admin: e.target.checked })}
                      />
                      <Label htmlFor="is_admin" className="font-medium cursor-pointer text-purple-600">Administrator</Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    {modalMode === 'add' && (
                      <Button variant="ghost" onClick={() => setStep('search')} className="mr-auto">
                        ← Πίσω
                      </Button>
                    )}
                    <Button variant="outline" onClick={closeModal}>
                      Ακύρωση
                    </Button>
                    <Button onClick={handleSave} disabled={!formData.name}>
                      <Save className="w-4 h-4 mr-2" />
                      {modalMode === 'add' ? 'Προσθήκη Author' : 'Αποθήκευση Αλλαγών'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
