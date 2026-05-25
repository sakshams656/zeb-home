"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const FAQS = [
  {
    q: "Is ZebPay regulated?",
    a: "Yes. ZebPay is registered with FIU-IND and complies with Indian AML and KYC regulations."
  },
  {
    q: "How secure is my crypto?",
    a: "98% of assets are held in cold storage with multi-sig wallets and insurance coverage on hot wallet balances."
  },
  {
    q: "What is the minimum SIP amount?",
    a: "You can start a SIP from ₹100 per installment on supported assets and pause or resume any time."
  },
  {
    q: "What are ZebPay's trading fees?",
    a: "Spot maker/taker start at 0.10% / 0.15%. Futures fees are competitive with volume-based discounts."
  },
  {
    q: "Can I use sub accounts?",
    a: "Yes. Isolate trading, earn and API strategies with separate wallets, balances and API keys."
  },
  {
    q: "When will options launch?",
    a: "INR-settled options on majors are coming soon. Join the waitlist in-app to get early access."
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
          ? "is-open border-[color:var(--brand)]/40 bg-white/[0.035] shadow-[0_18px_60px_-30px_rgba(27,85,224,0.7)]"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14]"
      }`}
    >
      <span
        aria-hidden
        className="faq-glow-ring pointer-events-none absolute inset-0 rounded-2xl opacity-0"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(27, 85, 224, 0.18) 0%, transparent 70%)",
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
        <span className="text-base font-semibold text-white sm:text-lg">{item.q}</span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
            open
              ? "border-[color:var(--brand)]/60 bg-[color:var(--brand)]/15 text-white"
              : "border-white/[0.10] bg-white/[0.04] text-white/75"
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
        <p className="px-5 pb-5 text-sm leading-relaxed text-white/65 sm:px-6 sm:pb-6">
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
      className="faq-section relative overflow-hidden px-6 py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="faq-grid pointer-events-none absolute inset-0"
      />
      <div className="relative mx-auto max-w-[820px] text-center">
        <span className="faq-eyebrow inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
          <HelpIcon /> FAQ
        </span>
        <h2 className="faq-heading mt-4 text-[clamp(2.25rem,5vw,3.75rem)] font-black leading-[1.05] text-white">
          Frequently Asked Questions
        </h2>
        <p className="faq-sub mt-3 text-sm text-white/55 sm:text-base">
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
