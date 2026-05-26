"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { PACKS, type PackId } from "@/lib/market-data";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const PACK_META: Record<PackId, { accent: string; bg: string }> = {
  defi: { accent: "#1b55e0", bg: "#0d1f2d" },
  l1: { accent: "#7f77dd", bg: "#0d0d2b" },
  ai: { accent: "#00b07a", bg: "#0a1a0a" },
  meme: { accent: "#f5a623", bg: "#2b1a0a" }
};

const IDS: PackId[] = ["defi", "l1", "ai", "meme"];

export function CryptoPacks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (prefersReducedMotion() || !root) return;

      gsap.from(root.querySelectorAll(".pack-card"), {
        opacity: 0,
        y: 80,
        stagger: 0.1,
        duration: 0.9,
        ease: ZEB_EASE,
        scrollTrigger: { trigger: ".packs-grid", start: "top 75%", once: true }
      });

      const cleanups: (() => void)[] = [];
      root.querySelectorAll(".pack-card").forEach((card) => {
        const el = card as HTMLElement;
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
          const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
          gsap.to(el, { rotateY: x, rotateX: y, scale: 1.03, duration: 0.4, ease: "power2.out", transformPerspective: 900 });
        };
        const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope: ref }
  );

  return (
    <section id="packs" ref={ref} className="scroll-mt-24 bg-[#040812] py-14 sm:py-16 lg:py-24">
      <div className="container-zeb">
        <h2 className="text-[clamp(2rem,5vw,3rem)] font-black text-[var(--fg)]">Invest in themes, not tickers.</h2>
        <p className="mt-4 text-base text-[var(--fg-muted)] sm:text-xl">4 curated packs built for every kind of investor.</p>

        <div className="packs-grid mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {IDS.map((id) => {
            const p = PACKS[id];
            const meta = PACK_META[id];
            return (
              <article
                key={id}
                className="pack-card flex min-h-[360px] flex-col justify-between rounded-3xl p-6 sm:p-8"
                style={{ background: meta.bg, transformStyle: "preserve-3d" }}
              >
                <div className="flex -space-x-2">
                  {p.coins.slice(0, 3).map((c) => (
                    <span
                      key={c}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0f2e] bg-[var(--surface)] text-xs font-bold"
                      style={{ color: meta.accent }}
                    >
                      {c[0]}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[var(--fg)]">{p.name}</h3>
                  <p className="mt-2 text-sm text-[var(--fg-muted)]">Decentralised finance themes</p>
                  <p className="mt-4 text-sm text-[var(--fg-muted)]">{p.coins.length} coins</p>
                  <p className="mt-2 inline-block rounded-full px-3 py-1 text-sm font-bold" style={{ color: meta.accent, background: `${meta.accent}22` }}>
                    ↑ {p.ret}% this year
                  </p>
                  <button type="button" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[var(--border)] px-5 py-2 text-sm font-bold text-[var(--fg)] hover:border-[var(--brand)]">
                    Invest →
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
