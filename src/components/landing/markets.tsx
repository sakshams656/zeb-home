"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { INITIAL_COINS } from "@/lib/market-data";
import { formatInr, formatPercent } from "@/lib/format";

type Tab = "gainers" | "losers" | "volume";

export function Markets() {
  const [tab, setTab] = useState<Tab>("gainers");
  const coins = useMemo(() => {
    let list = [...INITIAL_COINS];
    if (tab === "gainers") list = list.filter((c) => c.ch > 0).sort((a, b) => b.ch - a.ch);
    if (tab === "losers") list = list.filter((c) => c.ch < 0).sort((a, b) => a.ch - b.ch);
    if (tab === "volume") list = list.sort((a, b) => b.vol - a.vol);
    return list.slice(0, 8);
  }, [tab]);

  return (
    <section id="markets" className="scroll-mt-20 px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Markets" title="Top movers on ZebPay" subtitle="Mock prices for demo — live data in the app." />
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <div className="flex gap-2 border-b border-[var(--border)] p-4">
              {(["gainers", "losers", "volume"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize ${
                    tab === t ? "bg-[var(--cyan)] text-[var(--navy)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                    <th className="p-4 font-semibold">Asset</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">24h</th>
                    <th className="p-4 font-semibold">Vol (Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((c) => (
                    <tr key={c.sym} className="border-b border-[var(--border)] last:border-0">
                      <td className="p-4 font-bold">{c.sym}</td>
                      <td className="p-4 tabular-nums">{formatInr(c.price)}</td>
                      <td className="p-4 font-bold" style={{ color: c.ch >= 0 ? "var(--success)" : "var(--danger)" }}>
                        {formatPercent(c.ch)}
                      </td>
                      <td className="p-4 tabular-nums text-[var(--text-muted)]">{c.vol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
