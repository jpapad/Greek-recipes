import { CustomHTMLBlock as CustomHTMLBlockType } from '@/lib/types/pages';

export default function CustomHTMLBlock({ block }: { block: CustomHTMLBlockType }) {
    return (
        <div 
            className="custom-html-block w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: block.data.html }}
        />
    );
}
