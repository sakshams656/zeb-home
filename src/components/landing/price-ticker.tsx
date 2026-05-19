"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { TICKER_COINS } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

function TickerRow({ reverse }: { reverse?: boolean }) {
  const items = [...TICKER_COINS, ...TICKER_COINS];
  return (
    <div
      className={`ticker-track flex w-max gap-8 ${reverse ? "ticker-reverse" : ""}`}
      aria-hidden={reverse}
    >
      {items.map((c, i) => (
        <span
          key={`${c.sym}-${i}-${reverse ? "r" : "f"}`}
          data-sym={c.sym}
          className="ticker-item flex shrink-0 items-center gap-2 text-sm font-semibold tabular-nums"
        >
          <span className="text-[var(--text)]">{c.sym}</span>
          <span className="ticker-price text-[var(--text-muted)]">{formatInr(c.price)}</span>
          <span
            className="font-bold"
            style={{ color: c.ch >= 0 ? "var(--success)" : "var(--danger)" }}
          >
            {formatPercent(c.ch)}
          </span>
        </span>
      ))}
    </div>
  );
}

export function PriceTicker() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const id = setInterval(() => {
          const items = rootRef.current?.querySelectorAll(".ticker-item");
          if (!items?.length) return;
          const el = items[Math.floor(Math.random() * items.length)]?.querySelector(".ticker-price");
          if (!el) return;
          gsap.to(el, { color: "#00b07a", duration: 0.2, yoyo: true, repeat: 1 });
        }, 3000);
        return () => clearInterval(id);
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="price-ticker overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3">
      <TickerRow />
      <TickerRow reverse />
    </div>
  );
}
