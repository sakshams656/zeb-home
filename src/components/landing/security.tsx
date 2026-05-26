"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/context/theme-context";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

type PillarId = "cold-storage" | "multi-sig" | "insurance-fund" | "zero-hacks";

const PILLARS: { id: PillarId; title: string; body: string }[] = [
  {
    id: "cold-storage",
    title: "Cold storage",
    body: "98% of assets in multi-sig cold wallets across geographies."
  },
  {
    id: "multi-sig",
    title: "Multi-sig wallets",
    body: "5-of-3 custody architecture for institutional-grade safety."
  },
  {
    id: "insurance-fund",
    title: "Insurance fund",
    body: "$100M custodial coverage on qualified balances."
  },
  {
    id: "zero-hacks",
    title: "Zero hacks since 2014",
    body: "A decade-long track record you can verify."
  }
];

function PillarIcon({ id }: { id: PillarId }) {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <Image
      src={`/security/icons/${theme}/${id}.png`}
      alt=""
      width={40}
      height={40}
      className="h-10 w-10 object-contain"
      aria-hidden
    />
  );
}

const STATS: { num: string; label: string; tone?: "success" }[] = [
  { num: "10+", label: "Years secure" },
  { num: "$100M", label: "Custodial coverage" },
  { num: "98%", label: "Assets in cold storage" },
  { num: "0", label: "Hacks since 2014", tone: "success" }
];

const BADGES = ["FIU-IND registered", "ISO 27001", "SOC 2 Type II"];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function ShieldVisual() {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <div className="security-hero-visual relative mx-auto aspect-[5/6] w-full max-w-[340px]">
      <Image
        src={`/security/icons/${theme}/hero-shield.png`}
        alt=""
        width={340}
        height={408}
        className="h-full w-full object-contain"
        priority
        aria-hidden
      />
    </div>
  );
}

export function Security() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (prefersReducedMotion() || !root) return;

      gsap.fromTo(
        root.querySelector(".security-hero-visual"),
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".security-stat"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".security-pillar"),
        { opacity: 0, y: 18, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.55,
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
      id="security"
      ref={ref}
      className="security-section scroll-mt-24 px-6 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
            Security
          </p>
          <h2 className="mt-2 text-[clamp(1.75rem,3.5vw,2.75rem)] font-black text-[var(--fg)]">
            Built like a fortress.
          </h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)] sm:text-base">
            Zero hacks since 2014. FIU-IND registered. ISO 27001. SOC 2 Type II.
          </p>
        </div>

        <div
          className="mt-10 grid gap-6 overflow-hidden rounded-3xl border border-[var(--border)] p-5 backdrop-blur-sm sm:p-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:p-8"
          style={{ background: "var(--surface)" }}
        >
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 -z-10 rounded-2xl"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 50%, rgba(var(--brand-rgb), 0.18) 0%, transparent 70%)"
              }}
            />
            <ShieldVisual />
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="security-stat rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
                >
                  <p
                    className={`text-2xl font-black tabular-nums sm:text-3xl ${
                      s.tone === "success" ? "text-[var(--success)]" : "text-[var(--fg)]"
                    }`}
                  >
                    {s.num}
                  </p>
                  <p className="mt-1 text-xs text-[var(--fg-muted)] sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-subtle)]">
                Compliance &amp; certifications
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {BADGES.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--fg)]"
                    style={{
                      border: "1px solid rgba(var(--brand-rgb), 0.35)",
                      background: "rgba(var(--brand-rgb), 0.10)"
                    }}
                  >
                    <CheckIcon className="h-3 w-3 text-[var(--success)]" />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[var(--brand)] transition-colors hover:text-[var(--fg)]"
            >
              View security report
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="security-pillar group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 transition hover:border-[var(--border-strong)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(var(--brand-rgb), 0.18), rgba(var(--brand-rgb), 0) 60%)"
                }}
              />
              <span
                className="relative grid h-10 w-10 place-items-center rounded-xl text-[var(--brand)]"
                style={{
                  border: "1px solid rgba(var(--brand-rgb), 0.35)",
                  background: "rgba(var(--brand-rgb), 0.16)"
                }}
              >
                <PillarIcon id={p.id} />
              </span>
              <h3 className="relative mt-3 text-base font-bold text-[var(--fg)]">{p.title}</h3>
              <p className="relative mt-1.5 text-sm text-[var(--fg-muted)]">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
