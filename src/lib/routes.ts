/**
 * In-app routes (this Next.js site). External product URLs live in `LINKS`.
 */
export const ROUTES = {
  home: "/",
  markets: "/markets",
  calculators: "/calculators",
  announcements: "/announcements",
  discover: "/discover",
  testimonials: "/testimonials",
  events: "/events",
  expertTrades: "/pro/expert-trades",
  howToBuy: "/how-to-buy",
  howToBuyCoin: (sym: string) => `/how-to-buy/${sym.toLowerCase()}`,
  features: {
    quickTrade: "/features/quick-trade",
    futures: "/features/futures",
    sip: "/features/sip",
    cryptopacks: "/features/cryptopacks",
    earn: "/features/earn",
    aiInsights: "/features/ai-insights"
  },
  business: {
    hni: "/business/hni-institutional",
    otc: "/business/otc",
    listings: "/business/new-listings",
    partnerships: "/business/partnerships",
    affiliate: "/business/affiliate"
  }
} as const;
