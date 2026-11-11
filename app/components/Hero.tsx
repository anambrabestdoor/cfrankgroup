"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";

export default function Hero() {
  const { settings } = useApp();
  const videoSrc = settings.heroVideoUrl || "/cfrank_hero_assembly.mp4?v=4.5";
  const posterSrc = settings.heroPosterUrl || "/cfrank_hero_poster.webp?v=4.5";
  const fallbackImage = settings.heroImageUrl || "/cfrank_hero_completed_house.png";
  return (
    <section className="relative w-full bg-[#121518] text-[#FBF9F5] border-b border-[#22262B] overflow-hidden">
      {/* Subtle warm depth layer behind building */}
      <div
        className="pointer-events-none absolute top-[-20%] right-[5%] w-[60%] h-[120%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(243, 102, 27, 0.08) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Architectural Value Proposition & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08] mb-5">
              Everything to build,
              <br />
              secure, and complete <span className="text-[#F3661B]">your space.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#9EA5AD] leading-relaxed max-w-lg mb-8">
              We deliver quality security doors, stone-coated roof tiles, smart biometric door locks,
              and sanitary wares; building project supply in one order.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-[#F3661B] hover:bg-[#D9530F] text-white text-xs sm:text-sm font-bold rounded-md transition-colors shadow-xs"
              >
                Browse shop
              </Link>
              <Link
                href="/about"
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-[#C5CAD0] hover:text-white text-xs sm:text-sm font-semibold rounded-md border border-[#2E353D] hover:border-[#515961] transition-colors"
              >
                About us
              </Link>
            </div>
          </div>

          {/* Right Column: Seamless 3D Architectural Animation Showcase */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[580px] flex items-center justify-center">
              {/* Native HTML5 Chromeless Video */}
              <video
                key={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                poster={posterSrc}
                className="w-full h-full object-contain pointer-events-none select-none bg-[#121518]"
                aria-label="CFrank Group architectural assembly animation"
              >
                {videoSrc.endsWith(".webm") ? (
                  <source src={videoSrc} type="video/webm" />
                ) : (
                  <source src={videoSrc} type="video/mp4" />
                )}
                {/* Fallback image inside video element */}
                <Image
                  src={fallbackImage}
                  alt="CFrank Group architectural assembly completed house"
                  fill
                  className="object-contain"
                  priority
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
