"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const heroSlides = [
  {
    id: "hdf-door",
    tag: "Interior Room Door",
    title: "Foreign HDF Room Door",
    specs: "Complete set with matching frame, architrave, hinges, and lock handle.",
    badge: "In Stock at Ogidi",
    image: "/WhatsApp Image 2026-10-19 at 7.46.19 AM.jpeg",
    href: "/shop?category=hdf-doors",
    buttonText: "Browse Room Doors",
    alt: "Foreign Luxury HDF Wooden Door with complete frame and lock at Anambra Best Door",
  },
  {
    id: "security-door",
    tag: "Main Entrance Door",
    title: "Heavy-Gauge Turkish Security Door",
    specs: "Armoured steel leaf with multi-point deadlock and master laser keys.",
    badge: "In Stock at Ogidi",
    image: "/WhatsApp Image 2026-10-19 at 7.46.18 AM.jpeg",
    href: "/shop?category=security-doors",
    buttonText: "Browse Security Doors",
    alt: "Heavy-Gauge Turkish Steel Security Door displayed at Anambra Best Door depot, Ogidi",
  },
  {
    id: "sanitary-wc",
    tag: "Bathroom & Toilet",
    title: "Executive Luxury Water Closet (WC)",
    specs: "Quality ceramic toilet set with dual-flush cistern and soft-closing seat cover.",
    badge: "In Stock at Ogidi",
    image: "/products/Excutive Gøld wc.jpeg",
    href: "/shop?category=sanitary-fittings",
    buttonText: "Browse Sanitary Wares",
    alt: "Executive Luxury Water Closet by Anambra Best Door and CFrank Enterprise",
  },
  {
    id: "residential-installation",
    tag: "Estate Installations",
    title: "Luxury Pre-Hung Interior Sets",
    specs: "Precision installed with acoustic sound damping across residential suites.",
    badge: "Direct Importer",
    image: "/WhatsApp Image 2026-10-19 at 7.46.19 AM (2).jpeg",
    href: "/shop",
    buttonText: "Browse Our Doors",
    alt: "Anambra Best Door residential suite installation corridor",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Automatic slideshow interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section className="relative bg-[#FAF9F5] sm:bg-[#F8FAFC] pt-8 pb-10 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Real Trade Copy, Direct CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* 1. Trust & Location Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-[#003296]">
              <CheckCircle2 className="w-4 h-4 text-[#003296] shrink-0" />
              <span>Direct Importer • Maraim Plaza, Ogidi Onitsha</span>
            </div>

            {/* 2. Main Headline */}
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

              {/* Watch Video Button */}
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                title="Watch warehouse offloading video at Maraim Plaza"
              >
                <Play className="w-3.5 h-3.5 text-[#003296] fill-current" />
                <span>Watch Warehouse Video</span>
              </button>
            </div>
          </div>

          {/* Right Column: Physical Product Slideshow Showcase */}
          <div
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden p-3 sm:p-4 space-y-3">
              {/* Product Slideshow Image Box */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <Link href={slide.href} className="block w-full h-full relative">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center transition-opacity duration-500"
                  />

                  {/* Badge Overlay */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">
                    {slide.badge}
                  </div>
                </Link>

                {/* Slideshow Arrow Controls */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    prevSlide();
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    nextSlide();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-xs">
                  {heroSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? "w-5 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide Information & Action Box */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003296]">
                    {slide.tag}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    In stock at Maraim Plaza, Ogidi
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-snug">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {slide.specs}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    See designs & prices:
                  </span>
                  <Link
                    href={slide.href}
                    className="py-2 px-3.5 bg-[#003296] hover:bg-[#002266] text-white text-xs font-bold rounded-xl inline-flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <span>{slide.buttonText}</span>
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
