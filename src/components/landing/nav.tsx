"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

const FULL_LINKS = [
  { href: "#showcase", label: "Spot" },
  { href: "#showcase", label: "Futures" },
  { href: "#earn", label: "Earn" },
  { href: "#showcase", label: "SIP" },
  { href: "#packs", label: "CryptoPacks" },
  { href: "#pro", label: "Pro" }
];

const PILL_LINKS = FULL_LINKS.slice(0, 3);

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const header = navRef.current;
      const inner = innerRef.current;
      if (prefersReducedMotion() || !header || !inner) return;

      gsap.from(".nav-logo", { opacity: 0, x: -16, duration: 0.6, ease: ZEB_EASE });
      gsap.from(".nav-link", { opacity: 0, y: -8, stagger: 0.05, duration: 0.45, ease: ZEB_EASE, delay: 0.1 });

      const topInner = {
        maxWidth: "100%",
        borderRadius: 0,
        background: "transparent",
        backdropFilter: "blur(0px)",
        border: "1px solid transparent",
        boxShadow: "none",
        paddingLeft: 24,
        paddingRight: 24
      };

      const scrolledInner = {
        maxWidth: 720,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 999,
        background: "rgba(10,15,46,0.55)",
        backdropFilter: "blur(28px) saturate(180%)",
        border: "1px solid rgba(0,184,230,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.08) inset",
        paddingLeft: 20,
        paddingRight: 20
      };

      gsap.set(header, { top: 0, paddingLeft: 0, paddingRight: 0 });
      gsap.set(inner, topInner);

      const toScrolled = () => {
        gsap.to(header, { top: 12, paddingLeft: 12, paddingRight: 12, duration: 0.5, ease: ZEB_EASE });
        gsap.to(inner, { ...scrolledInner, duration: 0.5, ease: ZEB_EASE });
        gsap.to(".nav-full-links", { opacity: 0, pointerEvents: "none", duration: 0.2 });
        gsap.to(".nav-pill-links", { opacity: 1, pointerEvents: "auto", duration: 0.3, delay: 0.15 });
        gsap.to(".nav-login", { opacity: 0, width: 0, margin: 0, padding: 0, overflow: "hidden", duration: 0.25 });
      };

      const toTop = () => {
        gsap.to(header, { top: 0, paddingLeft: 0, paddingRight: 0, duration: 0.4, ease: ZEB_EASE });
        gsap.to(inner, { ...topInner, duration: 0.4, ease: ZEB_EASE });
        gsap.to(".nav-full-links", { opacity: 1, pointerEvents: "auto", duration: 0.3, delay: 0.1 });
        gsap.to(".nav-pill-links", { opacity: 0, pointerEvents: "none", duration: 0.2 });
        gsap.to(".nav-login", { opacity: 1, width: "auto", duration: 0.3, delay: 0.1 });
      };

      const syncFromScroll = () => {
        if (window.scrollY > 80) toScrolled();
        else toTop();
      };

      ScrollTrigger.create({
        start: "top -80",
        onEnter: toScrolled,
        onLeaveBack: toTop,
        onRefresh: syncFromScroll
      });

      if (window.scrollY > 80) syncFromScroll();
    },
    { scope: navRef }
  );

  useGSAP(
    () => {
      if (!menuOpen || prefersReducedMotion()) return;
      gsap.from(".mobile-nav-link", { opacity: 0, x: 40, stagger: 0.05, duration: 0.4, ease: ZEB_EASE });
    },
    { dependencies: [menuOpen] }
  );

  return (
    <>
      <header ref={navRef} className="nav-header fixed left-0 right-0 top-0 z-50">
        <nav
          ref={innerRef}
          className="nav-inner mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 border border-transparent px-6 transition-colors"
        >
          <Link href="/" className="nav-logo flex items-center gap-2 font-black text-[var(--text-on-dark)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--cyan)] to-[var(--blue)] text-sm text-[var(--navy)]">
              Z
            </span>
            <span className="nav-wordmark hidden sm:inline">ZebPay</span>
          </Link>

          <ul className="nav-full-links hidden items-center gap-5 lg:flex">
            {FULL_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="nav-link text-sm font-semibold text-[var(--text-muted-dark)] hover:text-[var(--cyan)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <ul className="nav-pill-links pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-4 opacity-0 lg:flex">
            {PILL_LINKS.map((l) => (
              <li key={`pill-${l.label}`}>
                <a href={l.href} className="text-sm font-semibold text-[var(--text-on-dark)]">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`${APP_URL}/login`}
              className="nav-login hidden text-sm font-bold text-[var(--text-muted-dark)] hover:text-[var(--cyan)] sm:inline"
            >
              Log in
            </a>
            <a href={`${APP_URL}/signup`} className="btn-primary hidden text-sm sm:inline-flex">
              Get started
            </a>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-dark)] text-[var(--text-on-dark)] lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#040812]/98 backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="absolute right-6 top-6 text-2xl text-[var(--text-on-dark)]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="flex h-full flex-col justify-center gap-6 px-10">
            {[...FULL_LINKS, { href: `${APP_URL}/login`, label: "Log in" }, { href: `${APP_URL}/signup`, label: "Get started" }].map(
              (l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="mobile-nav-link text-2xl font-bold text-[var(--text-on-dark)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              )
            )}
          </nav>
        </div>
      )}
    </>
  );
}
