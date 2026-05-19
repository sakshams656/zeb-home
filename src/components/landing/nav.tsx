"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#markets", label: "Markets" },
  { href: "#packs", label: "CryptoPacks" },
  { href: "#earn", label: "Earn" },
  { href: "#security", label: "Security" }
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".nav-logo", { opacity: 0, x: -20, duration: 0.6, ease: "power3.out" });
      gsap.from(".nav-link", { opacity: 0, y: -10, stagger: 0.06, duration: 0.5, ease: "power2.out", delay: 0.1 });

      if (innerRef.current) {
        ScrollTrigger.create({
          start: "top -60",
          onEnter: () => gsap.to(innerRef.current, { height: 52, duration: 0.3, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(innerRef.current, { height: 72, duration: 0.3, ease: "power2.out" })
        });
      }
    },
    { scope: navRef }
  );

  return (
    <header ref={navRef} className="nav-header sticky top-0 z-50 border-b border-[var(--border)]">
      <nav
        className="nav-inner container-zeb flex items-center justify-between gap-4 backdrop-blur-[12px]"
        style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", height: 72 }}
        ref={innerRef}
      >
        <Link href="/" className="nav-logo">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-link text-sm font-semibold text-[var(--text-muted)] transition hover:text-[var(--cyan)]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href={`${APP_URL}/login`} className="hidden text-sm font-bold text-[var(--text-muted)] sm:inline">
            Log In
          </a>
          <a href={`${APP_URL}/signup`} className="btn-primary hidden text-sm sm:inline-flex">
            Get Started
          </a>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-4 md:hidden">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="block py-2 font-semibold" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <a href={`${APP_URL}/login`} className="btn-outline">Log In</a>
            <a href={`${APP_URL}/signup`} className="btn-primary">Get Started</a>
          </div>
        </div>
      )}
    </header>
  );
}
