"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { ShoppingCart, MessageSquare, ChevronDown, Search } from "lucide-react";

export default function Header() {
  const { cartCount, setCartOpen, setMobileMenuOpen, setSearchOpen, settings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
            : "bg-white border-b border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* 1. Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="relative h-9 w-40 sm:h-11 sm:w-52">
              <Image
                src="/logo.png"
                alt="Anambra Best Door by CFrank Enterprise Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* 2. Desktop Navigation — Center Floating Pill Capsule (Duevy Style) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/60 shadow-xs">
            <Link
              href="/"
              className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-[#003296] hover:bg-white rounded-full transition-all"
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                onMouseEnter={() => setProductsDropdownOpen(true)}
                className="inline-flex items-center space-x-1 px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-[#003296] hover:bg-white rounded-full transition-all focus:outline-none cursor-pointer"
                aria-expanded={productsDropdownOpen}
              >
                <span>Products</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {productsDropdownOpen && (
                <div
                  onMouseLeave={() => setProductsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/shop"
                    onClick={() => setProductsDropdownOpen(false)}
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900">All Products</span>
                    <span className="text-[11px] text-slate-500">Complete doors & sanitary inventory</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100"></div>
                  <Link
                    href="/shop?category=interior-doors"
                    onClick={() => setProductsDropdownOpen(false)}
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-[#003296]">Foreign HDF Room Doors</span>
                    <span className="text-[11px] text-slate-500">Acoustic, pre-hung luxury timber sets</span>
                  </Link>
                  <Link
                    href="/shop?category=security-doors"
                    onClick={() => setProductsDropdownOpen(false)}
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900">Security Steel Doors</span>
                    <span className="text-[11px] text-slate-500">Bullet proof, copper, Turkish armored</span>
                  </Link>
                  <Link
                    href="/shop?category=bathroom-doors"
                    onClick={() => setProductsDropdownOpen(false)}
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900">Waterproof Bathroom Doors</span>
                    <span className="text-[11px] text-slate-500">WPC & aluminium composite flush doors</span>
                  </Link>
                  <Link
                    href="/shop?category=sanitary-fittings"
                    onClick={() => setProductsDropdownOpen(false)}
                    className="flex flex-col px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900">Sanitary Wares & Fittings</span>
                    <span className="text-[11px] text-slate-500">Rimless WCs, luxury vanity basins, sinks</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-[#003296] hover:bg-white rounded-full transition-all"
            >
              Depot & About
            </Link>

            <Link
              href="/contact"
              className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-[#003296] hover:bg-white rounded-full transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* 3. Header Action Items (Desktop & Mobile) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search door catalogue"
              className="w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button (Shopping trolley, NO HANDBAG) */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`View Cart, ${cartCount} items`}
              className="relative w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#003296] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin text link (Desktop) */}
            <Link
              href="/admin"
              className="hidden md:inline-block text-xs font-bold text-slate-600 hover:text-[#003296] px-2 py-1 transition-colors"
            >
              Admin
            </Link>

            {/* WhatsApp Direct Order Pill (Desktop & Tablet — Duevy Style) */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                "Hello CFrank Enterprise, I am contacting you from your website to inquire about your door and sanitary products catalog."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-2 py-2.5 px-5 bg-[#003296] hover:bg-[#002266] text-white font-bold text-xs rounded-full shadow-sm transition-all active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Order</span>
            </a>

            {/* Duevy-Style 2-Line Minimalist Circular Menu Toggle (=) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-900 flex flex-col items-center justify-center space-y-1.5 transition-colors cursor-pointer"
            >
              <span className="w-4 h-[2px] bg-slate-900 rounded-full block"></span>
              <span className="w-4 h-[2px] bg-slate-900 rounded-full block"></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
