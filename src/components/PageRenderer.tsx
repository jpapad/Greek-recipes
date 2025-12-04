'use client';

import { Page, ContentBlock } from '@/lib/types/pages';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import ImageBlock from './blocks/ImageBlock';
import ButtonBlock from './blocks/ButtonBlock';
import ListBlock from './blocks/ListBlock';
import SpacerBlock from './blocks/SpacerBlock';
import DividerBlock from './blocks/DividerBlock';
import QuoteBlock from './blocks/QuoteBlock';
import VideoBlock from './blocks/VideoBlock';
import CodeBlock from './blocks/CodeBlock';
import ColumnsBlock from './blocks/ColumnsBlock';
import HeroBlock from './blocks/HeroBlock';
import HomeSectionsBlock from './blocks/HomeSectionsBlock';
import ContactFormBlock from './blocks/ContactFormBlock';
import ContactInfoBlock from './blocks/ContactInfoBlock';
import RecipesGridBlock from './blocks/RecipesGridBlock';
import RegionsGridBlock from './blocks/RegionsGridBlock';
import CustomHTMLBlock from './blocks/CustomHTMLBlock';

interface PageRendererProps {
    page: Page;
}

export default function PageRenderer({ page }: PageRendererProps) {
    const TemplateWrapper = getTemplateWrapper(page.template);

    return (
        <TemplateWrapper>
            <div className="space-y-6 sm:space-y-8 md:space-y-12">
                {page.content.blocks.map((block, index) => (
                    <BlockRenderer key={index} block={block} />
                ))}
            </div>
        </TemplateWrapper>
    );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case 'heading':
            return <HeadingBlock block={block} />;
        case 'paragraph':
            return <ParagraphBlock block={block} />;
        case 'image':
            return <ImageBlock block={block} />;
        case 'button':
            return <ButtonBlock block={block} />;
        case 'list':
            return <ListBlock block={block} />;
        case 'spacer':
            return <SpacerBlock block={block} />;
        case 'divider':
            return <DividerBlock block={block} />;
        case 'quote':
            return <QuoteBlock block={block} />;
        case 'video':
            return <VideoBlock block={block} />;
        case 'code':
            return <CodeBlock block={block} />;
        case 'columns':
            return <ColumnsBlock block={block} />;
        case 'hero':
            return <HeroBlock block={block} />;
        case 'home-sections':
            return <HomeSectionsBlock block={block as any} />;
        case 'contact-form':
            return <ContactFormBlock block={block as any} />;
        case 'contact-info':
            return <ContactInfoBlock block={block as any} />;
        case 'recipes-grid':
            return <RecipesGridBlock block={block as any} />;
        case 'regions-grid':
            return <RegionsGridBlock block={block as any} />;
        case 'custom-html':
            return <CustomHTMLBlock block={block as any} />;
        default:
            return null;
    }
}

function getTemplateWrapper(template: string) {
    switch (template) {
        case 'full-width':
            return FullWidthTemplate;
        case 'sidebar-left':
            return SidebarLeftTemplate;
        case 'sidebar-right':
            return SidebarRightTemplate;
        default:
            return DefaultTemplate;
    }
}

function DefaultTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-4xl">
            {children}
        </div>
    );
}

function FullWidthTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full">
            {children}
        </div>
    );
}

function SidebarLeftTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                <aside className="lg:col-span-3 order-2 lg:order-1">
                    <div className="sticky top-24 space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">Sidebar</h3>
                            <p className="text-sm text-muted-foreground">Sidebar content</p>
                        </div>
                    </div>
                </aside>
                <main className="lg:col-span-9 order-1 lg:order-2">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarRightTemplate({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                <main className="lg:col-span-9">
                    {children}
                </main>
                <aside className="lg:col-span-3">
                    <div className="sticky top-24 space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">Sidebar</h3>
                            <p className="text-sm text-muted-foreground">Sidebar content</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
