"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";

const FAQS = [
  { q: "Is ZebPay safe and regulated?", a: "Yes. ZebPay is FIU-IND registered, ISO 27001 certified, and holds SOC 2 Type II. 98% of assets are in cold storage with insurance coverage." },
  { q: "What is RMS?", a: "Risk Management System auto-applies take-profit and stop-loss on futures positions so you never miss exit levels." },
  { q: "Can I use sub accounts?", a: "Yes. Split capital across trading, earn, and API/bot wallets with separate API keys per sub-account." },
  { q: "When will options launch?", a: "Options on majors are coming soon. Join the waitlist in-app for early access." },
  { q: "What fees does ZebPay charge?", a: "Spot maker/taker from 0.10% / 0.15%. Futures fees are competitive with up to 25x leverage on majors." }
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-20">
      <div className="container-zeb max-w-3xl">
        <SectionHeader chip="FAQ" title="Common questions" />
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between p-4 text-left font-bold text-[var(--text)]"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {f.q}
                <span className="text-[var(--cyan)]">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p className="border-t border-[var(--border)] px-4 pb-4 text-sm text-[var(--text-muted)]">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
