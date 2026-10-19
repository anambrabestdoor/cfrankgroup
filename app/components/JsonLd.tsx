import React from "react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";

export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: DEFAULT_SITE_SETTINGS.companyName,
    legalName: DEFAULT_SITE_SETTINGS.parentCompany,
    alternateName: ["Anambra Best Door", "CFrank Enterprise", "Anambra Best Door Onitsha"],
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/products/bullet-proof-door.jpg`,
    description: DEFAULT_SITE_SETTINGS.description,
    telephone: DEFAULT_SITE_SETTINGS.phone,
    email: DEFAULT_SITE_SETTINGS.salesEmail,
    priceRange: "₦₦ - ₦₦₦₦",
    currenciesAccepted: "NGN",
    paymentAccepted: "Direct Bank Transfer, WhatsApp Inquiries",
    address: {
      "@type": "PostalAddress",
      streetAddress: DEFAULT_SITE_SETTINGS.address,
      addressLocality: "Ogidi",
      addressRegion: "Anambra State",
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "6.1432",
      longitude: "6.8623",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Anambra State" },
      { "@type": "AdministrativeArea", name: "Delta State" },
      { "@type": "AdministrativeArea", name: "Enugu State" },
      { "@type": "AdministrativeArea", name: "Imo State" },
      { "@type": "AdministrativeArea", name: "Rivers State" },
      { "@type": "AdministrativeArea", name: "Lagos State" },
      { "@type": "AdministrativeArea", name: "Abuja Federal Capital Territory" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:30",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Architectural Doors and Sanitary Inventory",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Foreign HDF Interior Room Doors",
          url: `${baseUrl}/collections/hdf-doors`,
        },
        {
          "@type": "OfferCatalog",
          name: "Heavy-Gauge Turkish Steel Security Doors",
          url: `${baseUrl}/collections/security-doors`,
        },
        {
          "@type": "OfferCatalog",
          name: "100% Waterproof WPC Bathroom Doors",
          url: `${baseUrl}/collections/bathroom-doors`,
        },
        {
          "@type": "OfferCatalog",
          name: "Executive Sanitary Wares and Water Closets",
          url: `${baseUrl}/collections/sanitary-fittings`,
        },
      ],
    },
    knowsAbout: [
      "Heavy-Gauge Turkish Security Doors",
      "Foreign HDF Interior Room Doors",
      "100% Waterproof WPC Bathroom Doors",
      "Executive Water Closets and Sanitary Wares",
      "Building Materials Ogidi Market Onitsha",
      "Nationwide Crated Haulage",
    ],
    sameAs: [
      DEFAULT_SITE_SETTINGS.instagramUrl,
      DEFAULT_SITE_SETTINGS.facebookUrl,
      DEFAULT_SITE_SETTINGS.jijiShopUrl,
      DEFAULT_SITE_SETTINGS.githubUrl,
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Anambra Best Door",
    alternateName: "Anambra Best Door by CFrank Enterprise",
    publisher: {
      "@id": `${baseUrl}/#localbusiness`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/shop?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
