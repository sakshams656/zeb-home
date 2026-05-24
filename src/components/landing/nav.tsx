"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "./logo";
import { NAV_ALL_GROUPS, NAV_COMPANY, NAV_MENU_GROUPS } from "./nav-config";
import { NavDropdown } from "./nav-dropdown";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const header = navRef.current;
      const inner = innerRef.current;
      if (prefersReducedMotion() || !header || !inner) return;

      gsap.from(".nav-logo", { opacity: 0, y: -10, duration: 0.6, ease: ZEB_EASE });
      gsap.from(".nav-dropdown-trigger", { opacity: 0, y: -8, stagger: 0.05, duration: 0.45, ease: ZEB_EASE, delay: 0.1 });

      const SCROLL_RANGE = 80;
      const SCROLL_INSET = 16;

      gsap.set(inner, { position: "absolute", top: 0, left: 0, right: 0 });

      const applyNavProgress = (progress: number) => {
        const p = gsap.utils.clamp(0, 1, progress);
        const inset = p * SCROLL_INSET;
        gsap.set(header, { top: p * 12 });
        gsap.set(inner, {
          left: inset,
          right: inset,
          borderRadius: p * 36,
          background: `rgba(10,15,46,${p * 0.55})`,
          backdropFilter: p > 0.02 ? `blur(${p * 28}px) saturate(${100 + p * 80}%)` : "none",
          border: `1px solid rgba(27,85,224,${p * 0.2})`,
          boxShadow:
            p > 0.08
              ? `0 ${p * 8}px ${p * 32}px rgba(0,0,0,${p * 0.35}), inset 0 1px 0 rgba(255,255,255,${p * 0.08})`
              : "none"
        });
      };

      applyNavProgress(Math.min(1, window.scrollY / SCROLL_RANGE));

      ScrollTrigger.create({
        start: "top top",
        end: `+=${SCROLL_RANGE}`,
        scrub: 0.4,
        onUpdate: (self) => applyNavProgress(self.progress),
        onRefresh: (self) => applyNavProgress(self.progress)
      });
    },
    { scope: navRef }
  );

  useGSAP(
    () => {
      if (!menuOpen || prefersReducedMotion()) return;
      gsap.from(".mobile-nav-group", { opacity: 0, y: 16, stagger: 0.06, duration: 0.4, ease: ZEB_EASE });
    },
    { dependencies: [menuOpen] }
  );

  const closeMobile = () => {
    setMenuOpen(false);
    setMobileGroup(null);
  };

  return (
    <>
      <header ref={navRef} className="nav-header fixed left-0 right-0 top-0 z-50 h-[72px] w-full">
        <nav
          ref={innerRef}
          className="nav-inner border border-transparent will-change-[border-radius,box-shadow,left,right]"
        >
          <div className="flex h-[72px] w-full items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
            <Link href="/" className="nav-logo flex shrink-0 items-center">
              <Logo />
            </Link>

            <ul className="nav-menus hidden flex-1 items-center justify-center gap-0 lg:flex">
              {NAV_MENU_GROUPS.map((group) => (
                <NavDropdown key={group.id} group={group} openId={openId} setOpenId={setOpenId} />
              ))}
            </ul>

            <div className="flex items-center gap-2 sm:gap-3">
              <ul className="hidden lg:flex">
                <NavDropdown group={NAV_COMPANY} openId={openId} setOpenId={setOpenId} align="right" />
              </ul>
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
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#040812]/98 backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="absolute right-6 top-6 text-2xl text-[var(--text-on-dark)]"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="flex min-h-full flex-col px-6 pb-10 pt-20">
            <div className="flex flex-col gap-2">
              {NAV_ALL_GROUPS.map((group) => {
                const expanded = mobileGroup === group.id;
                return (
                  <div key={group.id} className="mobile-nav-group border-b border-[var(--border-dark)] pb-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left text-lg font-bold text-[var(--text-on-dark)]"
                      aria-expanded={expanded}
                      onClick={() => setMobileGroup(expanded ? null : group.id)}
                    >
                      {group.label}
                      <svg
                        className="h-5 w-5 shrink-0 text-[var(--text-muted-dark)] transition-transform"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth={1.75}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {expanded && (
                      <ul className="mb-2 space-y-1 pl-1">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <a
                              href={item.href}
                              className="mobile-nav-link block rounded-lg px-3 py-2.5 text-base text-[var(--text-muted-dark)] hover:bg-white/5 hover:text-[var(--cyan)]"
                              onClick={closeMobile}
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
            <a
              href={`${APP_URL}/signup`}
              className="btn-primary mobile-nav-link mt-8 w-full justify-center text-center"
              onClick={closeMobile}
            >
              Get started
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
