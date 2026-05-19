"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Cell = string | boolean;

const ROWS: { feature: string; zeb: Cell; w: Cell; d: Cell; hl?: boolean }[] = [
  { feature: "Maker / Taker fees", zeb: "0.10% / 0.15%", w: "0.20% / 0.20%", d: "0.10% / 0.20%", hl: true },
  { feature: "Max futures leverage", zeb: "25x", w: "—", d: "20x" },
  { feature: "INR withdrawal", zeb: "< 30 min", w: "1–2 hrs", d: "~1 hr", hl: true },
  { feature: "AI Insights", zeb: true, w: false, d: false, hl: true },
  { feature: "RMS", zeb: true, w: false, d: false },
  { feature: "Expert Trades", zeb: true, w: false, d: "Partial", hl: true },
  { feature: "CryptoPacks", zeb: true, w: false, d: true },
  { feature: "FIU-IND registered", zeb: true, w: true, d: true }
];

function CellContent({ v }: { v: Cell }) {
  if (v === true) return <span className="check-icon text-[var(--success)] font-bold">✓</span>;
  if (v === false) return <span className="text-[var(--text-muted)]">—</span>;
  return <>{v}</>;
}

export function Comparison() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(".zebpay-col-highlight", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".comparison-table", start: "top 70%", once: true }
      });
      gsap.from(".compare-row", {
        opacity: 0,
        y: 16,
        stagger: 0.06,
        duration: 0.4,
        scrollTrigger: { trigger: ".comparison-table", start: "top 65%", once: true }
      });
      gsap.from(".check-icon", {
        scale: 0,
        stagger: 0.04,
        duration: 0.3,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".comparison-table", start: "top 60%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="px-6 py-20 bg-[var(--surface)]">
      <div className="container-zeb">
        <SectionHeader chip="Why ZebPay" title="How we compare" subtitle="Side-by-side on what matters for Indian traders." />
        <div className="comparison-table relative overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          <div className="zebpay-col-highlight pointer-events-none absolute bottom-0 top-12 left-[calc(25%-1px)] w-[25%] bg-[var(--cyan)]/5" aria-hidden />
          <table className="relative w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--navy)] text-white">
                <th className="p-4 text-left" />
                <th className="p-4">ZebPay</th>
                <th className="p-4">WazirX</th>
                <th className="p-4">CoinDCX</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.feature} className={`compare-row ${r.hl ? "bg-[var(--cyan)]/5" : ""}`}>
                  <td className="border-t border-[var(--border)] p-4 font-medium">{r.feature}</td>
                  <td className="border-t border-[var(--border)] p-4 text-center font-bold">
                    <CellContent v={r.zeb} />
                  </td>
                  <td className="border-t border-[var(--border)] p-4 text-center">
                    <CellContent v={r.w} />
                  </td>
                  <td className="border-t border-[var(--border)] p-4 text-center">
                    <CellContent v={r.d} />
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
