"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getHomeSectionById, createHomeSection, updateHomeSection } from "@/lib/api";
import { SectionType } from "@/lib/types/home-sections";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

const SECTION_TYPES: Array<{ value: SectionType; label: string; description: string }> = [
    { value: 'hero', label: '🎬 Hero Slider', description: 'Hero slider με slides στην κορυφή' },
    { value: 'stats', label: '📊 Στατιστικά', description: 'Cards με αριθμούς και εικονίδια' },
    { value: 'featured-recipes', label: '🍽️ Προβεβλημένες Συνταγές', description: 'Grid με συνταγές' },
    { value: 'categories', label: '📁 Κατηγορίες', description: 'Grid με κατηγορίες φαγητού' },
    { value: 'newsletter', label: '📧 Newsletter', description: 'Newsletter signup form' },
    { value: 'blog', label: '📝 Blog', description: 'Πρόσφατα άρθρα blog' },
    { value: 'custom', label: '✨ Custom', description: 'Custom HTML/React component' }
];

export default function HomeSectionFormPage() {
    const router = useRouter();
    const params = useParams();
    const sectionId = params?.id as string | undefined;
    const isEditing = sectionId && sectionId !== 'new';

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        section_type: 'custom' as SectionType,
        content: '{}',
        is_active: true,
        display_order: 999
    });

    async function loadSection() {
        if (!sectionId) return;
        
        setLoading(true);
        const data = await getHomeSectionById(sectionId);
        if (data) {
            setFormData({
                title: data.title,
                slug: data.slug,
                section_type: data.section_type,
                content: JSON.stringify(data.content, null, 2),
                is_active: data.is_active,
                display_order: data.display_order
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        if (isEditing) {
            loadSection();
        }
    }, [sectionId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            // Parse JSON content
            const parsedContent = JSON.parse(formData.content);

            if (isEditing && sectionId) {
                const success = await updateHomeSection(sectionId, {
                    title: formData.title,
                    slug: formData.slug,
                    section_type: formData.section_type,
                    content: parsedContent,
                    is_active: formData.is_active
                });

                if (success) {
                    alert('Το section ενημερώθηκε επιτυχώς!');
                    router.push('/admin/home-sections');
                } else {
                    alert('Σφάλμα κατά την ενημέρωση');
                }
            } else {
                const result = await createHomeSection({
                    title: formData.title,
                    slug: formData.slug,
                    section_type: formData.section_type,
                    content: parsedContent,
                    is_active: formData.is_active,
                    display_order: formData.display_order,
                    settings: {}
                });

                if (result) {
                    alert('Το section δημιουργήθηκε επιτυχώς!');
                    router.push('/admin/home-sections');
                } else {
                    alert('Σφάλμα κατά τη δημιουργία');
                }
            }
        } catch (error) {
            alert('Μη έγκυρο JSON format στο περιεχόμενο!');
        }

        setSaving(false);
    }

    const handleContentTemplateChange = (type: SectionType) => {
        const templates: Record<SectionType, any> = {
            hero: {
                slides: [
                    {
                        title: "Τίτλος Slide",
                        subtitle: "Υπότιτλος",
                        buttonText: "Κουμπί",
                        buttonLink: "/recipes",
                        imageUrl: ""
                    }
                ]
            },
            stats: {
                title: "Τα Νούμερά μας",
                subtitle: "Υπότιτλος",
                stats: [
                    { label: "Label", value: "100+", icon: "ChefHat", color: "from-orange-500 to-pink-500" }
                ]
            },
            'featured-recipes': {
                title: "Προβεβλημένες Συνταγές",
                subtitle: "Υπότιτλος",
                limit: 8,
                filterType: "latest"
            },
            categories: {
                title: "Κατηγορίες",
                subtitle: "Υπότιτλος",
                categories: [
                    { name: "Όνομα", slug: "slug", icon: "Utensils", color: "from-orange-500 to-red-500", description: "Περιγραφή" }
                ]
            },
            newsletter: {
                badge: "Newsletter",
                title: "Τίτλος",
                subtitle: "Υπότιτλος",
                placeholder: "Email...",
                buttonText: "Εγγραφή",
                privacyText: "Privacy text"
            },
            blog: {
                badge: "📚 Blog",
                title: "Τίτλος",
                subtitle: "Υπότιτλος",
                limit: 3
            },
            custom: {
                html: "<div>Custom HTML here</div>"
            }
        };

        setFormData({
            ...formData,
            section_type: type,
            content: JSON.stringify(templates[type], null, 2)
        });
    };

    if (loading) {
        return <div className="p-8 text-center">Φόρτωση...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/home-sections">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-bold">
                        {isEditing ? 'Επεξεργασία Section' : 'Νέο Section'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isEditing ? 'Επεξεργαστείτε τις ρυθμίσεις του section' : 'Δημιουργήστε ένα νέο section για την αρχική σελίδα'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <GlassPanel className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="title">Τίτλος *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="slug">Slug (URL-friendly) *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Τύπος Section *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            {SECTION_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => handleContentTemplateChange(type.value)}
                                    className={`
                                        p-4 rounded-lg border-2 text-left transition-all
                                        ${formData.section_type === type.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                        }
                                    `}
                                >
                                    <div className="font-semibold mb-1">{type.label}</div>
                                    <div className="text-xs text-muted-foreground">{type.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="content">Περιεχόμενο (JSON) *</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Επεξεργαστείτε το JSON περιεχόμενο του section. Επιλέξτε τύπο παραπάνω για template.
                        </p>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={15}
                            className="font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 rounded"
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Ενεργό (εμφανίζεται στην αρχική σελίδα)
                        </Label>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                        <Button type="submit" size="lg" disabled={saving}>
                            <Save className="w-5 h-5 mr-2" />
                            {saving ? 'Αποθήκευση...' : isEditing ? 'Ενημέρωση' : 'Δημιουργία'}
                        </Button>
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Ακύρωση
                        </Button>
                    </div>
                </GlassPanel>
            </form>
        </div>
    );
}
