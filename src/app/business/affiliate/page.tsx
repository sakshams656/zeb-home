import { BusinessPage, businessMetadata } from "@/components/layout/business-page";

export const metadata = businessMetadata(
  "Affiliate",
  "Earn by referring traders to ZebPay's affiliate programme."
);

export default function AffiliatePage() {
  return (
    <BusinessPage
      title="Affiliate programme"
      description="Share ZebPay with your audience and earn rewards on qualified referrals."
    />
  );
}
