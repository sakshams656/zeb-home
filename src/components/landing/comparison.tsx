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
  "200+ assets",
  "Earn rewards",
  "Expert copy trade"
];

const ZEB = [true, true, true, true, false, true, true, true, true, true, true, true];
const WAZ = [false, false, true, false, false, true, true, false, false, true, false, false];
const DCX = [true, false, true, false, false, true, true, true, false, true, true, false];

function Cell({ v }: { v: boolean }) {
  return v ? <span className="check-mark text-[var(--success)]">✓</span> : <span className="text-[var(--text-muted-dark)]">—</span>;
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
    <section ref={ref} className="bg-[#0a0f2e] px-6 py-[120px]">
      <div className="mx-auto max-w-[900px]">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-black text-[var(--text-on-dark)]">Why ZebPay?</h2>
        <p className="mt-2 text-lg text-[var(--text-muted-dark)]">See how we compare.</p>

        <div className="comparison-table relative mt-10 overflow-x-auto rounded-2xl border border-[var(--border-dark)]">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-[var(--text-muted-dark)]">
                <th className="p-4 text-left font-semibold">Feature</th>
                <th className="relative p-4 text-center">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3 py-0.5 text-[10px] font-extrabold text-white">
                    Recommended
                  </span>
                  <span className="font-black text-[var(--text-on-dark)]">ZebPay</span>
                </th>
                <th className="p-4 text-center">WazirX</th>
                <th className="p-4 text-center">CoinDCX</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f, i) => (
                <tr key={f} className="compare-row border-t border-[var(--border-dark)]">
                  <td className="p-4 text-[var(--text-on-dark)]">{f}</td>
                  <td className="bg-[rgba(27,85,224,0.08)] p-4 text-center border-t-2 border-[var(--brand)]">
                    <Cell v={ZEB[i]} />
                  </td>
                  <td className="p-4 text-center">
                    <Cell v={WAZ[i]} />
                  </td>
                  <td className="p-4 text-center">
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
