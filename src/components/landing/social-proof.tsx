"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const STATS = [
  { cls: "stat-1", target: 6, suffix: "M+", label: "Users worldwide" },
  { cls: "stat-2", target: 2, prefix: "₹", suffix: "T+", label: "Total volume traded" },
  { cls: "stat-3", target: 200, suffix: "+", label: "Crypto assets available" }
];

export function SocialProof() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      STATS.forEach(({ cls, target, prefix = "", suffix = "" }) => {
        const el = ref.current!.querySelector(`.${cls}`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          onUpdate: () => {
            (el as HTMLElement).textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          }
        });
      });
      gsap.from(ref.current.querySelectorAll(".stat-label"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.6,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#040812] via-[#06101f] to-[#040812] px-6 py-[120px] text-center"
    >
      <svg className="pointer-events-none absolute left-6 top-1/4 h-48 w-48 opacity-[0.12]" viewBox="0 0 100 100" aria-hidden>
        <circle cx={50} cy={50} r={45} fill="none" stroke="var(--cyan)" strokeWidth={1} />
        <circle cx={50} cy={50} r={32} fill="none" stroke="var(--cyan)" strokeWidth={0.5} />
      </svg>
      <svg className="pointer-events-none absolute bottom-1/4 right-6 h-64 w-64 opacity-[0.08]" viewBox="0 0 100 100" aria-hidden>
        <circle cx={50} cy={50} r={48} fill="none" stroke="var(--cyan)" strokeWidth={1} />
      </svg>
      {STATS.map((s) => (
        <div key={s.cls} className="mb-16 last:mb-0">
          <p className={`${s.cls} text-[clamp(4rem,12vw,8.75rem)] font-black leading-none text-white`}>0{s.suffix}</p>
          <p className="stat-label mt-4 text-lg text-[var(--text-muted-dark)]">{s.label}</p>
        </div>
      ))}
    </section>
  );
}
