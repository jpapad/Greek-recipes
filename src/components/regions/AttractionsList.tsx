"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import type { Attraction } from "@/lib/types";

interface AttractionsListProps {
  attractions: Attraction[];
}

const attractionTypeIcons: Record<Attraction["type"], string> = {
  museum: "🏛️",
  monument: "🗿",
  beach: "🏖️",
  park: "🌳",
  archaeological: "⚱️",
  religious: "⛪",
  nature: "🏞️",
};

const attractionTypeLabels: Record<Attraction["type"], string> = {
  museum: "Μουσείο",
  monument: "Μνημείο",
  beach: "Παραλία",
  park: "Πάρκο",
  archaeological: "Αρχαιολογικός Χώρος",
  religious: "Θρησκευτικό",
  nature: "Φυσικό Αξιοθέατο",
};

export default function AttractionsList({ attractions }: AttractionsListProps) {
  const [selectedType, setSelectedType] = useState<Attraction["type"] | "all">("all");

  if (!attractions || attractions.length === 0) {
    return null;
  }

  const filteredAttractions =
    selectedType === "all"
      ? attractions
      : attractions.filter((a) => a.type === selectedType);

  const availableTypes = Array.from(new Set(attractions.map((a) => a.type)));

  return (
    <GlassPanel className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Αξιοθέατα
        </h2>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
          >
            Όλα ({attractions.length})
          </Button>
          {availableTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {attractionTypeIcons[type]} {attractionTypeLabels[type]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAttractions.map((attraction, index) => (
          <GlassPanel key={index} variant="card" className="p-4 hover:border-primary transition-colors">
            <div className="flex gap-4">
              {/* Image */}
              {attraction.image_url && (
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={attraction.image_url}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {attraction.name}
                  </h3>
                  <span className="flex-shrink-0 text-2xl" title={attractionTypeLabels[attraction.type]}>
                    {attractionTypeIcons[attraction.type]}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {attraction.description}
                </p>

                {/* Meta info */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  {attraction.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{attraction.address}</span>
                    </div>
                  )}
                  {attraction.website && (
                    <a
                      href={attraction.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ιστοσελίδα</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {filteredAttractions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Δεν βρέθηκαν αξιοθέατα αυτού του τύπου.
        </div>
      )}
    </GlassPanel>
  );
}
