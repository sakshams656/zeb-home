"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useTheme } from "@/context/theme-context";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { LINKS } from "@/lib/links";
import { Logo } from "./logo";

const COLS = [
  {
    title: "Product",
    links: [
      { label: "Spot", href: LINKS.exchange },
      { label: "Futures", href: LINKS.futures },
      { label: "SIP", href: LINKS.sip },
      { label: "CryptoPacks", href: LINKS.cryptopacks },
      { label: "Earn", href: LINKS.earn }
    ]
  },
  {
    title: "Pro tools",
    links: [
      { label: "AI Insights", href: "#" },
      { label: "Expert Trades", href: "#" },
      { label: "RMS", href: "#" },
      { label: "Sub Accounts", href: "#" },
      { label: "Options", href: "#" },
      { label: "APIs", href: LINKS.apidocs }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: LINKS.blog },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Risk disclosure", href: "#" },
      { label: "Grievance", href: "#" }
    ]
  }
];

const BADGES = ["FIU-IND registered", "ISO 27001", "SOC 2 Type II"];

function FooterGlobe() {
  const { isDark } = useTheme();
  const src = isDark
    ? "/footer/zebpay-hero-globe-dark.gif"
    : "/footer/zebpay-hero-globe-light.gif";

  return (
    // eslint-disable-next-line @next/next/no-img-element -- animated GIF
    <img
      src={src}
      alt=""
      width={800}
      height={480}
      className="mx-auto h-auto w-full max-w-[800px]"
      decoding="async"
      aria-hidden
    />
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
        <div className="container-zeb flex flex-col items-center pt-20 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--brand)]">
            Start trading
          </p>
          <h2 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-black text-[var(--fg)]">
            Crypto, from India to the world.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-[var(--fg-muted)] sm:text-base">
            India&apos;s most trusted crypto exchange. 6M+ users, ₹2T+ traded, 200+ assets.
          </p>
          <a href={LINKS.getStarted} className="btn-primary mt-6">
            Get started →
          </a>
          <div className="relative mt-6 w-full max-w-[800px] sm:mt-8">
            <FooterGlobe />
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
                  href="https://twitter.com/zebpay"
                  label="Twitter / X"
                  d="M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.78-6.27L4.8 22H2l7-8L2 2h6.99l4.32 5.74L18.244 2zM17.1 20h1.6L7 4h-1.6L17.1 20z"
                />
                <SocialIcon
                  href="https://www.linkedin.com/company/zebpay/"
                  label="LinkedIn"
                  d="M4 4h4v16H4V4zm2 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm4 4h3.8v2.2h.06c.53-1 1.83-2.06 3.77-2.06 4.04 0 4.78 2.66 4.78 6.12V20h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V20h-4V8z"
                />
                <SocialIcon
                  href="https://www.instagram.com/zebpayofficial/"
                  label="Instagram"
                  d="M12 2c2.72 0 3.05 0 4.12.06 1.07.05 1.8.22 2.43.47.66.25 1.22.59 1.77 1.15.56.55.9 1.11 1.15 1.77.25.63.42 1.36.47 2.43.05 1.07.06 1.4.06 4.12s0 3.05-.06 4.12c-.05 1.07-.22 1.8-.47 2.43-.25.66-.59 1.22-1.15 1.77-.55.56-1.11.9-1.77 1.15-.63.25-1.36.42-2.43.47-1.07.06-1.4.06-4.12.06s-3.05 0-4.12-.06c-1.07-.05-1.8-.22-2.43-.47-.66-.25-1.22-.59-1.77-1.15-.56-.55-.9-1.11-1.15-1.77-.25-.63-.42-1.36-.47-2.43C2 15.05 2 14.72 2 12s0-3.05.06-4.12c.05-1.07.22-1.8.47-2.43.25-.66.59-1.22 1.15-1.77.55-.56 1.11-.9 1.77-1.15.63-.25 1.36-.42 2.43-.47C8.95 2 9.28 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.5-3.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"
                />
                <SocialIcon
                  href="https://www.youtube.com/user/ZebpayTube"
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
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-[var(--fg-muted)] transition-colors hover:text-[var(--brand)]"
                      >
                        {l.label}
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
