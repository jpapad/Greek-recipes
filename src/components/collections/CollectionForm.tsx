"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
 

interface CollectionFormProps {
    onSave: (collection: {
        name: string;
        description: string;
        is_public: boolean;
        recipe_ids: string[];
    }) => Promise<void>;
    initialData?: {
        name: string;
        description: string;
        is_public: boolean;
        recipe_ids: string[];
    };
    onCancel: () => void;
}

export function CollectionForm({ onSave, initialData, onCancel }: CollectionFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [isPublic, setIsPublic] = useState(initialData?.is_public || false);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            showToast('Το όνομα είναι υποχρεωτικό', 'error');
            return;
        }

        setSaving(true);
        try {
            await onSave({
                name: name.trim(),
                description: description.trim(),
                is_public: isPublic,
                recipe_ids: initialData?.recipe_ids || []
            });
            showToast('Η συλλογή αποθηκεύτηκε επιτυχώς!', 'success');
        } catch (error) {
            showToast('Σφάλμα κατά την αποθήκευση', 'error');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <GlassPanel className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-xl font-bold mb-4">
                        {initialData ? 'Επεξεργασία Συλλογής' : 'Νέα Συλλογή'}
                    </h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Όνομα Συλλογής *</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="π.χ. Αγαπημένες Κρητικές Συνταγές"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Περιγραφή</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Μια σύντομη περιγραφή της συλλογής σας..."
                        rows={3}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="is_public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="is_public" className="cursor-pointer">
                        Δημόσια συλλογή (ορατή σε άλλους χρήστες)
                    </Label>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Ακύρωση
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
                    </Button>
                </div>
            </form>
        </GlassPanel>
    );
}
