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
  Minus,
  CheckCircle,
  Truck,
} from "lucide-react";

export default function StorefrontPage() {
  const { settings, setCacModalOpen } = useApp();
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

  return (
    <div className="flex flex-col w-full bg-[#FAF9F5] sm:bg-[#F8FAFC]">
      {/* 1. Hero Section (Duevy-Inspired Single-Column Centered) */}
      <Hero />

      {/* 2. Section 2: "Who It's For" (Duevy frame_05_sec_9.9 style) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
            <span>Who We Supply</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Designed for those building with permanence.
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            Whether securing a private residence or fitting an entire residential estate, our doors provide verified steel thickness, flawless timber finishing, and factory-direct pricing.
          </p>
        </div>

        {/* 3-Column Card Grid (Duevy Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Homeowners */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:border-[#003296]/30 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Homeowners & Builders
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Bullet-Proof Security & Family Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Armoured entrance doors featuring multi-point deadbolts, drill-resistant strike plates, and ornamental cast aluminium designs that safeguard your home without compromising elegance.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#003296]">
              <span>Turkish Steel & Cast Aluminum</span>
            </div>
          </div>

          {/* Card 2: Contractors */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:border-[#003296]/30 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                  <HardHat className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Contractors & Engineers
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Bulk HDF Room Doors & Estate Consistency
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                High-density acoustic room doors, Watson designs, and pre-hung frames supplied in uniform batches for multi-unit projects, hotels, and commercial developments with zero delays.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#003296]">
              <span>Foreign HDF & Pre-Hung Sets</span>
            </div>
          </div>

          {/* Card 3: Wholesalers */}
          <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-slate-200/80 shadow-xs hover:border-[#003296]/30 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Retailers & Wholesalers
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Direct Container Loads & Market Pricing
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Source directly from our Maraim Plaza depot at importer rates. We provide container offloading, palletized packing, and reliable haulage across the South-East and Nigeria.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#003296]">
              <span>Direct Importer Wholesale Rates</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 3: Catalogue Highlights ("The Full Range, in Plain Words" — Duevy frame_06_sec_11.9 style) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
              <span>Inventory Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Heavy-gauge security & interior doors.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Direct importer inventory stocked at Maraim Plaza Building Material International Market Ogidi.
            </p>
          </div>

          {/* 6 Clean White Feature Cards (Subtly Prioritizing HDF!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* 1. HDF Luxury Room Doors (Subtly Prioritized) */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[28px] p-8 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-[#003296] text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Interior Priority
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Foreign HDF Luxury Room Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  High-density acoustic room doors, Watson designs, and complete pre-hung wooden frame packages built to resist humidity, cracking, and sound transmission.
                </p>
              </div>
              <Link
                href="/shop?category=interior-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View HDF Door Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Turkish Armoured Steel Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[28px] p-8 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Maximum Security
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Turkish Armoured Steel Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Bullet-proof steel entrance doors, Israeli central lock systems, cast aluminum ornamental panels, and Italian copper electro-plated skins for primary perimeter defense.
                </p>
              </div>
              <Link
                href="/shop?category=security-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View Security Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. Waterproof Bathroom Doors */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[28px] p-8 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Wet-Area Fit
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Waterproof & Flush Bathroom Doors
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  WPC composite and aluminium-capped bathroom doors that never rot, swell, peel, or absorb water in shower and ensuite environments.
                </p>
              </div>
              <Link
                href="/shop?category=bathroom-doors"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View Waterproof Range</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Executive Sanitary Wares */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[28px] p-8 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Bath className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Sanitary Wares
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Sanitary Wares & Bathroom Fittings
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Modern rimless water closets, high-gloss dining area washbasins, gold executive vanity sinks, and commercial stainless kitchen basins.
                </p>
              </div>
              <Link
                href="/shop?category=sanitary-fittings"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline pt-2"
              >
                <span>View Sanitary Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Biometric Smart Locks & Handles */}
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[28px] p-8 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Hardware & Access
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
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
            <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[28px] p-8 border border-slate-200/80 flex flex-col justify-between hover:border-[#003296]/40 transition-all space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003296] flex items-center justify-center">
                    <Ruler className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Custom Specs
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Standard & Custom Wall Openings
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Standard 3ft (900mm x 2100mm) and 4ft (1200mm x 2100mm), plus customized 5ft double leaves and oversized entrance arches built on demand.
                </p>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I have custom wall dimensions for my building project and would like to confirm door sizing.")}`}
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

      {/* 4. Section 4: "How It Works" (Duevy frame_09_sec_17.9 Split Progression Layout) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Sticky Title & Subtitle */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              One direct order flow, from enquiry to site offload.
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              No middleman markup. Confirm stock, verify wall dimensions, and receive direct delivery to your building project.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 py-3 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-full shadow-sm transition-all"
              >
                <span>SEE ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Step Timeline Cards with Colored Circular Badges */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Step 01 */}
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-slate-200/80 shadow-xs flex items-start space-x-5 sm:space-x-6">
              <div className="w-12 h-12 rounded-full bg-[#003296] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                01
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  STEP 01
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Select Model & Wall Specification
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Browse our catalogue or send your building plan's door schedule. Choose whether you need 3ft room doors, 4ft entrance security doors, waterproof toilet doors, or luxury double leaves.
                </p>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-slate-200/80 shadow-xs flex items-start space-x-5 sm:space-x-6">
              <div className="w-12 h-12 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                02
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  STEP 02
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Instant WhatsApp Stock & Invoice Confirmation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our sales desk at Maraim Plaza verifies real-time warehouse inventory, sends live photos/videos of the exact units, confirms opening orientation (left/right, in/out), and provides an official proforma invoice.
                </p>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-10 border border-slate-200/80 shadow-xs flex items-start space-x-5 sm:space-x-6">
              <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                03
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                  STEP 03
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Secure Loading & Nationwide Waybill
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Doors are packaged with protective corner guards and film, loaded onto verified inter-state freight carriers from Onitsha, and tracked until direct offload at your project site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 5: Wholesale & Value Proposition (Duevy frame_11_sec_21.8 Side-by-Side Style) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Big Royal Blue Card */}
            <div className="lg:col-span-5 bg-[#003296] text-white rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 flex flex-col justify-between space-y-8 shadow-xl relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>Direct Importer Advantage</span>
                </div>

                <div className="space-y-2">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
                    0% Showroom
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-200">
                    Markup Over Market Price
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                  We supply directly from import shipping containers at Maraim Plaza Ogidi. You get direct market wholesale pricing rather than intermediate retailer markups.
                </p>
              </div>

              <div className="pt-6 border-t border-white/20 relative z-10 space-y-3">
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

            {/* Right Stacked 3 Clean White Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              {/* Card 1 */}
              <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[24px] sm:rounded-[28px] p-7 sm:p-8 border border-slate-200/80 shadow-xs flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    No Formulated or Hidden Extra Fees
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    We quote genuine factory-direct prices based on the actual steel gauge, lock mechanism type, and timber core. No surprise surcharges on delivery day.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[24px] sm:rounded-[28px] p-7 sm:p-8 border border-slate-200/80 shadow-xs flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Transparent Waybill Logistics
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Inter-state waybill haulage is arranged directly with verified market drivers from Onitsha to your specific building site without inflated handling costs.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#FAF9F5] sm:bg-[#F8FAFC] rounded-[24px] sm:rounded-[28px] p-7 sm:p-8 border border-slate-200/80 shadow-xs flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Physical Depot Inspection Always Open
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    You or your project representative are warmly invited to inspect the doors physically at Maraim Plaza Ogidi before loading and dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 6: Frequently Asked Questions (Duevy frame_10_sec_19.9 Clean Accordion) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-10 sm:space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#003296]">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
            Clear answers for builders and homeowners.
          </h2>
        </div>

        {/* Clean Accordion Pills */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-900 text-xs sm:text-sm md:text-base">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? "bg-[#003296] text-white rotate-45" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Section 7: Massive High-Impact Conversion Card (Duevy frame_12_sec_23.8 Style) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[32px] sm:rounded-[48px] bg-[#003296] text-white p-8 sm:p-16 text-center space-y-6 sm:space-y-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to secure your building project?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-blue-100/90 leading-relaxed font-normal">
              Whether you need a single bullet-proof security door or 50 HDF room doors for an estate, CFrank Enterprise delivers with zero hassle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 relative z-10">
            <Link
              href="/shop"
              className="w-full sm:w-auto py-3.5 sm:py-4 px-8 bg-white hover:bg-slate-100 text-[#003296] text-xs sm:text-sm font-black rounded-full flex items-center justify-center space-x-2 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <span>SEE PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am contacting you to order or request a quote for doors and sanitary fittings.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 sm:py-4 px-8 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold rounded-full border border-white/25 flex items-center justify-center space-x-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>CHAT US ON WHATSAPP</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
