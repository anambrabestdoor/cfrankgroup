"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { ShoppingBag, MessageSquare, Phone, MapPin, ShieldCheck, Search } from "lucide-react";

export default function Header() {
  const { cartCount, setCartOpen, setMobileMenuOpen, setSearchOpen, setCacModalOpen, settings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement & Trust Bar */}
      <div className="bg-[#0A192F] text-slate-200 text-[11px] py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Location & Depot */}
          <div className="flex items-center space-x-2 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />

          </div>

          {/* Center Trust: CAC Verification */}
          <button
            onClick={() => setCacModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-blue-200 hover:bg-blue-800/80 transition-colors cursor-pointer text-[10px] font-medium"
          >
            <ShieldCheck className="w-3 h-3 text-blue-300" />
            <span>CAC Registered: {settings.parentCompany}</span>
            <span className="underline text-white font-semibold">Verify</span>
          </button>

          {/* Quick Contact Line */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{settings.phoneDisplay}</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{settings.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? "py-2 px-3 sm:px-6 floating-header-glass shadow-md"
            : "py-3 px-4 sm:px-6 bg-white border-b border-slate-200/80"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="relative h-10 w-44 sm:h-12 sm:w-56">
              <Image
                src="/logo.png"
                alt="Anambra Best Door by CFrank Enterprise Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-slate-700">
            <Link href="/" className="hover:text-[#003296] transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-[#003296] transition-colors">
              All Doors & Fittings
            </Link>
            <Link href="/shop?category=security-doors" className="hover:text-[#003296] transition-colors">
              Security Doors
            </Link>
            <Link href="/shop?category=interior-doors" className="hover:text-[#003296] transition-colors">
              Interior Doors
            </Link>
            <Link href="/shop?category=smart-locks" className="hover:text-[#003296] transition-colors">
              Smart Locks
            </Link>
            <Link href="/about" className="hover:text-[#003296] transition-colors">
              About CFrank
            </Link>
            <Link href="/contact" className="hover:text-[#003296] transition-colors">
              Showroom
            </Link>
          </nav>

          {/* Header Action Items */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search door catalogue"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`View Cart, ${cartCount} items`}
              className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-800" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#003296] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* WhatsApp CTA (Desktop & Tablet) */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am inquiring about door orders from your website.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 py-2 px-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs rounded-full shadow-sm transition-transform active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Order</span>
            </a>

            {/* Minimalist 2-Line Hamburger Menu Button for Mobile (from video) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="lg:hidden w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex flex-col items-center justify-center space-y-1.5 transition-colors"
            >
              <span className="w-4 h-0.5 bg-slate-900 rounded-full block"></span>
              <span className="w-4 h-0.5 bg-slate-900 rounded-full block"></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
