"use client";

import { useEffect, useState } from "react";
import { getAllHomeSections, reorderHomeSections, toggleHomeSectionActive, deleteHomeSection } from "@/lib/api";
import { HomeSection } from "@/lib/types/home-sections";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Eye, EyeOff, Pencil, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function HomeSectionsPage() {
    const router = useRouter();
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadSections();
    }, []);

    async function loadSections() {
        setLoading(true);
        const data = await getAllHomeSections();
        setSections(data);
        setLoading(false);
    }

    async function handleDragEnd(result: DropResult) {
        if (!result.destination) return;

        const items = Array.from(sections);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update display_order for all items
        const updatedItems = items.map((item, index) => ({
            ...item,
            display_order: index + 1
        }));

        setSections(updatedItems);
        setHasChanges(true);
    }

    async function handleSaveOrder() {
        setSaving(true);
        const orderData = sections.map((section, index) => ({
            id: section.id,
            display_order: index + 1
        }));

        const success = await reorderHomeSections(orderData);
        if (success) {
            alert('Η σειρά αποθηκεύτηκε επιτυχώς!');
            setHasChanges(false);
        } else {
            alert('Σφάλμα κατά την αποθήκευση');
        }
        setSaving(false);
    }

    async function handleToggleActive(id: string, currentState: boolean) {
        const success = await toggleHomeSectionActive(id, !currentState);
        if (success) {
            setSections(sections.map(s =>
                s.id === id ? { ...s, is_active: !currentState } : s
            ));
        }
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Σίγουρα θέλετε να διαγράψετε το section "${title}";`)) return;

        const success = await deleteHomeSection(id);
        if (success) {
            setSections(sections.filter(s => s.id !== id));
            alert('Το section διαγράφηκε επιτυχώς!');
        } else {
            alert('Σφάλμα κατά τη διαγραφή');
        }
    }

    const getSectionTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'hero': '🎬 Hero Slider',
            'stats': '📊 Στατιστικά',
            'featured-recipes': '🍽️ Προβεβλημένες Συνταγές',
            'categories': '📁 Κατηγορίες',
            'newsletter': '📧 Newsletter',
            'blog': '📝 Blog',
            'custom': '✨ Custom'
        };
        return labels[type] || type;
    };

    if (loading) {
        return <div className="p-8 text-center">Φόρτωση...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Διαχείριση Home Sections</h1>
                    <p className="text-muted-foreground">
                        Σύρετε τα sections για να αλλάξετε τη σειρά τους στην αρχική σελίδα
                    </p>
                </div>
                <div className="flex gap-3">
                    {hasChanges && (
                        <Button
                            onClick={handleSaveOrder}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Αποθήκευση...' : 'Αποθήκευση Σειράς'}
                        </Button>
                    )}
                    <Button asChild>
                        <Link href="/admin/home-sections/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Νέο Section
                        </Link>
                    </Button>
                </div>
            </div>

            <GlassPanel className="p-6">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-3"
                            >
                                {sections.map((section, index) => (
                                    <Draggable
                                        key={section.id}
                                        draggableId={section.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={`
                                                    flex items-center gap-4 p-4 rounded-lg border-2 
                                                    ${snapshot.isDragging
                                                        ? 'bg-primary/10 border-primary shadow-lg'
                                                        : 'bg-white/50 dark:bg-gray-800/50 border-border'
                                                    }
                                                    ${!section.is_active ? 'opacity-50' : ''}
                                                    transition-all
                                                `}
                                            >
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="cursor-grab active:cursor-grabbing"
                                                >
                                                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-sm font-mono text-muted-foreground">
                                                            #{index + 1}
                                                        </span>
                                                        <h3 className="text-lg font-semibold">
                                                            {section.title}
                                                        </h3>
                                                        <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                            {getSectionTypeLabel(section.section_type)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Slug: <code className="px-1 py-0.5 bg-muted rounded">{section.slug}</code>
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleActive(section.id, section.is_active)}
                                                        title={section.is_active ? 'Απόκρυψη' : 'Εμφάνιση'}
                                                    >
                                                        {section.is_active ? (
                                                            <Eye className="w-4 h-4" />
                                                        ) : (
                                                            <EyeOff className="w-4 h-4" />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link href={`/admin/home-sections/${section.id}/edit`}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(section.id, section.title)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {sections.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Δεν υπάρχουν sections ακόμα.</p>
                        <Button asChild className="mt-4">
                            <Link href="/admin/home-sections/new">
                                <Plus className="w-4 h-4 mr-2" />
                                Δημιουργήστε το πρώτο section
                            </Link>
                        </Button>
                    </div>
                )}
            </GlassPanel>

            {hasChanges && (
                <div className="fixed bottom-6 right-6 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 rounded-lg p-4 shadow-lg">
                    <p className="text-sm font-medium mb-2">⚠️ Υπάρχουν μη αποθηκευμένες αλλαγές</p>
                    <Button
                        onClick={handleSaveOrder}
                        disabled={saving}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="sm"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Αποθήκευση...' : 'Αποθήκευση Σειράς'}
                    </Button>
                </div>
            )}
        </div>
    );
}
