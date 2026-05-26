"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const ITEMS = [
  {
    quote:
      "ZebPay's SIP feature changed how I invest in crypto. Set it, forget it, grow it — effortlessly.",
    name: "Priya M.",
    role: "Retail investor since 2021"
  },
  {
    quote:
      "RMS auto stop-loss on every futures position — I sleep better knowing exits are handled.",
    name: "Arjun K.",
    role: "Active futures trader"
  },
  {
    quote:
      "QuickTrade is the fastest way to enter a position I've used on any Indian exchange.",
    name: "Sneha R.",
    role: "Crypto beginner, 2023"
  }
];

const SLIDE_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const fadingRef = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = useCallback(
    (i: number) => {
      if (fadingRef.current || i === indexRef.current) return;
      const el = contentRef.current;
      if (!el || prefersReducedMotion()) {
        setIndex(i);
        return;
      }
      fadingRef.current = true;
      gsap.to(el, {
        opacity: 0,
        y: -16,
        duration: 0.32,
        ease: "power2.in",
        overwrite: true,
        onComplete: () => {
          setIndex(i);
          gsap.fromTo(
            el,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: ZEB_EASE,
              onComplete: () => {
                fadingRef.current = false;
              }
            }
          );
        }
      });
    },
    []
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setTimeout(() => {
      goTo((indexRef.current + 1) % ITEMS.length);
    }, SLIDE_MS);
    return () => window.clearTimeout(id);
  }, [index, goTo]);

  const t = ITEMS[index];

  return (
    <section className="testimonials-section relative overflow-hidden px-6 py-20 text-center lg:py-24">
      <svg
        className="pointer-events-none absolute -left-8 top-1/3 h-56 w-56 opacity-[0.10]"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <circle cx={50} cy={50} r={46} fill="none" stroke="var(--brand)" strokeWidth={1} />
      </svg>
      <svg
        className="pointer-events-none absolute -right-4 bottom-1/4 h-40 w-40 opacity-[0.12]"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <circle cx={50} cy={50} r={40} fill="none" stroke="var(--brand)" strokeWidth={1} />
        <circle cx={50} cy={50} r={28} fill="none" stroke="var(--brand)" strokeWidth={0.5} />
      </svg>

      <div className="relative mx-auto flex max-w-[760px] flex-col items-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          Loved by traders
        </span>

        <div ref={contentRef} className="testimonial-content mt-6">
          <blockquote className="text-[clamp(1.25rem,2.6vw,1.9rem)] font-normal italic leading-relaxed text-[var(--fg)]">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <footer className="mt-6 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white">
              {t.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <div className="text-left">
              <cite className="font-bold not-italic text-[var(--fg)]">
                {t.name}
              </cite>
              <p className="text-sm text-[var(--fg-muted)]">{t.role}</p>
            </div>
          </footer>
        </div>

        <div className="mt-8 flex items-center gap-3">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[var(--brand)]"
                  : "w-2 bg-[var(--surface-strong)] hover:bg-[var(--border-strong)]"
              }`}
            />
          ))}
          <div className="ml-4 h-1 w-48 overflow-hidden rounded-full bg-[var(--surface-strong)]">
            <div
              key={index}
              className="testimonial-progress-fill h-full bg-[var(--brand)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
