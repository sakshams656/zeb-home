"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion, ZEB_EASE } from "@/lib/gsap";
import type { NavGroup } from "./nav-config";

const PANEL_GUTTER = 16;
const HOVER_CLOSE_DELAY = 180;

type NavMenuBarProps = {
  groups: ReadonlyArray<NavGroup>;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  align?: "left" | "right";
  className?: string;
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
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Rect = { left: number; right: number; bottom: number };

export function NavMenuBar({
  groups,
  openId,
  setOpenId,
  align = "left",
  className
}: NavMenuBarProps) {
  const uid = useId().replace(/:/g, "");
  const panelId = `nav-mega-panel-${uid}`;
  const triggerIdFor = (groupId: string) => `nav-trigger-${uid}-${groupId}`;

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);
  const prevOpenIdRef = useRef<string | null>(null);

  const [activeRect, setActiveRect] = useState<Rect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only this bar owns a panel when one of its groups is the active one.
  const isMyGroupOpen = openId !== null && groups.some((g) => g.id === openId);
  const activeGroup = isMyGroupOpen
    ? groups.find((g) => g.id === openId) ?? null
    : null;

  const measureFor = useCallback((groupId: string): Rect | null => {
    const el = triggerRefs.current[groupId];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, bottom: r.bottom };
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpenId(null);
    }, HOVER_CLOSE_DELAY);
  }, [cancelClose, setOpenId]);

  const openGroup = useCallback(
    (group: NavGroup) => {
      cancelClose();
      const rect = measureFor(group.id);
      if (rect) setActiveRect(rect);
      setOpenId(group.id);
    },
    [cancelClose, measureFor, setOpenId]
  );

  const closeNow = useCallback(() => {
    cancelClose();
    setOpenId(null);
  }, [cancelClose, setOpenId]);

  // Refresh activeRect whenever this bar's active group changes (so the panel
  // anchors to the correct trigger immediately, before the FLIP animation).
  useLayoutEffect(() => {
    if (!isMyGroupOpen || !openId) return;
    const rect = measureFor(openId);
    if (rect) setActiveRect(rect);
  }, [isMyGroupOpen, openId, measureFor]);

  // Keep panel anchored on resize / scroll.
  useEffect(() => {
    if (!isMyGroupOpen || !openId) return;
    const update = () => {
      const rect = measureFor(openId);
      if (rect) setActiveRect(rect);
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [isMyGroupOpen, openId, measureFor]);

  // Click-outside + Escape (only while this bar's panel is the active one).
  useEffect(() => {
    if (!isMyGroupOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      const insideTrigger = Object.values(triggerRefs.current).some((el) =>
        el?.contains(target)
      );
      if (insideTrigger) return;
      closeNow();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMyGroupOpen, closeNow]);

  // Drive the panel: fresh-open (fade + scale), shift (animate top/left to
  // new trigger while keeping panel visible), reposition (instant during
  // scroll/resize), and close (fade + scale out, then display:none).
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const groupChanged = prevOpenIdRef.current !== openId;
    prevOpenIdRef.current = openId;

    // Close path (we lost the active group, or another bar took it).
    if (!isMyGroupOpen || !activeRect) {
      if (!wasOpenRef.current) return;
      if (prefersReducedMotion()) {
        panel.style.display = "none";
        wasOpenRef.current = false;
        return;
      }
      gsap.to(panel, {
        opacity: 0,
        y: -8,
        scale: 0.96,
        duration: 0.22,
        ease: ZEB_EASE,
        overwrite: "auto",
        onComplete: () => {
          panel.style.display = "none";
          wasOpenRef.current = false;
        }
      });
      return;
    }

    // Open / shift path.
    panel.style.display = "block";
    const panelWidth = panel.offsetWidth || 220;
    const viewport = window.innerWidth;
    const top = activeRect.bottom + 8;
    let left =
      align === "right" ? activeRect.right - panelWidth : activeRect.left;
    const maxLeft = Math.max(
      PANEL_GUTTER,
      viewport - panelWidth - PANEL_GUTTER
    );
    left = Math.max(PANEL_GUTTER, Math.min(left, maxLeft));

    if (prefersReducedMotion()) {
      gsap.set(panel, { top, left, opacity: 1, y: 0, scale: 1 });
      wasOpenRef.current = true;
      return;
    }

    if (wasOpenRef.current && groupChanged) {
      // Shift between triggers: animate position, keep panel visible.
      gsap.to(panel, {
        top,
        left,
        duration: 0.42,
        ease: ZEB_EASE,
        overwrite: "auto"
      });
      gsap.to(panel, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.24,
        ease: ZEB_EASE
      });
    } else if (wasOpenRef.current) {
      // Reposition only (scroll/resize) — instant, no animation.
      gsap.set(panel, { top, left });
    } else {
      // Fresh open: gentle drop-and-expand from the trigger.
      gsap.set(panel, { top, left, transformOrigin: "top center" });
      gsap.fromTo(
        panel,
        { opacity: 0, y: -14, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: ZEB_EASE,
          clearProps: "transform"
        }
      );
      wasOpenRef.current = true;
    }
  }, [isMyGroupOpen, openId, activeRect, align]);

  // Cleanup the close timer on unmount.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <ul className={className}>
        {groups.map((group) => {
          const isOpen = openId === group.id;
          return (
            <li key={group.id} className="relative">
              <button
                ref={(el) => {
                  triggerRefs.current[group.id] = el;
                }}
                type="button"
                id={triggerIdFor(group.id)}
                className="nav-dropdown-trigger flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls={panelId}
                onMouseEnter={() => openGroup(group)}
                onMouseLeave={scheduleClose}
                onFocus={() => openGroup(group)}
                onBlur={scheduleClose}
                onClick={() => {
                  if (isOpen) closeNow();
                  else openGroup(group);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (isOpen) closeNow();
                    else openGroup(group);
                  }
                }}
              >
                {group.label}
                <Chevron open={isOpen} />
              </button>
            </li>
          );
        })}
      </ul>

      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="menu"
            aria-labelledby={
              activeGroup ? triggerIdFor(activeGroup.id) : undefined
            }
            className="nav-dropdown-panel fixed z-[60] min-w-[220px] rounded-2xl border border-[var(--border)] p-2"
            style={{
              display: "none",
              background: "rgba(var(--nav-bg-rgb), 0.92)",
              boxShadow:
                "var(--shadow-lg), inset 0 1px 0 rgba(var(--nav-inset-rgb), 0.08)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              backdropFilter: "blur(24px) saturate(180%)"
            }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <ul>
              {activeGroup?.items.map((item) => (
                <li key={item.label} role="none">
                  <a
                    href={item.href}
                    role="menuitem"
                    className="block rounded-xl px-4 py-3 text-center text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--brand)]"
                    onClick={closeNow}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}
