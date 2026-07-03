"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { NAV_ALL_GROUPS, NAV_MENU_GROUPS, navGroupEntries } from "./nav-config";
import { NavMenuBar } from "./nav-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { LINKS } from "@/lib/links";

const SCROLL_THRESHOLD = 12;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = () => {
    setMenuOpen(false);
    setMobileGroup(null);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const root = mobileMenuRef.current;
    if (!root) return;

    const focusable = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobile();
        return;
      }
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`nav-header fixed left-0 right-0 top-0 z-50 w-full overflow-visible transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-[var(--bg)] shadow-[var(--shadow)]"
            : "bg-transparent shadow-none"
        }`}
      >
        <nav className="overflow-visible">
          <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
            <Link href="/" className="nav-logo flex shrink-0 items-center">
              <Logo priority className="h-auto w-[100px] sm:w-[140px] lg:w-[180px]" />
            </Link>

            <NavMenuBar
              groups={NAV_MENU_GROUPS}
              openId={openId}
              setOpenId={setOpenId}
              className="nav-menus hidden flex-1 items-center justify-center gap-1 overflow-visible lg:flex"
            />

            <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <a
                href={LINKS.login}
                className="btn-outline hidden whitespace-nowrap text-sm lg:inline-flex"
              >
                Login
              </a>
              <a
                href={LINKS.createAccount}
                className="btn-primary hidden whitespace-nowrap text-sm lg:inline-flex"
              >
                Create account
              </a>
              <button
                ref={menuButtonRef}
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-xl leading-none text-[var(--fg)] lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                ☰
              </button>
            </div>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[var(--bg)] lg:hidden"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between bg-[var(--bg)] px-4 py-3">
            <Link href="/" className="flex shrink-0 items-center" onClick={closeMobile}>
              <Logo className="h-auto w-[100px]" />
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-xl leading-none text-[var(--fg)]"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          <nav className="flex flex-col px-4 pb-10 pt-2">
            <div className="flex flex-col">
              {NAV_ALL_GROUPS.map((group) => {
                const expanded = mobileGroup === group.id;
                return (
                  <div key={group.id} className="border-b border-[var(--border)]">
                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center justify-between py-3 text-left text-base font-bold text-[var(--fg)]"
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
                    {expanded ? (
                      <div className="pb-3">
                        {group.sections
                          ? group.sections.map((section) => (
                              <div key={section.title} className="mt-1">
                                <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--fg-subtle)]">
                                  {section.title}
                                </p>
                                <ul>
                                  {section.items.map((item) => (
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
                              </div>
                            ))
                          : (
                              <ul>
                                {navGroupEntries(group).map((item) => (
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
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={LINKS.createAccount}
                className="btn-primary mobile-nav-link w-full justify-center text-center"
                onClick={closeMobile}
              >
                Create account
              </a>
              <a
                href={LINKS.login}
                className="btn-outline mobile-nav-link w-full justify-center text-center"
                onClick={closeMobile}
              >
                Login
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
