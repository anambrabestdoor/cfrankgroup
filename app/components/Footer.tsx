"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { ShieldCheck, MapPin, Phone, Mail, Clock, Store, Instagram } from "lucide-react";
import { CATEGORIES } from "@/app/data/doorsData";

export default function Footer() {
  const { settings, setCacModalOpen } = useApp();

  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
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
              Anambra Best Door (operated by CFrank Enterprise) is Nigeria's trusted direct importer of Turkish steel security doors, interior luxury HDF room doors, waterproof bathroom doors, and commercial sanitary fittings at Maraim Plaza, Building Material International Market Ogidi.
            </p>

            {/* CAC Trust Badge */}
            <div className="inline-flex items-center space-x-2 py-2 px-3.5 bg-blue-50/80 border border-blue-200/70 rounded-full text-xs font-semibold text-[#003296]">
              <ShieldCheck className="w-4 h-4 text-[#003296]" />
              <span>CAC BN: {settings.cacNumber} (CFrank Enterprise)</span>
              <button
                type="button"
                onClick={() => setCacModalOpen(true)}
                className="underline hover:text-[#002266] ml-1 cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Products
            </h3>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li>
                <Link href="/shop?category=interior-doors" className="hover:text-[#003296] transition-colors font-bold text-[#003296]">
                  Foreign HDF Room Doors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=security-doors" className="hover:text-[#003296] transition-colors">
                  Turkish Armoured Doors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bathroom-doors" className="hover:text-[#003296] transition-colors">
                  Waterproof Bathroom Doors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=sanitary-fittings" className="hover:text-[#003296] transition-colors">
                  Sanitary Wares & Basins
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#003296] transition-colors">
                  All Door Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Depot Links */}
          <div className="space-y-3">
            <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider">
              Company & Depot
            </h3>
            <ul className="space-y-2.5 text-slate-600 font-medium">
              <li>
                <Link href="/about" className="hover:text-[#003296] transition-colors">
                  About CFrank Enterprise
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#003296] transition-colors">
                  Store & Depot Location
                </Link>
              </li>
              <li>
                <a
                  href={settings.jijiShopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors flex items-center space-x-1.5 text-emerald-700"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Jiji.ng Verified Store</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 transition-colors flex items-center space-x-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram Profile</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#003296] transition-colors text-slate-400">
                  Staff Admin Login
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

        {/* Bottom Attribution Line (Duevy Style) */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Anambra Best Door. Operated by {settings.parentCompany} (CAC BN: {settings.cacNumber}).
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>Building Material International Market Ogidi</span>
            <span>•</span>
            <span>Nationwide Waybill</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCacModalOpen(true)}
              className="text-[#003296] hover:underline font-semibold cursor-pointer"
            >
              Verify Certificate
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
