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
      const root = ref.current;

      gsap.fromTo(
        root.querySelectorAll(".stat-slide"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: ZEB_EASE,
          stagger: 0.12,
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      STATS.forEach(({ cls, target, prefix = "", suffix = "" }, i) => {
        const el = root.querySelector(`.${cls}`);
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.12 * i,
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          onUpdate: () => {
            (el as HTMLElement).textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          }
        });
      });

      gsap.fromTo(
        root.querySelectorAll(".stat-label"),
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.45,
          delay: 0.25,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="social-proof-section relative px-4 py-14 sm:px-6 lg:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
            Trusted at scale
          </p>
          <h2 className="mt-2 text-[clamp(1.5rem,5vw,2.25rem)] font-black text-[var(--fg)]">
            Millions trade, save and invest on ZebPay
          </h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 md:divide-x md:divide-[var(--border)]">
          {STATS.map((s) => (
            <li key={s.cls} className="stat-tile px-2 py-5 text-center md:px-6 lg:px-8">
              <span className="stat-mask block overflow-hidden pb-1">
                <span
                  className={`stat-slide ${s.cls} block text-[clamp(2.25rem,4.5vw,3.5rem)] font-black leading-none tabular-nums text-[var(--fg)]`}
                >
                  0{s.suffix}
                </span>
              </span>
              <p className="stat-label mt-3 text-sm text-[var(--fg-muted)] sm:text-base">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
