"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import {
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  FileText,
  Play,
  X,
  Layers,
  Lock,
  Bath,
} from "lucide-react";

type HeroCategory = "hdf" | "security" | "sanitary";

export default function Hero() {
  const { settings } = useApp();
  const [activeCategory, setActiveCategory] = useState<HeroCategory>("hdf");
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const showcaseData = {
    hdf: {
      tag: "Interior Room Door",
      title: "Foreign HDF Room Door",
      specs: "Complete set with matching frame, architrave, hinges, and lock handle.",
      badge: "In Stock at Ogidi",
      image: "/WhatsApp Image 2026-10-19 at 7.46.19 AM.jpeg",
      href: "/collections/hdf-doors",
      buttonText: "See All Room Doors",
      alt: "Foreign Luxury HDF Wooden Door with complete frame and lock displayed at Anambra Best Door",
    },
    security: {
      tag: "Main Entrance Door",
      title: "Heavy-Gauge Turkish Security Door",
      specs: "Armoured steel with multi-point deadlock and master laser keys.",
      badge: "In Stock at Ogidi",
      image: "/WhatsApp Image 2026-10-19 at 7.46.18 AM.jpeg",
      href: "/collections/security-doors",
      buttonText: "See All Security Doors",
      alt: "Heavy-Gauge Turkish Steel Security Door displayed at Anambra Best Door depot, Ogidi",
    },
    sanitary: {
      tag: "Bathroom & Toilet",
      title: "Executive Luxury Water Closet (WC)",
      specs: "Quality ceramic toilet set with dual-flush cistern and soft-closing seat cover.",
      badge: "In Stock at Ogidi",
      image: "/products/Excutive Gøld wc.jpeg",
      href: "/collections/sanitary-fittings",
      buttonText: "See All Sanitary Wares",
      alt: "Executive Luxury Water Closet by Anambra Best Door and CFrank Enterprise",
    },
  };

  const currentShowcase = showcaseData[activeCategory];

  return (
    <section className="relative bg-[#FAF9F5] sm:bg-[#F8FAFC] pt-8 pb-10 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Real Trade Copy, CTAs, Catalog Links */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* 1. Trust & Location Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-[#003296]">
              <CheckCircle2 className="w-4 h-4 text-[#003296] shrink-0" />
              <span>Direct Importer • Maraim Plaza, Ogidi Onitsha</span>
            </div>

            {/* 2. Main Headline (Balanced Across Categories) */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Heavy-Gauge Steel Security,{" "}
              <span className="block sm:inline">Luxury HDF Doors &</span>{" "}
              <span className="relative inline-block text-[#003296]">
                Sanitary Wares.
                <svg
                  className="absolute left-0 -bottom-2 w-full h-2.5 text-[#003296]/30 overflow-visible"
                  viewBox="0 0 240 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 8.5C50 3.5 120 4.5 237 7.5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* 3. Trade Authority Copy */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Anambra Best Door (operated by CFrank Enterprise) is a leading South-East supplier and direct importer of heavy-gauge Turkish security doors, luxury interior HDF doors, waterproof bathroom doors, and commercial sanitary wares from the Onitsha building materials market (Ogidi) to residential estates, contractors, and builders across Nigeria.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/shop"
                className="py-3.5 px-7 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>SEE ALL PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  "Hello CFrank Enterprise, I want to chat about your doors and sanitary wares, current prices, and waybill delivery."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>CHAT ON WHATSAPP</span>
              </a>

              {/* Watch Video Button */}
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                title="Watch warehouse offloading video at Maraim Plaza"
              >
                <Play className="w-3.5 h-3.5 text-[#003296] fill-current" />
                <span>Watch Warehouse Video</span>
              </button>
            </div>

            {/* 5. Download Official PDF Catalogs Row */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
              <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                Official Trade Catalogs:
              </span>
              <a
                href="/Anambra-Best-Door-Catalog.pdf"
                download
                className="inline-flex items-center space-x-1 text-[#003296] font-semibold hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Doors Catalog (PDF)</span>
              </a>
              <span className="text-slate-300">•</span>
              <a
                href="/Anambra-Best-Sanitary-Ware-Catalog.pdf"
                download
                className="inline-flex items-center space-x-1 text-[#003296] font-semibold hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Sanitary Wares Catalog (PDF)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Physical Product Showcase Card with 3 Category Tabs */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden p-3 sm:p-4 space-y-3">
              {/* Category Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveCategory("hdf")}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                    activeCategory === "hdf"
                      ? "bg-white text-[#003296] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Room Doors</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("security")}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                    activeCategory === "security"
                      ? "bg-white text-[#003296] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security Doors</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("sanitary")}
                  className={`py-2 px-2 text-[11px] font-bold rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                    activeCategory === "sanitary"
                      ? "bg-white text-[#003296] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Bath className="w-3.5 h-3.5" />
                  <span>Sanitary Wares</span>
                </button>
              </div>

              {/* Physical Product Showcase Image */}
              <Link
                href={currentShowcase.href}
                className="group block relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
              >
                <Image
                  src={currentShowcase.image}
                  alt={currentShowcase.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                  {currentShowcase.badge}
                </div>
              </Link>

              {/* Clear Details & Direct Category Link */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003296]">
                    {currentShowcase.tag}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    In stock at Maraim Plaza, Ogidi
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                    {currentShowcase.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {currentShowcase.specs}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    See all designs & prices:
                  </span>
                  <Link
                    href={currentShowcase.href}
                    className="py-2 px-3.5 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <span>{currentShowcase.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
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
            className="relative w-full max-w-sm sm:max-w-md bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white">
              <span className="text-xs font-bold">Depot Offload at Maraim Plaza, Ogidi</span>
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
