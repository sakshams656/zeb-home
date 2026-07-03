"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/ui/section";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";
import { ROUTES } from "@/lib/routes";

const FEATURES = [
  {
    id: "custom-fees",
    title: "Custom fees",
    body: "Flexible fee structures designed for high-value portfolios.",
    Icon: IconCustomFees
  },
  {
    id: "personalised-rm",
    title: "Personalised RM",
    body: "A dedicated relationship manager focused on your goals.",
    Icon: IconPersonalisedRm
  },
  {
    id: "tax-filing",
    title: "Tax filing assistance",
    body: "Simplified crypto tax reporting with expert guidance.",
    Icon: IconTaxFiling
  },
  {
    id: "help-desk",
    title: "24×7 help desk",
    body: "Round-the-clock priority support for uninterrupted trading.",
    Icon: IconHelpDesk
  },
  {
    id: "secure-custody",
    title: "Secure custodies",
    body: "Partnership with trusted platforms to offer secure custody.",
    Icon: IconSecureCustody
  }
] as const;

function IconCustomFees({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden>
      <path
        d="M8 4h8l2 4v12H6V4h2z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d="M9 9h6M9 13h4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      <path
        d="M16 3l1.2 2.4 2.6.4-1.9 1.8.5 2.6L16 8.8l-2.4 1.3.5-2.6-1.9-1.8 2.6-.4L16 3z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconPersonalisedRm({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden>
      <circle cx={9} cy={8} r={3} stroke="currentColor" strokeWidth={1.75} />
      <path
        d="M4 20c0-3 2.2-5 5-5s5 2 5 5"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <circle cx={17} cy={9} r={2.25} stroke="currentColor" strokeWidth={1.75} />
      <path d="M14 20c.4-2 1.8-3.5 4-3.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      <path d="M19 7v4M21 9h-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}

function IconTaxFiling({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden>
      <path
        d="M7 3h10l3 3v15H4V3h3z"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      <path d="M8 3v4h11" stroke="currentColor" strokeWidth={1.75} />
      <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconHelpDesk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden>
      <path
        d="M4 11a8 8 0 0116 0v3a2 2 0 01-2 2h-1v-3l2-1"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 19h3M12 19h4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      <circle cx={18} cy={6} r={2.5} stroke="currentColor" strokeWidth={1.5} />
      <path d="M18 4v1M18 7v1M16.5 6h1M18.5 6h1" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" />
    </svg>
  );
}

function IconSecureCustody({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" className={className} aria-hidden>
      <rect x={5} y={11} width={14} height={10} rx={2} stroke="currentColor" strokeWidth={1.75} />
      <path
        d="M8 11V8a4 4 0 018 0v3"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <circle cx={12} cy={16} r={1.25} fill="currentColor" />
    </svg>
  );
}

export function HniInstitutionalSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.fromTo(
        ref.current.querySelectorAll(".hni-alpha-reveal"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.6,
          ease: ZEB_EASE,
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    },
    { scope: ref }
  );

  return (
    <Section ref={ref} id="hni-institutional" className="hni-section scroll-mt-24" aria-labelledby="hni-heading">
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] px-4 py-14 sm:px-8 sm:py-16 lg:py-20">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="hni-alpha-reveal text-sm font-bold uppercase tracking-widest text-[var(--fg-subtle)]">
            Institutional
          </p>

          <div className="hni-alpha-reveal mt-4 flex flex-col items-center">
            <div className="relative flex items-center justify-center gap-2">
              <Image
                src="/zebpay-mark-blue.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 object-contain dark:hidden sm:h-12 sm:w-12"
                aria-hidden
              />
              <Image
                src="/zebpay-mark.png"
                alt=""
                width={48}
                height={48}
                className="hidden h-10 w-10 object-contain dark:block sm:h-12 sm:w-12"
                aria-hidden
              />
              <p className="text-[clamp(2.5rem,8vw,4rem)] font-black leading-none tracking-tight text-[var(--fg)]">
                Pro
              </p>
            </div>
          </div>

          <h2
            id="hni-heading"
            className="hni-alpha-reveal mt-6 text-[clamp(1.35rem,4.5vw,2.35rem)] font-black leading-snug tracking-tight text-[var(--fg)]"
          >
            Designed for long-term capital for
            <br />
            HNIs &amp; Institutional Investors
          </h2>

          <p className="hni-alpha-reveal mx-auto mt-4 max-w-xl text-sm text-[var(--fg-muted)] sm:text-base">
            Tailored solutions for HNIs and institutions managing large portfolios.
          </p>

          <Link
            href={ROUTES.business.hni}
            className="hni-alpha-reveal btn-primary mt-8 sm:px-8 sm:text-base"
          >
            Start your crypto journey
            <span aria-hidden className="text-lg leading-none">
              →
            </span>
          </Link>
        </div>

        {/* Five features */}
        <ul className="mt-14 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-10 lg:mt-20 lg:grid-cols-5 lg:gap-6">
          {FEATURES.map(({ id, title, body, Icon }) => (
            <li key={id} className="hni-alpha-reveal flex flex-col items-center text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--brand-tint-border)] bg-[var(--brand-tint)] text-[var(--brand)]">
                <Icon />
              </span>
              <h3 className="mt-4 text-base font-bold text-[var(--fg)] sm:text-lg">{title}</h3>
              <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-[var(--fg-muted)] sm:text-sm">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
