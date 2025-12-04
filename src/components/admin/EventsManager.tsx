"use client";

import { useState } from "react";
import { X, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Event } from "@/lib/types";

interface EventsManagerProps {
  events: Event[];
  onChange: (events: Event[]) => void;
}

export default function EventsManager({ events, onChange }: EventsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Event>({
    name: "",
    date: "",
    description: "",
    location: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      description: "",
      location: "",
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.description) return;

    if (editingIndex !== null) {
      const updated = [...events];
      updated[editingIndex] = formData;
      onChange(updated);
    } else {
      onChange([...events, formData]);
    }
    resetForm();
  };

  const startEdit = (index: number) => {
    setFormData(events[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const removeEvent = (index: number) => {
    onChange(events.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Εκδηλώσεις & Γιορτές</Label>
        {!isAdding && (
          <Button type="button" onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Προσθήκη Εκδήλωσης
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <GlassPanel variant="card" className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-name">Όνομα Εκδήλωσης *</Label>
                <Input
                  id="event-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="event-date">Ημερομηνία/Περίοδος *</Label>
                <Input
                  id="event-date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  placeholder="π.χ. Αύγουστος, 15-20 Ιουλίου"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="event-desc">Περιγραφή *</Label>
              <Textarea
                id="event-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="event-location">Τοποθεσία</Label>
              <Input
                id="event-location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="π.χ. Κεντρική Πλατεία"
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

      {/* Events List */}
      {events.length > 0 && (
        <div className="space-y-3">
          {events.map((event, index) => (
            <GlassPanel key={index} variant="card" className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{event.name}</h4>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.description}
                  </p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground">
                      📍 {event.location}
                    </p>
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
                    onClick={() => removeEvent(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {events.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Δεν υπάρχουν εκδηλώσεις. Προσθέστε την πρώτη εκδήλωση.</p>
        </div>
      )}
    </div>
  );
}
