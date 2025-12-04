"use client";

import { useState } from "react";
import { X, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { LocalProduct } from "@/lib/types";

interface LocalProductsManagerProps {
  products: LocalProduct[];
  onChange: (products: LocalProduct[]) => void;
}

const productCategories = [
  { value: "food", label: "Τρόφιμα" },
  { value: "wine", label: "Κρασιά/Ποτά" },
  { value: "craft", label: "Χειροτεχνήματα" },
  { value: "other", label: "Άλλο" },
] as const;

export default function LocalProductsManager({
  products,
  onChange,
}: LocalProductsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<LocalProduct>({
    name: "",
    category: "food",
    description: "",
    image_url: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "food",
      description: "",
      image_url: "",
    });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;

    if (editingIndex !== null) {
      const updated = [...products];
      updated[editingIndex] = formData;
      onChange(updated);
    } else {
      onChange([...products, formData]);
    }
    resetForm();
  };

  const startEdit = (index: number) => {
    setFormData(products[index]);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const removeProduct = (index: number) => {
    onChange(products.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Τοπικά Προϊόντα</Label>
        {!isAdding && (
          <Button type="button" onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Προσθήκη Προϊόντος
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <GlassPanel variant="card" className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prod-name">Όνομα Προϊόντος *</Label>
                <Input
                  id="prod-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="prod-category">Κατηγορία *</Label>
                <select
                  id="prod-category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as LocalProduct["category"],
                    })
                  }
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  required
                >
                  {productCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="prod-desc">Περιγραφή *</Label>
              <Textarea
                id="prod-desc"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="prod-image">Image URL</Label>
              <Input
                id="prod-image"
                type="url"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
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

      {/* Products List */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((product, index) => (
            <GlassPanel key={index} variant="card" className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">{product.name}</h4>
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                      {
                        productCategories.find(
                          (c) => c.value === product.category
                        )?.label
                      }
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded mt-2"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(index)}
                  >
                    Επεξ.
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {products.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Δεν υπάρχουν προϊόντα. Προσθέστε το πρώτο προϊόν.</p>
        </div>
      )}
    </div>
  );
}
