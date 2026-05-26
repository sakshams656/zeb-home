/**
 * Real ZebPay product URLs. Single source of truth — every CTA, nav item,
 * and footer link should import from here so future URL changes are a
 * one-file edit.
 */
export const LINKS = {
  getStarted: "https://zebpay.com/app",
  exchange: "https://zebpay.com/exchange",
  futures: "https://zebpay.com/futures/trade/BTC-USDT",
  sip: "https://sip.zebpay.com/sip",
  earn: "https://zebpay.com/app/portfolio/earn",
  cryptopacks: "https://zebpay.com/app/cryptoPacks",
  apidocs: "https://apidocs.zebpay.com/",
  blog: "https://zebpay.com/in/blog",
  convertor: "https://zebpay.com/in/converter/BTC/INR",
  about: "https://zebpay.com/in/about-us",
  careers: "https://zebpay.com/careers",
  missionVision: "https://zebpay.com/vision-mission-values",
  terms: "https://zebpay.com/in/legal-privacy#terms-of-use",
  privacy: "https://zebpay.com/in/legal-privacy#privacy-policy",
  riskDisclosure: "https://zebpay.com/in/legal-privacy#risk-disclosure"
} as const;

/** Per-coin spot pair page (used by the Markets table to deep-link a row). */
export function exchangePairUrl(sym: string, quote = "INR"): string {
  return `https://zebpay.com/exchange/${sym.toUpperCase()}-${quote.toUpperCase()}`;
}

/** Per-coin converter page (used by the footer Convertor column). */
export function converterUrl(sym: string, fiat = "INR"): string {
  return `https://zebpay.com/in/converter/${sym.toUpperCase()}/${fiat.toUpperCase()}`;
}
