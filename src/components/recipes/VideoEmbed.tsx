"use client";

import { Play } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface VideoEmbedProps {
    videoUrl?: string;
}

export function VideoEmbed({ videoUrl }: VideoEmbedProps) {
    if (!videoUrl) return null;

    // Extract video ID from various URL formats
    const getVideoId = (url: string): { platform: 'youtube' | 'vimeo' | 'other', id: string } => {
        // YouTube
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch) {
            return { platform: 'youtube', id: youtubeMatch[1] };
        }

        // Vimeo
        const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch) {
            return { platform: 'vimeo', id: vimeoMatch[1] };
        }

        return { platform: 'other', id: url };
    };

    const { platform, id } = getVideoId(videoUrl);

    const getEmbedUrl = () => {
        if (platform === 'youtube') {
            return `https://www.youtube.com/embed/${id}`;
        } else if (platform === 'vimeo') {
            return `https://player.vimeo.com/video/${id}`;
        }
        return videoUrl;
    };

    return (
        <GlassPanel className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Video Tutorial</h3>
            </div>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                    src={getEmbedUrl()}
                    title="Recipe Video Tutorial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>

            {platform === 'other' && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    If the video doesn't load, <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">click here to watch</a>
                </p>
            )}
        </GlassPanel>
    );
}
