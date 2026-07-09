import { ROUTES } from "@/lib/routes";
import { LINKS } from "@/lib/links";

export type NavItem = { label: string; href: string };

export type NavSection = {
  title: string;
  items: NavItem[];
};

export type NavGroup = {
  id: string;
  label: string;
  /** Flat list — used when the menu has no sub-headings. */
  items?: NavItem[];
  /** Grouped columns — e.g. Features → Invest / Pro Trading. */
  sections?: NavSection[];
};

/** All links in a group (flat), for mobile accordion. */
export function navGroupEntries(group: NavGroup): NavItem[] {
  if (group.sections) return group.sections.flatMap((s) => s.items);
  return group.items ?? [];
}

export const NAV_TRADE: NavGroup = {
  id: "trade",
  label: "Trade",
  items: [
    { label: "Quick Trade", href: LINKS.quickTrade },
    { label: "Exchange", href: LINKS.exchange },
    { label: "Futures", href: LINKS.futures },
    { label: "API Trading", href: LINKS.apidocs }
  ]
};

export const NAV_FEATURES: NavGroup = {
  id: "features",
  label: "Features",
  sections: [
    {
      title: "Invest",
      items: [
        { label: "Quick Trade", href: ROUTES.features.quickTrade },
        { label: "CryptoPacks", href: ROUTES.features.cryptopacks },
        { label: "SIP", href: ROUTES.features.sip },
        { label: "Earn", href: ROUTES.features.earn }
      ]
    },
    {
      title: "Pro Trading",
      items: [
        { label: "Exchange", href: LINKS.exchange },
        { label: "Futures", href: ROUTES.features.futures },
        { label: "Expert Trades", href: ROUTES.expertTrades },
        { label: "API Trading", href: LINKS.apidocs }
      ]
    }
  ]
};

export const NAV_BUSINESS: NavGroup = {
  id: "business",
  label: "Business",
  items: [
    { label: "HNI & Institutional Investors", href: ROUTES.business.hni },
    { label: "OTC", href: ROUTES.business.otc },
    { label: "New Coin Listings", href: ROUTES.business.listings },
    { label: "Partnerships", href: ROUTES.business.partnerships },
    { label: "Affiliate", href: ROUTES.business.affiliate }
  ]
};

export const NAV_MORE: NavGroup = {
  id: "more",
  label: "More",
  sections: [
    {
      title: "Explore",
      items: [
        { label: "Events & Meet ups", href: ROUTES.events },
        { label: "Calculators", href: ROUTES.calculators },
        { label: "How to Buy", href: ROUTES.howToBuy }
      ]
    },
    {
      title: "Blogs",
      items: [
        { label: "The Z Blog", href: ROUTES.blog },
        { label: "Market Analysis", href: ROUTES.blogCategory("market-analysis") },
        { label: "Crypto Assets", href: ROUTES.blogCategory("crypto") },
        { label: "Crypto News", href: ROUTES.blogCategory("crypto-news") }
      ]
    }
  ]
};

export const NAV_MENU_GROUPS = [NAV_TRADE, NAV_FEATURES, NAV_BUSINESS, NAV_MORE] as const;

export const NAV_ALL_GROUPS = [NAV_TRADE, NAV_FEATURES, NAV_BUSINESS, NAV_MORE] as const;
