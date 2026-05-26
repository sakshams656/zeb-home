"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const FEATURES = [
  "SIP investing",
  "AI insights",
  "Cold storage",
  "Sub accounts",
  "Options trading",
  "FIU-IND registered",
  "ISO certified",
  "SOC 2",
  "0% maker fee",
  "400+ assets",
  "Earn rewards",
  "Expert copy trade"
];

const ZEB = [true, true, true, true, false, true, true, true, true, true, true, true];
const WAZ = [false, false, true, false, false, true, true, false, false, true, false, false];
const DCX = [true, false, true, false, false, true, true, true, false, true, true, false];

function Cell({ v }: { v: boolean }) {
  return v ? <span className="check-mark text-[var(--success)]">✓</span> : <span className="text-[var(--fg-muted)]">—</span>;
}

export function Comparison() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current.querySelectorAll(".compare-row"), {
        opacity: 0,
        y: 12,
        stagger: 0.04,
        duration: 0.4,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: ".comparison-table", start: "top 70%", once: true }
      });
      gsap.from(ref.current.querySelectorAll(".check-mark"), {
        scale: 0,
        stagger: 0.03,
        duration: 0.4,
        ease: "back.out(2)",
        scrollTrigger: { trigger: ".comparison-table", start: "top 65%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-[var(--bg)] px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-black text-[var(--fg)]">Why ZebPay?</h2>
        <p className="mt-2 text-base text-[var(--fg-muted)] sm:text-lg">See how we compare.</p>

        <div className="comparison-table relative mt-10 rounded-2xl border border-[var(--border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-[var(--fg-muted)]">
                <th className="p-3 text-left font-semibold sm:p-4">Feature</th>
                <th className="relative p-3 text-center sm:p-4">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3 py-0.5 text-[10px] font-extrabold text-white">
                    Recommended
                  </span>
                  <span className="font-black text-[var(--fg)]">ZebPay</span>
                </th>
                <th className="hidden p-3 text-center sm:table-cell sm:p-4">WazirX</th>
                <th className="hidden p-3 text-center md:table-cell md:p-4">CoinDCX</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f} className="compare-row border-t border-[var(--border)]">
                  <td className="p-3 text-[var(--fg)] sm:p-4">{f}</td>
                  <td
                    className="border-t-2 border-[var(--brand)] p-3 text-center sm:p-4"
                    style={{ background: "rgba(var(--brand-rgb), 0.08)" }}
                  >
                    <Cell v={ZEB[i]} />
                  </td>
                  <td className="hidden p-3 text-center sm:table-cell sm:p-4">
                    <Cell v={WAZ[i]} />
                  </td>
                  <td className="hidden p-3 text-center md:table-cell md:p-4">
                    <Cell v={DCX[i]} />
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
