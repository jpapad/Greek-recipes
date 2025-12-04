import { ListBlock as ListBlockType } from '@/lib/types/pages';

export default function ListBlock({ block }: { block: ListBlockType }) {
    const Tag = block.data.style === 'ordered' ? 'ol' : 'ul';
    const listStyleClass = block.data.style === 'ordered' 
        ? 'list-decimal' 
        : 'list-disc';

    return (
        <Tag className={`${listStyleClass} pl-5 sm:pl-6 md:pl-8 space-y-2 text-sm sm:text-base md:text-lg`}>
            {block.data.items.map((item: string, index: number) => (
                <li key={index} className="leading-relaxed">
                    {item}
                </li>
            ))}
        </Tag>
    );
}
