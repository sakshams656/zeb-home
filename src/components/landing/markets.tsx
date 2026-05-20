"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { INITIAL_COINS } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

type Tab = "trending" | "gainers" | "losers";

function sparkPath(seed: number, positive: boolean) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const wobble = Math.sin(seed * 1.7 + i * 0.85) * 2 + Math.cos(seed * 0.5 + i * 1.1) * 1.5;
    const y = 14 + (positive ? -1 : 1) * Math.sin(seed + i * 0.9) * 8 + wobble;
    return `${i === 0 ? "M" : "L"}${(i * 6.4).toFixed(1)} ${y.toFixed(2)}`;
  });
  return pts.join(" ");
}

const DISPLAY = ["BTC", "ETH", "SOL", "BNB", "AVAX", "MATIC", "LINK", "ADA", "DOT", "DOGE"];

export function Markets() {
  const [tab, setTab] = useState<Tab>("trending");
  const ref = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ trending: null, gainers: null, losers: null });

  const coins = useMemo(() => {
    let list = INITIAL_COINS.filter((c) => DISPLAY.includes(c.sym));
    if (tab === "gainers") list = list.filter((c) => c.ch > 0).sort((a, b) => b.ch - a.ch);
    if (tab === "losers") list = list.filter((c) => c.ch < 0).sort((a, b) => a.ch - b.ch);
    return list;
  }, [tab]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current.querySelectorAll(".market-row"), {
        opacity: 0,
        y: 16,
        stagger: 0.04,
        duration: 0.5,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: ".markets-table", start: "top 80%", once: true }
      });
    },
    { scope: ref }
  );

  const moveUnderline = (t: Tab) => {
    const btn = tabRefs.current[t];
    const ul = underlineRef.current;
    if (!btn || !ul) return;
    gsap.to(ul, { x: btn.offsetLeft, width: btn.offsetWidth, duration: 0.35, ease: ZEB_EASE });
  };

  return (
    <section id="markets" ref={ref} className="scroll-mt-24 bg-[#0a0f2e] px-6 py-[120px]">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--cyan)]">Markets</p>
        <h2 className="mt-2 text-[clamp(2rem,4vw,3rem)] font-black text-[var(--text-on-dark)]">What&apos;s moving today</h2>

        <div className="relative mt-8 flex gap-6 border-b border-[var(--border-dark)]">
          {(["trending", "gainers", "losers"] as Tab[]).map((t) => (
            <button
              key={t}
              ref={(el) => {
                tabRefs.current[t] = el;
              }}
              type="button"
              onClick={() => {
                setTab(t);
                moveUnderline(t);
              }}
              className={`pb-3 text-sm font-bold capitalize ${tab === t ? "text-[var(--text-on-dark)]" : "text-[var(--text-muted-dark)]"}`}
            >
              {t}
            </button>
          ))}
          <span ref={underlineRef} className="absolute bottom-0 left-0 h-0.5 bg-[var(--cyan)]" style={{ width: 80 }} />
        </div>

        <div className="markets-table mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-[var(--text-muted-dark)]">
                <th className="py-3 font-semibold">#</th>
                <th className="py-3 font-semibold">Coin</th>
                <th className="py-3 font-semibold">Price</th>
                <th className="py-3 font-semibold">24H</th>
                <th className="py-3 font-semibold">Vol</th>
                <th className="py-3 font-semibold">7D</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((c, i) => (
                <tr
                  key={c.sym}
                  className="market-row group relative border-b border-[var(--border-dark)] transition-colors hover:bg-white/[0.03]"
                >
                  <td className="relative py-4 pl-2 text-[var(--text-muted-dark)]">{i + 1}</td>
                  <td className="relative py-4 font-bold text-[var(--text-on-dark)]">
                    <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-dark)] text-xs text-[var(--cyan)]">
                      {c.sym[0]}
                    </span>
                    {c.name}
                    <span className="ml-1 text-[var(--text-muted-dark)]">{c.sym}</span>
                  </td>
                  <td className="relative py-4 tabular-nums text-[var(--text-on-dark)]">{formatInr(c.price)}</td>
                  <td
                    className="relative py-4 font-bold tabular-nums"
                    style={{ color: c.ch >= 0 ? "var(--success)" : "var(--danger)" }}
                  >
                    {formatPercent(c.ch)}
                  </td>
                  <td className="relative py-4 text-[var(--text-muted-dark)]">{c.vol} Cr</td>
                  <td className="relative py-4">
                    <svg width={64} height={28} viewBox="0 0 64 28" aria-hidden>
                      <path
                        d={sparkPath(i, c.ch >= 0)}
                        fill="none"
                        stroke={c.ch >= 0 ? "var(--success)" : "var(--danger)"}
                        strokeWidth={1.5}
                      />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
