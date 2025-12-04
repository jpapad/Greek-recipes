"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Recipe } from "@/lib/types";

interface RecipeShareButtonProps {
    recipe: Recipe;
}

export function RecipeShareButton({ recipe }: RecipeShareButtonProps) {
    const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/recipes/${recipe.slug}` 
        : '';

    const shareData = {
        title: recipe.title,
        text: recipe.short_description || `Check out this delicious Greek recipe: ${recipe.title}`,
        url: shareUrl,
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    };

    const shareToFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
        );
    };

    const shareToTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=400'
        );
    };

    const shareToWhatsApp = () => {
        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareUrl)}`,
            '_blank'
        );
    };

    const shareToEmail = () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(recipe.title)}&body=${encodeURIComponent(shareData.text + '\n\n' + shareUrl)}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <DropdownMenuItem onClick={handleNativeShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share...
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleCopyLink}>
                    📋 Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToFacebook}>
                    📘 Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToTwitter}>
                    🐦 Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToWhatsApp}>
                    💬 WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToEmail}>
                    📧 Email
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
