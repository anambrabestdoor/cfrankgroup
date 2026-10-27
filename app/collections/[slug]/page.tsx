import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { DOOR_PRODUCTS, DoorProduct } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { generateGeoKeywords } from "@/lib/geoKeywords";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Warehouse } from "lucide-react";

interface CollectionMeta {
  title: string;
  seoTitle: string;
  desc: string;
  categoryKey: DoorProduct["category"];
  commercialHighlight?: {
    heading: string;
    points: string[];
  };
}

const COLLECTIONS: Record<string, CollectionMeta> = {
  "hdf-doors": {
    title: "Luxury Foreign HDF Interior Room Doors",
    seoTitle: "Foreign HDF Room Doors | Direct Importer Price | Anambra Best Door",
    desc: "Engineered high-density fibreboard (HDF) interior room doors built for private residences, hotel suites, and multi-unit estate developments across Nigeria. Complete packages available with factory-matched architraves, frames, and mortise locks.",
    categoryKey: "hdf-doors",
    commercialHighlight: {
      heading: "Contractor & Builder Specifications for HDF Doors",
      points: [
        "Standard rough masonry opening: 3ft x 7ft (900mm x 2100mm) or custom height.",
        "Supplied as full pre-hung package: Leaf, frame casing, architrave, and heavy hinges.",
        "High-density compression core prevents bowing, warping, and surface cracking in humid weather.",
        "Direct warehouse supply with bulk discounts for developers ordering 10 units or more.",
      ],
    },
  },
  "security-doors": {
    title: "Heavy-Gauge Turkish Steel Security Doors",
    seoTitle: "Turkish Armoured Security Doors | Anambra Best Door",
    desc: "Reinforced structural steel entrance doors, bullet-resistant cores, multi-point deadbolt perimeter locks, and heavy-duty tamper-proof hinges. Inspected before dispatch.",
    categoryKey: "security-doors",
    commercialHighlight: {
      heading: "Security Door Quality Assurance",
      points: [
        "Electro-galvanized cold-rolled steel plates with internal steel reinforcement ribs.",
        "Rockwool acoustic and thermal core insulation.",
        "Multi-point perimeter locking with laser-cut computerized keys.",
        "Custom double leaf (4.5ft x 7ft & 5ft x 7ft) and standard 3ft / 4ft single leaves in stock.",
      ],
    },
  },
  "interior-doors": {
    title: "Interior Wooden Doors & Watson Panel Doors",
    seoTitle: "Interior Wooden Room Doors | American Panel & Watson | Anambra Best Door",
    desc: "Solid timber core interior doors, American panel finishes, and Watson room doors tailored for modern bedroom and office entries.",
    categoryKey: "interior-doors",
  },
  "bathroom-doors": {
    title: "100% Waterproof WPC Bathroom Doors",
    seoTitle: "Waterproof Bathroom Doors WPC | Anti-Swelling Moisture Proof",
    desc: "Monolithic polymer composite restroom doors 100% immune to water, shower steam, moisture condensation, and termites. Solves the persistent problem of rotting door bases in Nigerian bathrooms.",
    categoryKey: "bathroom-doors",
    commercialHighlight: {
      heading: "Why WPC Outlasts Wood in Nigerian Bathrooms",
      points: [
        "Zero wood fiber absorption: will never swell, peel, or warp from water contact.",
        "Termite-proof and fungus-resistant material composition.",
        "Pre-fitted frosted glass inserts and privacy mortise deadbolts.",
      ],
    },
  },
  "luxury-doors": {
    title: "Luxury Cast Aluminium & Copper Villa Doors",
    seoTitle: "Luxury Cast Aluminium & Copper Doors | Bible Design | Anambra Best Door",
    desc: "Monumental Bible cast aluminium doors and electro-plated Italian copper doors engineered for landmark residences, duplex main entrances, and executive conference halls.",
    categoryKey: "luxury-doors",
  },
  "sanitary-fittings": {
    title: "Executive Sanitary Wares & Bathroom Fittings",
    seoTitle: "Sanitary Wares & Water Closets | Executive Bathroom Fittings",
    desc: "Heavy ceramic water closets, dual-flush siphon toilets, countertop wash hand basins, and solid brass plumbing fixtures for residential and commercial projects.",
    categoryKey: "sanitary-fittings",
  },
  "paint": {
    title: "Premium Architectural Paints & Wall Finishes",
    seoTitle: "Quality Paints & Textured Wall Finishes | Anambra Best Door",
    desc: "Long-lasting interior and exterior paints, satin emulsions, weather-shield acrylics, and textured coatings for residential estates and commercial buildings.",
    categoryKey: "paint",
  },
  "roof-tiles": {
    title: "Stone-Coated Roof Tiles & Roofing Materials",
    seoTitle: "Stone-Coated Roof Tiles | Direct Supply | Anambra Best Door",
    desc: "High-grade stone-coated steel roof tiles, classic, shingle, and Roman tile profiles engineered for weather resistance and enduring aesthetic appeal.",
    categoryKey: "roof-tiles",
  },
  "bathrooms": {
    title: "Complete Bathroom Suites & Sanitary Wares",
    seoTitle: "Bathroom Suites, Tubs & Vanities | Anambra Best Door",
    desc: "All-in-one bathroom equipment including glass shower enclosures, bathtubs, designer vanity units, and modern sanitary installations.",
    categoryKey: "bathrooms",
  },
  "real-estate": {
    title: "Real Estate & Commercial Properties",
    seoTitle: "Verified Real Estate & Land Inquiries | Anambra Best Door",
    desc: "Commercial building listings, residential plots, and investment property connections across Anambra State and the South-East region.",
    categoryKey: "real-estate",
  },
  "careers": {
    title: "Careers & Employment Opportunities",
    seoTitle: "Join Our Team | Careers at CFrank Enterprise & Anambra Best Door",
    desc: "Open job vacancies in sales, fabrication, technical fitting, inventory management, and digital marketing at Anambra Best Door.",
    categoryKey: "careers",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const col = COLLECTIONS[slug];

  if (!col) {
    return {
      title: "Door Collection | Anambra Best Door",
      description: "Explore genuine heavy-gauge security and interior doors from Anambra Best Door with nationwide delivery.",
    };
  }

  const keywords = generateGeoKeywords(col.title, col.categoryKey);

  return {
    title: { absolute: col.seoTitle },
    description: col.desc,
    keywords,
    alternates: {
      canonical: `${baseUrl}/collections/${slug}`,
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: `${baseUrl}/collections/${slug}`,
      siteName: DEFAULT_SITE_SETTINGS.companyName,
      title: col.seoTitle,
      description: col.desc,
    },
    twitter: {
      card: "summary_large_image",
      title: col.seoTitle,
      description: col.desc,
    },
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug] || {
    title: "Architectural Door & Sanitary Collection",
    seoTitle: "Door Collection | Anambra Best Door",
    desc: "Explore verified heavy-gauge security doors, luxury interior wooden doors, and sanitary fittings in our warehouse inventory.",
    categoryKey: undefined,
  };

  const filtered = DOOR_PRODUCTS.filter((p) => {
    if (!p || !p.active) return false;
    if (collection.categoryKey) {
      return p.category === collection.categoryKey;
    }
    return true;
  });

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.title,
    description: collection.desc,
    url: `${baseUrl}/collections/${slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: `${DEFAULT_SITE_SETTINGS.companyName} (${DEFAULT_SITE_SETTINGS.parentCompany})`,
      telephone: DEFAULT_SITE_SETTINGS.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: DEFAULT_SITE_SETTINGS.address,
        addressLocality: "Ogidi",
        addressRegion: "Anambra State",
        addressCountry: "NG",
      },
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    itemListElement: filtered.slice(0, 20).map((product, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: product.name,
      url: `${baseUrl}/products/${product.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catalogue",
        item: `${baseUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.title,
        item: `${baseUrl}/collections/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/shop" className="hover:text-[#003296] flex items-center space-x-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Full Catalogue</span>
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-800">{collection.title}</span>
          </nav>

          {/* Hero Header Box */}
          <header className="bg-white p-6 sm:p-10 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-50 text-[#003296] text-[11px] font-bold uppercase tracking-wider">
                <Warehouse className="w-3 h-3" />
                <span>Direct Warehouse Inventory</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                <Truck className="w-3 h-3" />
                <span>Direct Site Waybill</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {collection.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {collection.desc}
            </p>

            {/* Commercial Highlight for HDF and key doors */}
            {collection.commercialHighlight && (
              <div className="mt-6 pt-6 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-6 sm:p-8 rounded-b-xl">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                  {collection.commercialHighlight.heading}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                  {collection.commercialHighlight.points.map((pt, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#003296] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
              <p className="text-sm font-bold text-slate-800">
                No products currently listed under this category.
              </p>
              <Link
                href="/shop"
                className="inline-block py-2.5 px-5 bg-[#003296] text-white text-xs font-bold rounded-lg"
              >
                Browse Full Catalogue
              </Link>
            </div>
          ) : (
            <section aria-label="Products in this collection">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filtered.map((door) => (
                  <ProductCard key={door.id} product={door} />
                ))}
              </div>
            </section>
          )}

          {/* Contractor & Project Procurement Schedule */}
          <section className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Contractor & Project Procurement for {collection.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct warehouse supply terms for property developers, architects, and quantity surveyors across Nigeria.
                </p>
              </div>
              <a
                href={`https://wa.me/${DEFAULT_SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent(`Hello CFrank Enterprise, I would like to request contractor wholesale pricing for ${collection.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center py-2 px-3.5 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>Request Project BOQ</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider text-[#003296]">
                  Standard Masonry Openings
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>Single Leaf:</strong> 3ft x 7ft (900mm x 2100mm) and 4ft x 7ft (1200mm x 2100mm).<br />
                  <strong>Double Leaf:</strong> 4.5ft x 7ft (1400mm x 2100mm) and 5ft x 7ft (1500mm x 2100mm).<br />
                  Custom rough masonry openings fabricated to architectural schedule.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider text-[#003296]">
                  Bulk Developer Brackets
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>Duplex Orders (5 to 15 doors):</strong> Tiered contractor discounts with factory-matched architraves.<br />
                  <strong>Estate Projects (20+ doors):</strong> Direct wholesale container pricing with scheduled phased dispatch.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 block uppercase text-[11px] tracking-wider text-[#003296]">
                  Corridor Waybill Dispatch
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  <strong>South-East & Delta:</strong> Same-day to 24h (Onitsha, Ogidi, Asaba, Enugu, Owerri, Aba).<br />
                  <strong>Rivers & Middle Belt:</strong> 24h waybill (Port Harcourt, Makurdi, Gboko).<br />
                  <strong>Lagos & Abuja:</strong> 24h to 48h freight to major building materials hubs.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
