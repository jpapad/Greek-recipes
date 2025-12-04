// Page Builder Types

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageContent;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  status: 'draft' | 'published' | 'archived';
  template: 'default' | 'full-width' | 'sidebar-left' | 'sidebar-right';
  author_id?: string;
  is_homepage: boolean;
  display_in_menu: boolean;
  menu_order: number;
  parent_page_id?: string;
  settings: Record<string, any>;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  blocks: ContentBlock[];
}

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | VideoBlock
  | CodeBlock
  | QuoteBlock
  | ListBlock
  | DividerBlock
  | SpacerBlock
  | ButtonBlock
  | ColumnsBlock
  | HeroBlock
  | HomeSectionsBlock
  | ContactFormBlock
  | ContactInfoBlock
  | RecipesGridBlock
  | RegionsGridBlock
  | CustomHTMLBlock;

// Base block interface
interface BaseBlock {
  id: string;
  type: string;
  data: Record<string, any>;
}

// Heading Block
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  data: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    text: string;
    align?: 'left' | 'center' | 'right';
    color?: string;
  };
}

// Paragraph Block
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  data: {
    text: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
  };
}

// Image Block
export interface ImageBlock extends BaseBlock {
  type: 'image';
  data: {
    url: string;
    alt: string;
    caption?: string;
    width?: string;
    height?: string;
    align?: 'left' | 'center' | 'right';
    link?: string;
  };
}

// Video Block
export interface VideoBlock extends BaseBlock {
  type: 'video';
  data: {
    url: string; // YouTube, Vimeo, or direct video URL
    provider: 'youtube' | 'vimeo' | 'direct';
    caption?: string;
  };
}

// Code Block
export interface CodeBlock extends BaseBlock {
  type: 'code';
  data: {
    code: string;
    language: string;
    showLineNumbers?: boolean;
  };
}

// Quote Block
export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  data: {
    text: string;
    author?: string;
    align?: 'left' | 'center' | 'right';
  };
}

// List Block
export interface ListBlock extends BaseBlock {
  type: 'list';
  data: {
    style: 'ordered' | 'unordered';
    items: string[];
  };
}

// Divider Block
export interface DividerBlock extends BaseBlock {
  type: 'divider';
  data: {
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    width?: string;
  };
}

// Spacer Block
export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  data: {
    height: string; // e.g., '2rem', '50px'
  };
}

// Button Block
export interface ButtonBlock extends BaseBlock {
  type: 'button';
  data: {
    text: string;
    url: string;
    style?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    align?: 'left' | 'center' | 'right';
    icon?: string; // Lucide icon name
    openInNewTab?: boolean;
  };
}

// Columns Block
export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  data: {
    columns: {
      id: string;
      width: number; // Percentage
      blocks: ContentBlock[];
    }[];
    gap?: string;
  };
}

// Hero Block
export interface HeroBlock extends BaseBlock {
  type: 'hero';
  data: {
    title: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
    height?: 'small' | 'medium' | 'large' | 'full';
    overlay?: boolean;
    overlayOpacity?: number;
  };
}

// Home Sections Block (loads from home_sections table)
export interface HomeSectionsBlock extends BaseBlock {
  type: 'home-sections';
  data: {
    message?: string;
  };
}

// Contact Form Block
export interface ContactFormBlock extends BaseBlock {
  type: 'contact-form';
  data: {
    title?: string;
    fields: ('name' | 'email' | 'phone' | 'subject' | 'message')[];
    submitText?: string;
    successMessage?: string;
  };
}

// Contact Info Block
export interface ContactInfoBlock extends BaseBlock {
  type: 'contact-info';
  data: {
    email?: string;
    phone?: string;
    address?: string;
    socialLinks?: {
      platform: string;
      url: string;
      icon: string;
    }[];
  };
}

// Recipes Grid Block
export interface RecipesGridBlock extends BaseBlock {
  type: 'recipes-grid';
  data: {
    title?: string;
    limit?: number;
    category?: string;
    difficulty?: string;
    region?: string;
    sortBy?: 'latest' | 'popular' | 'rating';
  };
}

// Regions Grid Block
export interface RegionsGridBlock extends BaseBlock {
  type: 'regions-grid';
  data: {
    title?: string;
    limit?: number;
  };
}

// Custom HTML Block
export interface CustomHTMLBlock extends BaseBlock {
  type: 'custom-html';
  data: {
    html: string;
  };
}

// Menu Item Types
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  target: '_self' | '_blank';
  menu_location: 'main' | 'footer' | 'mobile' | 'user-menu' | 'admin';
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  requires_auth: boolean;
  requires_admin: boolean;
  css_classes?: string;
  badge_text?: string;
  badge_color?: string;
  children?: MenuItem[]; // For nested menus
  created_at: string;
  updated_at: string;
}

// Block Template for Page Builder
export interface BlockTemplate {
  type: string;
  label: string;
  icon: string;
  category: 'content' | 'media' | 'layout' | 'special';
  defaultData: Record<string, any>;
  description?: string;
}
