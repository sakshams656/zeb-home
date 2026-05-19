"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const STATS = [
  { value: "98%", label: "Cold storage", desc: "Multi-sig across geographies" },
  { value: "0", label: "Exchange hacks", desc: "Since 2014" },
  { value: "5-of-3", label: "Multi-sig", desc: "Custody architecture" },
  { value: "$100M", label: "Insurance", desc: "Custodial coverage" }
];

export function Security() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const path = ref.current.querySelector(".shield-svg path") as SVGPathElement | null;
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: "#security", start: "top 70%", once: true }
          }
        );
      }
      gsap.from(".security-icon", {
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "back.out(2)",
        scrollTrigger: { trigger: "#security", start: "top 70%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section id="security" ref={ref} className="scroll-mt-20 px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Security" title="Institutional-grade protection" subtitle="FIU-IND registered · ISO 27001 · SOC 2 Type II" />
        <div className="mb-10 flex justify-center">
          <svg className="shield-svg h-24 w-24 text-[var(--cyan)]" viewBox="0 0 64 72" fill="none" aria-hidden>
            <path
              d="M32 4 L56 14 V36 C56 52 44 64 32 68 C20 64 8 52 8 36 V14 Z"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
          </svg>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="security-icon rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center">
              <p className="text-3xl font-black text-[var(--cyan)]">{s.value}</p>
              <p className="mt-2 font-bold text-[var(--text)]">{s.label}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
