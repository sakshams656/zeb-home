const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zebpay.com";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "ZebPay",
    url: siteUrl,
    description:
      "India's trusted cryptocurrency exchange offering spot, futures, earn, CryptoPacks, SIP, AI insights, and RMS.",
    areaServed: "IN",
    foundingDate: "2014"
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
