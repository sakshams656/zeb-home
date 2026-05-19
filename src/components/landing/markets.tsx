"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { INITIAL_COINS } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Tab = "gainers" | "losers" | "volume";

function sparkPath(seed: number) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const y = 12 + Math.sin(seed + i * 0.9) * 8;
    return `${i === 0 ? "M" : "L"}${i * 7} ${y}`;
  });
  return pts.join(" ");
}

export function Markets() {
  const [tab, setTab] = useState<Tab>("gainers");
  const [displayTab, setDisplayTab] = useState<Tab>("gainers");
  const sectionRef = useRef<HTMLElement>(null);
  const tableWrapRef = useRef<HTMLDivElement>(null);

  const coins = useMemo(() => {
    let list = [...INITIAL_COINS];
    if (displayTab === "gainers") list = list.filter((c) => c.ch > 0).sort((a, b) => b.ch - a.ch);
    if (displayTab === "losers") list = list.filter((c) => c.ch < 0).sort((a, b) => a.ch - b.ch);
    if (displayTab === "volume") list = list.sort((a, b) => b.vol - a.vol);
    return list.slice(0, 8);
  }, [displayTab]);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;
      gsap.from(".market-row", {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: "#markets", start: "top 75%", once: true }
      });
      sectionRef.current.querySelectorAll(".market-spark path").forEach((path, i) => {
        const el = path as SVGPathElement;
        const len = el.getTotalLength();
        gsap.fromTo(
          el,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            delay: i * 0.03,
            ease: "power2.out",
            scrollTrigger: { trigger: "#markets", start: "top 75%", once: true }
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [displayTab] }
  );

  const switchTab = (t: Tab) => {
    if (t === tab || prefersReducedMotion()) {
      setTab(t);
      setDisplayTab(t);
      return;
    }
    setTab(t);
    const wrap = tableWrapRef.current;
    if (!wrap) {
      setDisplayTab(t);
      return;
    }
    gsap.to(wrap, {
      rotateY: 90,
      duration: 0.2,
      ease: "power2.in",
      transformPerspective: 1000,
      onComplete: () => {
        setDisplayTab(t);
        gsap.fromTo(wrap, { rotateY: -90 }, { rotateY: 0, duration: 0.2, ease: "power2.out" });
      }
    });
  };

  return (
    <section id="markets" ref={sectionRef} className="scroll-mt-20 px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Markets" title="Top movers on ZebPay" subtitle="Mock prices for demo — live data in the app." />
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="flex gap-2 border-b border-[var(--border)] p-4">
            {(["gainers", "losers", "volume"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${
                  tab === t ? "bg-[var(--cyan)] text-[var(--navy)]" : "text-[var(--text-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div ref={tableWrapRef} className="market-table-wrap overflow-x-auto" style={{ perspective: 1000 }}>
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                  <th className="p-4 font-semibold">Asset</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">24h</th>
                  <th className="p-4 font-semibold">Trend</th>
                  <th className="p-4 font-semibold">Vol (Cr)</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((c, i) => (
                  <tr key={c.sym} className="market-row border-b border-[var(--border)] last:border-0">
                    <td className="p-4 font-bold">{c.sym}</td>
                    <td className="p-4 tabular-nums">{formatInr(c.price)}</td>
                    <td className="p-4 font-bold" style={{ color: c.ch >= 0 ? "var(--success)" : "var(--danger)" }}>
                      {formatPercent(c.ch)}
                    </td>
                    <td className="p-4">
                      <svg className="market-spark" width={48} height={24} viewBox="0 0 49 24" aria-hidden>
                        <path
                          d={sparkPath(i)}
                          fill="none"
                          stroke={c.ch >= 0 ? "var(--success)" : "var(--danger)"}
                          strokeWidth={1.5}
                        />
                      </svg>
                    </td>
                    <td className="p-4 tabular-nums text-[var(--text-muted)]">{c.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
