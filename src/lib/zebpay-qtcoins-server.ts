import "server-only";

const QTCOINS_API_URL = "https://www.zebstage.com/api/v1/qtcoins/IN";

export interface QtTradePair {
  pairId: number;
  tradePairName: string;
  tradeCurrency: string;
  quoteCurrency: string;
  currencyName: string;
  coinIcon: string;
  iconV3Blue?: string;
  minimumTradeAmount: number;
  is_sip_enabled: boolean;
  categories: number[] | null;
}

export type QtCoin = {
  symbol: string;
  name: string;
  slug: string;
  coinIcon: string;
  minimumTradeAmount: number;
  isSipEnabled: boolean;
  categories: number[];
  pairName: string;
};

const POPULAR_SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "DOGE", "BNB", "ADA", "MATIC"] as const;

function pairToCoin(pair: QtTradePair): QtCoin {
  return {
    symbol: pair.tradeCurrency.toUpperCase(),
    name: pair.currencyName,
    slug: pair.tradeCurrency.toLowerCase(),
    coinIcon: pair.iconV3Blue || pair.coinIcon,
    minimumTradeAmount: pair.minimumTradeAmount,
    isSipEnabled: pair.is_sip_enabled,
    categories: pair.categories ?? [],
    pairName: pair.tradePairName
  };
}

async function fetchTradePairs(): Promise<QtTradePair[]> {
  try {
    const res = await fetch(QTCOINS_API_URL, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ZebPay/1.0)"
      },
      next: { revalidate: 3600 }
    });
    if (!res.ok) {
      console.warn(`ZebPay qtcoins API returned ${res.status}, using fallback coins`);
      return [];
    }
    const json = (await res.json()) as { data?: { tradePairs?: QtTradePair[] } };
    return json.data?.tradePairs ?? [];
  } catch (error) {
    console.warn(`Failed to fetch ZebPay qtcoins, using fallback coins:`, error);
    return [];
  }
}

let coinsCache: QtCoin[] | null = null;

// Fallback coins for when API is unavailable
function getFallbackCoins(): QtCoin[] {
  return POPULAR_SYMBOLS.map((symbol) => ({
    symbol,
    name: symbol, // Fallback to symbol as name
    slug: symbol.toLowerCase(),
    coinIcon: "",
    minimumTradeAmount: 100,
    isSipEnabled: true,
    categories: [],
    pairName: `${symbol}/INR`
  }));
}

export async function getInrCoins(): Promise<QtCoin[]> {
  if (coinsCache) return coinsCache;

  const pairs = await fetchTradePairs();
  const bySymbol = new Map<string, QtCoin>();

  for (const pair of pairs) {
    if (pair.quoteCurrency !== "INR") continue;
    const sym = pair.tradeCurrency.toUpperCase();
    if (!bySymbol.has(sym)) {
      bySymbol.set(sym, pairToCoin(pair));
    }
  }

  // If API returned no pairs, use fallback
  if (bySymbol.size === 0) {
    coinsCache = getFallbackCoins();
    console.warn("Using fallback coins list");
  } else {
    coinsCache = [...bySymbol.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return coinsCache;
}

export async function getCoinBySymbol(sym: string): Promise<QtCoin | null> {
  const normalized = sym.trim().toUpperCase();
  const coins = await getInrCoins();
  return coins.find((c) => c.symbol === normalized) ?? null;
}

export async function getRelatedCoins(coin: QtCoin, limit = 10): Promise<QtCoin[]> {
  const minCount = Math.max(limit, 8);
  const coins = await getInrCoins();
  const picked: QtCoin[] = [];
  const seen = new Set<string>([coin.symbol]);

  const add = (c: QtCoin | undefined) => {
    if (!c || seen.has(c.symbol)) return;
    seen.add(c.symbol);
    picked.push(c);
  };

  if (coin.categories.length > 0) {
    const categorySet = new Set(coin.categories);
    for (const c of coins) {
      if (c.categories.some((id) => categorySet.has(id))) add(c);
      if (picked.length >= minCount) break;
    }
  }

  for (const sym of POPULAR_SYMBOLS) {
    if (picked.length >= minCount) break;
    add(coins.find((c) => c.symbol === sym));
  }

  for (const c of coins) {
    if (picked.length >= minCount) break;
    add(c);
  }

  return picked.slice(0, minCount);
}
