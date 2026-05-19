"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "@/components/ui/section-header";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

export function AppDownload() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".app-phone-mockup", { y: -16, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" });
        gsap.to(".qr-scan-line", { y: 80, duration: 1.5, yoyo: true, repeat: -1, ease: "power1.inOut" });
      });
      gsap.from(".store-badge", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".app-download", start: "top 70%", once: true }
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="app-download px-6 py-20">
      <div className="container-zeb">
        <div className="grid items-center gap-10 rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <SectionHeader chip="Mobile app" title="Trade anywhere" subtitle="iOS & Android — full feature parity with web." center={false} />
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`${APP_URL}/app`} className="store-badge btn-primary">
                App Store
              </a>
              <a href={`${APP_URL}/app`} className="store-badge btn-outline">
                Google Play
              </a>
            </div>
          </div>
          <div className="app-phone-mockup relative mx-auto flex h-64 w-48 flex-col items-center justify-center overflow-hidden rounded-[2rem] border-[8px] border-[var(--navy)] bg-[var(--surface)] text-center text-sm text-[var(--text-muted)]">
            <span>Scan to download</span>
            <div className="relative mt-4 h-24 w-24 rounded-lg border border-[var(--border)] bg-white">
              <div className="qr-scan-line absolute left-0 right-0 top-0 h-0.5 bg-[var(--cyan)] opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
