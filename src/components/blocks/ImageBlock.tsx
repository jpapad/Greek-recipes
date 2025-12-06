import { ImageBlock as ImageBlockType } from '@/lib/types/pages';
import Link from 'next/link';
import Image from 'next/image';

export default function ImageBlock({ block }: { block: ImageBlockType }) {
    const widthClass = {
        full: 'w-full',
        medium: 'w-full sm:w-3/4 md:w-2/3 mx-auto',
        small: 'w-full sm:w-1/2 md:w-1/3 mx-auto',
    }[block.data.width || 'full'] || 'w-full';

    const imageElement = (
        <div className={`relative ${widthClass} overflow-hidden rounded-lg`}>
            <Image
                src={block.data.url}
                alt={block.data.alt || ''}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
            />
            {block.data.caption && (
                <p className="text-xs sm:text-sm text-center text-muted-foreground mt-2 px-2">
                    {block.data.caption}
                </p>
            )}
        </div>
    );

    if (block.data.link) {
        return (
            <Link href={block.data.link} className="block hover:opacity-90 transition-opacity">
                {imageElement}
            </Link>
        );
    }

    return imageElement;
}
