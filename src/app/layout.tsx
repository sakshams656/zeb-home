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
    "400+ crypto assets, institutional-grade security, and up to 8.5% earn yields on India's most trusted crypto exchange since 2014. 6M+ users.",
  keywords: [
    "ZebPay",
    "crypto exchange India",
    "Bitcoin INR",
    "crypto futures India",
    "crypto SIP",
    "AI insights crypto"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "ZebPay",
    title: "ZebPay — India's Pro-Grade Crypto Exchange",
    description:
      "Spot, futures up to 25x, earn, APIs, AI insights, RMS, sub accounts — built for India's traders and investors."
  },
  twitter: {
    card: "summary_large_image",
    title: "ZebPay — India's Pro-Grade Crypto Exchange",
    description: "Trade smarter with pro-grade tools, RMS, and FIU-IND compliance."
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl }
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
    <html lang="en" className={lato.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
