"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchMarketsCoins, type CgMarketRow } from "@/lib/coingecko";
import { formatInr, formatPercent } from "@/lib/format";
import { exchangePairUrl } from "@/lib/links";
import { TICKER_COINS } from "@/lib/market-data";

export const TRADE_PAIR_SYMS = ["BTC", "ETH", "SOL", "XRP", "DOGE", "BNB"] as const;

type LivePair = {
  sym: string;
  price: number;
  ch: number;
  image?: string;
};

function rowsToPairs(rows: CgMarketRow[], symbols: readonly string[]): LivePair[] {
  const order = new Map(symbols.map((s, i) => [s.toUpperCase(), i]));
  return rows
    .map((r) => ({
      sym: r.symbol.toUpperCase(),
      price: r.current_price ?? 0,
      ch: r.price_change_percentage_24h ?? 0,
      image: r.image
    }))
    .filter((c) => order.has(c.sym) && c.price > 0)
    .sort((a, b) => (order.get(a.sym) ?? 99) - (order.get(b.sym) ?? 99));
}

function fallbackPairs(symbols: readonly string[]): LivePair[] {
  const bySym = new Map(TICKER_COINS.map((c) => [c.sym, c]));
  return symbols
    .map((sym) => bySym.get(sym))
    .filter((c): c is (typeof TICKER_COINS)[number] => Boolean(c))
    .map((c) => ({ sym: c.sym, price: c.price, ch: c.ch }));
}

function useLivePairs(symbols: readonly string[]) {
  const fallback = useMemo(() => fallbackPairs(symbols), [symbols]);
  const [pairs, setPairs] = useState<LivePair[]>(fallback);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchMarketsCoins();
        if (cancelled) return;
        const mapped = rowsToPairs(rows, symbols);
        if (mapped.length) setPairs(mapped);
      } catch {
        if (!cancelled) setPairs(fallback);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ fallback, symbols]);

  return pairs;
}

function PairIcon({ sym, image }: { sym: string; image?: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        width={32}
        height={32}
        loading="lazy"
        className="h-8 w-8 rounded-full bg-[var(--surface)] object-cover"
      />
    );
  }
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand-tint)] text-xs font-black text-[var(--brand)]">
      {sym[0]}
    </span>
  );
}

type FeatureLivePairsGridProps = {
  symbols?: readonly string[];
  moreLabel?: string;
  className?: string;
};

/** Grid of live INR pairs — used on feature pages (Quick Trade, SIP, CryptoPacks). */
export function FeatureLivePairsGrid({
  symbols = TRADE_PAIR_SYMS,
  moreLabel = "+294 more",
  className = ""
}: FeatureLivePairsGridProps) {
  const pairs = useLivePairs(symbols);

  return (
    <div className={`relative flex h-full flex-wrap content-center gap-3 p-6 sm:p-8 ${className}`.trim()}>
      {pairs.map((coin) => {
        const positive = coin.ch >= 0;
        return (
          <a
            key={coin.sym}
            href={exchangePairUrl(coin.sym)}
            className="inline-flex min-w-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm font-bold text-[var(--fg)] shadow-sm transition-colors hover:border-[var(--brand)] sm:px-4"
          >
            <PairIcon sym={coin.sym} image={coin.image} />
            <span className="whitespace-nowrap">{coin.sym}/INR</span>
            <span className="hidden tabular-nums text-[var(--fg-muted)] sm:inline">{formatInr(coin.price)}</span>
            <span
              className="text-xs font-bold tabular-nums sm:text-sm"
              style={{ color: positive ? "var(--success)" : "var(--danger)" }}
            >
              {positive ? "↑" : "↓"} {formatPercent(coin.ch)}
            </span>
          </a>
        );
      })}
      <span className="inline-flex items-center rounded-full border border-dashed border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--fg-muted)]">
        {moreLabel}
      </span>
    </div>
  );
}

type FeatureLivePairsStripProps = {
  symbols?: readonly string[];
  className?: string;
};

/** Compact horizontal strip for product showcase trade panels. */
export function FeatureLivePairsStrip({
  symbols = TRADE_PAIR_SYMS,
  className = ""
}: FeatureLivePairsStripProps) {
  const pairs = useLivePairs(symbols.slice(0, 4));

  return (
    <div
      className={`mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 ${className}`.trim()}
      aria-label="Live market prices"
    >
      {pairs.map((coin) => {
        const positive = coin.ch >= 0;
        return (
          <a
            key={coin.sym}
            href={exchangePairUrl(coin.sym)}
            className="inline-flex shrink-0 snap-start items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold tabular-nums transition-colors hover:border-[var(--brand)] sm:text-sm"
          >
            <PairIcon sym={coin.sym} image={coin.image} />
            <span className="text-[var(--fg)]">{coin.sym}</span>
            <span className="text-[var(--fg-muted)]">{formatInr(coin.price)}</span>
            <span style={{ color: positive ? "var(--success)" : "var(--danger)" }}>
              {formatPercent(coin.ch)}
            </span>
          </a>
        );
      })}
    </div>
  );
}
