import { ParagraphBlock as ParagraphBlockType } from '@/lib/types/pages';

export default function ParagraphBlock({ block }: { block: ParagraphBlockType }) {
    return (
        <p
            className={`text-sm sm:text-base md:text-lg leading-relaxed text-${block.data.align || 'left'}`}
            style={{ color: block.data.color }}
        >
            {block.data.text}
        </p>
    );
}
