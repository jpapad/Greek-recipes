'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getRecipes } from '@/lib/api';
import { createArticle, updateArticle, getArticleCategories } from '@/lib/blog-api';
import type { Article, ArticleCategory, Recipe } from '@/lib/types';
import { getUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { X, Plus } from 'lucide-react';

// Dynamic import to avoid SSR issues with Tiptap
const TiptapEditor = dynamic(() => import('./TiptapEditor').then(mod => ({ default: mod.TiptapEditor })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">Φόρτωση επεξεργαστή...</div>
});

interface ArticleFormProps {
  article?: Article;
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  // Form state
  const [title, setTitle] = useState(article?.title || '');
  const [slug, setSlug] = useState(article?.slug || '');
  const [content, setContent] = useState(article?.content || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image || '');
  const [categoryId, setCategoryId] = useState(article?.category_id || '');
  const [tags, setTags] = useState<string[]>(article?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [relatedRecipeIds, setRelatedRecipeIds] = useState<string[]>(article?.related_recipe_ids || []);
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(article?.status || 'draft');
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState(article?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || '');
  const [keywords, setKeywords] = useState<string[]>(article?.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categoriesData, recipesData] = await Promise.all([
      getArticleCategories(),
      getRecipes({})
    ]);
    setCategories(categoriesData);
    setRecipes(recipesData);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[άàâä]/g, 'a')
      .replace(/[έèêë]/g, 'e')
      .replace(/[ήìîï]/g, 'i')
      .replace(/[όòôö]/g, 'o')
      .replace(/[ύùûü]/g, 'u')
      .replace(/ω/g, 'o')
      .replace(/ς/g, 's')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!article) {
      setSlug(generateSlug(value));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const toggleRecipe = (recipeId: string) => {
    if (relatedRecipeIds.includes(recipeId)) {
      setRelatedRecipeIds(relatedRecipeIds.filter(id => id !== recipeId));
    } else {
      setRelatedRecipeIds([...relatedRecipeIds, recipeId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getUser();
      if (!user) {
        toast({ title: 'Πρέπει να συνδεθείτε', variant: 'destructive' });
        return;
      }

      const articleData = {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        author_id: user.id,
        category_id: categoryId || undefined,
        tags,
        related_recipe_ids: relatedRecipeIds,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        keywords,
        status,
        published_at: status === 'published' && !article?.published_at ? new Date().toISOString() : article?.published_at,
      };

      let result;
      if (article) {
        result = await updateArticle(article.id, articleData);
      } else {
        result = await createArticle(articleData as any);
      }

      if (result) {
        toast({ title: article ? 'Το άρθρο ενημερώθηκε!' : 'Το άρθρο δημιουργήθηκε!', variant: 'success' });
        router.push('/admin/articles');
        router.refresh();
      } else {
        toast({ title: 'Σφάλμα κατά την αποθήκευση', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast({ title: 'Σφάλμα κατά την αποθήκευση', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <GlassPanel className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Βασικές Πληροφορίες</h2>
        
        <div>
          <Label htmlFor="title">Τίτλος *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Τίτλος άρθρου"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="url-friendly-slug"
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Περίληψη</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Σύντομη περιγραφή του άρθρου (εμφανίζεται σε λίστες)"
            rows={3}
          />
        </div>

        <div>
          <Label>Εικόνα Εξώφυλλου</Label>
          <ImageUpload onUpload={setFeaturedImage} />
          {featuredImage && (
            <div className="mt-2">
              <img src={featuredImage} alt="Preview" className="max-w-xs rounded-lg" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Κατηγορία</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="">-- Χωρίς κατηγορία --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="status">Κατάσταση</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              <option value="draft">Πρόχειρο</option>
              <option value="published">Δημοσιευμένο</option>
              <option value="archived">Αρχειοθετημένο</option>
            </select>
          </div>
        </div>
      </GlassPanel>

      {/* Content Editor */}
      <GlassPanel className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Περιεχόμενο</h2>
        <TiptapEditor content={content} onChange={setContent} />
      </GlassPanel>

      {/* Tags */}
      <GlassPanel className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Ετικέτες</h2>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Προσθήκη ετικέτας"
          />
          <Button type="button" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-full text-sm"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </GlassPanel>

      {/* Related Recipes */}
      <GlassPanel className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Συνταγές που σχετίζονται</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {recipes.map((recipe) => (
            <label
              key={recipe.id}
              className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={relatedRecipeIds.includes(recipe.id)}
                onChange={() => toggleRecipe(recipe.id)}
              />
              <span className="text-sm">{recipe.title}</span>
            </label>
          ))}
        </div>
      </GlassPanel>

      {/* SEO */}
      <GlassPanel className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">SEO</h2>
        
        <div>
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={title || 'Τίτλος για SEO'}
          />
        </div>

        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder={excerpt || 'Περιγραφή για μηχανές αναζήτησης'}
            rows={3}
          />
        </div>

        <div>
          <Label>Keywords</Label>
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="Προσθήκη keyword"
            />
            <Button type="button" onClick={addKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/20 rounded-full text-sm"
              >
                {keyword}
                <button type="button" onClick={() => removeKeyword(keyword)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Ακύρωση
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Αποθήκευση...' : article ? 'Ενημέρωση Άρθρου' : 'Δημιουργία Άρθρου'}
        </Button>
      </div>
    </form>
  );
}
