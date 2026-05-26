"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { gsap, prefersReducedMotion, ZEB_EASE } from "@/lib/gsap";
import type { NavGroup } from "./nav-config";

const PANEL_GUTTER = 16;

type NavDropdownProps = {
  group: NavGroup;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  align?: "left" | "right";
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className="nav-dropdown-chevron ml-1 h-4 w-4 shrink-0 transition-transform"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavDropdown({ group, openId, setOpenId, align = "left" }: NavDropdownProps) {
  const uid = useId().replace(/:/g, "");
  const triggerId = `nav-trigger-${group.id}-${uid}`;
  const panelId = `nav-panel-${group.id}-${uid}`;
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = openId === group.id;

  // The parent .nav-inner has `overflow-hidden` (so the floating pill chrome
  // can never be escaped by other children). The dropdown therefore renders
  // as `position: fixed`, anchored to the trigger's bounding rect, so it can
  // still appear below the header without being clipped.
  const positionPanel = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const r = trigger.getBoundingClientRect();
    const panelWidth = panel.offsetWidth;
    const viewport = window.innerWidth;
    const top = r.bottom + 8;
    let left = align === "right" ? r.right - panelWidth : r.left;
    const maxLeft = Math.max(PANEL_GUTTER, viewport - panelWidth - PANEL_GUTTER);
    left = Math.max(PANEL_GUTTER, Math.min(left, maxLeft));
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
  }, [align]);

  const close = useCallback(() => {
    const panel = panelRef.current;
    if (!panel || !isOpen) return;

    if (prefersReducedMotion()) {
      panel.style.display = "none";
      setOpenId(null);
      return;
    }

    gsap.to(panel, {
      opacity: 0,
      y: -8,
      scale: 0.98,
      duration: 0.22,
      ease: ZEB_EASE,
      onComplete: () => {
        panel.style.display = "none";
        setOpenId(null);
      }
    });
  }, [isOpen, setOpenId]);

  const open = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    panel.style.display = "block";
    positionPanel();
    setOpenId(group.id);

    if (prefersReducedMotion()) {
      gsap.set(panel, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.fromTo(
      panel,
      { opacity: 0, y: -8, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: ZEB_EASE }
    );
  }, [group.id, positionPanel, setOpenId]);

  const toggle = useCallback(() => {
    if (isOpen) close();
    else open();
  }, [close, isOpen, open]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onReposition = () => positionPanel();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition);
    };
  }, [close, isOpen, positionPanel]);

  useEffect(() => {
    if (openId !== group.id && panelRef.current) {
      panelRef.current.style.display = "none";
      gsap.set(panelRef.current, { clearProps: "opacity,y,scale" });
    }
  }, [group.id, openId]);

  return (
    <li ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        className="nav-dropdown-trigger flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)]"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        {group.label}
        <Chevron open={isOpen} />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        role="menu"
        aria-labelledby={triggerId}
        className="nav-dropdown-panel fixed z-[60] min-w-[220px] overflow-hidden rounded-2xl border border-[var(--border)] py-2 backdrop-blur-[20px]"
        style={{
          display: "none",
          background: "rgba(var(--nav-bg-rgb), 0.92)",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <ul>
          {group.items.map((item) => (
            <li key={item.label} role="none">
              <a
                href={item.href}
                role="menuitem"
                className="block px-4 py-2.5 text-sm text-[var(--fg-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--brand)]"
                onClick={() => close()}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
