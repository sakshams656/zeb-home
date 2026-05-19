"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Logo } from "./logo";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

const COLS = [
  {
    title: "Products",
    links: [
      { label: "Spot Trading", href: "#features" },
      { label: "Futures", href: "#features" },
      { label: "CryptoPacks", href: "#packs" },
      { label: "Earn", href: "#earn" },
      { label: "Options", href: "#features" }
    ]
  },
  {
    title: "Pro Tools",
    links: [
      { label: "AI Insights", href: "#pro" },
      { label: "Expert Trades", href: "#pro" },
      { label: "RMS", href: "#pro" },
      { label: "Sub Accounts", href: "#pro" },
      { label: "Trading APIs", href: "#features" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: `${APP_URL}/about` },
      { label: "Careers", href: `${APP_URL}/careers` },
      { label: "Blog", href: `${APP_URL}/blog` },
      { label: "Support", href: `${APP_URL}/support` }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: `${APP_URL}/terms` },
      { label: "Privacy", href: `${APP_URL}/privacy` },
      { label: "Risk Disclosure", href: `${APP_URL}/risk` },
      { label: "FIU-IND", href: `${APP_URL}/compliance` }
    ]
  }
];

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".footer-col", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: "footer", start: "top 85%", once: true }
      });
      ScrollTrigger.create({
        start: "top -300",
        onEnter: () => gsap.to(".back-to-top", { opacity: 1, y: 0, duration: 0.3 }),
        onLeaveBack: () => gsap.to(".back-to-top", { opacity: 0, y: 20, duration: 0.3 })
      });
    },
    { scope: ref }
  );

  const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion()) return;
    gsap.to(e.currentTarget, { "--underline-width": "100%", duration: 0.25 });
  };
  const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { "--underline-width": "0%", duration: 0.25 });
  };

  return (
    <>
      <footer ref={ref} className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-16">
        <div className="container-zeb">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
            <div className="footer-col lg:col-span-2">
              <Logo />
              <p className="mt-4 max-w-xs text-sm text-[var(--text-muted)]">
                India&apos;s trusted crypto exchange since 2014. FIU-IND registered.
              </p>
            </div>
            {COLS.map((col) => (
              <div key={col.title} className="footer-col">
                <h4 className="mb-3 text-sm font-bold text-[var(--text)]">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="footer-link text-sm text-[var(--text-muted)] hover:text-[var(--cyan)]"
                        onMouseEnter={onLinkEnter}
                        onMouseLeave={onLinkLeave}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--text-muted)] sm:flex-row">
            <span>© {new Date().getFullYear()} ZebPay. All rights reserved.</span>
            <span>Crypto assets are volatile. Trade responsibly.</span>
          </div>
        </div>
      </footer>
      <button
        type="button"
        className="back-to-top rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-bold text-[var(--navy)] shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑ Top
      </button>
    </>
  );
}
