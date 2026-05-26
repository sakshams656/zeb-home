"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "./logo";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

const COLS = [
  {
    title: "Product",
    links: ["Spot", "Futures", "SIP", "CryptoPacks", "Earn"]
  },
  {
    title: "Pro tools",
    links: ["AI Insights", "Expert Trades", "RMS", "Sub Accounts", "Options", "APIs"]
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press"]
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Risk disclosure", "Grievance"]
  }
];

const BADGES = ["FIU-IND registered", "ISO 27001", "SOC 2 Type II"];

type CoinKey = "BTC" | "ETH" | "SOL" | "USDT" | "DOGE" | "BAT";

function BtcGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden>
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontFamily="inherit"
        fontWeight="900"
        fontSize="18"
        fill="white"
      >
        ₿
      </text>
    </svg>
  );
}
function EthGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="55%" height="55%" aria-hidden fill="white">
      <path d="M12 2L5.5 12.3L12 16l6.5-3.7L12 2z" opacity={0.92} />
      <path d="M12 17.3L5.5 13.5L12 22l6.5-8.5L12 17.3z" opacity={0.7} />
    </svg>
  );
}
function SolGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden fill="white">
      <path d="M5.5 16.5l2-2h11l-2 2h-11zM5.5 12l2-2h11l-2 2h-11zM5.5 7.5l2-2h11l-2 2h-11z" />
    </svg>
  );
}
function UsdtGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="65%" height="65%" aria-hidden>
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontFamily="inherit"
        fontWeight="900"
        fontSize="14"
        fill="white"
      >
        ₮
      </text>
    </svg>
  );
}
function DogeGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="65%" height="65%" aria-hidden>
      <text
        x="12"
        y="17.5"
        textAnchor="middle"
        fontFamily="inherit"
        fontWeight="900"
        fontSize="16"
        fill="white"
      >
        Ð
      </text>
    </svg>
  );
}
function BatGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="60%" height="60%" aria-hidden fill="white">
      <path d="M12 4L20 19H4L12 4z" opacity={0.9} />
      <path d="M12 9L16 17H8L12 9z" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}

const COIN_STYLE: Record<CoinKey, { color: string; glyph: ReactNode }> = {
  BTC: { color: "#f7931a", glyph: <BtcGlyph /> },
  ETH: { color: "#627eea", glyph: <EthGlyph /> },
  SOL: { color: "#9945ff", glyph: <SolGlyph /> },
  USDT: { color: "#26a17b", glyph: <UsdtGlyph /> },
  DOGE: { color: "#c2a633", glyph: <DogeGlyph /> },
  BAT: { color: "#ff5000", glyph: <BatGlyph /> }
};

type CoinSlot = { coin: CoinKey; size: number; top: string; left: string };
const COIN_SLOTS: CoinSlot[] = [
  { coin: "BTC", size: 72, top: "8%", left: "62%" },
  { coin: "ETH", size: 60, top: "20%", left: "14%" },
  { coin: "SOL", size: 54, top: "58%", left: "4%" },
  { coin: "USDT", size: 64, top: "70%", left: "80%" },
  { coin: "DOGE", size: 48, top: "78%", left: "38%" },
  { coin: "BAT", size: 52, top: "30%", left: "88%" }
];

function CoinDisc({ coin, size, top, left }: CoinSlot) {
  const { color, glyph } = COIN_STYLE[coin];
  return (
    <span
      className="coin-orb absolute grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85) 0%, ${color} 35%, #0a0f2e 100%)`,
        boxShadow: `0 12px 36px ${color}55, inset 0 -6px 18px rgba(0,0,0,0.35)`,
        border: `1px solid ${color}80`
      }}
      aria-label={coin}
    >
      {glyph}
    </span>
  );
}

