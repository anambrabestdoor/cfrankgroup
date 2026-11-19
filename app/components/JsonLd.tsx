import React from "react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { brand } from "@/lib/brand";

export default function JsonLd() {
  const baseUrl = brand.url;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "Corporation"],
    "@id": `${baseUrl}/#organization`,
    name: "CFrank Group",
    legalName: "CFrank Enterprise",
    alternateName: [
      "CFrank Enterprise",
      "C. Frank Enterprise",
      "CFrank Enterprises",
      "CFrank Group",
      "C-Frank Group",
      "CFrank",
    ],
    url: baseUrl,
    logo: `${baseUrl}/cfranklogo.png`,
    image: `${baseUrl}/cfrank_hero_completed_house.png`,
    description:
      "CFrank Group (CFrank Enterprise) is Nigeria's premier architectural and building supply enterprise, direct factory importer of certified Turkish security doors, luxury interior doors, sanitary wares, stone-coated roofing tiles, and furniture, operating subsidiary divisions including Anambra Best Door.",
    telephone: brand.phone,
    email: brand.email,
    founder: {
      "@type": "Person",
      name: brand.proprietor,
      jobTitle: "Proprietor & Managing Director",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address,
      addressLocality: "Ogidi",
      addressRegion: "Anambra State",
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: brand.geo.latitude,
      longitude: brand.geo.longitude,
    },
    subOrganization: [
      {
        "@type": "LocalBusiness",
        "@id": "https://anambrabestdoor.com/#localbusiness",
        name: "Anambra Best Door",
        legalName: "Anambra Best Door Enterprises",
        alternateName: [
          "Anambra Best Door by CFrank Enterprise",
          "Anambra Best Door Enterprises",
          "Anambra Best Door",
        ],
        url: "https://anambrabestdoor.com",
        description:
          "Specialized door dealer, direct Turkish security door importer, and installation division operating as a dedicated subsidiary under CFrank Enterprise.",
        parentOrganization: {
          "@id": `${baseUrl}/#organization`,
        },
      },
    ],
    department: [
      {
        "@type": "Organization",
        name: "Anambra Best Door",
        url: "https://anambrabestdoor.com",
      },
    ],
    sameAs: [
      "https://anambrabestdoor.com",
      brand.social.instagram,
      brand.social.facebook,
      brand.social.linkedin,
      brand.social.twitter,
      brand.social.jiji,
    ].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "CFrank Group",
    alternateName: [
      "CFrank Enterprise",
      "C. Frank Enterprise",
      "CFrank Enterprise Official Website",
      "CFrank Group Official Website",
      "CFrank",
      "CFrank Enterprises",
    ],
    description:
      "The official parent website of CFrank Enterprise (CFrank Group), coordinating building supply, security doors, sanitary wares, roofing tiles, and furniture, with Anambra Best Door as its subsidiary division.",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    hasPart: [
      {
        "@type": "WebSite",
        "@id": "https://anambrabestdoor.com/#website",
        name: "Anambra Best Door",
        url: "https://anambrabestdoor.com",
        description: "Door dealership and subsidiary brand under CFrank Enterprise.",
      },
    ],
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
