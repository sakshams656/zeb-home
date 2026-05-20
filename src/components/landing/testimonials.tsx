"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const ITEMS = [
  {
    quote: "ZebPay's SIP feature changed how I invest in crypto. Set it, forget it, grow it — effortlessly.",
    name: "Priya M.",
    role: "Retail investor since 2021"
  },
  {
    quote: "RMS auto stop-loss on every futures position — I sleep better knowing exits are handled.",
    name: "Arjun K.",
    role: "Active futures trader"
  },
  {
    quote: "QuickTrade is the fastest way to enter a position I've used on any Indian exchange.",
    name: "Sneha R.",
    role: "Crypto beginner, 2023"
  }
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const advance = useCallback(() => {
    const el = contentRef.current;
    const next = (indexRef.current + 1) % ITEMS.length;
    if (!el || prefersReducedMotion()) {
      setIndex(next);
      setProgress(0);
      return;
    }
    gsap.to(el, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setIndex(next);
        setProgress(0);
        gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: ZEB_EASE });
      }
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / 6000);
      setProgress(p);
      if (p >= 1) advance();
    };
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [index, advance]);

  const t = ITEMS[index];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[var(--navy)] via-[#0c1535] to-[var(--navy)] px-6 py-[120px] text-center">
      <svg className="pointer-events-none absolute -left-8 top-1/3 h-56 w-56 opacity-[0.1]" viewBox="0 0 100 100" aria-hidden>
        <circle cx={50} cy={50} r={46} fill="none" stroke="var(--cyan)" strokeWidth={1} />
      </svg>
      <svg className="pointer-events-none absolute -right-4 bottom-1/4 h-40 w-40 opacity-[0.12]" viewBox="0 0 100 100" aria-hidden>
        <circle cx={50} cy={50} r={40} fill="none" stroke="var(--cyan)" strokeWidth={1} />
        <circle cx={50} cy={50} r={28} fill="none" stroke="var(--cyan)" strokeWidth={0.5} />
      </svg>
      <div ref={contentRef} className="testimonial-content max-w-[700px]">
        <blockquote className="text-[clamp(1.25rem,3vw,2rem)] font-normal italic leading-relaxed text-[var(--text-on-dark)]">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <footer className="mt-10 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cyan)] text-sm font-bold text-[var(--navy)]">
            {t.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <div className="text-left">
            <cite className="font-bold not-italic text-[var(--text-on-dark)]">{t.name}</cite>
            <p className="text-sm text-[var(--text-muted-dark)]">{t.role}</p>
          </div>
        </footer>
      </div>

      <div className="mt-12 flex items-center gap-3">
        {ITEMS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-[var(--cyan)]" : "bg-white/20"}`}
          />
        ))}
        <div className="ml-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[var(--cyan)] transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
