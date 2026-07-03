import { BusinessPage, businessMetadata } from "@/components/layout/business-page";

export const metadata = businessMetadata(
  "Partnerships",
  "Build with ZebPay — integrations, co-marketing, and ecosystem partnerships."
);

export default function PartnershipsPage() {
  return (
    <BusinessPage
      title="Partnerships"
      description="Collaborate with ZebPay on products, education, and growth initiatives."
    />
  );
}
