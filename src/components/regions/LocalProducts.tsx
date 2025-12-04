"use client";

import { Package } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { LocalProduct } from "@/lib/types";

interface LocalProductsProps {
  products: LocalProduct[];
}

const productCategoryLabels: Record<LocalProduct["category"], string> = {
  food: "Τρόφιμα",
  wine: "Κρασιά/Ποτά",
  craft: "Χειροτεχνήματα",
  other: "Άλλο",
};

const productCategoryIcons: Record<LocalProduct["category"], string> = {
  food: "🍯",
  wine: "🍷",
  craft: "🎨",
  other: "📦",
};

export default function LocalProducts({ products }: LocalProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <GlassPanel className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Package className="w-6 h-6 text-primary" />
        Τοπικά Προϊόντα
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <GlassPanel
            key={index}
            variant="card"
            className="overflow-hidden hover:border-primary transition-colors"
          >
            {/* Image */}
            {product.image_url && (
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg leading-tight">
                  {product.name}
                </h3>
                <span className="flex-shrink-0 text-2xl" title={productCategoryLabels[product.category]}>
                  {productCategoryIcons[product.category]}
                </span>
              </div>

              <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded mb-2">
                {productCategoryLabels[product.category]}
              </div>

              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
          </GlassPanel>
        ))}
      </div>
    </GlassPanel>
  );
}
