"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const STEPS = [
  { n: "1", title: "Register", time: "90 sec", desc: "Phone or email + Aadhaar e-KYC in-flow." },
  { n: "2", title: "Deposit", time: "30 sec", desc: "UPI, IMPS, or NEFT — instant on UPI." },
  { n: "3", title: "Trade", time: "Anytime", desc: "Spot, futures, SIP, or follow an expert." }
];

export function Steps() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (prefersReducedMotion() || !root) return;

      const line = root.querySelector(".onboarding-connector") as SVGPathElement | null;
      if (line) {
        const len = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: root,
              start: "top 70%",
              end: "bottom 70%",
              scrub: 1,
              onUpdate(st) {
                const progress = st.progress;
                root.querySelectorAll(".step-icon").forEach((icon, i) => {
                  const threshold = (i + 1) / 3;
                  gsap.to(icon, {
                    scale: progress >= threshold - 0.1 ? 1.15 : 1,
                    duration: 0.2,
                    ease: "back.out(2)",
                    overwrite: true
                  });
                });
              }
            }
          }
        );
      }

      gsap.from(root.querySelectorAll(".onboarding-step"), {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.6,
        scrollTrigger: { trigger: root, start: "top 75%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="onboarding-steps px-6 py-20">
      <div className="container-zeb">
        <SectionHeader chip="Get started" title="Three steps to your first trade" />
        <div className="relative">
          <svg className="pointer-events-none absolute left-0 right-0 top-8 hidden h-4 w-full md:block" aria-hidden>
            <path
              className="onboarding-connector"
              d="M 80 8 Q 320 8 540 8"
              fill="none"
              stroke="var(--cyan)"
              strokeWidth={2}
            />
          </svg>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="onboarding-step rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6">
                <span className="step-icon flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cyan)] text-lg font-black text-[var(--navy)]">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-black">{s.title}</h3>
                <p className="text-sm font-bold text-[var(--cyan)]">{s.time}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
