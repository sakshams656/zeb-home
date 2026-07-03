"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FeatureFaq({ items, id = "feature-faq" }: { items: FaqItem[]; id?: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <li
            key={item.q}
            className={`rounded-2xl border transition-colors ${
              open
                ? "border-[var(--brand-tint-border)] bg-[var(--surface)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"
            }`}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-body-${i}`}
              onClick={() => setOpenIdx(open ? null : i)}
              className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
            >
              <span className="text-base font-semibold text-[var(--fg)]">{item.q}</span>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-lg leading-none ${
                  open
                ? "border-[var(--brand-tint-border)] text-[var(--brand)]"
                    : "border-[var(--border)] text-[var(--fg-muted)]"
                }`}
                aria-hidden
              >
                {open ? "−" : "+"}
              </span>
            </button>
            <div
              id={`${id}-body-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--fg-muted)] sm:px-6 sm:pb-6">
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
