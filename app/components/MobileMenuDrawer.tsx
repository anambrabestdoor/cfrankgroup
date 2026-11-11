"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { X, ChevronDown, ShoppingCart, MessageSquare, Instagram, Store } from "lucide-react";
import { brand, colors, whatsappDefaults } from "@/lib/brand";

export default function MobileMenuDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen, settings, cartCount, setCartOpen } = useApp();
  const [productsOpen, setProductsOpen] = useState(false);

  if (!mobileMenuOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-[#FBF9F5] flex flex-col justify-between animate-fade-in overflow-y-auto"
    >
        {/* Top Header with Brand Logo & Close Button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E3DC] bg-white">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="relative h-9 w-44"
          >
            <Image
              src="/cfranklogo.png"
              alt={`${brand.name} Logo`}
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full bg-[#FBF9F5] hover:bg-[#E5E3DC] text-[#121518] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Items */}
        <div className="px-6 py-8 flex-1 space-y-6">
          <nav className="space-y-5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-bold text-[#121518] hover:text-[#F3661B] tracking-tight transition-colors"
            >
              Home
            </Link>

            {/* Products Dropdown Accordion */}
            <div>
              <div
                className="flex items-center justify-between cursor-pointer py-1"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                  <span className="text-2xl font-bold text-[#121518] hover:text-[#F3661B] tracking-tight">
                    Shop
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#121518] transition-transform duration-200 ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                  />
            </div>

            {productsOpen && (
              <div className="mt-3 pl-3 border-l-2 border-[#F3661B]/40 space-y-3 pt-1 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3661B] block mb-1">
                    Doors & Entrances
                  </span>
                  <div className="space-y-1.5 pl-2 text-[#4A4A4A]">
                    <Link
                      href="/shop?category=hdf-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-medium text-[#121518] hover:text-[#F3661B]"
                    >
                      Foreign HDF Luxury Doors
                    </Link>
                    <Link
                      href="/shop?category=security-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Security & Bulletproof Steel Doors
                    </Link>
                    <Link
                      href="/shop?category=luxury-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Bible Cast & Italian Copper Doors
                    </Link>
                    <Link
                      href="/shop?category=interior-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Watson & American Panel Doors
                    </Link>
                    <Link
                      href="/shop?category=bathroom-doors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Waterproof Bathroom Doors
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3661B] block mb-1">
                    Sanitary Wares & Fittings
                  </span>
                  <div className="space-y-1.5 pl-2 text-[#4A4A4A]">
                    <Link
                      href="/shop?category=sanitary-fittings&sub=wc"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Water Closets & Toilets (Executive & Pro)
                    </Link>
                    <Link
                      href="/shop?category=sanitary-fittings&sub=basins"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Dining Suite & Wash Basins
                    </Link>
                    <Link
                      href="/shop?category=sanitary-fittings&sub=showers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Shower Cubicles & Power Towers
                    </Link>
                    <Link
                      href="/shop?category=sanitary-fittings&sub=sinks"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#F3661B]"
                    >
                      Kitchen Sinks & Quality Taps
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-block py-1.5 px-3 bg-white text-[#121518] border border-[#E5E3DC] font-semibold rounded-lg text-xs hover:border-[#F3661B]"
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
            className="block text-2xl font-bold text-[#121518] hover:text-[#F3661B] tracking-tight transition-colors"
          >
            About
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-[#121518] hover:text-[#F3661B] tracking-tight transition-colors"
          >
            Contact
          </Link>

          <Link
            href="/downloads"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-2xl font-bold text-[#121518] hover:text-[#F3661B] tracking-tight transition-colors"
          >
            Downloads
          </Link>
        </nav>

        {/* Social Icons row */}
        <div className="pt-4 border-t border-[#E5E3DC]">
          <span className="text-[10px] font-bold text-[#73787E] uppercase tracking-wider block mb-2">
            Connect
          </span>
          <div className="flex items-center gap-2">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white hover:text-pink-600 text-[#4A4A4A] flex items-center justify-center transition-all border border-[#E5E3DC]"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white hover:text-[#1877F2] text-[#4A4A4A] flex items-center justify-center transition-all border border-[#E5E3DC]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {settings.jijiShopUrl && (
              <a
                href={settings.jijiShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Jiji Store"
                className="w-9 h-9 rounded-full bg-white hover:text-emerald-700 text-[#4A4A4A] flex items-center justify-center transition-all border border-[#E5E3DC]"
              >
                <Store className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="p-6 space-y-3 bg-white border-t border-[#E5E3DC]">
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setCartOpen(true);
          }}
          className="w-full py-3.5 px-6 bg-[#FBF9F5] hover:bg-[#E5E3DC] text-[#121518] font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors text-xs sm:text-sm border border-[#E5E3DC] cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-[#121518]" />
          <span>View Cart ({cartCount})</span>
        </button>

        <a
          href={`https://wa.me/${settings.whatsappNumber || brand.whatsappNumber}?text=${encodeURIComponent(
            whatsappDefaults.generalGreeting
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-6 bg-[#121518] hover:bg-[#252A2F] text-white font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-xs transition-colors text-xs sm:text-sm cursor-pointer"
        >
                  <MessageSquare className="w-4 h-4 text-[#F3661B]" />
                  <span>Contact on WhatsApp</span>
                </a>
              </div>
            </div>
            );
}
