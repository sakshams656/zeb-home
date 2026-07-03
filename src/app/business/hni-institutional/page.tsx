import { BusinessPage, businessMetadata } from "@/components/layout/business-page";

export const metadata = businessMetadata(
  "HNI & Institutional Investors",
  "Dedicated solutions for high-net-worth and institutional crypto investors on ZebPay."
);

export default function HniPage() {
  return (
    <BusinessPage
      title="HNI & Institutional Investors"
      description="White-glove onboarding, deeper liquidity, and tailored support for professional investors."
    />
  );
}
