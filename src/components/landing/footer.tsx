import Link from "next/link";
import { Logo } from "./logo";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zebpay.com";

const COLS = [
  {
    title: "Products",
    links: [
      { label: "Spot Trading", href: "#features" },
      { label: "Futures", href: "#features" },
      { label: "CryptoPacks", href: "#packs" },
      { label: "Earn", href: "#earn" },
      { label: "Options", href: "#features" }
    ]
  },
  {
    title: "Pro Tools",
    links: [
      { label: "AI Insights", href: "#pro" },
      { label: "Expert Trades", href: "#pro" },
      { label: "RMS", href: "#pro" },
      { label: "Sub Accounts", href: "#pro" },
      { label: "Trading APIs", href: "#features" }
    ]
  },
  {
    title: "Company",
    links: [
      { label: "About", href: `${APP_URL}/about` },
      { label: "Careers", href: `${APP_URL}/careers` },
      { label: "Blog", href: `${APP_URL}/blog` },
      { label: "Support", href: `${APP_URL}/support` }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: `${APP_URL}/terms` },
      { label: "Privacy", href: `${APP_URL}/privacy` },
      { label: "Risk Disclosure", href: `${APP_URL}/risk` },
      { label: "FIU-IND", href: `${APP_URL}/compliance` }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-16">
      <div className="container-zeb">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-[var(--text-muted)]">
              India&apos;s trusted crypto exchange since 2014. FIU-IND registered.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-bold text-[var(--text)]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--cyan)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--text-muted)] sm:flex-row">
          <span>© {new Date().getFullYear()} ZebPay. All rights reserved.</span>
          <span>Crypto assets are volatile. Trade responsibly.</span>
        </div>
      </div>
    </footer>
  );
}
