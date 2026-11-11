"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/app/components/Hero";
import ProductCard from "@/app/components/ProductCard";
import { useApp } from "@/app/context/AppContext";
import { brand, colors } from "@/lib/brand";
import {
  Building2,
  Store,
  Layers,
  Lock,
  Bath,
  ArrowRight,
  MessageSquare,
  Plus,
  CheckCircle,
  Truck,
  FileText,
  BadgeCheck,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProtectedDocumentViewer from "@/app/components/ProtectedDocumentViewer";

export default function StorefrontPage() {
  const { settings, products, setCacModalOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [complianceDoc, setComplianceDoc] = useState<"cac" | "scuml">("cac");

  // Filter products for catalog preview
  const previewProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const active = list.filter((p) => Boolean(p && typeof p === "object" && p.active !== false));

    if (activeCategoryFilter === "doors") {
      return active
        .filter((p) =>
          ["security-doors", "hdf-doors", "interior-doors", "luxury-doors", "bathroom-doors"].includes(
            p.category
          )
        )
        .slice(0, 8);
    }

    if (activeCategoryFilter === "sanitary") {
      return active
        .filter((p) => ["sanitary-fittings", "bathrooms"].includes(p.category))
        .slice(0, 8);
    }

    if (activeCategoryFilter === "building-materials") {
      return active
        .filter((p) => ["paint", "roof-tiles", "building-materials"].includes(p.category))
        .slice(0, 8);
    }

    // Default "all": 4 doors + 4 sanitary/materials
    const doors = active
      .filter((p) =>
        ["security-doors", "hdf-doors", "interior-doors", "luxury-doors"].includes(p.category)
      )
      .slice(0, 4);

    const sanitary = active
      .filter((p) => ["sanitary-fittings", "bathrooms", "paint"].includes(p.category))
      .slice(0, 4);

    return [...doors, ...sanitary];
  }, [products, activeCategoryFilter]);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const corporateFaqs = [
    {
      q: "What is CFrank Group?",
      a: "CFrank Group is a commercial enterprise supplying certified Turkish security doors, luxury interior doors, sanitary wares, smart biometric locks, and stone-coated roofing materials from our physical facilities in Ogidi, Anambra State.",
    },
    {
      q: "Can I order multiple product categories in a single order?",
      a: "Yes. Our platform allows contractors, builders, and homeowners to combine security entrance doors, room doors, water closets, and building finishes into one unified order. Orders are coordinated centrally from our Anambra commercial facilities.",
    },
    {
      q: "Where are your physical showroom and warehouse located?",
      a: `Our commercial showroom and warehouse are situated at No. 16/17 Maraim Plaza, Building Materials International Market, Ogidi, Anambra State. Clients, architects, and site representatives are welcome to inspect physical inventory before dispatch.`,
    },
    {
      q: "Do you supply building projects outside Anambra State?",
      a: "Yes. We coordinate dedicated waybill and haulage logistics to project sites across South-Eastern Nigeria (Asaba, Enugu, Owerri, Port Harcourt, Aba, Abakaliki) as well as Abuja, Lagos, and other nationwide destinations.",
    },
    {
      q: "How do I submit an architectural door schedule or whole-house BOQ?",
      a: "You can submit your schedule directly via our online BOQ tool, email it to info@cfrankgroup.com, or send it to our trade desk on WhatsApp. Our technical team reviews openings, wall dimensions, and finish requirements to provide an itemized corporate quotation.",
    },
    {
      q: "Is CFrank Group legally registered in Nigeria?",
      a: "Yes. Registered with the Corporate Affairs Commission (CAC) under Business Number BN 9943925. Certified legal status extracts can be viewed directly on our website or verified via the official CAC public portal.",
    },
  ];

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: corporateFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const productCategories = [
    {
      id: "doors",
      name: "Security & Armoured Doors",
      description: "Turkish steel security doors, bulletproof models, and luxury entrance sets.",
      image: "/products/bullet-proof-door.jpeg",
      href: "/shop?category=doors",
      tag: "Entrances",
    },
    {
      id: "hdf-doors",
      name: "Foreign HDF Room Doors",
      description: "Acoustic room doors, Watson panels, and waterproof composite doors.",
      image: "/products/hdf-wooden-door-with-complete-fittings.jpeg",
      href: "/shop?category=hdf-doors",
      tag: "Interiors",
    },
    {
      id: "sanitary",
      name: "Executive Sanitary Wares",
      description: "Vitreous china water closets, vanity dining basins, and rainfall showers.",
      image: "/products/Excutive Gøld wc.jpeg",
      href: "/shop?category=sanitary-fittings",
      tag: "Bathrooms",
    },
    {
      id: "roofing",
      name: "Stone-Coated Roofing Tiles",
      description: "Weather-resilient stone-coated steel tiles and architectural finishes.",
      image: "/depot_video_1.jpg",
      href: "/shop?category=building-materials",
      tag: "Roofing",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />

      {/* 1. Corporate Hero Section */}
      <Hero />

      {/* 2. Product Categories Overview */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E3DC] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B]">
                Product Categories
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#121518]">
                Architectural Supply by Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#121518] hover:text-[#F3661B] inline-flex items-center gap-1.5 transition-colors self-start md:self-auto"
            >
              <span>Explore Full Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-md border border-[#E5E3DC] overflow-hidden flex flex-col justify-between hover:border-[#F3661B]/60 transition-colors shadow-xs group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-[#121518]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#121518]/85 text-[#FBF9F5] text-[10px] font-semibold px-2 py-0.5 rounded">
                      {cat.tag}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-[#121518] leading-tight group-hover:text-[#F3661B] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#4A4A4A] line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-xs">
                    <Link
                      href={cat.href}
                      className="font-bold text-[#F3661B] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Products</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Unified Product Catalogue Preview */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E3DC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E3DC] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B]">
                Shop & Warehouse Inventory
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#121518]">
                Warehouse Inventory & Sourcing
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto text-xs">
              <button
                onClick={() => setActiveCategoryFilter("all")}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  activeCategoryFilter === "all"
                    ? "bg-[#121518] text-white"
                    : "bg-[#FBF9F5] text-[#4A4A4A] hover:bg-[#E5E3DC]"
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setActiveCategoryFilter("doors")}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  activeCategoryFilter === "doors"
                    ? "bg-[#121518] text-white"
                    : "bg-[#FBF9F5] text-[#4A4A4A] hover:bg-[#E5E3DC]"
                }`}
              >
                Doors & Entrances
              </button>
              <button
                onClick={() => setActiveCategoryFilter("sanitary")}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  activeCategoryFilter === "sanitary"
                    ? "bg-[#121518] text-white"
                    : "bg-[#FBF9F5] text-[#4A4A4A] hover:bg-[#E5E3DC]"
                }`}
              >
                Sanitary Wares
              </button>
              <button
                onClick={() => setActiveCategoryFilter("building-materials")}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  activeCategoryFilter === "building-materials"
                    ? "bg-[#121518] text-white"
                    : "bg-[#FBF9F5] text-[#4A4A4A] hover:bg-[#E5E3DC]"
                }`}
              >
                Roofing & Finishes
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {previewProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center pt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Commercial Procurement & Project BOQ Section — Full-Width Architectural Band */}
      <section className="bg-[#121518] text-white py-14 sm:py-20 border-y border-[#22262B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F3661B] uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Commercial & Project Procurement</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Single-contract supply for hotels, estates, and private residences
            </h2>

            <p className="text-xs sm:text-sm text-[#D1D1CC] leading-relaxed">
              Consolidate architectural entrance schedules, interior room doors, executive sanitary wares, and surface finishes into one coordinated supply agreement. We provide verified line-item pricing, batch uniformity, and phased site offloading.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#D1D1CC]">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F3661B] shrink-0" />
                <span>Line-item architectural schedule quotes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F3661B] shrink-0" />
                <span>Dedicated logistics & direct site haulage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F3661B] shrink-0" />
                <span>Pre-hung complete door packages</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#F3661B] shrink-0" />
                <span>Single consolidated corporate billing</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/wholesale"
                className="py-3 px-5 bg-[#F3661B] hover:bg-[#D9530F] text-white text-xs font-bold rounded-md inline-flex items-center gap-2 transition-colors"
              >
                <span>Submit BOQ / Project Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                  `Hello ${brand.name}, I am a contractor/builder looking to request a commercial quote for an upcoming project.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-transparent hover:bg-white/10 text-white text-xs font-semibold rounded-md border border-[#3E454E] inline-flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#F3661B]" />
                <span>Chat with Project Desk</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4 bg-[#181C20] p-6 rounded-md border border-[#262C33]">
            <h3 className="text-sm font-bold text-white border-b border-[#262C33] pb-2">
              Procurement Desk Contact
            </h3>
            <div className="space-y-3 text-xs text-[#D1D1CC]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#73787E] block">
                  Central Depot
                </span>
                <span className="font-semibold text-white block mt-0.5">
                  Building Materials International Market, Ogidi
                </span>
                <span className="text-[#A0A5AB]">Lines 22 & 24, Anambra State</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#73787E] block">
                  Direct Line
                </span>
                <a href={`tel:${brand.phone}`} className="font-mono text-white hover:underline block mt-0.5">
                  {brand.phoneDisplay}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#73787E] block">
                  Corporate Email
                </span>
                <a href={`mailto:${brand.email}`} className="text-white hover:underline block mt-0.5">
                  {brand.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#73787E] block">
                  Corporate Registry
                </span>
                <span className="font-mono text-[#F3661B] block mt-0.5">
                  Federal Republic of Nigeria | {brand.cacNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Statutory Compliance & Corporate Standing Section (CAC + SCUML Dual Slider) */}
      <section className="bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E5E3DC]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Legal Entity & Statutory Compliance</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121518]">
              Registered Corporate Standing & Statutory Compliance
            </h2>

            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed max-w-2xl">
              {brand.name} operates with full statutory certification under the Corporate Affairs Commission (CAMA 2020 Business Number <strong>{brand.cacNumber}</strong>) and the Special Control Unit Against Money Laundering (SCUML RN: <strong>SC 041603036</strong>). All commercial clients and private buyers can verify our certified documentation.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCacModalOpen(true)}
                className="px-5 py-2.5 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>View Certified CAC Extract</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F3661B]" />
              </button>

              <Link
                href="/about"
                className="px-5 py-2.5 bg-[#FBF9F5] hover:bg-[#E5E3DC] text-[#121518] text-xs font-semibold rounded-lg border border-[#E5E3DC] inline-flex items-center gap-2 transition-colors"
              >
                <span>Corporate Background & SCUML</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href="https://search.cac.gov.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-transparent hover:text-[#F3661B] text-[#73787E] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Verify at CAC portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Dual Compliance Document Slider / Switcher */}
          <div className="lg:col-span-5 space-y-3">
            {/* Slider Switcher Tabs */}
            <div className="flex items-center justify-between p-1 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setComplianceDoc("cac")}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors text-center cursor-pointer ${
                  complianceDoc === "cac"
                    ? "bg-[#121518] text-white shadow-xs"
                    : "text-[#4A4A4A] hover:text-[#121518]"
                }`}
              >
                CAC Registration
              </button>
              <button
                type="button"
                onClick={() => setComplianceDoc("scuml")}
                className={`flex-1 py-1.5 px-2 rounded-md transition-colors text-center cursor-pointer ${
                  complianceDoc === "scuml"
                    ? "bg-[#121518] text-white shadow-xs"
                    : "text-[#4A4A4A] hover:text-[#121518]"
                }`}
              >
                SCUML Certificate
              </button>
            </div>

            {/* Document Display with Protected Viewer */}
            <div className="relative">
              {complianceDoc === "cac" ? (
                <div onClick={() => setCacModalOpen(true)} className="cursor-pointer">
                  <ProtectedDocumentViewer
                    src={settings.cacCertificateUrl || "/cac-status-report-page1.jpeg"}
                    alt="CAC Legal Status Report - Anambra Best Door Enterprises"
                    aspectRatio="aspect-[4/3]"
                    badgeText="CAC BN: 9943925"
                    watermarkText="CFRANK GROUP • OFFICIAL CAC EXTRACT • VERIFICATION COPY"
                    onExpand={() => setCacModalOpen(true)}
                  />
                </div>
              ) : (
                <div>
                  <ProtectedDocumentViewer
                    src="/scuml-certificate.jpg"
                    alt="SCUML Anti-Money Laundering Certificate - Anambra Best Door Enterprises"
                    aspectRatio="aspect-[4/3]"
                    badgeText="SCUML RN: SC 041603036"
                    watermarkText="CFRANK GROUP • OFFICIAL SCUML COMPLIANCE • NOT FOR RE-USE"
                  />
                </div>
              )}

              {/* Slider Prev / Next Controls */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-[#73787E]">
                <button
                  type="button"
                  onClick={() => setComplianceDoc((prev) => (prev === "cac" ? "scuml" : "cac"))}
                  className="inline-flex items-center gap-1 hover:text-[#121518] cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                  {complianceDoc === "cac" ? "1 of 2: Corporate Affairs (CAC)" : "2 of 2: Anti-Money Laundering (SCUML)"}
                </span>
                <button
                  type="button"
                  onClick={() => setComplianceDoc((prev) => (prev === "cac" ? "scuml" : "cac"))}
                  className="inline-flex items-center gap-1 hover:text-[#121518] cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Corporate & Trade FAQ Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121518]">
            Trade, Ordering & Logistics
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A4A]">
            Answers to common questions regarding corporate procurement, deliveries, and product specifications.
          </p>
        </div>

        <div className="space-y-3">
          {corporateFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md border border-[#E5E3DC] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#121518] hover:text-[#F3661B] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-[#F3661B] shrink-0 font-bold text-base">
                  {openFaq === idx ? "-" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-[#4A4A4A] leading-relaxed border-t border-[#E5E3DC] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
