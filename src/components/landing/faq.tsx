"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const FAQS = [
  { q: "Is ZebPay regulated?", a: "Yes. ZebPay is registered with FIU-IND and complies with Indian AML and KYC regulations." },
  { q: "How secure is my crypto?", a: "98% of assets are held in cold storage with multi-sig wallets and insurance coverage." },
  { q: "What is the minimum SIP amount?", a: "You can start a SIP from ₹100 per installment on supported assets." },
  { q: "What are ZebPay's trading fees?", a: "Spot maker/taker from 0.10% / 0.15%. Futures fees are competitive with volume discounts." },
  { q: "Can I use sub accounts?", a: "Yes. Isolate trading, earn, and API strategies with separate wallets and API keys." },
  { q: "When will options launch?", a: "INR-settled options on majors are coming soon. Join the waitlist in-app." }
];

function toggleItem(item: HTMLElement) {
  const body = item.querySelector(".faq-body") as HTMLElement;
  const icon = item.querySelector(".faq-icon") as HTMLElement;
  const open = item.classList.contains("open");

  if (open) {
    gsap.to(body, { height: 0, duration: 0.35, ease: "power2.inOut" });
    gsap.to(icon, { rotate: 0, duration: 0.25 });
    gsap.to(item, { backgroundColor: "transparent", duration: 0.25 });
  } else {
    document.querySelectorAll(".faq-item.open").forEach((el) => {
      if (el !== item) toggleItem(el as HTMLElement);
    });
    gsap.set(body, { height: "auto" });
    const h = body.offsetHeight;
    gsap.fromTo(body, { height: 0 }, { height: h, duration: 0.4, ease: "power2.out" });
    gsap.to(icon, { rotate: 45, duration: 0.25 });
    gsap.to(item, { backgroundColor: "rgba(255,255,255,0.03)", duration: 0.25 });
  }
  item.classList.toggle("open");
}

export function Faq() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      ref.current.querySelectorAll(".faq-body").forEach((b) => gsap.set(b, { height: 0, overflow: "hidden" }));
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-[#040812] px-6 py-[120px]">
      <div className="mx-auto max-w-[800px]">
        <h2 className="mb-12 text-[clamp(2rem,4vw,3rem)] font-black text-[var(--text-on-dark)]">Questions</h2>
        {FAQS.map((f) => (
          <div key={f.q} className="faq-item border-b border-[var(--border-dark)]">
            <button
              type="button"
              className="flex w-full items-center justify-between py-6 text-left text-lg font-bold text-[var(--text-on-dark)]"
              onClick={(e) => toggleItem((e.currentTarget as HTMLElement).closest(".faq-item")!)}
            >
              {f.q}
              <span className="faq-icon text-2xl text-[var(--cyan)]">+</span>
            </button>
            <div className="faq-body">
              <p className="pb-6 text-[var(--text-muted-dark)]">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
