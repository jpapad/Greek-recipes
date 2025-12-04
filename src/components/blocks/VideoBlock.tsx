import { VideoBlock as VideoBlockType } from '@/lib/types/pages';

export default function VideoBlock({ block }: { block: VideoBlockType }) {
    function getEmbedUrl() {
        if (block.data.provider === 'youtube') {
            // Extract video ID from URL if full URL provided
            const videoId = block.data.url.includes('youtube.com') 
                ? new URL(block.data.url).searchParams.get('v') || block.data.url
                : block.data.url;
            return `https://www.youtube.com/embed/${videoId}`;
        } else if (block.data.provider === 'vimeo') {
            // Extract video ID from URL
            const videoId = block.data.url.includes('vimeo.com')
                ? block.data.url.split('/').pop()
                : block.data.url;
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return block.data.url;
    }

    if (block.data.provider === 'direct') {
        return (
            <div className="w-full rounded-lg overflow-hidden my-6">
                <video
                    src={block.data.url}
                    controls
                    className="w-full h-auto"
                />
                {block.data.caption && (
                    <p className="text-xs sm:text-sm text-center text-muted-foreground mt-2">
                        {block.data.caption}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="my-6">
            <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={getEmbedUrl()}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            {block.data.caption && (
                <p className="text-xs sm:text-sm text-center text-muted-foreground mt-2">
                    {block.data.caption}
                </p>
            )}
        </div>
    );
}
