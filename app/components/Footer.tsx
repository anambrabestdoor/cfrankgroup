"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { ShieldCheck, MapPin, Phone, Mail, Clock, Store, Instagram, ExternalLink } from "lucide-react";
import { CATEGORIES } from "@/app/data/doorsData";

export default function Footer() {
  const { settings, setCacModalOpen } = useApp();

  return (
    <footer className="bg-[#0A192F] text-slate-300 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Corporate Entity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-lg font-black text-white tracking-tight block">
                ANAMBRA <span className="text-blue-400">BEST DOOR</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                Operated by {settings.parentCompany}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Direct importer of certified heavy-gauge Turkish armoured security doors, contemporary interior wooden room doors, waterproof WPC bathroom doors, and biometric smart locks in Onitsha, Anambra State.
            </p>

            {/* CAC Trust Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2 max-w-sm">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified CAC Registered Entity</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {settings.parentCompany} is registered under the Companies and Allied Matters Act (CAC BN: {settings.cacNumber}).
              </p>
              <button
                onClick={() => setCacModalOpen(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold underline flex items-center space-x-1"
              >
                <span>View Official Certificate</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider">
              Product Categories
            </h3>
            <ul className="space-y-2 text-slate-400">
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.id}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation & Trust Links */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider">
              Company & Channels
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About CFrank Enterprise
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Showroom & Depot Location
                </Link>
              </li>
              <li>
                <a
                  href={settings.jijiShopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1 text-emerald-400 font-medium"
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
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram @anambrabestdoor</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Staff Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom & Depot Contact */}
          <div className="space-y-3">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider">
              Ogidi Showroom Depot
            </h3>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />

              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">
                  {settings.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${settings.salesEmail}`} className="hover:text-white truncate">
                  {settings.salesEmail}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Anambra Best Door. Operated by {settings.parentCompany}. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <span>Ogidi Onitsha, Anambra State</span>
            <span>•</span>
            <span>Nationwide Waybill Delivery</span>
            <span>•</span>
            <button
              onClick={() => setCacModalOpen(true)}
              className="hover:text-white text-slate-400 underline"
            >
              CAC Certificate
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
