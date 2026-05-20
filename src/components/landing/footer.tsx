"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

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

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".footer-col", {
        opacity: 0,
        y: 30,
        stagger: 0.08,
        duration: 0.6,
        ease: ZEB_EASE,
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

  return (
    <>
      <footer ref={ref} className="bg-[#040812] px-6 pt-[120px] text-[var(--text-on-dark)]">
        <div className="mx-auto max-w-[1200px] border-b border-[var(--border-dark)] pb-16 text-center">
          <p className="text-[clamp(3rem,10vw,5rem)] font-black">ZebPay</p>
          <p className="mt-4 text-lg text-[var(--text-muted-dark)]">India&apos;s most trusted crypto exchange</p>
          <a href={`${APP_URL}/signup`} className="btn-primary mt-8 inline-flex">
            Get started →
          </a>
        </div>

        <div className="mx-auto grid max-w-[1200px] gap-10 py-16 md:grid-cols-4">
          {COLS.map((col) => (
            <div key={col.title} className="footer-col">
              <h4 className="mb-4 text-sm font-bold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="footer-link text-sm text-[var(--text-muted-dark)] hover:text-[var(--cyan)]">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 border-t border-[var(--border-dark)] py-8 text-sm text-[var(--text-muted-dark)]">
          <div className="flex flex-wrap gap-4">
            {["FIU-IND", "ISO", "SOC 2"].map((b) => (
              <span key={b}>✓ {b}</span>
            ))}
          </div>
          <span>© {new Date().getFullYear()} ZebPay. Made in India 🇮🇳</span>
        </div>
      </footer>

      <button
        type="button"
        className="back-to-top fixed bottom-6 right-6 z-40 rounded-full bg-[var(--cyan)] px-4 py-2 text-sm font-bold text-[var(--navy)] opacity-0 shadow-lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑ Top
      </button>
    </>
  );
}
