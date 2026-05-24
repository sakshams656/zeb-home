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
    { label: "Spot", href: "#showcase" },
    { label: "Exchange", href: "#showcase" },
    { label: "Perpetual Futures", href: "#showcase" }
  ]
};

export const NAV_FEATURES: NavGroup = {
  id: "features",
  label: "Features",
  items: [
    { label: "SIP", href: "#showcase" },
    { label: "CryptoPacks", href: "#packs" },
    { label: "Earn", href: "#earn" },
    { label: "Referral", href: "#" },
    { label: "API Trading", href: "#pro" },
    { label: "HNI", href: "#" },
    { label: "SubAccounts", href: "#pro" },
    { label: "RMS", href: "#pro" }
  ]
};

export const NAV_MORE: NavGroup = {
  id: "more",
  label: "More",
  items: [
    { label: "Z Blog", href: "#" },
    { label: "Calculators", href: "#calculators" },
    { label: "Convertor", href: "#" }
  ]
};

export const NAV_COMPANY: NavGroup = {
  id: "company",
  label: "Company",
  items: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Our Vision", href: "#" },
    { label: "Mission and Values", href: "#" }
  ]
};

export const NAV_MENU_GROUPS = [NAV_TRADE, NAV_FEATURES, NAV_MORE] as const;

export const NAV_ALL_GROUPS = [NAV_TRADE, NAV_FEATURES, NAV_MORE, NAV_COMPANY] as const;
