export type BlogCategoryId =
  | "market-analysis"
  | "crypto"
  | "crypto-news"
  | "crypto-coin-prediction"
  | "zebpay-announcement"
  | "others";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: BlogCategoryId;
  tags: string[];
  image?: { url: string; alt?: string };
};

export type BlogCategory = {
  id: BlogCategoryId;
  label: string;
  description: string;
};

export type BlogMediaItem = {
  id: string;
  title: string;
  excerpt: string;
  href?: string;
  image?: string;
};

export type BlogVideoItem = {
  id: string;
  title: string;
  episode: string;
  excerpt: string;
  date: string;
  image: string;
  href: string;
};
