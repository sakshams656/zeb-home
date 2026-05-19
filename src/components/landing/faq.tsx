"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const FAQS = [
  { q: "Is ZebPay safe and regulated?", a: "Yes. ZebPay is FIU-IND registered, ISO 27001 certified, and holds SOC 2 Type II. 98% of assets are in cold storage with insurance coverage." },
  { q: "What is RMS?", a: "Risk Management System auto-applies take-profit and stop-loss on futures positions so you never miss exit levels." },
  { q: "Can I use sub accounts?", a: "Yes. Split capital across trading, earn, and API/bot wallets with separate API keys per sub-account." },
  { q: "When will options launch?", a: "Options on majors are coming soon. Join the waitlist in-app for early access." },
  { q: "What fees does ZebPay charge?", a: "Spot maker/taker from 0.10% / 0.15%. Futures fees are competitive with up to 25x leverage on majors." }
];

function toggleFAQ(item: HTMLElement) {
  const body = item.querySelector(".faq-body") as HTMLElement;
  const chevron = item.querySelector(".faq-chevron") as HTMLElement;
  const isOpen = item.classList.contains("open");

  if (isOpen) {
    gsap.to(body, { height: 0, duration: 0.35, ease: "power2.inOut" });
    gsap.to(chevron, { rotate: 0, duration: 0.3 });
  } else {
    document.querySelectorAll(".faq-item.open").forEach((other) => {
      if (other !== item) toggleFAQ(other as HTMLElement);
    });
    gsap.set(body, { height: "auto" });
    const h = body.offsetHeight;
    gsap.fromTo(body, { height: 0 }, { height: h, duration: 0.4, ease: "power2.out" });
    gsap.to(chevron, { rotate: 180, duration: 0.3 });
  }
  item.classList.toggle("open");
}

export function Faq() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      ref.current.querySelectorAll(".faq-body").forEach((body) => {
        gsap.set(body, { height: 0, overflow: "hidden" });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="px-6 py-20">
      <div className="container-zeb max-w-3xl">
        <SectionHeader chip="FAQ" title="Common questions" />
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`faq-item rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden ${i === 0 ? "" : ""}`}>
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left font-bold text-[var(--text)]"
                onClick={(e) => toggleFAQ((e.currentTarget as HTMLElement).closest(".faq-item")!)}
                aria-expanded={i === 0}
              >
                {f.q}
                <span className="faq-chevron text-[var(--cyan)]">▼</span>
              </button>
              <div className="faq-body border-t border-[var(--border)]">
                <p className="px-4 pb-4 text-sm text-[var(--text-muted)]">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
