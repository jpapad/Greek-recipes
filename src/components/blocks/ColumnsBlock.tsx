import { ColumnsBlock as ColumnsBlockType } from '@/lib/types/pages';

export default function ColumnsBlock({ block }: { block: ColumnsBlockType }) {
    const colCount = block.data.columns?.length || 2;
    const gridColsMap: Record<number, string> = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };
    const gridCols = gridColsMap[colCount] || 'grid-cols-1 md:grid-cols-2';

    return (
        <div 
            className={`grid ${gridCols} my-6`}
            style={{ gap: block.data.gap || '20px' }}
        >
            {block.data.columns?.map((column: any, index: number) => (
                <div key={index} className="space-y-4">
                    {column.blocks?.map((innerBlock: any, innerIndex: number) => (
                        <div key={innerIndex}>
                            {/* Recursive block rendering would go here */}
                            <div className="p-4 bg-muted/50 rounded">
                                Block: {innerBlock.type}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
