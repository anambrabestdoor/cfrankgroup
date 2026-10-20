"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";
import {
  ArrowRight,
  Play,
  X,
  ShieldCheck,
  DoorClosed,
  Bath,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  const { products, settings } = useApp();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Dynamic curation across the 3 core building supply lines (NOT locked to just Turkish doors!)
  // 1. Heavy Security & Steel Entrance Door
  const securityProduct =
    products.find(
      (p) =>
        (p.category === "security-doors" || p.category === "luxury-doors") &&
        p.active !== false &&
        p.image
    ) ||
    DOOR_PRODUCTS.find((p) => p.slug === "bullet-proof-door") ||
    DOOR_PRODUCTS[5];

  // 2. Foreign Luxury HDF & Interior Room Door
  const interiorProduct =
    products.find(
      (p) =>
        (p.category === "hdf-doors" || p.category === "interior-doors") &&
        p.active !== false &&
        p.image
    ) ||
    DOOR_PRODUCTS.find((p) => p.slug === "interior-luxury-foreign-hdf-door") ||
    DOOR_PRODUCTS[0];

  // 3. Modern Bathroom Sanitary Ware / Water Closet
  const sanitaryProduct =
    products.find(
      (p) =>
        p.category === "sanitary-fittings" &&
        p.active !== false &&
        p.image
    ) ||
    DOOR_PRODUCTS.find((p) => p.slug === "harmony-toilet-set") ||
    DOOR_PRODUCTS[DOOR_PRODUCTS.length - 1];

  const pillars = [
    {
      categoryBadge: "Entrance Security",
      categoryName: "Security & Steel Doors",
      product: securityProduct,
      specsLabel: "Heavy Gauge • Multi-Lock Deadbolts",
      icon: ShieldCheck,
      href: securityProduct ? `/products/${securityProduct.slug}` : "/shop?category=security-doors",
      shopHref: "/shop?category=security-doors",
    },
    {
      categoryBadge: "Interior Architecture",
      categoryName: "Foreign HDF & Room Doors",
      product: interiorProduct,
      specsLabel: "Acoustic Infill • Pre-Hung Frame Set",
      icon: DoorClosed,
      href: interiorProduct ? `/products/${interiorProduct.slug}` : "/shop?category=hdf-doors",
      shopHref: "/shop?category=hdf-doors",
    },
    {
      categoryBadge: "Bathrooms & Suites",
      categoryName: "Sanitary Wares & Fittings",
      product: sanitaryProduct,
      specsLabel: "Dual-Flush Ceramic • Soft-Close Finish",
      icon: Bath,
      href: sanitaryProduct ? `/products/${sanitaryProduct.slug}` : "/shop?category=sanitary-fittings",
      shopHref: "/shop?category=sanitary-fittings",
    },
  ];

  return (
    <section className="relative bg-[#FAF9F5] sm:bg-[#F8FAFC] pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Top Header & High-Impact Commercial Trade Messaging */}
        <div className="max-w-3xl space-y-4 text-left">
          {/* Business Positioning Pill */}
          <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-blue-50/90 border border-blue-200/80 rounded-full text-xs font-bold text-[#003296] w-fit shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#003296]" />
            <span>Direct Importers & Wholesale Building Supply • Powered by CFrank Enterprise</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
            Doors & Sanitary Wares Built for Modern Projects.
          </h1>

          {/* Trade Copy: Covers security doors, foreign HDF, room doors, and sanitary wares */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
            Direct wholesale and project supply of heavy-gauge entrance security doors, foreign luxury HDF room doors, waterproof bathroom doors, and premium sanitary fittings for homes, hotels, and estates nationwide.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/shop"
              className="py-3.5 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <span>Browse Full Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                "Hello CFrank Enterprise, I would like to inquire about door and sanitary ware prices for my project."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Sales Desk</span>
            </a>

            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              title="Watch warehouse offloading video"
            >
              <Play className="w-3.5 h-3.5 text-[#003296] fill-current" />
              <span>Warehouse Video</span>
            </button>
          </div>
        </div>

        {/* Modular 3-Category Showcase: Security Doors, HDF Room Doors, and Sanitary Wares */}
        <div className="pt-2 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Direct Importer Inventory
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Core Supply Lines in Stock
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-[#003296] hover:underline inline-flex items-center space-x-1 self-start sm:self-auto"
            >
              <span>View All 28+ Models</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Modular Showcase Cards (Stacked on Mobile, 3-Columns on Tablet/Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const prod = pillar.product;
              if (!prod) return null;

              return (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#003296]/50 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Header line inside card */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                        <Icon className="w-3 h-3 text-[#003296]" />
                        <span>{pillar.categoryBadge}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        {prod.badge || "In Stock"}
                      </span>
                    </div>

                    {/* Image Container with high architectural aspect ratio */}
                    <Link
                      href={pillar.href}
                      className="block relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 group-hover:opacity-95 transition-opacity"
                    >
                      <Image
                        src={prod.image || "/products/bullet-proof-door.jpeg"}
                        alt={prod.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
                        priority={idx === 0}
                      />
                    </Link>

                    {/* Product Name & Specs */}
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#003296] transition-colors line-clamp-1">
                        <Link href={pillar.href}>{prod.name}</Link>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {pillar.specsLabel}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-4 py-3 sm:px-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      href={pillar.href}
                      className="font-bold text-[#003296] hover:underline inline-flex items-center space-x-1"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href={pillar.shopHref}
                      className="text-slate-500 hover:text-slate-800 font-medium"
                    >
                      Browse Line →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real Video Offloading Modal */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white">
              <span className="text-xs font-bold">Depot Offloading Video</span>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[9/16] max-h-[75vh] w-full bg-black">
              <video
                src="/WhatsApp Video 2026-10-19 at 7.46.16 AM.mp4"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
