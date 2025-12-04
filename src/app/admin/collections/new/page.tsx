'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCollection } from '@/lib/collections-api';
import { getUser } from '@/lib/auth';
import { ArrowLeft, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

export default function NewCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleNameChange = (value: string) => {
    setName(value);
    // Auto-generate slug from Greek
    const greekToLatin: { [key: string]: string } = {
      'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
      'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
      'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
      'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    };
    
    const transliterated = value
      .toLowerCase()
      .split('')
      .map(char => greekToLatin[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setSlug(transliterated);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const collection = await createCollection({
        user_id: user.id,
        name,
        slug,
        description: description || undefined,
        image_url: imageUrl || undefined,
        is_public: isPublic,
      });

      if (collection) {
        router.push('/admin/collections');
      } else {
        alert('Σφάλμα κατά τη δημιουργία της συλλογής');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Σφάλμα κατά τη δημιουργία');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/collections">
        <Button variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Πίσω στις Συλλογές
        </Button>
      </Link>

      <h1 className="text-3xl font-bold">Νέα Συλλογή</h1>

      <form onSubmit={handleSubmit}>
        <GlassPanel className="p-8 space-y-6">
          <div>
            <Label htmlFor="name">Όνομα Συλλογής *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="π.χ. Καλοκαιρινές Σαλάτες"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="kalokairines-salates"
              pattern="[a-z0-9-]+"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL: /collections/{slug || 'slug'}
            </p>
          </div>

          <div>
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Περιγράψτε τη συλλογή..."
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">URL Εικόνας</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Ορατότητα</Label>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  isPublic
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Globe className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Δημόσια</div>
                <div className="text-sm text-muted-foreground">
                  Εμφανίζεται σε όλους
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  !isPublic
                    ? 'border-primary bg-primary/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Lock className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">Ιδιωτική</div>
                <div className="text-sm text-muted-foreground">
                  Κρυφή (draft)
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Δημιουργία...' : 'Δημιουργία Συλλογής'}
            </Button>
            <Link href="/admin/collections">
              <Button type="button" variant="outline">
                Ακύρωση
              </Button>
            </Link>
          </div>
        </GlassPanel>
      </form>
    </div>
  );
}
