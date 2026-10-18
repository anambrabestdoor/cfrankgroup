"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { X, ChevronDown, MessageSquare, ShoppingCart, ShieldCheck } from "lucide-react";
import { CATEGORIES } from "@/app/data/doorsData";

export default function MobileMenuDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen, setCacModalOpen, settings, cartCount, setCartOpen } = useApp();
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  if (!mobileMenuOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-white flex flex-col justify-between animate-fade-in overflow-y-auto"
    >
      {/* Top Header with Close Button */}
      <div className="flex items-center justify-between px-6 py-6">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="text-xl font-black tracking-tight text-slate-900"
        >
          ANAMBRA <span className="text-[#003296]">BEST DOOR</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation - Bold, Clean Typography like Video */}
      <div className="px-6 py-4 flex-1 space-y-6">
        <nav className="space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-3xl sm:text-4xl font-extrabold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            Home
          </Link>

          <div>
            <div className="flex items-center justify-between">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl sm:text-4xl font-extrabold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
              >
                Products
              </Link>
              <button
                onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                aria-label="Toggle categories"
                className="p-2 text-slate-400 hover:text-slate-700"
              >
                <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${categoriesExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>

            {categoriesExpanded && (
              <div className="mt-3 ml-2 pl-4 border-l-2 border-slate-100 space-y-2.5">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-slate-700 hover:text-[#003296]"
                >
                  All Products
                </Link>
                {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-slate-500 hover:text-[#003296]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-3xl sm:text-4xl font-extrabold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            About
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-3xl sm:text-4xl font-extrabold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* CAC Registration Trust */}
        <div className="pt-6">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setCacModalOpen(true);
            }}
            className="inline-flex items-center space-x-2 text-xs text-slate-500 hover:text-[#003296] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CAC Registered: {settings.parentCompany}</span>
            <span className="underline font-semibold">View Verification</span>
          </button>
        </div>
      </div>

      {/* Bottom Sleek Pill Action Buttons Matching Video sec_01.5.jpg */}
      <div className="p-6 space-y-3">
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
            "Hello CFrank Enterprise, I would like to inquire about current price and stock availability."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 bg-[#003296] hover:bg-[#002266] text-white font-bold rounded-full flex items-center justify-center space-x-2 shadow-sm transition-all text-sm active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Inquire on WhatsApp</span>
        </a>

        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setCartOpen(true);
          }}
          className="w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-full flex items-center justify-center space-x-2 transition-colors text-sm"
        >
          <ShoppingCart className="w-4 h-4 text-slate-700" />
          <span>View Cart ({cartCount})</span>
        </button>
      </div>
    </div>
  );
}