function GlobeScene() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[460px]">
      <svg
        viewBox="0 0 480 480"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="globe-fill" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#1a3580" />
            <stop offset="55%" stopColor="#0a1a4e" />
            <stop offset="100%" stopColor="#040812" />
          </radialGradient>
          <radialGradient id="globe-halo" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="rgba(var(--brand-rgb),0)" />
            <stop offset="80%" stopColor="rgba(var(--brand-rgb),0.18)" />
            <stop offset="100%" stopColor="rgba(var(--brand-rgb),0)" />
          </radialGradient>
          <linearGradient id="streak-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(var(--brand-rgb),0)" />
            <stop offset="50%" stopColor="rgba(80,150,255,0.85)" />
            <stop offset="100%" stopColor="rgba(80,150,255,0)" />
          </linearGradient>
        </defs>

        <circle cx={240} cy={240} r={220} fill="url(#globe-halo)" />
        <circle cx={240} cy={240} r={160} fill="url(#globe-fill)" />
        <circle
          cx={240}
          cy={240}
          r={160}
          fill="none"
          stroke="rgba(80,140,255,0.35)"
          strokeWidth={1}
        />

        <g
          className="footer-globe-rotate"
          style={{ transformOrigin: "240px 240px" }}
          stroke="rgba(80,140,255,0.40)"
          strokeWidth={1}
          fill="none"
        >
          <ellipse cx={240} cy={240} rx={160} ry={50} />
          <ellipse cx={240} cy={240} rx={160} ry={95} />
          <ellipse cx={240} cy={240} rx={160} ry={140} />
          <ellipse cx={240} cy={240} rx={50} ry={160} />
          <ellipse cx={240} cy={240} rx={95} ry={160} />
          <ellipse cx={240} cy={240} rx={140} ry={160} />
        </g>

        <g>
          {[-100, -60, -25, 15, 55, 95].map((dx, i) => (
            <rect
              key={i}
              x={240 + dx - 1.5}
              y={120}
              width={3}
              height={120}
              rx={1.5}
              fill="url(#streak-grad)"
              className="footer-streak"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          ))}
        </g>

        <g fill="rgba(180,210,255,0.9)">
          {[
            { cx: 80, cy: 96, r: 3 },
            { cx: 420, cy: 110, r: 2.5 },
            { cx: 60, cy: 320, r: 2 },
            { cx: 430, cy: 360, r: 3 },
            { cx: 180, cy: 50, r: 2 },
            { cx: 350, cy: 430, r: 2.5 }
          ].map((s, i) => (
            <g
              key={i}
              className="footer-star"
              style={{
                animationDelay: `${i * 0.4}s`,
                transformOrigin: `${s.cx}px ${s.cy}px`
              }}
            >
              <circle cx={s.cx} cy={s.cy} r={s.r} />
              <path
                d={`M${s.cx} ${s.cy - s.r * 2.5} L${s.cx + 0.6} ${s.cy} L${s.cx} ${s.cy + s.r * 2.5} L${s.cx - 0.6} ${s.cy} Z`}
                opacity={0.85}
              />
              <path
                d={`M${s.cx - s.r * 2.5} ${s.cy} L${s.cx} ${s.cy + 0.6} L${s.cx + s.r * 2.5} ${s.cy} L${s.cx} ${s.cy - 0.6} Z`}
                opacity={0.85}
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="absolute inset-0">
        {COIN_SLOTS.map((slot) => (
          <CoinDisc key={slot.coin} {...slot} />
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ d, label, href }: { d: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)] transition hover:border-transparent hover:bg-[var(--brand)] hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d={d} />
      </svg>
    </a>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const root = ref.current;

      gsap.fromTo(
        root.querySelectorAll(".footer-col"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.55,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      const orbs = root.querySelectorAll(".coin-orb");
      orbs.forEach((el, i) => {
        gsap.to(el, {
          y: -10,
          duration: 2.6 + i * 0.2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.15
        });
      });

      ScrollTrigger.create({
        start: "top -300",
        onEnter: () =>
          gsap.to(".back-to-top", { opacity: 1, y: 0, duration: 0.3 }),
        onLeaveBack: () =>
          gsap.to(".back-to-top", { opacity: 0, y: 20, duration: 0.3 })
      });
    },
    { scope: ref }
  );

  const year = new Date().getFullYear();

  return (
    <>
      <footer
        ref={ref}
        className="footer-globe-bg relative overflow-hidden text-[var(--fg)]"
      >
        <div className="container-zeb flex flex-col items-center pb-12 pt-20 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
            Start trading
          </p>
          <h2 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-black text-[var(--fg)]">
            Crypto, from India to the world.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[var(--fg-muted)] sm:text-base">
            India&apos;s most trusted crypto exchange. 6M+ users, ₹2T+ traded, 200+ assets.
          </p>
          <a href={`${APP_URL}/signup`} className="btn-primary mt-6">
            Get started →
          </a>
          <div className="relative mt-6 w-full max-w-[520px] sm:mt-8">
            <GlobeScene />
          </div>
        </div>

        <div className="border-t border-[var(--border)]">
          <div className="container-zeb grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
            <div className="footer-col">
              <Logo variant="auto" width={150} height={52} className="h-auto w-[150px]" />
              <p className="mt-3 max-w-[240px] text-xs text-[var(--fg-muted)]">
                India&apos;s most trusted crypto exchange since 2014. Trade, save and invest in 200+ assets.
              </p>
              <div className="mt-4 flex gap-2">
                <SocialIcon
                  href="#"
                  label="Twitter / X"
                  d="M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.78-6.27L4.8 22H2l7-8L2 2h6.99l4.32 5.74L18.244 2zM17.1 20h1.6L7 4h-1.6L17.1 20z"
                />
                <SocialIcon
                  href="#"
                  label="LinkedIn"
                  d="M4 4h4v16H4V4zm2 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm4 4h3.8v2.2h.06c.53-1 1.83-2.06 3.77-2.06 4.04 0 4.78 2.66 4.78 6.12V20h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V20h-4V8z"
                />
                <SocialIcon
                  href="#"
                  label="Instagram"
                  d="M12 2c2.72 0 3.05 0 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.59 1.77 1.15.56.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.07.06 1.4.06 4.12s0 3.05-.06 4.12c-.05 1.07-.22 1.8-.47 2.43-.25.66-.59 1.22-1.15 1.77-.55.56-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.07.06-1.4.06-4.12.06s-3.05 0-4.12-.06c-1.07-.05-1.8-.22-2.43-.47-.66-.25-1.22-.59-1.77-1.15-.56-.55-.9-1.11-1.15-1.77-.25-.63-.42-1.36-.47-2.43C2 15.05 2 14.72 2 12s0-3.05.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.59-1.22 1.15-1.77.55-.56 1.11-.9 1.77-1.15.63-.25 1.36-.42 2.43-.47C8.95 2 9.28 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"
                />
                <SocialIcon
                  href="#"
                  label="YouTube"
                  d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.38.48A3 3 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3 3 0 0 0 2.12 2.12C4.5 20.4 12 20.4 12 20.4s7.5 0 9.38-.48a3 3 0 0 0 2.12-2.12C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"
                />
              </div>
            </div>
            {COLS.map((col) => (
              <div key={col.title} className="footer-col">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--fg)]">
                  {col.title}
                </h4>
                <ul className="mt-3 space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--brand)]"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)]">
          <div className="container-zeb flex flex-wrap items-center justify-between gap-3 py-6 text-xs text-[var(--fg-muted)]">
            <div className="flex flex-wrap items-center gap-2">
              {BADGES.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1"
                >
                  <span className="text-[var(--success)]">
                    <CheckIcon />
                  </span>
                  {b}
                </span>
              ))}
            </div>
            <span className="tabular-nums">
              © {year} ZebPay. Made in India.
            </span>
          </div>
        </div>
      </footer>

      <button
        type="button"
        className="back-to-top fixed bottom-6 right-6 z-40 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-white opacity-0 shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑ Top
      </button>
    </>
  );
}
