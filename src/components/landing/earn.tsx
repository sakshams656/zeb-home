"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const COINS = [
  { sym: "USDT", apy: 8.5, pct: 100 },
  { sym: "BTC", apy: 6.0, pct: 71 },
  { sym: "ETH", apy: 5.0, pct: 59 },
  { sym: "SOL", apy: 4.5, pct: 53 }
];

export function Earn() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(".yield-bar-fill", {
        width: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "#earn", start: "top 75%", once: true }
      });
      const apyEl = ref.current.querySelector(".apy-counter");
      if (apyEl) {
        const obj = { v: 0 };
        gsap.to(obj, {
          v: 8.5,
          duration: 2,
          ease: "power1.out",
          snap: { v: 0.1 },
          scrollTrigger: { trigger: "#earn", start: "top 75%", once: true },
          onUpdate: () => {
            (apyEl as HTMLElement).textContent = `${obj.v.toFixed(1)}%`;
          }
        });
      }
    },
    { scope: ref }
  );

  return (
    <section id="earn" ref={ref} className="scroll-mt-20 px-6 py-20">
      <div className="container-zeb">
        <SectionHeader
          chip="Earn"
          title="Put idle crypto to work"
          subtitle="Up to 8.5% APY — flexible or locked terms. Daily interest, auto-compound."
        />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8">
            <p className="apy-counter text-5xl font-black text-[var(--cyan)]">0%</p>
            <p className="mt-2 text-xl font-bold text-[var(--text)]">Max APY on USDT</p>
            <p className="mt-4 text-[var(--text-muted)]">Ring-fenced from trading · Fully insured · No lock-in option</p>
          </div>
          <ul className="space-y-3">
            {COINS.map((c) => (
              <li
                key={c.sym}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold">{c.sym}</span>
                  <span className="font-black text-[var(--success)]">{c.apy}% APY</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                  <div
                    className="yield-bar-fill h-full rounded-full bg-[var(--cyan)]"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
