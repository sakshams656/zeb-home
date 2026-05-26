import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zebpay.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZebPay — India's Most Trusted Crypto Exchange",
    template: "%s | ZebPay"
  },
  description:
    "Buy, sell, and earn crypto on ZebPay. 6M+ users, ₹2T+ volume. Spot, Futures, SIP, AI Insights. FIU-IND registered, ISO & SOC 2 certified.",
  keywords: ["crypto exchange india", "buy bitcoin india", "crypto sip", "zebpay", "btc inr price"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "ZebPay",
    title: "ZebPay — India's Pro-Grade Crypto Exchange",
    description: "Trade smarter with pro-grade tools, RMS, and FIU-IND compliance.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ZebPay — Trade Crypto in India" }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@ZebPay",
    title: "ZebPay — India's Pro-Grade Crypto Exchange",
    description: "Trade smarter with pro-grade tools, RMS, and FIU-IND compliance."
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f2e" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${lato.variable} dark`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://apps.apple.com" />
        <link rel="dns-prefetch" href="https://play.google.com" />
      </head>
      <body className="min-h-screen bg-[var(--bg)] antialiased font-sans text-[var(--fg)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
