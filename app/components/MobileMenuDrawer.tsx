"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { X, ChevronDown, ShoppingCart, MessageSquare, Instagram, Store } from "lucide-react";

export default function MobileMenuDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen, settings, cartCount, setCartOpen } = useApp();
  const [productsOpen, setProductsOpen] = useState(false);

  if (!mobileMenuOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-[#FAF9F5] flex flex-col justify-between animate-fade-in overflow-y-auto"
    >
      {/* Top Header with Brand Transparent Logo & Circular Close Button */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 bg-white">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="relative h-9 w-44"
        >
          <Image
            src="/logo.png"
            alt="Anambra Best Door by CFrank Enterprise"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Items (Duevy Style Typography) */}
      <div className="px-6 py-8 flex-1 space-y-6">
        <nav className="space-y-5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            Home
          </Link>

          {/* Products Dropdown Accordion */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer py-1"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              <span className="text-2xl font-bold text-slate-900 hover:text-[#003296] tracking-tight">
                Products
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {productsOpen && (
              <div className="mt-3 pl-3 border-l-2 border-[#003296]/30 space-y-3 pt-1 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
                    Doors & Entrances
                  </span>
                  <div className="space-y-1.5 pl-2 text-slate-600">
                    <Link
                      href="/shop?category=hdf-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-semibold text-slate-900 hover:text-[#003296]"
                    >
                      Foreign HDF Luxury Doors
                    </Link>
                    <Link
                      href="/shop?category=security-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Security & Bulletproof Steel Doors
                    </Link>
                    <Link
                      href="/shop?category=luxury-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Bible Cast & Italian Copper Doors
                    </Link>
                    <Link
                      href="/shop?category=interior-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Watson & American Panel Doors
                    </Link>
                    <Link
                      href="/shop?category=bathroom-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Waterproof Bathroom Doors
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
                    Sanitary Wares & Fittings
                  </span>
                  <div className="space-y-1.5 pl-2 text-slate-600">
                    <Link
                      href="/shop?category=sanitary-fittings&sub=wc"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Water Closets & Toilets (Executive Gold & Pro)
                    </Link>
                    <Link
                      href="/shop?category=sanitary-fittings&sub=basins"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Dining Suite & Plain India Basins
                    </Link>
                    <Link
                      href="/shop?category=sanitary-fittings&sub=showers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Shower Cubicles & Power Towers
                    </Link>
                    <Link
                      href="/shop?category=sanitary-fittings&sub=sinks"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#003296]"
                    >
                      Kitchen Sinks & Big Brother Taps
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-block py-1.5 px-3 bg-blue-50 text-[#003296] font-bold rounded-lg text-xs"
                  >
                    View All Products →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            Contact
          </Link>

          <Link
            href="/downloads"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-slate-900 hover:text-[#003296] tracking-tight transition-colors"
          >
            Downloads
          </Link>
        </nav>

        {/* Social Icons row (Clean & Compact) */}
        <div className="pt-4 border-t border-slate-200/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Follow Us On
          </span>
          <div className="flex items-center gap-2">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white hover:bg-pink-50 hover:text-pink-600 text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-2xs"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white hover:bg-blue-50 hover:text-[#1877F2] text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-2xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={settings.jijiShopUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Jiji.ng Store"
              className="w-9 h-9 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 flex items-center justify-center transition-all border border-slate-200 shadow-2xs"
            >
              <Store className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Dual Pill Action Buttons Matching Duevy Reference sec_01.5.jpg */}
      <div className="p-6 space-y-3 bg-white border-t border-slate-200/80">
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setCartOpen(true);
          }}
          className="w-full py-3.5 px-6 bg-[#FAF9F5] hover:bg-slate-200 text-slate-900 font-bold rounded-full flex items-center justify-center space-x-2 transition-colors text-xs sm:text-sm border border-slate-200 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-slate-800" />
          <span>View Cart ({cartCount})</span>
        </button>

        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
            "Hello CFrank Enterprise, I want to chat about ordering doors and sanitary wares."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 bg-[#003296] hover:bg-[#002266] text-white font-bold rounded-full flex items-center justify-center space-x-2 shadow-sm transition-all text-xs sm:text-sm active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
