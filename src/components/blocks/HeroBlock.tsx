import { HeroBlock as HeroBlockType } from '@/lib/types/pages';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroBlock({ block }: { block: HeroBlockType }) {
    const heightMap = {
        small: '300px',
        medium: '500px',
        large: '700px',
        full: '100vh',
    };

    return (
        <div 
            className="relative w-full overflow-hidden rounded-lg my-6"
            style={{
                minHeight: '300px',
                height: heightMap[block.data.height || 'medium'],
                backgroundImage: block.data.backgroundImage ? `url(${block.data.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {block.data.overlay && (
                <div 
                    className="absolute inset-0 bg-black"
                    style={{ opacity: block.data.overlayOpacity || 0.5 }}
                />
            )}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6">
                    {block.data.title}
                </h1>
                {block.data.subtitle && (
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-2xl">
                        {block.data.subtitle}
                    </p>
                )}
                {block.data.buttonText && block.data.buttonLink && (
                    <Link href={block.data.buttonLink}>
                        <Button size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10">
                            {block.data.buttonText}
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
