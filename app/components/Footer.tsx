"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { BadgeCheck, MapPin, Phone, Mail, Clock, Store, Instagram, MessageSquare } from "lucide-react";

export default function Footer() {
  const { settings, setCacModalOpen } = useApp();

  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Corporate Summary Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-44">
                <Image
                  src="/logo.png"
                  alt="Anambra Best Door by CFrank Enterprise Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm">
              Anambra Best Door (operated by CFrank Enterprise) supplies Turkish steel security doors, interior luxury HDF room doors, waterproof bathroom doors, and commercial sanitary fittings directly from Maraim Plaza, Building Material International Market, Ogidi, to builders and residential estates nationwide.
            </p>

            {/* CAC Trust Badge */}
            <div className="inline-flex items-center space-x-2 py-2 px-3.5 bg-blue-50/80 border border-blue-200/70 rounded-full text-xs font-semibold text-[#003296]">
              <BadgeCheck className="w-4 h-4 text-[#003296]" />
              <span>CAC BN: {settings.cacNumber} (CFrank Enterprise)</span>
              <button
                type="button"
                onClick={() => setCacModalOpen(true)}
                className="underline hover:text-[#002266] ml-1 cursor-pointer font-bold"
              >
                Verify
              </button>
            </div>

            {/* Official Social Media Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Connect With Our Depot
              </span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Anambra Best Door on Instagram"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 flex items-center justify-center transition-all border border-slate-200/70 hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Anambra Best Door on Facebook"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#1877F2] text-slate-700 flex items-center justify-center transition-all border border-slate-200/70 hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Jiji */}
                <a
                  href={settings.jijiShopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Anambra Best Door Verified Store on Jiji.ng"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 flex items-center justify-center transition-all border border-slate-200/70 hover:scale-105"
                  title="Jiji.ng Store"
                >
                  <Store className="w-4 h-4" />
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am contacting you from your website.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with Anambra Best Door on WhatsApp"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#25D366] text-slate-700 flex items-center justify-center transition-all border border-slate-200/70 hover:scale-105"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Category A: Doors & Entrances */}
          <div className="space-y-3">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Doors & Entrances
            </h3>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li>
                <Link href="/shop?category=security-doors" className="hover:text-[#003296] transition-colors font-bold text-[#003296]">
                  Turkish Steel Security Doors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hdf-doors" className="hover:text-[#003296] transition-colors">
                  Foreign HDF Interior Doors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=interior-doors" className="hover:text-[#003296] transition-colors">
                  Watson & Panel Doors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bathroom-doors" className="hover:text-[#003296] transition-colors">
                  Waterproof Bathroom Doors
                </Link>
              </li>
            </ul>
          </div>

          {/* Category B: Sanitary Wares & Hardware */}
          <div className="space-y-3">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Fittings & Hardware
            </h3>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li>
                <Link href="/shop?category=sanitary-fittings" className="hover:text-[#003296] transition-colors font-bold text-[#003296]">
                  Water Closets & Basins
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sanitary-fittings" className="hover:text-[#003296] transition-colors">
                  Shower Systems & Sinks
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#003296] transition-colors">
                  Door Locks & Accessories
                </Link>
              </li>
              <li>
                <Link href="/collections/hdf-doors" className="hover:text-[#003296] transition-colors">
                  Complete Pre-Hung Sets
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-[#003296] transition-colors font-bold text-[#003296] flex items-center gap-1">
                  <span>Download Catalogues</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-[#003296] rounded font-extrabold uppercase">PDF</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Depot Address & Support Desk */}
          <div className="space-y-3">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Depot Contact
            </h3>
            <div className="space-y-2.5 text-slate-600 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#003296] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#003296] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-[#003296] font-semibold">
                  {settings.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#003296] shrink-0" />
                <a href={`mailto:${settings.salesEmail}`} className="hover:text-[#003296] truncate">
                  {settings.salesEmail}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-slate-500">
                <Clock className="w-4 h-4 text-[#003296] shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Line */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>© 2026 Anambra Best Door. Operated by CFrank Enterprise</span>
            <span className="text-slate-300">|</span>
            <a
              href="https://kator.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="italic text-slate-600 hover:text-[#003296] transition-colors hover:underline"
            >
              Designed and Developed by
            </a>
            <a
              href="https://usemadar.top"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-800 hover:text-[#003296] transition-colors hover:underline"
            >
              Madar
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/downloads" className="hover:text-[#003296] font-semibold transition-colors">
              PDF Catalogues
            </Link>
            <span>•</span>
            <span>Deliveries Arranged Across Nigeria</span>
            <span>•</span>
            <span>Maraim Plaza, Ogidi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
