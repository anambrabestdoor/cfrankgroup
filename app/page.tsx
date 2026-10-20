"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Hero from "@/app/components/Hero";
import ProductCard from "@/app/components/ProductCard";
import { useApp } from "@/app/context/AppContext";
import {
  BadgeCheck,
  Home,
  HardHat,
  Store,
  Layers,
  Lock,
  Droplets,
  Bath,
  KeyRound,
  Ruler,
  ArrowRight,
  MessageSquare,
  Plus,
  CheckCircle,
  Truck,
} from "lucide-react";

export default function StorefrontPage() {
  const { settings, products } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 4 latest products: 2 HDF room doors + 2 from other categories (security, sanitary, bathroom)
  const miniArchiveProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const active = list.filter((p) => Boolean(p && typeof p === "object" && p.active !== false));
    const hdf = active.filter((p) => p.category === "hdf-doors").slice(0, 2);

    const nonHdf = active.filter((p) => p.category !== "hdf-doors");
    const security = nonHdf.find((p) => p.category === "security-doors");
    const sanitaryOrBath = nonHdf.find(
      (p) => p.category === "sanitary-fittings" || p.category === "bathroom-doors"
    );

    const others: typeof active = [];
    if (security) others.push(security);
    if (sanitaryOrBath) others.push(sanitaryOrBath);

    if (others.length < 2) {
      for (const p of nonHdf) {
        if (!others.some((o) => o.id === p.id)) {
          others.push(p);
          if (others.length === 2) break;
        }
      }
    }

    return [...hdf, ...others].slice(0, 4);
  }, [products]);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What types of doors do you supply?",
      a: "We supply Turkish steel security entrance doors, foreign HDF luxury interior doors, Watson panel doors, waterproof WPC bathroom doors, digital and mechanical door locks, and bathroom sanitary wares.",
    },
    {
      q: "Where is your warehouse located?",
      a: "Our warehouse and showroom are at No. 16/17 Maraim Plaza, Building Material International Market, Ogidi, Anambra State. Customers and site representatives are welcome to visit during business hours.",
    },
    {
      q: "Can I inspect the doors before buying?",
      a: "Yes. We encourage customers or their site representatives to inspect door finishes, frame sets and locking hardware in person at our Ogidi depot before loading and dispatch.",
    },
    {
      q: "What door sizes are available?",
      a: "We supply standard single doors (commonly used for 3ft openings), one-and-a-half leaf doors (for 4ft openings), and double-leaf entrance doors (for 4.5ft to 5ft openings). Custom configurations can also be discussed based on your wall openings.",
    },
    {
      q: "Do your interior doors come with frames and locks?",
      a: "Most of our foreign HDF doors and security doors are supplied as complete pre-hung packages, including matching frame sets, architraves, hinges and locksets. Check individual product listings or ask us to confirm what is included with your preferred design.",
    },
    {
      q: "Do you deliver outside Anambra State?",
      a: "Yes. We coordinate transport and waybill delivery from our Ogidi depot to project sites in Asaba, Enugu, Owerri, Port Harcourt, Lagos, Abuja and other states across Nigeria. Transport costs are agreed separately based on location and order size.",
    },
    {
      q: "How do I get a quote for a building project?",
      a: "Send your door schedule, required sizes, preferred designs and quantities to us on WhatsApp or by email. We will review your list and provide an itemized quote.",
    },
    {
      q: "Is your business registered?",
      a: "Yes. Anambra Best Door is operated by CFrank Enterprise, registered with the Corporate Affairs Commission under Business Number BN 9943925.",
    },
  ];

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="flex flex-col w-full bg-[#FAF9F5] sm:bg-[#F8FAFC]">
      {/* Homepage FAQ Schema for Search Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
      />

      {/* 1. Hero Section (Split Hero with Physical Door Showcase & Video Trigger) */}
      <Hero />

      {/* Mini Archive: 4 Featured Products (2 HDF + 2 Other Categories) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-[#003296] uppercase tracking-wider">
              <span>Store Products</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Our Quality Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Foreign HDF interior doors, heavy-gauge security doors, and bathroom fittings ready for purchase.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#003296] hover:text-[#002266] hover:underline shrink-0 group self-start sm:self-end"
          >
            <span>See Our Full Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 4-Item Product Grid (2-Column Mobile, 4-Column Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {miniArchiveProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 2. Section 2: "Who We Supply" (Compact py-8 sm:py-12 spacing) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2.5">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
            <span>Who We Supply</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            The right doors for every kind of project.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            From a single home to a multi-unit development, Anambra Best Door helps homeowners, builders and trade buyers find doors that suit their spaces, designs and budgets. Explore our range of security doors, HDF wooden doors and other available designs, with options for individual purchases and bulk enquiries.
          </p>
        </div>

        {/* 3-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Homeowners & Residential Projects */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Homeowners & Residential Projects
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Make a lasting first impression.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose an entrance door that complements your home and interior doors that bring your spaces together. Explore security-focused entrance designs, decorative finishes and practical options for new builds, renovations and duplexes.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#003296] hover:underline"
              >
                <span>Explore Security Doors & HDF Wooden Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Contractors & Property Developers */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <HardHat className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Contractors & Property Developers
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Door solutions for projects of every size.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Planning a residential development, apartment block, hotel or renovation? Discuss your door types, quantities, preferred designs and project requirements with us. We’ll help you explore suitable options and request a quote for your project.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#003296]">
              <span>HDF Wooden Doors · Bulk Orders · Project Enquiries</span>
            </div>
          </div>

          {/* Card 3: Dealers, Retailers & Wholesalers */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Dealers, Retailers & Wholesalers
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Source doors for your next order.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Looking to stock up or purchase multiple doors? Contact us to discuss available designs, quantities, pricing and collection or delivery arrangements. Whether you're buying for resale or sourcing materials for a project, we’ll help you establish the options available for your order.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#003296]">
              <span>Wholesale Enquiries · Multiple-Unit Orders · Trade Pricing</span>
            </div>
          </div>
        </div>

        {/* Have a project in mind? Action Banner */}
        <div className="mt-8 bg-slate-50 rounded-xl p-6 sm:p-8 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left max-w-xl">
            <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
              Have a project in mind?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tell us the type of doors you need, your preferred designs and the quantity required. We&apos;ll help you explore available options and discuss pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/shop"
              className="w-full sm:w-auto py-3 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors text-center cursor-pointer"
            >
              <span>Browse Our Doors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                "Hello CFrank Enterprise, I have a project in mind. I would like to discuss door types, preferred designs, quantities, and pricing."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors text-center cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss Your Project on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Section 3: Catalogue Highlights (6 Standard Trade Categories) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
              <span>Product Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Doors & Building Materials in Stock
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Direct supplier inventory available for site delivery and nationwide waybill dispatch.
            </p>
          </div>

          {/* 6 Category Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* 1. Foreign HDF Luxury Room Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-[#003296] text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Interior Doors
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Foreign HDF Luxury Room Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  High-density fibreboard interior doors, Watson designs and complete pre-hung packages with matching frames and architraves.
                </p>
              </div>
              <Link
                href="/collections/hdf-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Browse Room Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Turkish Steel Security Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Perimeter Security
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Turkish Steel Security Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Heavy-gauge steel entrance doors, multi-point deadbolt locking systems, cast aluminum decorative panels and finished steel facings.
                </p>
              </div>
              <Link
                href="/collections/security-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Browse Security Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Waterproof Bathroom & Toilet Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Moisture Resistant
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Waterproof Bathroom & Toilet Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  WPC composite and aluminium-edged doors designed for high-moisture areas, bathrooms and en-suite facilities.
                </p>
              </div>
              <Link
                href="/collections/bathroom-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Browse Bathroom Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Sanitary Wares & Bathroom Fittings */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Bath className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Sanitary Wares
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Sanitary Wares & Bathroom Fittings
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Water closets, wash hand basins, executive vanity sinks and kitchen basins for residential and commercial bathrooms.
                </p>
              </div>
              <Link
                href="/collections/sanitary-fittings"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Browse Sanitary Wares</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Architectural Door Hardware */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Hardware & Access
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Architectural Door Hardware
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Digital smart locks, mechanical mortise handle sets, heavy-duty hinges and door accessories for homes and offices.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Browse Door Hardware</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. Watson & American Panel Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Panel Doors
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Watson & American Panel Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Interior panel door options for bedrooms, offices and residential developments, available in standard trade dimensions.
                </p>
              </div>
              <Link
                href="/shop?category=interior-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Browse Panel Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 4: Standard & Custom Door Sizes */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5] sm:bg-[#F8FAFC] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
              <Ruler className="w-3.5 h-3.5" />
              <span>Sizing Guide</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Standard & Custom Door Sizes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Available in standard single and double leaf sizes, with options to suit typical residential and commercial openings. Share your wall openings or project schedule with us, and we will confirm the right door sizes and frame allowances for your build.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-[#003296] uppercase tracking-wider block">Single Leaf</span>
              <h3 className="text-base font-bold text-slate-900">Standard 3ft Openings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commonly used for standard room doors, interior bedrooms, private study rooms, and office suites.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-[#003296] uppercase tracking-wider block">1.5 Leaf</span>
              <h3 className="text-base font-bold text-slate-900">Semi-Double 4ft Openings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Popular for master bedroom suites, executive offices, and semi-entrance residential doorways.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-[#003296] uppercase tracking-wider block">Double Leaf</span>
              <h3 className="text-base font-bold text-slate-900">4.5ft to 5ft Openings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed for main residential entrances, perimeter security doors, duplex entries, and reception halls.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-[#003296] uppercase tracking-wider block">Custom Sizing</span>
              <h3 className="text-base font-bold text-slate-900">Tailored Wall Heights</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oversized entry portals, extra-tall door leaves, and bespoke architectural specifications on request.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                "Hello Anambra Best Door, I would like to confirm door sizes and frame allowances for my building project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 py-3 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm Your Door Sizes on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. Section 5: Why Buy from Anambra Best Door? */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>Direct Trade Reliability</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Why Buy from Anambra Best Door?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Reliable supply, physical market presence, and straightforward trade terms.
            </p>
          </div>

          {/* 5 Value Pillars + CAC Entity Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* 1. Visit Our Ogidi Depot */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Depot Inspection
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Inspect door leaves, steel gauges, locks, and wood finishes in person before dispatch.
                </p>
              </div>
            </div>

            {/* 2. Pricing for Your Requirements */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Pricing for Your Requirements
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Clear, competitive prices whether you are buying a single door or ordering for a full building project.
                </p>
              </div>
            </div>

            {/* 3. Support for Bulk Orders */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <HardHat className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Support for Bulk Orders
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Special arrangements and coordination for contractors, developers and trade buyers with larger schedules.
                </p>
              </div>
            </div>

            {/* 4. Delivery Arrangements */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Delivery Arrangements
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We help arrange vehicle loading and transport to sites across Anambra and other states.
                </p>
              </div>
            </div>

            {/* 5. Inspect Before You Buy */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Inspect Before You Buy
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  You or your site representative are welcome to check the doors at our warehouse before loading and dispatch.
                </p>
              </div>
            </div>

            {/* 6. Registered Business Badge Card */}
            <div className="bg-[#003296] text-white rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-blue-100 text-[10px] font-bold uppercase tracking-wider">
                  <span>Verified Legal Entity</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  CFrank Enterprise (BN: {settings.cacNumber})
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Registered with the Corporate Affairs Commission for specialized building completion and construction activities.
                </p>
              </div>
              <div className="pt-2 text-xs text-blue-200">
                <span>Anambra State, Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 6: Frequently Asked Questions */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Clear answers for builders and homeowners.
          </h2>
        </div>

        {/* Clean Accordion Pills */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${isOpen ? "bg-[#003296] text-white rotate-45" : "bg-slate-100 text-slate-600"
                      }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Section 7: Planning a Door Purchase or Building Project? */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-2xl bg-[#003296] text-white p-6 sm:p-12 text-center space-y-4 sm:space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Planning a Door Purchase or Building Project?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              Whether you need entrance security doors for a new home, interior doors for an apartment development, or sanitary fittings for a commercial renovation, we are ready to assist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 relative z-10">
            <Link
              href="/shop"
              className="w-full sm:w-auto py-3 px-7 bg-white hover:bg-slate-100 text-[#003296] text-xs sm:text-sm font-black rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                "Hello Anambra Best Door, I would like to request a quote for my building project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-7 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Request a Quote</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
