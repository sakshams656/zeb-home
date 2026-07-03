"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import type { NavGroup } from "./nav-config";

const HOVER_CLOSE_DELAY = 160;

type NavMenuBarProps = {
  groups: ReadonlyArray<NavGroup>;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  className?: string;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className="ml-1 h-4 w-4 shrink-0 transition-transform duration-200"
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

function DropdownPanel({
  group,
  panelId,
  onClose,
  onCancelClose,
  onScheduleClose
}: {
  group: NavGroup;
  panelId: string;
  onClose: () => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
}) {
  return (
    <div
      id={panelId}
      role="menu"
      onMouseEnter={onCancelClose}
      onMouseLeave={onScheduleClose}
      className={`absolute left-1/2 top-full z-[70] mt-1 -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-2 shadow-[var(--shadow-lg)] ${
        group.sections ? "w-[min(26rem,calc(100vw-2rem))]" : "min-w-[12rem]"
      }`}
    >
      {group.sections ? (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {group.sections.map((section) => (
            <div key={section.title} className="min-w-0">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                {section.title}
              </p>
              <ul>
                {section.items.map((item) => (
                  <li key={item.label} role="none">
                    <a
                      href={item.href}
                      role="menuitem"
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--brand)]"
                      onClick={onClose}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <ul>
          {group.items?.map((item) => (
            <li key={item.label} role="none">
              <a
                href={item.href}
                role="menuitem"
                className="block rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--brand)]"
                onClick={onClose}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NavMenuBar({ groups, openId, setOpenId, className }: NavMenuBarProps) {
  const uid = useId().replace(/:/g, "");
  const barRef = useRef<HTMLUListElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const panelIdFor = (groupId: string) => `nav-panel-${uid}-${groupId}`;
  const triggerIdFor = (groupId: string) => `nav-trigger-${uid}-${groupId}`;

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setOpenId(null), HOVER_CLOSE_DELAY);
  }, [cancelClose, setOpenId]);

  const openGroup = useCallback(
    (groupId: string) => {
      cancelClose();
      setOpenId(groupId);
    },
    [cancelClose, setOpenId]
  );

  const close = useCallback(() => {
    cancelClose();
    setOpenId(null);
  }, [cancelClose, setOpenId]);

  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (e: MouseEvent) => {
      if (barRef.current?.contains(e.target as Node)) return;
      close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openId, close]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <ul ref={barRef} className={className}>
      {groups.map((group) => {
        const isOpen = openId === group.id;
        const panelId = panelIdFor(group.id);
        return (
          <li
            key={group.id}
            className="relative"
            onMouseEnter={() => openGroup(group.id)}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              id={triggerIdFor(group.id)}
              className="nav-dropdown-trigger flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              aria-controls={panelId}
              onFocus={() => openGroup(group.id)}
              onBlur={scheduleClose}
              onClick={() => setOpenId(isOpen ? null : group.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenId(isOpen ? null : group.id);
                }
              }}
            >
              {group.label}
              <Chevron open={isOpen} />
            </button>
            {isOpen ? (
              <DropdownPanel
                group={group}
                panelId={panelId}
                onClose={close}
                onCancelClose={cancelClose}
                onScheduleClose={scheduleClose}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
