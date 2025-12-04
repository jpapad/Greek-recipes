'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPageById, updatePage } from '@/lib/api';
import { Page } from '@/lib/types/pages';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BlockEditor from '@/components/admin/BlockEditor';
import { ArrowLeft, Save, Code, Layout } from 'lucide-react';
import Link from 'next/link';

export default function EditPagePage() {
    const router = useRouter();
    const params = useParams();
    const pageId = params.id as string;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [page, setPage] = useState<Page | null>(null);
    const [editorMode, setEditorMode] = useState<'visual' | 'json'>('visual');
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        og_image: '',
        status: 'draft' as 'draft' | 'published' | 'archived',
        template: 'default' as 'default' | 'full-width' | 'sidebar-left' | 'sidebar-right',
        display_in_menu: false,
        menu_order: 0,
        content: { blocks: [] }
    });

    useEffect(() => {
        loadPage();
    }, [pageId]);

    async function loadPage() {
        setLoading(true);
        const data = await getPageById(pageId);
        if (data) {
            setPage(data);
            setFormData({
                title: data.title,
                slug: data.slug,
                meta_title: data.meta_title || '',
                meta_description: data.meta_description || '',
                meta_keywords: data.meta_keywords || '',
                og_image: data.og_image || '',
                status: data.status,
                template: data.template,
                display_in_menu: data.display_in_menu || false,
                menu_order: data.menu_order || 0,
                content: data.content as any
            });
        }
        setLoading(false);
    }

    function handleChange(field: string, value: any) {
        setFormData(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const success = await updatePage(pageId, {
                title: formData.title,
                slug: formData.slug,
                meta_title: formData.meta_title || formData.title,
                meta_description: formData.meta_description,
                meta_keywords: formData.meta_keywords,
                og_image: formData.og_image,
                status: formData.status,
                template: formData.template,
                display_in_menu: formData.display_in_menu,
                menu_order: formData.menu_order,
                content: formData.content
            });

            if (success) {
                router.push('/admin/pages');
                router.refresh();
            }
        } catch (error) {
            console.error('Error updating page:', error);
            alert('Σφάλμα κατά την ενημέρωση της σελίδας');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Φόρτωση σελίδας...</p>
                </div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Η σελίδα δεν βρέθηκε</h2>
                    <Link href="/admin/pages">
                        <Button>Επιστροφή στις Σελίδες</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/pages">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Πίσω
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-bold mb-2">✏️ Επεξεργασία Σελίδας</h1>
                    <p className="text-muted-foreground">
                        {page.title}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <GlassPanel className="p-4 sm:p-6">
                            <h2 className="text-xl font-semibold mb-4">Βασικές Πληροφορίες</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Τίτλος *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="π.χ. Σχετικά με εμάς"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">URL Slug *</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        placeholder="π.χ. about-us"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        URL: /{formData.slug}
                                    </p>
                                </div>
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <h2 className="text-xl font-semibold">Περιεχόμενο</h2>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={editorMode === 'visual' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setEditorMode('visual')}
                                    >
                                        <Layout className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Visual</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={editorMode === 'json' ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setEditorMode('json')}
                                    >
                                        <Code className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">JSON</span>
                                    </Button>
                                </div>
                            </div>
                            
                            {editorMode === 'visual' ? (
                                <BlockEditor
                                    content={formData.content}
                                    onChange={(content) => handleChange('content', content)}
                                />
                            ) : (
                                <div>
                                    <Label htmlFor="content">Περιεχόμενο (JSON)</Label>
                                    <Textarea
                                        id="content"
                                        value={JSON.stringify(formData.content, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                handleChange('content', parsed);
                                            } catch {
                                                // Invalid JSON, don't update
                                            }
                                        }}
                                        rows={15}
                                        className="font-mono text-sm"
                                        placeholder='{"blocks": []}'
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Blocks: {formData.content.blocks?.length || 0}
                                    </p>
                                </div>
                            )}
                        </GlassPanel>

                        <GlassPanel className="p-4 sm:p-6">
                            <h2 className="text-xl font-semibold mb-4">SEO & Meta Tags</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input
                                        id="meta_title"
                                        value={formData.meta_title}
                                        onChange={(e) => handleChange('meta_title', e.target.value)}
                                        placeholder="Αφήστε κενό για αυτόματο"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="meta_description">Meta Description</Label>
                                    <Textarea
                                        id="meta_description"
                                        value={formData.meta_description}
                                        onChange={(e) => handleChange('meta_description', e.target.value)}
                                        rows={3}
                                        placeholder="Περιγραφή για μηχανές αναζήτησης"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                    <Input
                                        id="meta_keywords"
                                        value={formData.meta_keywords}
                                        onChange={(e) => handleChange('meta_keywords', e.target.value)}
                                        placeholder="λέξεις-κλειδιά, χωρισμένες, με, κόμματα"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="og_image">OG Image URL</Label>
                                    <Input
                                        id="og_image"
                                        value={formData.og_image}
                                        onChange={(e) => handleChange('og_image', e.target.value)}
                                        placeholder="https://..."
                                        type="url"
                                    />
                                </div>
                            </div>
                        </GlassPanel>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        <GlassPanel className="p-4 sm:p-6">
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Ρυθμίσεις</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="status">Κατάσταση</Label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                    >
                                        <option value="draft">Πρόχειρο</option>
                                        <option value="published">Δημοσιευμένο</option>
                                        <option value="archived">Αρχειοθετημένο</option>
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="template">Template</Label>
                                    <select
                                        id="template"
                                        value={formData.template}
                                        onChange={(e) => handleChange('template', e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-md"
                                    >
                                        <option value="default">Default</option>
                                        <option value="full-width">Full Width</option>
                                        <option value="sidebar-left">Sidebar Left</option>
                                        <option value="sidebar-right">Sidebar Right</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="display_in_menu"
                                        checked={formData.display_in_menu}
                                        onChange={(e) => handleChange('display_in_menu', e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="display_in_menu" className="cursor-pointer">
                                        Εμφάνιση στο Menu
                                    </Label>
                                </div>

                                {formData.display_in_menu && (
                                    <div>
                                        <Label htmlFor="menu_order">Σειρά στο Menu</Label>
                                        <Input
                                            id="menu_order"
                                            type="number"
                                            value={formData.menu_order}
                                            onChange={(e) => handleChange('menu_order', parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                )}
                            </div>
                        </GlassPanel>

                        <GlassPanel className="p-6 bg-muted/50">
                            <h3 className="font-semibold mb-2">Πληροφορίες</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>ID: {page.id}</p>
                                <p>Δημιουργήθηκε: {new Date(page.created_at).toLocaleDateString('el-GR')}</p>
                                <p>Τελευταία ενημέρωση: {new Date(page.updated_at).toLocaleDateString('el-GR')}</p>
                                {page.published_at && (
                                    <p>Δημοσιεύθηκε: {new Date(page.published_at).toLocaleDateString('el-GR')}</p>
                                )}
                            </div>
                        </GlassPanel>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={saving}
                            >
                                <Save className="w-5 h-5 mr-2" />
                                {saving ? 'Αποθήκευση...' : 'Αποθήκευση Αλλαγών'}
                            </Button>
                            <Link href="/admin/pages" className="block">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    disabled={saving}
                                >
                                    Ακύρωση
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
