import { BusinessPage, businessMetadata } from "@/components/layout/business-page";

export const metadata = businessMetadata(
  "New Coin Listings",
  "List your digital asset on ZebPay — India's trusted crypto exchange."
);

export default function ListingsPage() {
  return (
    <BusinessPage
      title="New coin listings"
      description="Partner with ZebPay to launch your token to millions of verified Indian users."
    />
  );
}
