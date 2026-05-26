"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const FEATURES = [
  { icon: "🤖", title: "AI Insights", desc: "Sentiment scores and trade bias for every major pair.", tag: "NEW", href: "#features" },
  { icon: "👤", title: "Expert Trades", desc: "Follow verified futures traders with transparent win rates.", tag: "HOT", href: "#features" },
  { icon: "🛡", title: "RMS Account", desc: "Auto TP/SL and position limits — 87% of traders enable it.", href: "#features" },
  { icon: "🔀", title: "Sub Accounts", desc: "Isolated wallets and API keys per strategy or team member.", href: "#features" },
  { icon: "📊", title: "Options Trading", desc: "INR-settled calls and puts on majors.", tag: "Soon", href: "#features" }
];

export function ProFeatures() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const track = ref.current.querySelector(".pro-cards-track") as HTMLElement;
      const cards = gsap.utils.toArray<HTMLElement>(".pro-card", ref.current);
      if (!track || !cards.length) return;

      // Desktop-only horizontal scroll-pin. On phones the track is a native
      // horizontal scroller — provided by the wrapping `overflow-x-auto` div
      // (see JSX below); `flex w-max` alone does not enable native scrolling.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const totalWidth = cards.reduce((w, c) => w + c.offsetWidth + 32, 0);
        gsap.to(track, {
          x: () => -(totalWidth - window.innerWidth + 80),
          ease: "none",
          scrollTrigger: {
            trigger: "#pro",
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
          },
        });
      });

      gsap.from(cards, {
        opacity: 0.5,
        scale: 0.92,
        stagger: 0.12,
        scrollTrigger: { trigger: "#pro", start: "top 80%", once: true }
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section id="pro" ref={ref} className="scroll-mt-20 overflow-hidden bg-[var(--surface)] py-14 sm:py-16 lg:py-24">
      <div className="container-zeb mb-10">
        <SectionHeader
          chip="Pro tools"
          title="Features that set ZebPay apart"
          subtitle="Built for serious traders — scroll to explore."
        />
      </div>
      {/*
        On mobile the section is `overflow-hidden` to support the desktop GSAP
        pin, so the inner track needs its own horizontal scroller. On `lg+`
        GSAP takes over with a pinned/scrubbed translate, so we let the
        wrapper become `overflow-visible` to give the pin room to work.
      */}
      <div className="overflow-x-auto px-4 sm:px-6 lg:overflow-visible lg:px-0 [-webkit-overflow-scrolling:touch]">
        <div className="pro-cards-track flex w-max gap-4 sm:gap-8">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="pro-card group block w-[min(320px,85vw)] shrink-0 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 transition hover:border-[var(--cyan)] hover:shadow-[var(--shadow)]"
            >
              {f.tag && (
                <span
                  className={`mb-3 inline-block rounded px-2 py-0.5 text-[10px] font-extrabold ${
                    f.tag === "Soon" ? "bg-[var(--gold)] text-[var(--navy)]" : "bg-[var(--cyan)] text-[var(--navy)]"
                  }`}
                >
                  {f.tag}
                </span>
              )}
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-3 text-lg font-black text-[var(--text)] group-hover:text-[var(--cyan)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
