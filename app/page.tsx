"use client";

import React, { useState } from "react";
import Link from "next/link";
import Hero from "@/app/components/Hero";
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
  const { settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What wall opening sizes do your steel security doors come in?",
      a: "Our standard security doors are available in 3ft (900mm x 2100mm) and 4ft (1200mm x 2100mm / 1500mm x 2100mm for luxury double leaves). Custom architectural dimensions can also be confirmed with our sales desk on WhatsApp.",
    },
    {
      q: "What makes your foreign HDF room doors superior for estates and homes?",
      a: "Our HDF room doors are manufactured with high-density moisture-sealed fibreboard over kiln-dried hardwood stiles. They provide solid acoustic sound deadening, do not warp or split in Nigerian humidity, and come pre-hung with precision mortise locksets.",
    },
    {
      q: "Do you deliver doors outside Anambra State?",
      a: "Yes. We coordinate insured, crated inter-state logistics from our Maraim Plaza Ogidi depot to project sites in Lagos, Abuja, Port Harcourt, Asaba, Benin, Owerri, Enugu, and nationwide within 24–48 hours.",
    },
    {
      q: "Can I inspect the doors in person before making payment?",
      a: "Absolutely. We encourage contractors, engineers, and homeowners to visit our showroom and warehouse at No 16/17 Maraim Plaza, Building Material International Market Ogidi, to inspect leaf steel gauges, finish quality, and lock cylinders in person.",
    },
    {
      q: "Is CFrank Enterprise / Anambra Best Door registered with the CAC?",
      a: "Yes. CFrank Enterprise is registered with the Corporate Affairs Commission under Business Number BN 9943925 for specialized building completion and construction activities.",
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
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
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
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
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
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
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
        <div className="mt-8 bg-slate-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
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

      {/* 3. Section 3: Catalogue Highlights (Product-Dense & Compact Spacing) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
              <span>Inventory Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              Heavy-gauge security, room doors & sanitary wares.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Direct importer inventory stocked at Maraim Plaza Building Material International Market Ogidi.
            </p>
          </div>

          {/* 6 Category Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* 1. HDF Luxury Room Doors (Prioritized) */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-[#003296] text-[10px] font-bold rounded-full uppercase tracking-wider">
                    High-Volume Interior
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Foreign HDF Luxury Room Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  High-density acoustic room doors, Watson designs, and complete pre-hung wooden frame packages built to resist humidity, cracking, and sound transmission.
                </p>
              </div>
              <Link
                href="/collections/hdf-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View HDF Door Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Turkish Armoured Steel Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Perimeter Security
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Turkish Armoured Steel Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bullet-proof steel entrance doors, multi-point deadbolts, cast aluminum ornamental panels, and Italian copper electro-plated skins for primary defense.
                </p>
              </div>
              <Link
                href="/collections/security-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View Security Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Waterproof Bathroom Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    100% Waterproof
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Waterproof & Flush Bathroom Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  WPC composite and aluminium-capped restroom doors that never rot, swell, peel, or absorb water in shower and ensuite environments.
                </p>
              </div>
              <Link
                href="/collections/bathroom-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View Waterproof Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Executive Sanitary Wares */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Bath className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Sanitary Wares
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Sanitary Wares & Water Closets
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Modern rimless water closets, high-gloss dining area washbasins, gold executive vanity sinks, and commercial stainless kitchen basins.
                </p>
              </div>
              <Link
                href="/collections/sanitary-fittings"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View Sanitary Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Biometric Smart Locks & Handles */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Hardware & Access
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Biometric Smart Locks & Handles
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Fingerprint, passcode, and card electronic mortise smart locks, paired with stainless steel pull handles and heavy-gauge ball bearing hinges.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Explore Hardware</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. Custom Dimensions */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Custom Specs
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Standard & Custom Wall Openings
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Standard 3ft (900mm x 2100mm) and 4ft (1200mm x 2100mm), plus customized 5ft double leaves and oversized entrance arches built on demand.
                </p>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  "Hello CFrank Enterprise, I have custom wall dimensions for my building project and would like to confirm door sizing."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>Confirm Dimensions via WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 4: Wholesale & Depot Advantage (Compact Spacing) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Royal Blue Card */}
            <div className="lg:col-span-5 bg-[#003296] text-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 flex flex-col justify-between space-y-6 shadow-lg relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Direct Importer Advantage</span>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    0% Showroom
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-blue-200">
                    Markup Over Market Price
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  We supply directly from import shipping containers at Maraim Plaza Ogidi. You get direct market wholesale pricing rather than intermediate retailer markups.
                </p>
              </div>

              <div className="pt-4 border-t border-white/20 relative z-10 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>CAC Registered: CFrank Enterprise (BN: {settings.cacNumber})</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-blue-200">
                  <Store className="w-4 h-4 shrink-0" />
                  <span>Maraim Plaza No 16/17, Building Material Ogidi</span>
                </div>
              </div>
            </div>

            {/* Right Stacked 3 Clean Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
              <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    No Formulated or Hidden Extra Fees
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We quote genuine factory-direct prices based on the actual steel gauge, lock mechanism type, and timber core. No surprise surcharges on delivery day.
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Transparent Waybill Logistics
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inter-state waybill haulage is arranged directly with verified market drivers from Onitsha to your specific building site without inflated handling costs.
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Physical Depot Inspection Always Open
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You or your project representative are warmly invited to inspect the doors physically at Maraim Plaza Ogidi before loading and dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 5: Frequently Asked Questions (Compact Spacing) */}
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
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
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
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "bg-[#003296] text-white rotate-45" : "bg-slate-100 text-slate-600"
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

      {/* 6. Section 6: High-Impact Conversion Card (Compact Spacing) */}
      <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl sm:rounded-[36px] bg-[#003296] text-white p-6 sm:p-12 text-center space-y-4 sm:space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Ready to secure your building project?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              Whether you need a single bullet-proof security door or 50 HDF room doors for an estate, CFrank Enterprise delivers with zero hassle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 relative z-10">
            <Link
              href="/shop"
              className="w-full sm:w-auto py-3 px-7 bg-white hover:bg-slate-100 text-[#003296] text-xs sm:text-sm font-black rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>SEE PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                "Hello CFrank Enterprise, I am contacting you to order or request a quote for doors and sanitary fittings."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-7 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>CHAT US ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
