const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zebpay.com";

export function OrganizationJsonLd() {
  const financial = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "ZebPay",
    url: siteUrl,
    description:
      "India's trusted cryptocurrency exchange offering spot, futures, earn, CryptoPacks, SIP, AI insights, and RMS.",
    areaServed: "IN",
    foundingDate: "2014"
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ZebPay",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(financial) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
