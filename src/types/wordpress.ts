export interface WpPage {
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  modified: string;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
  };
}

export interface WpMenuItem {
  label: string;
  url: string;
  children?: WpMenuItem[];
}

export interface WpPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  featuredImage?: { url: string; alt?: string };
}
