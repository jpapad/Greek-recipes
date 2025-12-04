"use client";

import { useState } from "react";
import { Search, X, Loader2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Photo {
  id: string;
  url: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  source: string;
  download_url: string;
}

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  initialQuery?: string;
  type?: "food" | "place" | "product";
}

export function ImageSearchModal({
  isOpen,
  onClose,
  onSelect,
  initialQuery = "",
  type = "food",
}: ImageSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [enhancedQuery, setEnhancedQuery] = useState("");
  const [alternativeQueries, setAlternativeQueries] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/search-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, type }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setPhotos(data.photos || []);
      setEnhancedQuery(data.query);
      setAlternativeQueries(data.alternatives || []);
      
      if (data.photos.length === 0) {
        alert("Δεν βρέθηκαν φωτογραφίες. Δοκιμάστε διαφορετικό όνομα.");
      }
    } catch (error) {
      console.error("Image search error:", error);
      alert("Αποτυχία αναζήτησης φωτογραφιών");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPhoto = (photo: Photo) => {
    onSelect(photo.url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <GlassPanel className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Αναζήτηση Φωτογραφίας
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="π.χ. Μουσακάς, Σαντορίνη, Ελληνικό τυρί..."
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="gap-2"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Αναζήτηση
            </Button>
          </div>

          {enhancedQuery && enhancedQuery !== query && (
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <p>🔍 Primary: "{enhancedQuery}"</p>
              {alternativeQueries.length > 0 && (
                <p>🔄 Also searching: {alternativeQueries.map(q => `"${q}"`).join(', ')}</p>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
              <p className="text-muted-foreground">Αναζήτηση φωτογραφιών...</p>
            </div>
          ) : photos.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                ✅ Βρέθηκαν {photos.length} φωτογραφίες HD • Κλικ για επιλογή
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-purple-400 transition-all"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photo.thumb}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-xs font-medium truncate">
                          {photo.photographer}
                        </p>
                        <p className="text-white/70 text-xs">
                          {photo.source}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
              <Search className="w-16 h-16 opacity-20" />
              <p>Κάντε αναζήτηση για να βρείτε φωτογραφίες</p>
              <p className="text-sm">Δοκιμάστε: "Μουσακάς", "Σαντορίνη", "Φέτα τυρί"</p>
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(selectedPhoto.download_url, "_blank");
                  }}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Προβολή
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPhoto(selectedPhoto);
                  }}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Επιλογή
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-white font-medium">{selectedPhoto.alt}</p>
                <p className="text-white/70 text-sm">
                  📸 {selectedPhoto.photographer} • {selectedPhoto.source}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {selectedPhoto.width} × {selectedPhoto.height}px
                </p>
              </div>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
