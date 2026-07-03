import type { FeatureIconName } from "@/components/features/feature-icons";
import { LINKS } from "@/lib/links";
import { ROUTES } from "@/lib/routes";

export type ProductFeatureId =
  | "quickTrade"
  | "futures"
  | "sip"
  | "cryptopacks"
  | "earn"
  | "aiInsights";

type FaqItem = { q: string; a: string };

type VisualBand = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  cta?: { label: string; href: string };
  reverse?: boolean;
};

export type ProductFeature = {
  id: ProductFeatureId;
  featureRoute: string;
  metadataDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroTitleAccent?: string;
  heroDescription: string;
  heroIllustration: string;
  heroIllustrationAlt: string;
  ctaIcon: FeatureIconName;
  primaryCta: { label: string; href: string };
  benefits: { icon: FeatureIconName; title: string; body: string }[];
  stepsTitle?: string;
  steps?: { icon?: FeatureIconName; title: string; body: string }[];
  visualBands: VisualBand[];
  highlightsTitle?: string;
  highlights?: { icon: FeatureIconName; title: string; body: string }[];
  compare?: {
    title: string;
    left: { icon: FeatureIconName; title: string; body: string; tag?: string };
    right: { icon: FeatureIconName; title: string; body: string; tag?: string };
  };
  pairsShowcase?: {
    title: string;
    description: string;
    cta: { label: string; href: string };
    moreLabel?: string;
  };
  faqs: FaqItem[];
  ctaBand: { title: string; description: string; cta: { label: string; href: string } };
};

