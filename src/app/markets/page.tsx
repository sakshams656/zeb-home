import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";

const Markets = dynamic(() => import("@/components/landing/markets").then((m) => ({ default: m.Markets })));

export const metadata: Metadata = {
  title: "Markets",
  description: "Live crypto prices and market trends on ZebPay."
};

export default function MarketsPage() {
  return (
    <SiteShell>
      <Markets />
    </SiteShell>
  );
}
