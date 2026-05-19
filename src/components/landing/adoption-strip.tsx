"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { usePersona } from "@/context/persona-context";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const TRADER = [
  { target: 82, suffix: "%", label: "Use Trading API daily" },
  { target: 87, suffix: "%", label: "Enable RMS protection" },
  { target: 47, suffix: "K", label: "Active futures traders" },
  { target: 62, suffix: "%", label: "Use AI Insights daily" }
];

const RETAIL = [
  { target: 33, suffix: "%", label: "Invest via Crypto SIP" },
  { target: 612, suffix: "K", label: "Active CryptoPacks users" },
  { target: 18, suffix: "L", label: "Following Expert Trades" },
  { target: 85, suffix: "%", label: "Max Earn APY headline" }
];

export function AdoptionStrip() {
  const { persona } = usePersona();
  const metrics = persona === "trader" ? TRADER : RETAIL;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      ref.current.querySelectorAll(".stat-counter").forEach((el) => {
        const target = Number((el as HTMLElement).dataset.target ?? 0);
        const suffix = (el as HTMLElement).dataset.suffix ?? "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          snap: { val: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            (el as HTMLElement).textContent = `${Math.round(obj.val)}${suffix}`;
          }
        });
      });
    },
    { scope: ref, dependencies: [persona] }
  );

  return (
    <section ref={ref} className="px-6 py-16">
      <div className="container-zeb">
        <p className="mb-8 text-center text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Platform metrics · {persona === "trader" ? "Active traders" : "Retail investors"}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
              <p className="text-3xl font-black text-[var(--text)]">
                <span className="stat-counter" data-target={m.target} data-suffix={m.suffix}>
                  0{m.suffix}
                </span>
              </p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
