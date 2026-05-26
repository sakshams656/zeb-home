import { LINKS } from "@/lib/links";

export type NavItem = { label: string; href: string };

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_TRADE: NavGroup = {
  id: "trade",
  label: "Trade",
  items: [
    { label: "Spot", href: LINKS.exchange },
    { label: "Exchange", href: LINKS.exchange },
    { label: "Perpetual Futures", href: LINKS.futures }
  ]
};

export const NAV_FEATURES: NavGroup = {
  id: "features",
  label: "Features",
  items: [
    { label: "SIP", href: LINKS.sip },
    { label: "CryptoPacks", href: LINKS.cryptopacks },
    { label: "Earn", href: LINKS.earn },
    // { label: "Referral", href: "#" },
    { label: "API Trading", href: LINKS.apidocs },
    // { label: "HNI", href: "#" },
    // { label: "SubAccounts", href: "#pro" },
    // { label: "RMS", href: "#pro" }
  ]
};

export const NAV_MORE: NavGroup = {
  id: "more",
  label: "More",
  items: [
    { label: "Z Blog", href: LINKS.blog },
    { label: "Calculators", href: "#calculators" },
    { label: "Convertor", href: LINKS.convertor }
  ]
};

// export const NAV_COMPANY: NavGroup = {
//   id: "company",
//   label: "Company",
//   items: [
//     { label: "About Us", href: "#" },
//     // { label: "Careers", href: "#" },
//     { label: "Our Vision", href: "#" },
//     { label: "Mission and Values", href: "#" }
//   ]
// };

export const NAV_MENU_GROUPS = [NAV_TRADE, NAV_FEATURES, NAV_MORE] as const;

export const NAV_ALL_GROUPS = [NAV_TRADE, NAV_FEATURES, NAV_MORE] as const;
