"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const BADGES = [
  "FIU-IND Registered",
  "ISO 27001:2022",
  "SOC 2 Type II",
  "1:1 Reserves",
  "TDS Compliant",
  "4.6★ App Store"
];

const MARQUEE = [...BADGES, ...BADGES];

export function TrustStrip() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(".trust-badge", {
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: ".trust-strip", start: "top 80%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="trust-strip border-y border-[var(--border)] bg-[var(--surface)] py-8">
      <div className="container-zeb mb-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
        {BADGES.map((b) => (
          <span key={b} className="trust-badge text-sm font-bold text-[var(--text-muted)]">
            ✓ {b}
          </span>
        ))}
      </div>
      <div className="overflow-hidden">
        <div className="ticker-track flex w-max gap-8 px-4">
          {MARQUEE.map((b, i) => (
            <span key={`${b}-${i}`} className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
