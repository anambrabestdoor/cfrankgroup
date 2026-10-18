"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { X, ArrowRight, Phone, MessageSquare, ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { CATEGORIES } from "@/app/data/doorsData";

export default function MobileMenuDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen, setCacModalOpen, settings, cartCount, setCartOpen } = useApp();

  if (!mobileMenuOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-white flex flex-col justify-between animate-fade-in overflow-y-auto"
    >
      {/* Top Bar with Logo & Close Button */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg tracking-tight text-slate-900">
            ANAMBRA <span className="text-[#003296]">BEST DOOR</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="px-6 py-6 flex-1 space-y-6">
        {/* Trust Pill */}
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setCacModalOpen(true);
          }}
          className="w-full py-2.5 px-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-[#003296] font-semibold"
        >
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#003296]" />
            <span>CAC Registered: {settings.parentCompany}</span>
          </div>
          <span className="text-[11px] underline">View Certificate</span>
        </button>

        {/* Primary Page Links */}
        <div className="space-y-4 pt-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between text-2xl font-bold text-slate-900 hover:text-[#003296] transition-colors"
          >
            <span>All Products</span>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] transition-colors"
          >
            About CFrank
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] transition-colors"
          >
            Contact & Showroom
          </Link>
          <a
            href={settings.jijiShopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xl font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <span>Official Jiji.ng Store</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </a>
        </div>

        {/* Categories Section */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Product Categories
          </span>
          <div className="space-y-2.5">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-700 hover:text-[#003296] py-1 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Showroom Address */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
          <span className="font-semibold text-slate-700 block">Ogidi Showroom Depot</span>
          <p>{settings.address}</p>
          <p className="text-[11px] text-slate-400">Hours: {settings.workingHours}</p>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/60 space-y-2.5">
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am inquiring about door orders from your website.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
        <a
          href={`tel:${settings.phone}`}
          className="w-full py-3 px-4 bg-[#003296] hover:bg-[#092b7c] text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors text-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Call Showroom: {settings.phoneDisplay}</span>
        </a>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setCartOpen(true);
          }}
          className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center justify-center space-x-1.5"
        >
          <ShoppingBag className="w-4 h-4 text-slate-500" />
          <span>View Saved Cart ({cartCount})</span>
        </button>
      </div>
    </div>
  );
}
