"use client";

import { useState } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface PhotoGalleryManagerProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

export default function PhotoGalleryManager({
  photos,
  onChange,
}: PhotoGalleryManagerProps) {
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const addPhoto = () => {
    if (newPhotoUrl.trim()) {
      onChange([...photos, newPhotoUrl.trim()]);
      setNewPhotoUrl("");
    }
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPhoto();
    }
  };

  return (
    <div className="space-y-4">
      <Label>Φωτογραφίες (Gallery)</Label>

      {/* Add new photo */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="https://example.com/photo.jpg"
          value={newPhotoUrl}
          onChange={(e) => setNewPhotoUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button type="button" onClick={addPhoto} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Προσθήκη
        </Button>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photoUrl, index) => (
            <GlassPanel key={index} variant="card" className="relative group">
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).alt = "Broken image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {photoUrl}
              </p>
            </GlassPanel>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Δεν υπάρχουν φωτογραφίες. Προσθέστε URLs φωτογραφιών.</p>
        </div>
      )}
    </div>
  );
}
