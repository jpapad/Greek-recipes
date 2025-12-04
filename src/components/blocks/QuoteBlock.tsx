import { QuoteBlock as QuoteBlockType } from '@/lib/types/pages';

export default function QuoteBlock({ block }: { block: QuoteBlockType }) {
    return (
        <blockquote
            className={`border-l-4 border-primary pl-4 sm:pl-6 md:pl-8 py-2 sm:py-3 md:py-4 italic text-${block.data.align || 'left'}`}
        >
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                "{block.data.text}"
            </p>
            {block.data.author && (
                <footer className="text-xs sm:text-sm md:text-base mt-2 text-muted-foreground not-italic">
                    — {block.data.author}
                </footer>
            )}
        </blockquote>
    );
}
