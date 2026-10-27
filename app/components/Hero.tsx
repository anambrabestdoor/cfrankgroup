"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const heroSlides = [
  {
    id: "hdf-door",
    title: "Foreign HDF Room Door",
    image: "/WhatsApp Image 2026-10-19 at 7.46.19 AM.jpeg",
    href: "/shop?category=hdf-doors",
    buttonText: "Browse Room Doors",
    alt: "Foreign Luxury HDF Wooden Door with complete frame and lock at Anambra Best Door",
  },
  {
    id: "security-door",
    title: "Heavy-Gauge Turkish Security Door",
    image: "/WhatsApp Image 2026-10-19 at 7.46.18 AM.jpeg",
    href: "/shop?category=security-doors",
    buttonText: "Browse Security Doors",
    alt: "Heavy-Gauge Turkish Steel Security Door displayed at Anambra Best Door warehouse",
  },
  {
    id: "sanitary-wc",
    title: "Executive Luxury Water Closet (WC)",
    image: "/products/Excutive Gøld wc.jpeg",
    href: "/shop?category=sanitary-fittings",
    buttonText: "Browse Sanitary Wares",
    alt: "Executive Luxury Water Closet by Anambra Best Door and CFrank Enterprise",
  },
  {
    id: "residential-installation",
    title: "Luxury Pre-Hung Interior Sets",
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
    }, 4000);
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
            {/* Quality Label Badge */}
            <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-blue-50/80 border border-blue-200/70 rounded-full text-xs font-bold text-[#003296] w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#003296]" />
              <span>Quality Doors and Sanitary Wares</span>
            </div>

            {/* 1. Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Doors That Define Your Space.
            </h1>

            {/* 2. Trade Copy */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              Anambra Best Door is a prominent door dealer and manufacturer in Anambra State, Nigeria, a subsidiary of CFrank Enterprise. From HDF interior doors to security doors and bathroom doors, we help homeowners, builders and contractors find the right fit for their projects.
            </p>


            {/* 4. Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="py-3.5 px-7 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>Browse Our Doors</span>
                <ArrowRight className="w-4 h-4" />
              </Link>


              {/* Watch Video Button */}
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 border border-slate-200 shadow-xs transition-colors cursor-pointer"
                title="Watch warehouse offloading video"
              >
                <Play className="w-3.5 h-3.5 text-[#003296] fill-current" />
                <span>Watch Warehouse Video</span>
              </button>
            </div>
          </div>

          {/* Right Column: Clean Architectural Physical Product Slideshow */}
          <div
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-sm p-2 sm:p-2.5">
              {/* Product Slideshow Image Box (Subtle crisp corners, zero floating stickers) */}
              <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                <Link href={slide.href} className="block w-full h-full relative" aria-label={`View ${slide.title}`}>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center transition-opacity duration-500"
                  />
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

                {/* Minimalist Pagination Dots */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-xs">
                  {heroSlides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === idx ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Clean Product Caption & Direct Browse Link (No Overcomplicated Labels) */}
              <div className="pt-2.5 pb-1 px-1 flex items-center justify-between gap-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {slide.title}
                </h3>
                <Link
                  href={slide.href}
                  className="text-xs font-bold text-[#003296] hover:underline inline-flex items-center space-x-1 shrink-0"
                >
                  <span>{slide.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
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
            className="relative w-full max-w-sm sm:max-w-md bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white">
              <span className="text-xs font-bold">Warehouse Offloading Video</span>
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
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                <source
                  src="https://res.cloudinary.com/xsmuyjy5/video/upload/v1792953541/anambra_best_door/videos/hero_warehouse_offloading.mp4"
                  type="video/mp4"
                />
                <source
                  src="/WhatsApp Video 2026-10-19 at 7.46.16 AM.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
