import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/api';
import PageRenderer from '@/components/PageRenderer';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const page = await getPageBySlug(params.slug);
    
    if (!page || page.status !== 'published') {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.meta_title || page.title,
        description: page.meta_description || '',
        keywords: page.meta_keywords || '',
        openGraph: {
            title: page.meta_title || page.title,
            description: page.meta_description || '',
            images: page.og_image ? [page.og_image] : [],
        },
    };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
    const page = await getPageBySlug(params.slug);

    if (!page || page.status !== 'published') {
        notFound();
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <PageRenderer page={page} />
        </div>
    );
}
