"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { TICKER_COINS } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const COINS = [
  ...TICKER_COINS,
  { sym: "ADA", price: 29.3, ch: -1.65 },
  { sym: "DOT", price: 412, ch: 0.42 },
  { sym: "MATIC", price: 8.4, ch: -2.37 },
  { sym: "AVAX", price: 1049, ch: -0.56 }
];

function CoinChip({ sym, price, ch }: { sym: string; price: number; ch: number }) {
  return (
    <span className="ticker-chip inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-dark)] bg-[var(--surface-dark)] px-4 py-2 text-sm font-semibold tabular-nums">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--navy-mid)] text-[10px] font-black text-[var(--cyan)]">
        {sym[0]}
      </span>
      <span className="text-[var(--text-on-dark)]">{sym}</span>
      <span className="ticker-price text-[var(--text-muted-dark)]">{formatInr(price)}</span>
      <span className="font-bold" style={{ color: ch >= 0 ? "var(--success)" : "var(--danger)" }}>
        {ch >= 0 ? "↑" : "↓"} {formatPercent(ch)}
      </span>
    </span>
  );
}

function TickerRow({ reverse }: { reverse?: boolean }) {
  const items = [...COINS, ...COINS];
  return (
    <div className={`ticker-row flex w-max gap-4 ${reverse ? "ticker-reverse" : ""}`}>
      {items.map((c, i) => (
        <CoinChip key={`${c.sym}-${i}-${reverse ? "r" : "f"}`} {...c} />
      ))}
    </div>
  );
}

export function PriceTicker() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const id = setInterval(() => {
          const prices = ref.current?.querySelectorAll(".ticker-price");
          if (!prices?.length) return;
          const el = prices[Math.floor(Math.random() * prices.length)] as HTMLElement;
          const coin = COINS[Math.floor(Math.random() * COINS.length)];
          const color = coin.ch >= 0 ? "#00b07a" : "#e33e5c";
          gsap.to(el, { color, duration: 0.15, yoyo: true, repeat: 1 });
        }, 3000);
        return () => clearInterval(id);
      });
    },
    { scope: ref }
  );

  useEffect(() => {
    const rows = ref.current?.querySelectorAll(".ticker-row");
    rows?.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        (row as HTMLElement).style.animationPlayState = "paused";
      });
      row.addEventListener("mouseleave", () => {
        (row as HTMLElement).style.animationPlayState = "running";
      });
    });
  }, []);

  return (
    <div ref={ref} className="price-ticker overflow-hidden border-y border-[var(--border-dark)] bg-[#040812] py-4">
      <TickerRow />
      <TickerRow reverse />
    </div>
  );
}
