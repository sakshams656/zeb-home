"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const FAQS = [
  {
    q: "What trading options does ZebPay offer?",
    a: "ZebPay enables users to buy, sell, and trade a wide range of crypto assets through an intuitive platform designed for smooth and efficient execution."
  },
  {
    q: "Is ZebPay suitable for beginners?",
    a: "Yes. ZebPay is built to be easy to navigate, making it accessible for new users while still offering depth for those looking to explore crypto further."
  },
  {
    q: "Does ZebPay offer advanced trading features?",
    a: "ZebPay provides features that support more experienced users, including detailed market views and tools that help track trades and activity with clarity."
  },
  {
    q: "How can users track their crypto portfolio on ZebPay?",
    a: "Users can monitor their holdings, view profit and loss, check individual asset performance, and access transaction history through the portfolio feature."
  },
  {
    q: "Are there earning options available on ZebPay?",
    a: "Yes. ZebPay offers options that allow users to earn on their crypto holdings, helping them make more of their assets over time."
  },
  {
    q: "How does ZebPay approach platform security?",
    a: "ZebPay follows a security-first approach, implementing strong safeguards and best practices to help protect user accounts and assets in an evolving digital environment."
  }
] as const;

function HelpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx={12} cy={12} r={9} />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
      <circle cx={12} cy={17} r={0.6} fill="currentColor" />
    </svg>
  );
}

type RowProps = {
  item: (typeof FAQS)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
};

function FaqRow({ item, index, open, onToggle }: RowProps) {
  return (
    <li
      className={`faq-card relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors ${
        open
          ? "is-open border-[color:var(--brand)]/40 bg-[var(--bg-elevated)] shadow-[0_18px_60px_-30px_rgba(var(--brand-rgb),0.7)]"
          : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-strong)]"
      }`}
    >
      <span
        aria-hidden
        className="faq-glow-ring pointer-events-none absolute inset-0 rounded-2xl opacity-0"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(var(--brand-rgb), 0.18) 0%, transparent 70%)",
          opacity: open ? 1 : 0
        }}
      />
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-body-${index}`}
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
      >
        <span className="text-base font-semibold text-[var(--fg)] sm:text-lg">{item.q}</span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
            open
              ? "border-[color:var(--brand)]/60 bg-[color:var(--brand)]/15 text-[var(--brand)]"
              : "border-[var(--border)] bg-[var(--surface)] text-[var(--fg-muted)]"
          }`}
        >
          <span className="relative block h-3 w-3">
            <span className="absolute left-0 top-1/2 h-[2px] w-3 -translate-y-1/2 rounded-full bg-current" />
            <span className="faq-bar-v absolute left-1/2 top-0 h-3 w-[2px] -translate-x-1/2 rounded-full bg-current" />
          </span>
        </span>
      </button>
      <div
        id={`faq-body-${index}`}
        className="faq-body relative"
        style={{ height: 0, overflow: "hidden" }}
      >
        <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--fg-muted)] sm:px-6 sm:pb-6">
          {item.a}
        </p>
      </div>
    </li>
  );
}

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useGSAP(
    () => {
      if (!ref.current) return;
      const cards = gsap.utils.toArray<HTMLElement>(".faq-card", ref.current);
      const reduced = prefersReducedMotion();

      cards.forEach((card, i) => {
        const body = card.querySelector<HTMLElement>(".faq-body");
        const bar = card.querySelector<HTMLElement>(".faq-bar-v");
        if (!body || !bar) return;
        const isOpen = i === openIdx;

        if (reduced) {
          gsap.set(body, { height: isOpen ? "auto" : 0 });
          gsap.set(bar, { rotate: isOpen ? 90 : 0 });
        } else {
          gsap.to(body, {
            height: isOpen ? body.scrollHeight : 0,
            duration: 0.45,
            ease: "expo.out",
            overwrite: true
          });
          gsap.to(bar, {
            rotate: isOpen ? 90 : 0,
            duration: 0.35,
            ease: "power3.out",
            overwrite: true
          });
        }
      });
    },
    { dependencies: [openIdx], scope: ref }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      gsap.fromTo(
        ref.current.querySelectorAll(".faq-eyebrow, .faq-heading, .faq-sub"),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.55,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );

      gsap.fromTo(
        ref.current.querySelectorAll(".faq-card"),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      className="faq-section relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:py-24"
    >
      <div
        aria-hidden
        className="faq-grid pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto max-w-[820px] text-center">
        <span className="faq-eyebrow inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
          <HelpIcon /> FAQ
        </span>
        <h2 className="faq-heading mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[1.05] text-[var(--fg)]">
          Frequently Asked Questions
        </h2>
        <p className="faq-sub mt-3 text-sm text-[var(--fg-muted)] sm:text-base">
          Quick answers about ZebPay&apos;s products, security and fees.
        </p>
      </div>
      <ul className="relative mx-auto mt-10 flex max-w-[760px] flex-col gap-3">
        {FAQS.map((f, i) => (
          <FaqRow
            key={f.q}
            item={f}
            index={i}
            open={openIdx === i}
            onToggle={() => setOpenIdx((prev) => (prev === i ? null : i))}
          />
        ))}
      </ul>
    </section>
  );
}
