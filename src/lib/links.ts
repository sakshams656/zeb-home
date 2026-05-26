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
  convertor: "https://zebpay.com/in/converter/BTC/INR"
} as const;

/** Per-coin spot pair page (used by the Markets table to deep-link a row). */
export function exchangePairUrl(sym: string, quote = "INR"): string {
  return `https://zebpay.com/exchange/${sym.toUpperCase()}-${quote.toUpperCase()}`;
}
