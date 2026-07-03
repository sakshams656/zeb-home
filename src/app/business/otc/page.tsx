import { BusinessPage, businessMetadata } from "@/components/layout/business-page";

export const metadata = businessMetadata(
  "OTC",
  "Over-the-counter crypto trading for large block orders on ZebPay."
);

export default function OtcPage() {
  return (
    <BusinessPage
      title="OTC trading"
      description="Execute large trades with minimal market impact through ZebPay OTC desks."
    />
  );
}
