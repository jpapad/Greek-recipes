"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecipeImage {
    id: string;
    image_url: string;
    caption?: string;
    display_order: number;
}

interface RecipeImageGalleryProps {
    images: RecipeImage[];
    recipeName: string;
}

export function RecipeImageGallery({ images, recipeName }: RecipeImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) return null;

    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
    const currentImage = sortedImages[currentIndex];

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "Escape") setIsFullscreen(false);
    };

    return (
        <>
            {/* Main Gallery */}
            <div className="space-y-4">
                {/* Main Image */}
                <div 
                    className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setIsFullscreen(true)}
                >
                    <Image
                        src={currentImage.image_url}
                        alt={currentImage.caption || `${recipeName} - Image ${currentIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={currentIndex === 0}
                    />
                    
                    {/* Navigation Arrows */}
                    {sortedImages.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                            >
                                <ChevronRight className="w-6 h-6" />
                            </Button>
                        </>
                    )}

                    {/* Image Counter */}
                    {sortedImages.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentIndex + 1} / {sortedImages.length}
                        </div>
                    )}
                </div>

                {/* Caption */}
                {currentImage.caption && (
                    <p className="text-sm text-muted-foreground italic text-center">
                        {currentImage.caption}
                    </p>
                )}

                {/* Thumbnails */}
                {sortedImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {sortedImages.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
                                    currentIndex === idx
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent hover:border-primary/50"
                                )}
                            >
                                <Image
                                    src={img.image_url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setIsFullscreen(false)}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <X className="w-6 h-6" />
                    </Button>

                    {/* Fullscreen Navigation */}
                    {sortedImages.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </Button>
                        </>
                    )}

                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full p-8">
                        <Image
                            src={currentImage.image_url}
                            alt={currentImage.caption || `${recipeName} - Image ${currentIndex + 1}`}
                            fill
                            className="object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {currentImage.caption && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg max-w-2xl text-center">
                            {currentImage.caption}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
