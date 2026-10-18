"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { ArrowRight, MessageSquare, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const { settings } = useApp();

  return (
    <section className="relative bg-[#FAF9F5] sm:bg-[#F8FAFC] pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8">
        {/* 1. Checkmark Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-[#003296] transition-transform hover:scale-105">
          <CheckCircle2 className="w-4 h-4 text-[#003296] shrink-0" />
          <span>Authentic Heavy-Gauge Turkish Steel & HDF Doors</span>
        </div>

        {/* 2. Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] sm:leading-[1.1]">
          Quality Steel Security,{" "}
          <span className="block sm:inline">HDF Doors &</span>{" "}
          <span className="relative inline-block text-[#003296]">
            Sanitary Wares.
            {/* Hand-drawn organic underline accent like Duevy */}
            <svg
              className="absolute left-0 -bottom-2 sm:-bottom-3 w-full h-3 text-[#003296]/30 overflow-visible"
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

        {/* 3. Subtitle / Human Trade Copy */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          Anambra Best Door (operated by CFrank Enterprise) supplies Turkish armoured security doors, luxury HDF room doors, waterproof bathroom doors, and commercial sanitary fittings directly from our depot at Maraim Plaza, Building Material International Market Ogidi, to residential estates, contractors, and builders nationwide.
        </p>

        {/* 4. Dual Call-to-Action Pill Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 sm:pt-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto py-3.5 sm:py-4 px-8 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center space-x-2 shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <span>SEE PRODUCTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I would like to inquire about your door inventory, current prices, and delivery terms.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3.5 sm:py-4 px-8 bg-[#F1F5F9] hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-full flex items-center justify-center space-x-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>CHAT US ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </section>
  );
}