const FEATURES: Record<ProductFeatureId, ProductFeature> = {
  quickTrade: {
    id: "quickTrade",
    featureRoute: ROUTES.features.quickTrade,
    metadataDescription:
      "Buy and sell crypto instantly on ZebPay Quick Trade. 300+ pairs, market and limit orders, minimal slippage, and competitive fees.",
    eyebrow: "Features",
    heroTitle: "Buy/Sell instantly",
    heroTitleAccent: "with Quick Trade",
    heroDescription:
      "Effortlessly invest in 300+ pairs using Quick Trade. Place market or limit orders with minimal slippage and competitive fees.",
    heroIllustration: "/features/quick-trade-hero.svg",
    heroIllustrationAlt: "Quick Trade interface illustration",
    ctaIcon: "quickTrade",
    primaryCta: { label: "Trade now", href: LINKS.exchange },
    benefits: [
      {
        icon: "fees",
        title: "Minimal transaction fees",
        body: "Transparent pricing from 0.5% onwards, shown before you confirm."
      },
      {
        icon: "execution",
        title: "Guaranteed execution",
        body: "Market orders fill instantly with confirmed pricing — no order-book wait."
      },
      {
        icon: "slippage",
        title: "Minimal slippage",
        body: "Best available price execution designed for fast in-and-out trades."
      },
      {
        icon: "prices",
        title: "Competitive prices",
        body: "Trade 300+ INR-Crypto and Crypto-Crypto pairs at sharp market rates."
      }
    ],
    stepsTitle: "Quick Trade in 3 simple steps",
    steps: [
      {
        icon: "charts",
        title: "Enter amount",
        body: "Go to Quick Trade and input the crypto amount you want to buy or sell."
      },
      {
        icon: "execution",
        title: "Buy or sell",
        body: "Tap Buy or Sell — choose market for instant fills or limit for your price."
      },
      {
        icon: "quickTrade",
        title: "Confirm trade",
        body: "Review the trade summary screen and confirm to execute in seconds."
      }
    ],
    visualBands: [
      {
        title: "Invest with charts, alerts & instant orders",
        description:
          "Use price charts, volume indicators, and one-tap market or limit placement. Bitcoin, Ethereum, Solana, and 300+ pairs are available at the click of a button.",
        imageSrc: "/features/quick-trade-charts.svg",
        imageAlt: "Quick Trade charts and order placement illustration",
        cta: { label: "Try now", href: LINKS.exchange }
      }
    ],
    highlightsTitle: "Explore Quick Trade features",
    highlights: [
      {
        icon: "charts",
        title: "Charts & instant orders",
        body: "Price charts, volume indicators, and market or limit orders in one streamlined view."
      },
      {
        icon: "alerts",
        title: "Rate alerts",
        body: "Set target prices and get notified when your coin hits the level you care about."
      },
      {
        icon: "devices",
        title: "Trade across devices",
        body: "Same account on mobile and web — balances and history stay in sync."
      },
      {
        icon: "api",
        title: "Robust API",
        body: "Programmatic trading via ZebPay Build for bots and custom integrations."
      }
    ],
    compare: {
      title: "Quick Trade vs open order book",
      left: {
        icon: "quickTrade",
        title: "Quick Trade",
        tag: "Instant",
        body: "Confirmed price immediately. Market or limit orders with guaranteed execution and minimal slippage — built for speed."
      },
      right: {
        icon: "orderBook",
        title: "Open order book",
        body: "Place limit orders at a specific price. Execution depends on matching buyers and sellers — better for price control when you can wait."
      }
    },
    pairsShowcase: {
      title: "INR-Crypto & Crypto-Crypto trading",
      description:
        "Trade across 300+ INR-Crypto and Crypto-Crypto pairs — Bitcoin, Ethereum, Solana, and more — from a single Quick Trade interface.",
      cta: { label: "Try now", href: LINKS.exchange }
    },
    faqs: [
      {
        q: "What is ZebPay Quick Trade?",
        a: "Quick Trade is an instant buy/sell experience on ZebPay. Trade 300+ INR-Crypto and Crypto-Crypto pairs using market or limit orders with guaranteed execution and competitive pricing — without navigating a traditional order book."
      },
      {
        q: "What is the difference between Quick Trade and an Open Order Book?",
        a: "Quick Trade confirms your price immediately for fast execution. The open order book lets you place limit orders at a specific price, but fills depend on market liquidity. Quick Trade suits speed; the order book suits price control."
      },
      {
        q: "How do I buy crypto instantly using Quick Trade?",
        a: "Open Quick Trade, pick your pair, enter an INR amount or crypto quantity, choose market or limit, review the summary, and confirm. Crypto credits to your wallet on execution."
      },
      {
        q: "What pairs are available on Quick Trade?",
        a: "Over 300 pairs including BTC/INR, ETH/INR, SOL/INR, and Crypto-Crypto pairs such as BTC/ETH. The full list is available on the ZebPay platform."
      },
      {
        q: "What are the transaction fees?",
        a: "Fees start from 0.5% per transaction and are shown on the trade summary before you confirm. Government-mandated TDS may apply separately on crypto transactions."
      },
      {
        q: "Is Quick Trade safe for buying crypto in India?",
        a: "ZebPay has operated since 2014 with multi-stage security, 98% of funds in multi-signature cold storage, and FIU-IND registration under India's PMLA framework."
      }
    ],
    ctaBand: {
      title: "Start trading now",
      description: "Open Quick Trade on ZebPay and execute your first market or limit order in seconds.",
      cta: { label: "Trade now", href: LINKS.exchange }
    }
  },

  futures: {
    id: "futures",
    featureRoute: ROUTES.features.futures,
    metadataDescription:
      "Trade Crypto-INR and Crypto-USDT perpetual futures on ZebPay with up to 75x leverage, instant order placement, and 100+ technical indicators.",
    eyebrow: "Features",
    heroTitle: "ZebPay Perpetual Futures",
    heroDescription:
      "Trade Crypto-INR and Crypto-USDT perpetual futures seamlessly on ZebPay. Endless opportunities are a click away.",
    heroIllustration: "/features/futures-hero.svg",
    heroIllustrationAlt: "Perpetual futures trading illustration",
    ctaIcon: "leverage",
    primaryCta: { label: "Explore futures", href: LINKS.futures },
    benefits: [
      {
        icon: "leverage",
        title: "Up to 75x leverage",
        body: "Elevate your trading game with up to 75x leverage and enhance the potential of your capital."
      },
      {
        icon: "execution",
        title: "Instant order placements",
        body: "Place orders with zero delay — buy or sell, settlements happen instantly."
      },
      {
        icon: "charts",
        title: "100+ indicators",
        body: "Perform in-depth technical analysis with a full suite of charting tools at your fingertips."
      },
      {
        icon: "orderBook",
        title: "Market & limit orders",
        body: "Trade at market price or set your desired price with limit orders and TP/SL controls."
      }
    ],
    stepsTitle: "How to trade perpetual futures on ZebPay",
    steps: [
      { icon: "wallet", title: "Create & verify", body: "Create a ZebPay account and complete KYC and bank verification." },
      { icon: "wallet", title: "Fund futures wallet", body: "Deposit INR and transfer funds from your fiat wallet to the Futures wallet." },
      { icon: "leverage", title: "Place your trade", body: "Select a pair, set leverage, choose market or limit, and execute." }
    ],
    visualBands: [
      {
        title: "Elevate your trading process",
        description:
          "Access 100+ indicators for in-depth technical analysis. Place market or limit orders with take-profit and stop-loss — all from one futures interface.",
        imageSrc: "/features/futures-trading.svg",
        imageAlt: "Futures charting and order controls illustration",
        cta: { label: "Start trading", href: LINKS.futures },
        reverse: true
      }
    ],
    highlightsTitle: "What's in store for you?",
    highlights: [
      {
        icon: "leverage",
        title: "200+ trading pairs",
        body: "Trade BTC-INR, ETH-INR, BTC-USDT, ETH-USDT, and 200+ altcoin perpetual contracts."
      },
      {
        icon: "risk",
        title: "Dedicated futures wallet",
        body: "Ring-fenced margin wallet separate from spot — transfer INR or USDT when you're ready to trade."
      },
      {
        icon: "devices",
        title: "Mobile & web",
        body: "Full futures experience on Android, iOS, and web — place and monitor positions anywhere."
      },
      {
        icon: "execution",
        title: "Zero-delay execution",
        body: "Orders execute and settle instantly so you can react to fast-moving markets."
      }
    ],
    faqs: [
      {
        q: "What are Perpetual Futures and how do they work on ZebPay?",
        a: "Perpetual futures are derivative contracts that let you take positions on crypto price movements without owning the underlying asset and without an expiry date. On ZebPay you can open long or short positions on 200+ tokens with up to 75x leverage."
      },
      {
        q: "What is the maximum leverage available?",
        a: "ZebPay Perpetual Futures offers up to 75x leverage. Higher leverage amplifies both gains and losses — use it based on your risk appetite."
      },
      {
        q: "What order types are supported?",
        a: "Market orders execute immediately at the best available price. Limit orders execute at your specified price or better. You can also set Take Profit and Stop Loss on open positions."
      },
      {
        q: "How do I get started?",
        a: "Complete KYC, deposit INR or crypto, transfer funds to your Futures Wallet, select a trading pair, set leverage, and place your first trade."
      },
      {
        q: "Is futures trading available in India?",
        a: "Yes. ZebPay is FIU-IND registered and PMLA-compliant. Indian citizens and Indian-registered entities can access perpetual futures after KYC verification."
      }
    ],
    ctaBand: {
      title: "Start your perpetual futures journey",
      description: "Transfer funds to your Futures wallet and explore 200+ pairs with up to 75x leverage.",
      cta: { label: "Explore futures", href: LINKS.futures }
    }
  },

  sip: {
    id: "sip",
    featureRoute: ROUTES.features.sip,
    metadataDescription:
      "Automate your Bitcoin and crypto investing with ZebPay SIP. Daily, weekly, or monthly installments with rupee cost averaging.",
    eyebrow: "Features",
    heroTitle: "Bitcoin SIP is now live",
    heroTitleAccent: "on ZebPay",
    heroDescription:
      "Automate your bitcoin and crypto investing the disciplined way — invest consistently, reduce timing risk, and build long-term exposure.",
    heroIllustration: "/features/sip-hero.svg",
    heroIllustrationAlt: "Crypto SIP recurring investment illustration",
    ctaIcon: "sip",
    primaryCta: { label: "Start your SIP", href: LINKS.sip },
    benefits: [
      {
        icon: "wallet",
        title: "Invest consistently",
        body: "Build crypto exposure on a trusted Indian exchange with automated recurring buys."
      },
      {
        icon: "slippage",
        title: "Rupee cost averaging",
        body: "Spread purchases across time to lower the impact of short-term volatility."
      },
      {
        icon: "calendar",
        title: "Flexible frequency",
        body: "Auto-invest daily, weekly, or monthly — start instantly or schedule for a future date."
      },
      {
        icon: "execution",
        title: "QuickTrade execution",
        body: "Each SIP installment executes as a QuickTrade market buy at the prevailing price."
      }
    ],
    stepsTitle: "Just 3 simple steps",
    steps: [
      { icon: "wallet", title: "Add funds", body: "Ensure you have sufficient INR balance in your ZebPay wallet." },
      { icon: "prices", title: "Select your coin", body: "Choose from cryptocurrencies available on ZebPay SIP." },
      { icon: "sip", title: "Set up your SIP", body: "Pick amount, frequency, and start date — your SIP runs automatically from there." }
    ],
    visualBands: [
      {
        title: "Own Bitcoin, one SIP at a time",
        description:
          "A disciplined Bitcoin SIP captures long-term growth across market cycles while reducing the impact of short-term volatility — from around $3,800 in 2018 to over $100,000 in 2025.",
        imageSrc: "/features/sip-flow.svg",
        imageAlt: "SIP growth and recurring investment illustration",
        cta: { label: "Start your SIP", href: LINKS.sip }
      }
    ],
    compare: {
      title: "SIP vs lump sum investing",
      left: {
        icon: "sip",
        title: "SIP investing",
        tag: "Disciplined",
        body: "Investment spread across multiple periods. Entry prices vary, reducing timing risk and aligning with regular income cycles."
      },
      right: {
        icon: "wallet",
        title: "Lump sum",
        body: "Entire amount invested at a single market price. Higher entry-price risk and sharper initial volatility on your full capital."
      }
    },
    faqs: [
      {
        q: "What is a Crypto SIP?",
        a: "A Crypto SIP lets you invest a fixed amount in cryptocurrencies automatically at regular intervals, helping you invest consistently without timing the market."
      },
      {
        q: "How do I start a SIP in Bitcoin on ZebPay?",
        a: "Add funds to your wallet, select a crypto available on QuickTrade, choose your SIP amount and frequency, and confirm."
      },
      {
        q: "What is the minimum and maximum SIP amount?",
        a: "Minimum and maximum SIP amounts follow ZebPay QuickTrade order limits and may vary by crypto."
      },
      {
        q: "Is crypto SIP legal in India?",
        a: "Yes. Crypto SIPs are allowed in India, though investments are subject to applicable taxes and regulations."
      },
      {
        q: "Can I pause or cancel my SIP?",
        a: "Yes. Pause, resume, or cancel your SIP anytime from the SIP details page with no penalties."
      }
    ],
    ctaBand: {
      title: "Start your crypto SIP today",
      description: "Set up daily, weekly, or monthly auto-investing in minutes on ZebPay.",
      cta: { label: "Start your SIP", href: LINKS.sip }
    }
  },

  cryptopacks: {
    id: "cryptopacks",
    featureRoute: ROUTES.features.cryptopacks,
    metadataDescription:
      "Invest in expert-curated crypto baskets with ZebPay CryptoPacks. Pre-balanced portfolios, performance insights, and risk-reward ratings.",
    eyebrow: "Features",
    heroTitle: "CryptoPacks",
    heroDescription:
      "Effortlessly invest in a bundle of crypto assets at the click of a button. Access well-balanced portfolios designed by experienced professionals.",
    heroIllustration: "/features/cryptopacks-hero.svg",
    heroIllustrationAlt: "CryptoPacks curated basket illustration",
    ctaIcon: "packs",
    primaryCta: { label: "Explore CryptoPacks", href: LINKS.cryptopacks },
    benefits: [
      {
        icon: "packs",
        title: "Curated baskets",
        body: "Expert-selected tokens pre-balanced to optimise risk and returns — DeFi, L1s, AI, and more."
      },
      {
        icon: "charts",
        title: "Performance insights",
        body: "Track portfolio progress from 1 week to 3 months with real-time performance data."
      },
      {
        icon: "risk",
        title: "Risk & reward rating",
        body: "Clear ratings help you understand the risk-reward profile before you invest."
      },
      {
        icon: "portfolio",
        title: "P&L at a glance",
        body: "Complete profit and loss breakdown so you know when to buy, sell, or hold."
      }
    ],
    visualBands: [
      {
        title: "Track your progress with in-depth performance insights",
        description:
          "Monitor portfolio performance across multiple timeframes. CryptoPacks empower strategic adjustments with comprehensive progress overviews.",
        imageSrc: "/features/cryptopacks-portfolio.svg",
        imageAlt: "CryptoPacks portfolio performance illustration",
        cta: { label: "Explore CryptoPacks", href: LINKS.cryptopacks },
        reverse: true
      },
      {
        title: "Portfolios curated by experienced professionals",
        description:
          "Tap into seasoned crypto veterans' selections — hand-picked tokens, pre-balanced for risk and return. Invest with expert finesse instantly.",
        imageSrc: "/features/cryptopacks-curated.svg",
        imageAlt: "Expert-curated crypto basket illustration",
        cta: { label: "Get started", href: LINKS.cryptopacks }
      }
    ],
    highlightsTitle: "What's in store for you?",
    highlights: [
      {
        icon: "packs",
        title: "One-click diversification",
        body: "Buy a full thematic basket instead of picking individual coins one by one."
      },
      {
        icon: "charts",
        title: "Multi-period tracking",
        body: "View performance from 1 week to 3 months to spot trends early."
      },
      {
        icon: "risk",
        title: "Transparent ratings",
        body: "Risk and reward ratings surface before you commit capital."
      },
      {
        icon: "portfolio",
        title: "Full P&L visibility",
        body: "See gains, losses, and allocation breakdown in one place."
      }
    ],
    faqs: [
      {
        q: "What are CryptoPacks?",
        a: "CryptoPacks are expert-curated baskets of crypto assets you can buy in one click — themed around sectors like DeFi, L1s, or AI."
      },
      {
        q: "How is performance tracked?",
        a: "CryptoPacks show portfolio progress across 1 week, 1 month, and 3 month windows with real-time data."
      },
      {
        q: "What is the Risk and Reward Rating?",
        a: "A rating that summarises the expected risk-reward profile of each pack so you can match investments to your comfort level."
      },
      {
        q: "Can I see my profit and loss?",
        a: "Yes. CryptoPacks provide a complete P&L breakdown for your pack holdings."
      }
    ],
    ctaBand: {
      title: "Embrace CryptoPacks today",
      description: "Unlock your path to a diversified crypto portfolio with one-click expert baskets.",
      cta: { label: "Explore CryptoPacks", href: LINKS.cryptopacks }
    }
  },

  earn: {
    id: "earn",
    featureRoute: ROUTES.features.earn,
    metadataDescription:
      "Earn fixed returns up to 8.5% APY on your crypto with ZebPay Earn. 30, 60, and 90-day terms on BTC, ETH, USDT, and more.",
    eyebrow: "Features",
    heroTitle: "Earn up to 8.5%",
    heroTitleAccent: "on your crypto",
    heroDescription:
      "Put idle crypto to work with fixed-term ZebPay Earn. Choose 30, 60, or 90-day terms and receive returns directly to your wallet at maturity.",
    heroIllustration: "/features/earn-hero.svg",
    heroIllustrationAlt: "ZebPay Earn fixed returns illustration",
    ctaIcon: "earn",
    primaryCta: { label: "Start earning", href: LINKS.earn },
    benefits: [
      {
        icon: "earn",
        title: "Up to 8.5% APY",
        body: "Competitive annualised rates on ATOM, INJ, SOL, USDT, and other supported assets."
      },
      {
        icon: "calendar",
        title: "Flexible terms",
        body: "Choose 30, 60, or 90-day fixed terms — longer terms generally earn higher rates."
      },
      {
        icon: "wallet",
        title: "Wallet payout",
        body: "Earnings credited in the same crypto you deposited, ready to trade or reinvest."
      },
      {
        icon: "risk",
        title: "No early penalty",
        body: "Withdraw early without slashing — principal returned in full (no earnings for partial terms)."
      }
    ],
    stepsTitle: "Here's how you start earning",
    steps: [
      { icon: "prices", title: "Select a crypto", body: "Pick from BTC, ETH, USDT, SOL, ATOM, and other supported assets." },
      { icon: "wallet", title: "Specify quantity", body: "Enter the amount to lock for your chosen term." },
      { icon: "calendar", title: "Choose your term", body: "Select 30, 60, or 90 days — enable auto-renewal if you prefer." },
      { icon: "earn", title: "Receive earnings", body: "Returns deposit to your wallet at maturity between 00:00–02:00 UTC." }
    ],
    visualBands: [
      {
        title: "Estimated earning rates by asset",
        description:
          "Rates vary by coin and term — USDT up to 4% on 90 days, ATOM up to 8.5% on 60 days, INJ up to 7% on 90 days. Over ₹23 crore in returns already distributed through ZebPay Earn.",
        imageSrc: "/features/earn-rates.svg",
        imageAlt: "ZebPay Earn rates by asset illustration",
        cta: { label: "Start earning", href: LINKS.earn },
        reverse: true
      }
    ],
    highlightsTitle: "Supported assets",
    highlights: [
      { icon: "prices", title: "Bitcoin (BTC)", body: "Earn on BTC with 30, 60, and 90-day term options." },
      { icon: "prices", title: "Stablecoins (USDT)", body: "Earn on USDT while keeping principal pegged to the dollar." },
      { icon: "earn", title: "Cosmos (ATOM)", body: "Among the highest rates — up to 8.5% annualised on 60-day terms." },
      { icon: "portfolio", title: "10 assets supported", body: "BTC, ETH, USDT, BNB, SOL, ADA, ATOM, POL, TRX, and INJ." }
    ],
    faqs: [
      {
        q: "What is ZebPay Earn?",
        a: "ZebPay Earn lets you lock crypto for 30, 60, or 90 days and earn fixed annualised returns paid to your wallet at maturity."
      },
      {
        q: "Which assets are supported?",
        a: "BTC, ETH, USDT, BNB, SOL, ADA, ATOM, POL, TRX, and INJ. Check the platform for current rates."
      },
      {
        q: "Is there a penalty for early withdrawal?",
        a: "No penalty on principal. Early withdrawal returns your full deposit but no earnings are credited for incomplete terms."
      },
      {
        q: "When are earnings credited?",
        a: "At maturity, between 00:00–02:00 UTC, in the same crypto you deposited."
      },
      {
        q: "Is ZebPay Earn safe?",
        a: "ZebPay has operated since 2014, is FIU-IND registered, and stores user funds in multi-signature cold wallets."
      }
    ],
    ctaBand: {
      title: "Sign up to start earning",
      description: "Lock idle crypto for a fixed term and receive returns directly to your ZebPay wallet.",
      cta: { label: "Start earning", href: LINKS.earn }
    }
  },

  aiInsights: {
    id: "aiInsights",
    featureRoute: ROUTES.features.aiInsights,
    metadataDescription:
      "AI-powered crypto insights on ZebPay — sentiment scores, risk alerts, and opportunity signals for major trading pairs.",
    eyebrow: "Features",
    heroTitle: "AI Insights",
    heroTitleAccent: "for smarter trades",
    heroDescription:
      "Get sentiment analysis, opportunity signals, and risk alerts for every major pair — so you trade with context, not guesswork.",
    heroIllustration: "/features/ai-insights-hero.svg",
    heroIllustrationAlt: "AI Insights sentiment and signals illustration",
    ctaIcon: "ai",
    primaryCta: { label: "Explore on ZebPay", href: LINKS.exchange },
    benefits: [
      {
        icon: "ai",
        title: "Sentiment scoring",
        body: "Bullish/bearish gauges updated regularly so you know market mood at a glance."
      },
      {
        icon: "alerts",
        title: "Risk alerts",
        body: "Surface volatility spikes and drawdown risks before they hit your portfolio."
      },
      {
        icon: "charts",
        title: "Opportunity signals",
        body: "AI-flagged setups on major pairs help you spot entries worth investigating."
      },
      {
        icon: "devices",
        title: "Built into the app",
        body: "Insights live where you trade — no separate dashboard or export required."
      }
    ],
    visualBands: [
      {
        title: "Sentiment, confidence & trend at a glance",
        description:
          "See bullish percentage, confidence trends over 7 days, and pair-level summaries. AI Insights distils market noise into actionable context for BTC, ETH, and major alt pairs.",
        imageSrc: "/features/ai-insights-sentiment.svg",
        imageAlt: "AI sentiment gauge and trend illustration",
        cta: { label: "Open ZebPay", href: LINKS.exchange },
        reverse: true
      },
      {
        title: "Pair-level risk and opportunity breakdown",
        description:
          "Every major pair gets a structured read — momentum, volatility context, and flagged risks — so you can align trades with your strategy.",
        imageSrc: "/features/ai-insights-pairs.svg",
        imageAlt: "AI pair-level insights illustration",
        cta: { label: "Try AI Insights", href: LINKS.exchange }
      }
    ],
    highlightsTitle: "How traders use AI Insights",
    highlights: [
      {
        icon: "ai",
        title: "Pre-trade check",
        body: "Glance at sentiment before entering a Quick Trade or futures position."
      },
      {
        icon: "risk",
        title: "Risk awareness",
        body: "Spot elevated volatility or negative momentum early."
      },
      {
        icon: "charts",
        title: "Trend confirmation",
        body: "Cross-check your technical view with AI confidence trends."
      },
      {
        icon: "alerts",
        title: "Stay informed",
        body: "Updated regularly so insights reflect recent market conditions."
      }
    ],
    faqs: [
      {
        q: "What is ZebPay AI Insights?",
        a: "AI Insights provides sentiment scores, risk flags, and opportunity signals for major crypto pairs directly within the ZebPay platform."
      },
      {
        q: "Which pairs are covered?",
        a: "Major INR and USDT pairs including BTC, ETH, SOL, and leading altcoins. Coverage expands as new pairs gain liquidity."
      },
      {
        q: "Is AI Insights financial advice?",
        a: "No. Insights are informational tools to support your own research — not personalised investment advice."
      },
      {
        q: "Where do I find AI Insights?",
        a: "Available in the ZebPay app and web platform within the trading and research sections for supported pairs."
      }
    ],
    ctaBand: {
      title: "Trade with AI context",
      description: "Open ZebPay and explore sentiment, risks, and opportunities for your favourite pairs.",
      cta: { label: "Explore on ZebPay", href: LINKS.exchange }
    }
  }
};

