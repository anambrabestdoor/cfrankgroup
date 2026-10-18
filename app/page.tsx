"use client";

import React from "react";
import Link from "next/link";
import Hero from "@/app/components/Hero";
import ProductCard from "@/app/components/ProductCard";
import QuickQuoteFinder from "@/app/components/QuickQuoteFinder";
import { DOOR_PRODUCTS, CATEGORIES } from "@/app/data/doorsData";
import { useApp } from "@/app/context/AppContext";
import { ShieldCheck, Truck, Store, Award, ArrowRight, MessageSquare, MapPin } from "lucide-react";

export default function StorefrontPage() {
  const { settings, setCacModalOpen } = useApp();

  // Curated featured selection prioritizing prominent HDF models alongside top security doors
  const featuredProducts = [
    DOOR_PRODUCTS.find((p) => p.slug === "interior-luxury-foreign-hdf-door")!,
    DOOR_PRODUCTS.find((p) => p.slug === "bullet-proof-door")!,
    DOOR_PRODUCTS.find((p) => p.slug === "hdf-wooden-door-with-complete-fittings")!,
    DOOR_PRODUCTS.find((p) => p.slug === "bible-design-cast-door")!,
    DOOR_PRODUCTS.find((p) => p.slug === "hdf-construction-on-demand")!,
    DOOR_PRODUCTS.find((p) => p.slug === "watson-door")!,
    DOOR_PRODUCTS.find((p) => p.slug === "italian-copper-door")!,
    DOOR_PRODUCTS.find((p) => p.slug === "harmony-toilet-size-door")!,
  ].filter(Boolean);

  // Dedicated HDF Collection for homepage spotlight
  const hdfProducts = DOOR_PRODUCTS.filter(
    (p) => p.category === "hdf-doors" || p.slug.includes("hdf") || p.slug.includes("watson")
  ).slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Value Proposition Strip */}
      <section className="bg-white border-b border-slate-200/80 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 text-left sm:text-center">
          <div className="flex items-center sm:justify-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Verified Steel Gauge</span>
              <span className="text-[11px] text-slate-500 block">Tested anti-drill Turkish plates</span>
            </div>
          </div>

          <div className="flex items-center sm:justify-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Maraim Plaza Depot</span>
              <span className="text-[11px] text-slate-500 block">Direct Ogidi market stock</span>
            </div>
          </div>

          <div className="flex items-center sm:justify-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Direct Importer Pricing</span>
              <span className="text-[11px] text-slate-500 block">Zero middleman markup</span>
            </div>
          </div>

          <div className="flex items-center sm:justify-center space-x-3 p-2">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Nationwide Waybill</span>
              <span className="text-[11px] text-slate-500 block">Safe delivery across Nigeria</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Step-by-Step Quote Tool (Video Inspired) */}
      <QuickQuoteFinder />

      {/* 4. Best Sellers & Featured Products Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-end justify-between mb-6 pb-3 border-b border-slate-200/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
              Verified Inventory
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Featured Doors & Bathroom Fittings
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center space-x-1 text-xs font-bold text-[#003296] hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-column mobile card grid, 3-column tablet, 4-column desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Dedicated Interior & HDF Doors Spotlight */}
      <section className="py-12 px-4 sm:px-6 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200/80">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
                Interior Woodwork & Estate Fittings
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Engineered HDF & Wooden Room Doors
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
                Complete pre-hung door packages with matching architraves, mortise locksets, and on-demand custom project fabrication with nationwide delivery.
              </p>
            </div>
            <Link
              href="/collections/hdf-doors"
              className="inline-flex items-center space-x-1.5 py-2 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#003296] hover:bg-slate-50 transition-colors self-start sm:self-auto shadow-xs"
            >
              <span>Explore HDF Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {hdfProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Physical Depot & Inspection Reassurance */}
      <section className="py-12 px-4 sm:px-6 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block">
              Direct Warehouse Presence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Physical Depot & Warehouse Inspection
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We welcome building contractors, architects, real estate developers, and homeowners to inspect door leaf gauges, lock mechanisms, and finishes in person at {settings.address}.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I would like directions to your store and warehouse.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-[#003296] hover:bg-[#002266] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Get Store Directions on WhatsApp</span>
              </a>
              <button
                onClick={() => setCacModalOpen(true)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#003296]" />
                <span>Verify CAC Registration</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0A192F] text-white space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>South-East & Nationwide Waybill Hub</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Direct Waybill to All States in Nigeria
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We coordinate secure, crated inter-state logistics from Onitsha to project sites in Lagos, Abuja, Port Harcourt, Asaba, Benin, Owerri, Enugu, and across the nation.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Standard transit: 24 - 48 Hours</span>
              <span className="text-white font-semibold">Crated Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. High-Impact Bottom Conversion Card (Video Inspired: sec_28.3.jpg) */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#003296] text-white p-8 sm:p-12 text-center space-y-5 shadow-xl relative overflow-hidden">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
            Contractor & Bulk Purchaser Inquiries
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to secure your building with heavy-gauge doors?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mx-auto leading-relaxed">
            Contact our sales desk on WhatsApp for instant price breakdowns, wall opening assessments, and direct warehouse pricing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I would like to request a bulk or retail door quotation for my project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-slate-100 text-[#003296] text-xs sm:text-sm font-black rounded-xl flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/shop"
              className="w-full sm:w-auto py-3.5 px-6 bg-blue-900/60 hover:bg-blue-900/90 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition-colors"
            >
              Browse Full Products Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
