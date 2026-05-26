"use client";

import { useEffect, useRef, useState } from "react";
import { TICKER_COINS } from "@/lib/market-data";
import { fetchMarketsCoins } from "@/lib/coingecko";
import { formatInr, formatPercent } from "@/lib/format";

type TickerCoin = {
  sym: string;
  price: number;
  ch: number;
  image?: string;
};

const FALLBACK: TickerCoin[] = TICKER_COINS;

function CoinChip({ sym, price, ch, image }: TickerCoin) {
  const positive = ch >= 0;
  return (
    <span className="ticker-chip inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold tabular-nums">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          className="h-6 w-6 rounded-full bg-[var(--surface)]"
        />
      ) : (
        <span
          aria-hidden
          className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-black text-white"
          style={{ background: "rgba(var(--brand-rgb), 0.9)" }}
        >
          {sym[0]}
        </span>
      )}
      <span className="text-[var(--fg)]">{sym}</span>
      <span className="ticker-price text-[var(--fg-muted)]">
        {formatInr(price)}
      </span>
      <span
        className="font-bold"
        style={{ color: positive ? "var(--success)" : "var(--danger)" }}
      >
        {positive ? "↑" : "↓"} {formatPercent(ch)}
      </span>
    </span>
  );
}

export function PriceTicker() {
  const ref = useRef<HTMLDivElement>(null);
  const [coins, setCoins] = useState<TickerCoin[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchMarketsCoins();
        if (cancelled) return;
        const mapped: TickerCoin[] = rows
          .map((r) => ({
            sym: r.symbol.toUpperCase(),
            price: r.current_price ?? 0,
            ch: r.price_change_percentage_24h ?? 0,
            image: r.image
          }))
          .filter((c) => c.price > 0);
        if (mapped.length) setCoins(mapped);
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pause marquee on hover.
  useEffect(() => {
    const row = ref.current?.querySelector(".ticker-row") as HTMLElement | null;
    if (!row) return;
    const onEnter = () => {
      row.style.animationPlayState = "paused";
    };
    const onLeave = () => {
      row.style.animationPlayState = "running";
    };
    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);
    return () => {
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
    };
  }, [coins]);

  // Duplicate the list so the -50% keyframe loop is seamless.
  const items = [...coins, ...coins];

  return (
    <div
      ref={ref}
      className="price-ticker overflow-hidden border-y border-[var(--border)] bg-[var(--bg)] py-4"
    >
      <div className="ticker-row flex w-max gap-4">
        {items.map((c, i) => (
          <CoinChip key={`${c.sym}-${i}`} {...c} />
        ))}
      </div>
    </div>
  );
}
