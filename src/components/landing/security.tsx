"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const PILLARS = [
  { title: "Cold storage", body: "98% of assets in multi-sig cold wallets across geographies." },
  { title: "Multi-sig wallets", body: "5-of-3 custody architecture for institutional-grade safety." },
  { title: "Insurance fund", body: "$100M custodial coverage on qualified balances." },
  { title: "Zero hacks since 2014", body: "A decade-long track record you can verify." }
];

export function Security() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (prefersReducedMotion() || !root) return;

      const path = root.querySelector(".shield-path") as SVGPathElement | null;
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: root, start: "top 70%", once: true }
          }
        );
        gsap.from(root.querySelectorAll(".shield-facet"), {
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          delay: 0.8,
          scrollTrigger: { trigger: root, start: "top 70%", once: true }
        });
      }

      gsap.from(root.querySelectorAll(".security-pillar"), {
        scale: 0.8,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: { trigger: root, start: "top 65%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section id="security" ref={ref} className="scroll-mt-24 bg-[#040812] px-6 py-[120px]">
      <div className="mx-auto max-w-[1000px] text-center">
        <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-black text-[var(--text-on-dark)]">Built like a fortress.</h2>
        <p className="mt-4 text-lg text-[var(--text-muted-dark)]">
          Zero hacks since 2014. FIU-IND registered. ISO 27001. SOC 2 Type II.
        </p>

        <svg className="mx-auto mt-12" width={300} height={360} viewBox="0 0 300 360" aria-hidden>
          <path
            className="shield-path"
            d="M150 20 L270 70 V180 C270 280 210 330 150 350 C90 330 30 280 30 180 V70 Z"
            fill="none"
            stroke="var(--cyan)"
            strokeWidth={2}
          />
          <path className="shield-facet" d="M150 60 L220 95 V175 L150 210 L80 175 V95 Z" fill="rgba(27,85,224,0.08)" />
          <path className="shield-facet" d="M150 120 L190 140 V190 L150 210 L110 190 V140 Z" fill="rgba(27,85,224,0.12)" />
        </svg>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="security-pillar rounded-2xl border border-[var(--border-dark)] bg-[var(--surface-dark)] p-6 text-left"
            >
              <h3 className="font-bold text-[var(--text-on-dark)]">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted-dark)]">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
