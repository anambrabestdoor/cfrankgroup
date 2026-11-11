import React from "react";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { brand } from "@/lib/brand";

export default function JsonLd() {
  const baseUrl = brand.url;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: brand.name,
    legalName: "Anambra Best Door Enterprises",
    alternateName: [
      brand.name,
      "CFrank Groups",
      "CFrank Enterprise",
      "CFrank Enterprises",
      brand.shortName,
      "Anambra Best Door",
      "Anambra Best Door Enterprises"
    ],
    url: baseUrl,
    logo: `${baseUrl}/cfranklogo.png`,
    description: brand.description,
    telephone: brand.phone,
    email: brand.email,
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
    sameAs: [
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
    name: brand.name,
    alternateName: ["CFrank Group", "CFrank Groups", "CFrank Enterprise", "CFrank", "Anambra Best Door"],
    publisher: {
      "@id": `${baseUrl}/#organization`,
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
