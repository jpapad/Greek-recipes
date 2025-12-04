import { HeadingBlock as HeadingBlockType } from '@/lib/types/pages';

export default function HeadingBlock({ block }: { block: HeadingBlockType }) {
    const Tag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements;
    const sizeClasses = {
        1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
        2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
        3: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
        4: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
        5: 'text-base sm:text-lg md:text-xl lg:text-2xl',
        6: 'text-sm sm:text-base md:text-lg lg:text-xl',
    };

    return (
        <Tag
            className={`font-bold ${sizeClasses[block.data.level]} text-${block.data.align || 'left'}`}
            style={{ color: block.data.color }}
        >
            {block.data.text}
        </Tag>
    );
}
