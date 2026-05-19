"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { Draggable, gsap, prefersReducedMotion } from "@/lib/gsap";

const ITEMS = [
  { quote: "RMS auto stop-loss on every futures position — I sleep better.", name: "Aman K.", role: "Futures trader, Mumbai", tag: "Pro" },
  { quote: "Sub-50ms API placement on perpetuals. Production-grade for our bot.", name: "Priya S.", role: "Algo trader, Bengaluru", tag: "Pro" },
  { quote: "₹15K SIP across two CryptoPacks. Up 38% in 14 months.", name: "Rohit M.", role: "Investor, Pune", tag: "Retail" }
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = useCallback((next: number) => {
    const slide = slideRef.current;
    const normalized = ((next % ITEMS.length) + ITEMS.length) % ITEMS.length;
    if (!slide || prefersReducedMotion()) {
      setIndex(normalized);
      return;
    }
    gsap.to(slide, {
      opacity: 0,
      x: -40,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setIndex(normalized);
        gsap.fromTo(slide, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
      }
    });
  }, []);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      if (prefersReducedMotion() || !wrap) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const float = gsap.to(wrap.querySelector(".testimonial-avatar"), {
          y: -8,
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });

        const draggable = Draggable.create(wrap, {
          type: "x",
          inertia: true,
          onDragEnd() {
            const dx = this.x;
            if (dx < -60) goTo(indexRef.current + 1);
            else if (dx > 60) goTo(indexRef.current - 1);
            gsap.set(wrap, { x: 0 });
          }
        });

        return () => {
          float.kill();
          draggable[0]?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [goTo] }
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => goTo(indexRef.current + 1), 5000);
    return () => clearInterval(id);
  }, [goTo]);

  const t = ITEMS[index];

  return (
    <section className="bg-[var(--surface)] px-6 py-20">
      <div className="container-zeb max-w-2xl">
        <SectionHeader chip="Community" title="Trusted by millions" />
        <div ref={wrapRef} className="testimonial-wrap cursor-grab active:cursor-grabbing">
          <blockquote ref={slideRef} className="testimonial-active rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8">
            <p className="text-lg text-[var(--text)]">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-6 flex items-center gap-3">
              <span className="testimonial-avatar flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cyan)] text-sm font-bold text-[var(--navy)]">
                {t.name.split(" ").map((w) => w[0]).join("")}
              </span>
              <div>
                <cite className="font-bold not-italic">{t.name}</cite>
                <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
              </div>
              <span className="ml-auto rounded bg-[var(--surface)] px-2 py-0.5 text-[10px] font-bold">{t.tag}</span>
            </footer>
          </blockquote>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {ITEMS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Testimonial ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full ${i === index ? "bg-[var(--cyan)]" : "bg-[var(--border)]"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
