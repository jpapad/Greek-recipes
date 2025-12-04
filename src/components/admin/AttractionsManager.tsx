"use client";

import { useState } from "react";
import { X, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Attraction } from "@/lib/types";

interface AttractionsManagerProps {
  attractions: Attraction[];
  onChange: (attractions: Attraction[]) => void;
}

const attractionTypes = [
  { value: "museum", label: "Μουσείο" },
  { value: "monument", label: "Μνημείο" },
  { value: "beach", label: "Παραλία" },
  { value: "park", label: "Πάρκο" },
  { value: "archaeological", label: "Αρχαιολογικός Χώρος" },
  { value: "religious", label: "Θρησκευτικό Μνημείο" },
  { value: "nature", label: "Φυσικό Αξιοθέατο" },
] as const;

export default function AttractionsManager({
  attractions,
  onChange,
}: AttractionsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Attraction>({
    name: "",
    type: "monument",
    description: "",
    image_url: "",
    address: "",
    website: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      type: "monument",
      description: "",
      image_url: "",
      address: "",
      website: "",
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    if (editingIndex !== null) {
      const updated = [...attractions];
      updated[editingIndex] = formData;
      onChange(updated);
    } else {
      onChange([...attractions, formData]);
    }
    resetForm();
  };

  const startEdit = (index: number) => {
    setFormData(attractions[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const removeAttraction = (index: number) => {
    onChange(attractions.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Αξιοθέατα</Label>
        {!isAdding && (
          <Button type="button" onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Προσθήκη Αξιοθέατου
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <GlassPanel variant="card" className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="attr-name">Όνομα *</Label>
                <Input
                  id="attr-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="attr-type">Τύπος *</Label>
                <select
                  id="attr-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Attraction["type"],
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  {attractionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="attr-desc">Περιγραφή *</Label>
              <Textarea
                id="attr-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="attr-image">Image URL</Label>
                <Input
                  id="attr-image"
                  type="url"
                  value={formData.image_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="attr-website">Website</Label>
                <Input
                  id="attr-website"
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="attr-address">Διεύθυνση</Label>
              <Input
                id="attr-address"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={resetForm}>
                Ακύρωση
              </Button>
              <Button type="submit">
                {editingIndex !== null ? "Ενημέρωση" : "Προσθήκη"}
              </Button>
            </div>
          </form>
        </GlassPanel>
      )}

      {/* Attractions List */}
      {attractions.length > 0 && (
        <div className="space-y-3">
          {attractions.map((attraction, index) => (
            <GlassPanel key={index} variant="card" className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{attraction.name}</h4>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                      {
                        attractionTypes.find((t) => t.value === attraction.type)
                          ?.label
                      }
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {attraction.description}
                  </p>
                  {attraction.address && (
                    <p className="text-xs text-muted-foreground">
                      📍 {attraction.address}
                    </p>
                  )}
                  {attraction.website && (
                    <a
                      href={attraction.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      🔗 {attraction.website}
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(index)}
                  >
                    Επεξεργασία
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttraction(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {attractions.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Δεν υπάρχουν αξιοθέατα. Προσθέστε το πρώτο αξιοθέατο.</p>
        </div>
      )}
    </div>
  );
}
