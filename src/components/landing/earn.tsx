"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const ASSETS = [
  { sym: "USDT", apy: 8.5, pct: 100 },
  { sym: "SOL", apy: 4.5, pct: 53 },
  { sym: "ETH", apy: 1.5, pct: 18 },
  { sym: "BTC", apy: 0.2, pct: 2 },
  { sym: "BNB", apy: 0.5, pct: 6 }
];

export function Earn() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current.querySelectorAll(".yield-bar"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        stagger: 0.08,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: "#earn", start: "top 70%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section id="earn" ref={ref} className="scroll-mt-24 bg-[var(--bg)] py-14 sm:py-16 lg:py-24">
      <div className="container-zeb grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-black leading-tight text-[var(--fg)]">
            Earn while
            <br />
            you hold.
          </h2>
          <p className="mt-4 text-[clamp(1.25rem,4vw,1.5rem)] font-bold text-[var(--cyan)]">Up to 8.5% APY</p>
          <p className="mt-6 max-w-md text-base text-[var(--fg-muted)] sm:text-lg">
            Stake idle assets across stablecoins and majors. Flexible terms, transparent rates — model returns in the
            calculator hub above.
          </p>
        </div>

        <ul className="space-y-4 self-center">
          {ASSETS.map((a) => (
            <li key={a.sym} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="mb-2 flex justify-between font-bold text-[var(--fg)]">
                <span>{a.sym}</span>
                <span className="text-[var(--cyan)]">{a.apy}% APY</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                <div className="yield-bar h-full rounded-full bg-[var(--cyan)]" style={{ width: `${a.pct}%`, transformOrigin: "left" }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
