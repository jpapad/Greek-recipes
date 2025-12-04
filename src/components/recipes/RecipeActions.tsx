"use client";

import { Recipe } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Printer, Share2, Facebook, Twitter, Link2, Mail } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface RecipeActionsProps {
    recipe: Recipe;
}

export function RecipeActions({ recipe }: RecipeActionsProps) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const recipeUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/recipes/${recipe.slug}`
        : '';

    const handlePrint = () => {
        window.print();
    };

    const handleShare = (platform: string) => {
        const title = encodeURIComponent(recipe.title);
        const url = encodeURIComponent(recipeUrl);
        const description = encodeURIComponent(recipe.short_description || '');

        const shareUrls: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}&media=${encodeURIComponent(recipe.image_url || '')}`,
            email: `mailto:?subject=${title}&body=${description}%0A%0A${url}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
        setShowShareMenu(false);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(recipeUrl);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
                setShowShareMenu(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    return (
        <div className="flex items-center gap-3 print:hidden">
            <Button
                variant="outline"
                size="lg"
                onClick={handlePrint}
                className="gap-2"
            >
                <Printer className="w-5 h-5" />
                Εκτύπωση
            </Button>

            <div className="relative">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="gap-2"
                >
                    <Share2 className="w-5 h-5" />
                    Κοινοποίηση
                </Button>

                {showShareMenu && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setShowShareMenu(false)}
                        />
                        
                        {/* Share Menu */}
                        <GlassPanel className="absolute right-0 top-full mt-2 w-56 p-3 space-y-2 z-50">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-left"
                            >
                                <Facebook className="w-5 h-5 text-blue-600" />
                                <span>Facebook</span>
                            </button>

                            <button
                                onClick={() => handleShare('twitter')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-left"
                            >
                                <Twitter className="w-5 h-5 text-sky-500" />
                                <span>Twitter</span>
                            </button>

                            <button
                                onClick={() => handleShare('email')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-left"
                            >
                                <Mail className="w-5 h-5 text-gray-600" />
                                <span>Email</span>
                            </button>

                            <div className="border-t border-white/20 my-2" />

                            <button
                                onClick={handleCopyLink}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-left"
                            >
                                <Link2 className="w-5 h-5 text-gray-600" />
                                <span>{copied ? '✓ Αντιγράφηκε!' : 'Αντιγραφή Link'}</span>
                            </button>
                        </GlassPanel>
                    </>
                )}
            </div>
        </div>
    );
}
