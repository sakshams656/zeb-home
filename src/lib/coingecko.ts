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

const CG_API_URL = process.env.CG_API_URL;

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

export interface CgMarketChart {
  prices: [number, number][];
}

type CgConfig = {
  base: string;
  header: "x-cg-demo-api-key" | "x-cg-pro-api-key";
  key: string;
};

function getCgConfig(): CgConfig | null {
  const raw = CG_API_URL?.trim();
  if (!raw) return null;

  if (raw.startsWith("http")) {
    const base = raw.replace(/\/$/, "");
    return { base, header: "x-cg-demo-api-key", key: "" };
  }

  const isDemo = raw.startsWith("CG-");
  return {
    base: isDemo
      ? "https://api.coingecko.com/api/v3"
      : "https://pro-api.coingecko.com/api/v3",
    header: isDemo ? "x-cg-demo-api-key" : "x-cg-pro-api-key",
    key: raw
  };
}

async function cgFetch<T>(path: string, search?: Record<string, string>): Promise<T> {
  const cfg = getCgConfig();
  if (!cfg) throw new Error("CG_API_URL is not set");

  const url = new URL(`${cfg.base}${path}`);
  if (search) {
    for (const [k, v] of Object.entries(search)) url.searchParams.set(k, v);
  }

  const headers: HeadersInit = { Accept: "application/json" };
  if (cfg.key) headers[cfg.header] = cfg.key;

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CoinGecko ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchMarketsCoins(
  syms: readonly string[] = MARKETS_DISPLAY_SYMS
): Promise<CgMarketRow[]> {
  const ids = syms
    .map((s) => COIN_GECKO_IDS[s])
    .filter(Boolean)
    .join(",");

  const rows = await cgFetch<CgMarketRow[]>("/coins/markets", {
    vs_currency: "inr",
    ids,
    order: "market_cap_desc",
    sparkline: "true",
    price_change_percentage: "24h,7d"
  });

  const order = new Map(syms.map((s, i) => [s.toUpperCase(), i]));
  return [...rows].sort(
    (a, b) =>
      (order.get(a.symbol.toUpperCase()) ?? 99) -
      (order.get(b.symbol.toUpperCase()) ?? 99)
  );
}

export type ChartPoint = { t: number; p: number };

export async function fetchCoinMarketChart(
  coinId: string,
  days = 1
): Promise<ChartPoint[]> {
  const data = await cgFetch<CgMarketChart>(`/coins/${coinId}/market_chart`, {
    vs_currency: "inr",
    days: String(days)
  });
  return data.prices.map(([t, p]) => ({ t, p }));
}

export function symFromCgRow(row: CgMarketRow): string {
  return row.symbol.toUpperCase();
}

export function volumeInCr(inrVolume: number): number {
  return Math.round((inrVolume / 1e7) * 10) / 10;
}
