import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SiteShell } from "@/components/layout/site-shell";

const CalculatorHub = dynamic(
  () => import("@/components/landing/calculator-hub").then((m) => ({ default: m.CalculatorHub }))
);

export const metadata: Metadata = {
  title: "Calculators",
  description: "Crypto trading, SIP, futures, and ROI calculators from ZebPay."
};

export default function CalculatorsPage() {
  return (
    <SiteShell>
      <CalculatorHub />
    </SiteShell>
  );
}
