import { ButtonBlock as ButtonBlockType } from '@/lib/types/pages';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ButtonBlock({ block }: { block: ButtonBlockType }) {
    const alignClass = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
    }[block.data.align || 'left'];

    const sizeMap = {
        sm: 'sm' as const,
        md: 'default' as const,
        lg: 'lg' as const,
    };

    return (
        <div className={`flex ${alignClass}`}>
            <Link href={block.data.url}>
                <Button 
                    variant={block.data.style as any || 'default'}
                    size={sizeMap[block.data.size || 'md'] || 'default'}
                    className="text-sm sm:text-base"
                >
                    {block.data.text}
                </Button>
            </Link>
        </div>
    );
}
