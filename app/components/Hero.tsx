"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { ArrowRight, MessageSquare, ShieldCheck, Truck, Store } from "lucide-react";

export default function Hero() {
  const { settings, setCacModalOpen } = useApp();
  const [heroDoor, setHeroDoor] = useState<"security" | "hdf">("security");

  const currentDoor =
    heroDoor === "security"
      ? {
          title: "Bullet Proof Door",
          subtitle: "Armoured Steel Security",
          price: "₦520,000",
          image: "/products/bullet-proof-door.jpeg",
          slug: "bullet-proof-door",
          tag: "Perimeter Security",
        }
      : {
          title: "Interior Luxury Foreign HDF Door",
          subtitle: "Precision-Engineered Interior",
          price: "₦210,000",
          image: "/products/interior-luxury-foreign-hdf-door.jpeg",
          slug: "interior-luxury-foreign-hdf-door",
          tag: "Interior Room & Estate Standard",
        };

  return (
    <section className="relative bg-white pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-semibold text-[#003296]">
              <span className="w-2 h-2 rounded-full bg-[#003296] inline-block animate-pulse"></span>
              <span>{settings.marketLocation || "Maraim Plaza, Building Material Ogidi, Onitsha"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
              Heavy-Gauge Security & Luxury HDF Doors.{" "}
              <span className="highlight-underline text-[#003296]">
                Direct from Ogidi Depot.
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {settings.companyName}, operated by {settings.parentCompany} ({settings.proprietor || "Chidera Frank Okonkwo"}), is your direct source for foreign luxury HDF room doors, complete fitted wooden sets, and heavy-gauge bullet proof doors at {settings.address}. Direct depot inventory for estates, contractors, and homeowners.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto py-3 px-6 bg-[#003296] hover:bg-[#092b7c] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-95"
              >
                <span>Browse Products Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hello ${settings.parentCompany}, I am inquiring about your door stock and prices at ${settings.marketLocation}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Quick Reassurance Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left border-t border-slate-100 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#003296] shrink-0" />
                <span>Solid Steel & HDF Core</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-700">
                <Truck className="w-4 h-4 text-[#003296] shrink-0" />
                <span>Nationwide Waybill</span>
              </div>
              <button
                type="button"
                onClick={() => setCacModalOpen(true)}
                className="col-span-2 sm:col-span-1 flex items-center space-x-2 text-[11px] font-semibold text-[#003296] hover:underline cursor-pointer"
              >
                <Store className="w-4 h-4 text-[#003296] shrink-0" />
                <span>CAC BN: {settings.cacNumber}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Feature with Switcher */}
          <div className="lg:col-span-5 relative space-y-3">
            {/* Subtle Switcher Pills */}
            <div className="flex items-center justify-center lg:justify-start space-x-2 p-1 bg-slate-100 rounded-xl max-w-xs mx-auto lg:mx-0">
              <button
                type="button"
                onClick={() => setHeroDoor("security")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  heroDoor === "security"
                    ? "bg-white text-[#003296] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Security Steel
              </button>
              <button
                type="button"
                onClick={() => setHeroDoor("hdf")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  heroDoor === "hdf"
                    ? "bg-white text-[#003296] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Luxury HDF Room
              </button>
            </div>

            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100 aspect-[4/5] sm:aspect-[4/4.8]">
              <Image
                src={currentDoor.image}
                alt={`${currentDoor.title} by Anambra Best Door Enterprises`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center transition-all duration-300"
              />

              {/* Floating Overlay Card (Video Aesthetic) */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#003296] block">
                      {currentDoor.tag}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate max-w-[200px]">
                      {currentDoor.title}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{currentDoor.price}</span>
                  </div>
                  <Link
                    href={`/products/${currentDoor.slug}`}
                    className="py-1.5 px-3 bg-[#003296] hover:bg-[#092b7c] text-white text-[11px] font-semibold rounded-lg flex items-center space-x-1 shrink-0"
                  >
                    <span>View Specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
