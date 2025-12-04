import { SpacerBlock as SpacerBlockType } from '@/lib/types/pages';

export default function SpacerBlock({ block }: { block: SpacerBlockType }) {
    // Convert px to responsive values
    const heightValue = parseInt(block.data.height);
    const mobileHeight = Math.max(20, heightValue * 0.5);
    const tabletHeight = Math.max(30, heightValue * 0.75);

    return (
        <div 
            className="w-full"
            style={{ 
                height: `${mobileHeight}px`,
            }}
            aria-hidden="true"
        >
            <style jsx>{`
                @media (min-width: 640px) {
                    div {
                        height: ${tabletHeight}px;
                    }
                }
                @media (min-width: 1024px) {
                    div {
                        height: ${block.data.height};
                    }
                }
            `}</style>
        </div>
    );
}
