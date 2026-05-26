"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { Logo } from "./logo";
import { NAV_ALL_GROUPS, NAV_COMPANY, NAV_MENU_GROUPS } from "./nav-config";
import { NavMenuBar } from "./nav-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { LINKS } from "@/lib/links";

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

      // lint-allow: unguarded-gsap-pixel-layout — initial pin at 0/0/0 only
      // establishes the absolute origin; the per-viewport pill animation is
      // gated through gsap.matchMedia below.
      gsap.set(inner, { position: "absolute", top: 0, left: 0, right: 0 });

      const mm = gsap.matchMedia();

      // <640px: flat full-bleed header. No insets / radius / border — just a
      // translucent backdrop on scroll. Pixel-layout writes here would shrink
      // the pill below the natural width of [logo | toggle | hamburger] and
      // push the hamburger past the rounded right edge (bug fix).
      mm.add("(max-width: 639px)", () => {
        const applyMobileProgress = (progress: number) => {
          const p = gsap.utils.clamp(0, 1, progress);
          gsap.set(inner, {
            background: `rgba(var(--nav-bg-rgb), ${p * 0.55})`,
            backdropFilter: p > 0.02 ? `blur(${p * 18}px) saturate(${100 + p * 60}%)` : "none",
            boxShadow:
              p > 0.08
                ? `0 ${p * 6}px ${p * 18}px rgba(var(--nav-shadow-rgb), ${p * 0.25})`
                : "none"
          });
        };

        applyMobileProgress(Math.min(1, window.scrollY / SCROLL_RANGE));

        const st = ScrollTrigger.create({
          start: "top top",
          end: `+=${SCROLL_RANGE}`,
          scrub: 0.4,
          onUpdate: (self) => applyMobileProgress(self.progress),
          onRefresh: (self) => applyMobileProgress(self.progress)
        });

        return () => {
          st.kill();
          gsap.set(inner, { clearProps: "background,backdropFilter,boxShadow" });
        };
      });

      // >=640px: full floating-pill effect with insets, radius, border, shadow.
      mm.add("(min-width: 640px)", () => {
        const applyDesktopProgress = (progress: number) => {
          const p = gsap.utils.clamp(0, 1, progress);
          const inset = p * SCROLL_INSET;
          gsap.set(header, { top: p * 12 });
          gsap.set(inner, {
            left: inset,
            right: inset,
            borderRadius: p * 36,
            background: `rgba(var(--nav-bg-rgb), ${p * 0.55})`,
            backdropFilter: p > 0.02 ? `blur(${p * 28}px) saturate(${100 + p * 80}%)` : "none",
            border: `1px solid rgba(var(--nav-tint-rgb), ${p * 0.2})`,
            boxShadow:
              p > 0.08
                ? `0 ${p * 8}px ${p * 32}px rgba(var(--nav-shadow-rgb), ${p * 0.35}), inset 0 1px 0 rgba(var(--nav-inset-rgb), ${p * 0.08})`
                : "none"
          });
        };

        applyDesktopProgress(Math.min(1, window.scrollY / SCROLL_RANGE));

        const st = ScrollTrigger.create({
          start: "top top",
          end: `+=${SCROLL_RANGE}`,
          scrub: 0.4,
          onUpdate: (self) => applyDesktopProgress(self.progress),
          onRefresh: (self) => applyDesktopProgress(self.progress)
        });

        return () => {
          st.kill();
          gsap.set(header, { clearProps: "top" });
          gsap.set(inner, {
            clearProps: "left,right,borderRadius,background,backdropFilter,border,boxShadow"
          });
        };
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
          className="nav-inner overflow-hidden border border-transparent will-change-[border-radius,box-shadow,left,right]"
        >
          <div className="flex h-[72px] w-full items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
            <Link href="/" className="nav-logo flex shrink-0 items-center">
              <Logo priority className="h-auto w-[110px] sm:w-[140px] lg:w-[180px]" />
            </Link>

            <NavMenuBar
              groups={NAV_MENU_GROUPS}
              openId={openId}
              setOpenId={setOpenId}
              className="nav-menus hidden flex-1 items-center justify-center gap-0 lg:flex"
            />

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <NavMenuBar
                groups={[NAV_COMPANY]}
                openId={openId}
                setOpenId={setOpenId}
                align="right"
                className="hidden lg:flex"
              />
              <ThemeToggle />
              <a
                href={LINKS.getStarted}
                className="btn-primary hidden whitespace-nowrap text-sm lg:inline-flex"
              >
                Get started
              </a>
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] lg:hidden"
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
        <div
          className="fixed inset-0 z-[60] overflow-y-auto backdrop-blur-md lg:hidden"
          style={{ background: "rgba(var(--nav-bg-rgb), 0.98)" }}
        >
          <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg text-2xl leading-none text-[var(--fg)] hover:bg-[var(--surface)]"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="flex min-h-full flex-col px-6 pb-10 pt-20">
            <div className="flex flex-col gap-2">
              {NAV_ALL_GROUPS.map((group) => {
                const expanded = mobileGroup === group.id;
                return (
                  <div key={group.id} className="mobile-nav-group border-b border-[var(--border)] pb-2">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left text-lg font-bold text-[var(--fg)]"
                      aria-expanded={expanded}
                      onClick={() => setMobileGroup(expanded ? null : group.id)}
                    >
                      {group.label}
                      <svg
                        className="h-5 w-5 shrink-0 text-[var(--fg-muted)] transition-transform"
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
                              className="mobile-nav-link block min-h-11 rounded-lg px-3 py-3 text-base text-[var(--fg-muted)] hover:bg-[var(--surface)] hover:text-[var(--brand)]"
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
              href={LINKS.getStarted}
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
