import type { BlogCategory, BlogCategoryId } from "@/types/blog";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "market-analysis",
    label: "Market Analysis",
    description: "Weekly reports and technical analysis for Bitcoin, Ethereum, and top altcoins."
  },
  {
    id: "crypto",
    label: "Crypto",
    description: "Guides, explainers, and curated lists for crypto investors in India."
  },
  {
    id: "crypto-news",
    label: "Crypto News",
    description: "Breaking news and regulatory updates from India and around the world."
  },
  {
    id: "crypto-coin-prediction",
    label: "Crypto Coin",
    description: "Price outlooks and predictions for popular digital assets."
  },
  {
    id: "zebpay-announcement",
    label: "ZebPay Announcement",
    description: "Product launches, partnerships, and company updates from ZebPay."
  },
  {
    id: "others",
    label: "Others",
    description: "More stories from the ZebPay editorial team."
  }
];

export const BLOG_CATEGORY_BY_NAME = new Map<string, BlogCategoryId>([
  ["Market Analysis", "market-analysis"],
  ["Crypto", "crypto"],
  ["Crypto News", "crypto-news"],
  ["Crypto Coin Prediction", "crypto-coin-prediction"],
  ["Crypto Coin", "crypto-coin-prediction"],
  ["ZebPay Announcement", "zebpay-announcement"],
  ["Others", "others"]
]);

export function getCategoryById(id: BlogCategoryId): BlogCategory {
  return BLOG_CATEGORIES.find((c) => c.id === id) ?? BLOG_CATEGORIES[0];
}
