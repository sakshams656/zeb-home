/** CoinGecko symbol → API id (used in markets section). */
export const COIN_GECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  AVAX: "avalanche-2",
  MATIC: "matic-network",
  LINK: "chainlink",
  ADA: "cardano",
  DOT: "polkadot",
  DOGE: "dogecoin"
};

export const MARKETS_DISPLAY_SYMS = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "AVAX",
  "MATIC",
  "LINK",
  "ADA",
  "DOT",
  "DOGE"
] as const;

export type MarketsDisplaySym = (typeof MARKETS_DISPLAY_SYMS)[number];

export interface CgMarketRow {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

export type ChartPoint = { t: number; p: number };

export async function fetchMarketsCoins(): Promise<CgMarketRow[]> {
  const res = await fetch("/api/coingecko/markets");
  if (!res.ok) throw new Error(`Markets API ${res.status}`);
  return res.json() as Promise<CgMarketRow[]>;
}

export async function fetchCoinMarketChart(coinId: string, _days = 1): Promise<ChartPoint[]> {
  const res = await fetch(`/api/coingecko/chart/${encodeURIComponent(coinId)}`);
  if (!res.ok) throw new Error(`Chart API ${res.status}`);
  return res.json() as Promise<ChartPoint[]>;
}

export function symFromCgRow(row: CgMarketRow): string {
  return row.symbol.toUpperCase();
}

export function volumeInCr(inrVolume: number): number {
  return Math.round((inrVolume / 1e7) * 10) / 10;
}
