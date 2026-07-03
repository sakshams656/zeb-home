const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zebpay.com";

function jsonLdScript(data: Record<string, unknown>) {
  // Prevent `</script>` breakout when embedding JSON in a script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function OrganizationJsonLd() {
  const financial = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "ZebPay",
    description: "India's most trusted crypto exchange",
    url: siteUrl,
    logo: `${siteUrl}/ZebLogo.png`,
    foundingDate: "2014",
    areaServed: "IN",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Crypto Trading Products"
    }
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
      <script type="application/ld+json">{jsonLdScript(financial)}</script>
      <script type="application/ld+json">{jsonLdScript(website)}</script>
    </>
  );
}
