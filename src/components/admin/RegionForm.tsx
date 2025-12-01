"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRegion, updateRegion } from "@/lib/api";
import { Region } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface RegionFormProps {
    region?: Region;
}

export function RegionForm({ region }: RegionFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: region?.name || "",
        slug: region?.slug || "",
        description: region?.description || "",
        image_url: region?.image_url || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (region?.id) {
                await updateRegion(region.id, formData);
            } else {
                await createRegion(formData);
            }
            router.push("/admin/regions");
            router.refresh();
        } catch (error) {
            alert("Failed to save region");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <GlassPanel className="p-8 space-y-6 max-w-2xl">
                <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                    />
                </div>

                <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                        id="image"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" size="lg" disabled={isSubmitting}>
                        <Save className="w-5 h-5 mr-2" />
                        {isSubmitting ? "Saving..." : region ? "Update Region" : "Create Region"}
                    </Button>
                    <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </GlassPanel>
        </form>
    );
}
