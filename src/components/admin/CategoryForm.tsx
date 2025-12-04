'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createArticleCategory, updateArticleCategory } from '@/lib/blog-api';
import type { ArticleCategory } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CategoryFormProps {
  category?: ArticleCategory;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [color, setColor] = useState(category?.color || '#3B82F6');

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!category) { // Only auto-generate for new categories
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
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name,
        slug,
        description: description || undefined,
        color,
      };

      if (category) {
        await updateArticleCategory(category.id, categoryData);
      } else {
        await createArticleCategory(categoryData);
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Σφάλμα κατά την αποθήκευση');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <GlassPanel className="max-w-2xl">
        <div className="mb-6">
          <Link href="/admin/categories">
            <Button type="button" variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Πίσω
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Όνομα *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="π.χ. Ιστορία"
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="istoria"
              pattern="[a-z0-9-]+"
              title="Μόνο πεζά λατινικά γράμματα, αριθμοί και παύλες"
            />
            <p className="text-sm text-gray-400 mt-1">
              Θα χρησιμοποιηθεί στο URL (π.χ. /blog/category/{slug || 'slug'})
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Σύντομη περιγραφή της κατηγορίας"
            />
          </div>

          {/* Color */}
          <div>
            <Label htmlFor="color">Χρώμα</Label>
            <div className="flex gap-4 items-center">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-12 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3B82F6"
                pattern="^#[0-9A-Fa-f]{6}$"
                className="font-mono"
              />
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: color }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Επιλέξτε χρώμα για την κατηγορία (hex format)
            </p>
          </div>

          {/* Preview */}
          <div>
            <Label>Προεπισκόπηση</Label>
            <div className="mt-2 p-4 bg-white/5 rounded-lg">
              <span 
                className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: color }}
              >
                {name || 'Όνομα κατηγορίας'}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Αποθήκευση...' : (category ? 'Ενημέρωση' : 'Δημιουργία')}
            </Button>
            <Link href="/admin/categories">
              <Button type="button" variant="outline">
                Ακύρωση
              </Button>
            </Link>
          </div>
        </div>
      </GlassPanel>
    </form>
  );
}
