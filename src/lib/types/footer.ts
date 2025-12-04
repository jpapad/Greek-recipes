export interface FooterSettings {
  id: string;
  section: 'brand' | 'contact' | 'social' | 'newsletter' | 'copyright';
  content: any;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BrandContent {
  title: string;
  subtitle: string;
  description: string;
}

export interface SocialContent {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface ContactContent {
  address: string;
  email: string;
  phone: string;
}

export interface NewsletterContent {
  title: string;
  description: string;
  placeholder: string;
}

export interface CopyrightContent {
  text: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}
