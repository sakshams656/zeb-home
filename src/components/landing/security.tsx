"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const PILLARS: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Cold storage",
    body: "98% of assets in multi-sig cold wallets across geographies.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2v20 M2 12h20 M5 5l14 14 M19 5 5 19" />
      </svg>
    )
  },
  {
    title: "Multi-sig wallets",
    body: "5-of-3 custody architecture for institutional-grade safety.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="8" cy="15" r="4" />
        <path d="M10.85 12.15 21 2 M18 5l3 3 M14.5 8.5l3 3" />
      </svg>
    )
  },
  {
    title: "Insurance fund",
    body: "$100M custodial coverage on qualified balances.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  },
  {
    title: "Zero hacks since 2014",
    body: "A decade-long track record you can verify.",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4 M8 2v4 M3 10h18 M8 15l2 2 4-4" />
      </svg>
    )
  }
];

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
  return (
    <div className="relative mx-auto aspect-[5/6] w-full max-w-[340px]">
      <svg
        viewBox="0 0 300 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="security-shield-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(var(--brand-rgb),0.55)" />
            <stop offset="60%" stopColor="rgba(var(--brand-rgb),0.18)" />
            <stop offset="100%" stopColor="rgba(27,85,224,0.04)" />
          </linearGradient>
          <radialGradient id="security-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(27,85,224,0.75)" />
            <stop offset="100%" stopColor="rgba(var(--brand-rgb),0)" />
          </radialGradient>
        </defs>

        <g className="security-ring-slow">
          <circle
            cx={150}
            cy={185}
            r={140}
            fill="none"
            stroke="rgba(var(--brand-rgb),0.25)"
            strokeWidth={1}
            strokeDasharray="4 8"
          />
        </g>
        <g className="security-ring-fast">
          <circle
            cx={150}
            cy={185}
            r={112}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={1}
            strokeDasharray="2 6"
          />
        </g>

        <path
          d="M150 20 L270 70 V180 C270 280 210 330 150 350 C90 330 30 280 30 180 V70 Z"
          fill="url(#security-shield-fill)"
        />

        <path
          className="shield-path"
          d="M150 20 L270 70 V180 C270 280 210 330 150 350 C90 330 30 280 30 180 V70 Z"
          fill="none"
          stroke="var(--brand)"
          strokeWidth={2}
        />

        <path
          className="shield-facet"
          d="M150 60 L220 95 V175 L150 210 L80 175 V95 Z"
          fill="rgba(var(--brand-rgb),0.10)"
          stroke="rgba(var(--brand-rgb),0.35)"
          strokeWidth={1}
        />

        <g className="security-pulse">
          <circle cx={150} cy={185} r={60} fill="url(#security-core-glow)" />
          <path
            className="shield-facet"
            d="M150 145 L190 168 V210 L150 232 L110 210 V168 Z"
            fill="rgba(var(--brand-rgb),0.35)"
            stroke="rgba(var(--brand-rgb),0.65)"
            strokeWidth={1}
          />
        </g>

        <g fill="rgba(27,85,224,0.8)">
          <circle className="shield-facet" cx={66} cy={104} r={2.5} />
          <circle className="shield-facet" cx={234} cy={104} r={2.5} />
          <circle className="shield-facet" cx={84} cy={258} r={2.5} />
          <circle className="shield-facet" cx={216} cy={258} r={2.5} />
        </g>
      </svg>
    </div>
  );
}

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
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none none"
            }
          }
        );

        gsap.fromTo(
          root.querySelectorAll(".shield-facet"),
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.06,
            duration: 0.5,
            delay: 0.6,
            ease: ZEB_EASE,
            immediateRender: false,
            transformOrigin: "center",
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none none"
            }
          }
        );
      }

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
                {p.icon}
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