export function getProductFeatureById(id: ProductFeatureId): ProductFeature {
  return FEATURES[id];
}

export function getAllProductFeatures(): ProductFeature[] {
  return Object.values(FEATURES);
}

export const PRODUCT_FEATURE_ROUTE_BY_ID: Record<ProductFeatureId, string> = {
  quickTrade: ROUTES.features.quickTrade,
  futures: ROUTES.features.futures,
  sip: ROUTES.features.sip,
  cryptopacks: ROUTES.features.cryptopacks,
  earn: ROUTES.features.earn,
  aiInsights: ROUTES.features.aiInsights
};

/** Maps product-showcase panel modes to internal feature pages. */
export const SHOWCASE_MODE_TO_FEATURE_ID: Partial<
  Record<"qt" | "ft" | "sip" | "cp" | "exchange" | "ai", ProductFeatureId>
> = {
  qt: "quickTrade",
  ft: "futures",
  sip: "sip",
  cp: "cryptopacks",
  exchange: "earn",
  ai: "aiInsights"
};

export function getFeatureRouteForShowcaseMode(
  mode: "qt" | "ft" | "sip" | "cp" | "exchange" | "ai"
): string {
  const id = SHOWCASE_MODE_TO_FEATURE_ID[mode];
  return id ? PRODUCT_FEATURE_ROUTE_BY_ID[id] : ROUTES.home;
}
