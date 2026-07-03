import "server-only";

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
  const raw = process.env.COINGECKO_API_KEY?.trim();
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
  if (!cfg) throw new Error("COINGECKO_API_KEY is not set");

  const url = new URL(`${cfg.base}${path}`);
  if (search) {
    for (const [k, v] of Object.entries(search)) url.searchParams.set(k, v);
  }

  const headers: HeadersInit = { Accept: "application/json" };
  if (cfg.key) headers[cfg.header] = cfg.key;

  const res = await fetch(url.toString(), { headers, next: { revalidate: 60 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CoinGecko ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchMarketsCoinsServer(ids: string): Promise<CgMarketRow[]> {
  return cgFetch<CgMarketRow[]>("/coins/markets", {
    vs_currency: "inr",
    ids,
    order: "market_cap_desc",
    sparkline: "true",
    price_change_percentage: "24h,7d"
  });
}

export async function fetchCoinMarketChartServer(
  coinId: string,
  days = 1
): Promise<{ t: number; p: number }[]> {
  const data = await cgFetch<CgMarketChart>(`/coins/${coinId}/market_chart`, {
    vs_currency: "inr",
    days: String(days)
  });
  return data.prices.map(([t, p]) => ({ t, p }));
}
