import { CustomHTMLBlock as CustomHTMLBlockType } from '@/lib/types/pages';

export default function CustomHTMLBlock({ block }: { block: CustomHTMLBlockType }) {
    // Sanitize out full-document tags that shouldn't be injected inside a div.
    // Remove <!DOCTYPE>, <html>, <head>, and <body> wrappers so the HTML fragment
    // can be safely inserted into the page without creating invalid nesting.
    let html = block.data.html || '';

    try {
        // Remove DOCTYPE
        html = html.replace(/<!doctype[^>]*>/gi, '');
        // Remove <html> and </html>
        html = html.replace(/<\/?html[^>]*>/gi, '');
        // Remove <head>...</head>
        html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
        // Remove <body> and </body> wrappers but keep inner content
        html = html.replace(/<\/?body[^>]*>/gi, '');
    } catch (err) {
        // If regex fails for any reason, fall back to original html
        console.error('Failed to sanitize custom HTML block:', err);
        html = block.data.html || '';
    }

    return (
        <div
            className="custom-html-block w-full overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
