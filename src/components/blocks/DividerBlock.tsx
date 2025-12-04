import { DividerBlock as DividerBlockType } from '@/lib/types/pages';

export default function DividerBlock({ block }: { block: DividerBlockType }) {
    const styleMap = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted',
    };

    return (
        <hr
            className={`border-t-2 ${styleMap[block.data.style || 'solid']} my-4 sm:my-6 md:my-8`}
            style={{
                borderColor: block.data.color || '#e5e7eb',
                width: block.data.width || '100%',
                marginLeft: block.data.width !== '100%' ? 'auto' : '0',
                marginRight: block.data.width !== '100%' ? 'auto' : '0',
            }}
        />
    );
}
