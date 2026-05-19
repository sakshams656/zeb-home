"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { PACKS, type PackId } from "@/lib/market-data";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const PACK_LIST: PackId[] = ["defi", "l1", "ai", "meme"];

export function CryptoPacks() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (prefersReducedMotion() || !root) return;

      gsap.from(root.querySelectorAll(".pack-card"), {
        opacity: 0,
        x: 60,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true }
      });

      const cleanups: (() => void)[] = [];
      root.querySelectorAll(".pack-card").forEach((card) => {
        const el = card as HTMLElement;
        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(el, {
            rotateY: x * 16,
            rotateX: -y * 16,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 800
          });
        };
        const onLeave = () => {
          gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        };
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
    <section id="packs" ref={ref} className="scroll-mt-20 bg-[var(--surface)] px-6 py-20">
      <div className="container-zeb">
        <SectionHeader
          chip="CryptoPacks"
          title="Diversified themes in one tap"
          subtitle="Expert-curated baskets — DeFi, L1s, AI, and more."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PACK_LIST.map((id) => {
            const p = PACKS[id];
            return (
              <article
                key={id}
                className="pack-card rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow)] transition hover:border-[var(--cyan)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <h3 className="text-lg font-black text-[var(--text)]">{p.name}</h3>
                <p className="mt-2 text-2xl font-black text-[var(--success)]">+{p.ret}% YTD</p>
                <p className="mt-3 text-sm text-[var(--text-muted)]">
                  {p.coins.length} assets · {p.coins.slice(0, 4).join(", ")}…
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
