"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { PhoneFrame } from "@/components/ui/phone-frame";
import { ExchangeListScreen } from "@/components/phone-demo/exchange-list-screen";
import { gsap, ZEB_EASE, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

export function AppDownload() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (prefersReducedMotion() || !root) return;

      gsap.from(root.querySelector(".download-copy"), { x: -60, opacity: 0, duration: 0.8, ease: ZEB_EASE, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
      gsap.from(root.querySelector(".download-phone"), { x: 60, opacity: 0, duration: 0.8, ease: ZEB_EASE, scrollTrigger: { trigger: root, start: "top 70%", once: true } });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(root.querySelector(".download-phone"), { y: -18, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(root.querySelector(".qr-scan"), { y: 72, duration: 1.5, yoyo: true, repeat: -1, ease: "power1.inOut" });
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="app-download relative overflow-hidden bg-[var(--navy)] px-6 py-[120px]">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(var(--brand-rgb),0.14)_0%,transparent_70%)]" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[55%_45%]">
        <div className="download-copy">
          <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black leading-tight text-[var(--fg)]">
            Trade on
            <br />
            the go.
          </h2>
          <ul className="mt-8 space-y-3 text-[var(--fg-muted)]">
            <li>✓ 200+ crypto assets</li>
            <li>✓ Live charts & AI insights</li>
            <li>✓ SIP, Earn, CryptoPacks</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`${APP_URL}/app`} className="btn-primary">
              App Store
            </a>
            <a href={`${APP_URL}/app`} className="rounded-full border border-[var(--border)] px-6 py-3 font-bold text-[var(--fg)]">
              Play Store
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0.5 p-2 opacity-40">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span key={i} className="bg-[var(--navy)]" />
                ))}
              </div>
              <span className="qr-scan absolute left-0 right-0 top-0 h-0.5 bg-[var(--cyan)]" />
            </div>
            <p className="text-sm text-[var(--fg-muted)]">Scan to download</p>
          </div>
        </div>
        <div className="download-phone flex justify-center">
          <PhoneFrame tilt={12}>
            <ExchangeListScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}
