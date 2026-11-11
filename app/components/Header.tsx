"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { ShoppingCart, MessageSquare, ChevronDown, Search, ArrowRight } from "lucide-react";
import { brand, colors, whatsappDefaults } from "@/lib/brand";

export default function Header() {
  const { cartCount, setCartOpen, setMobileMenuOpen, setSearchOpen, settings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    <header
      className={`sticky top-0 z-40 bg-[#FBF9F5] border-b border-[#E5E3DC] transition-[padding,box-shadow] duration-200 ${
        isScrolled ? "py-3 shadow-xs" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* 1. Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 shrink-0">
          <div className="relative h-9 w-40 sm:h-11 sm:w-52">
            <Image
              src={settings.logoUrl || "/cfranklogo.png"}
              alt={`${brand.name} Logo`}
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* 2. Desktop Navigation — Clean Architectural Text Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold text-[#121518]">
          <Link
            href="/"
            className="hover:text-[#F3661B] transition-colors py-1"
          >
            Home
          </Link>

          {/* Products Mega Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              onMouseEnter={() => setProductsDropdownOpen(true)}
              className="inline-flex items-center gap-1 hover:text-[#F3661B] transition-colors py-1 focus:outline-none cursor-pointer"
              aria-expanded={productsDropdownOpen}
            >
              <span>Shop</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  productsDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {productsDropdownOpen && (
              <div
                onMouseLeave={() => setProductsDropdownOpen(false)}
                className="absolute top-full -left-12 mt-3 w-[600px] bg-white rounded-md shadow-lg border border-[#E5E3DC] p-5 z-50 animate-in fade-in duration-150"
              >
                <div className="grid grid-cols-2 gap-5 divide-x divide-[#E5E3DC]">
                  {/* Doors & Entrances */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E3DC]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#121518]">
                        Doors & Entrances
                      </span>
                      <Link
                        href="/shop?category=doors"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="text-[10px] font-medium text-[#73787E] hover:text-[#F3661B]"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="space-y-1 text-xs">
                      <Link
                        href="/shop?category=hdf-doors"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Foreign HDF Luxury Doors
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Acoustic room doors & pre-hung complete sets
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=security-doors"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Security & Armoured Doors
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Bulletproof, Israeli multi-bolt & Juihua
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=luxury-doors"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Luxury Cast & Copper Doors
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Bible design cast & Italian architectural copper
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=interior-doors"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Watson & Panel Doors
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Standard 3ft & 4ft room entrances
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=bathroom-doors"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Waterproof Bathroom Doors
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Moisture-proof composite flush doors
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Sanitary Ware & Fittings */}
                  <div className="space-y-3 pl-5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E3DC]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#121518]">
                        Sanitary Wares & Fittings
                      </span>
                      <Link
                        href="/shop?category=sanitary-fittings"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="text-[10px] font-medium text-[#73787E] hover:text-[#F3661B]"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="space-y-1 text-xs">
                      <Link
                        href="/shop?category=sanitary-fittings&sub=wc"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Water Closets & Toilets
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Executive suites, England designs, Pro WC series
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=sanitary-fittings&sub=basins"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Wash Hand Basins
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Dining basin suites & vanity basins
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=sanitary-fittings&sub=showers"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Showers & Enclosures
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Cubicle shower rooms & power shower systems
                        </span>
                      </Link>

                      <Link
                        href="/shop?category=sanitary-fittings&sub=sinks"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="block p-2 rounded-md hover:bg-[#FBF9F5] transition-colors group"
                      >
                        <span className="font-semibold text-[#121518] group-hover:text-[#F3661B] block">
                          Kitchen Sinks & Brassware
                        </span>
                        <span className="text-[11px] text-[#73787E]">
                          Stainless steel sinks & designer taps
                        </span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#E5E3DC]">
                      <Link
                        href="/shop"
                        onClick={() => setProductsDropdownOpen(false)}
                        className="w-full py-2 px-3 bg-[#FBF9F5] hover:bg-[#E5E3DC] text-[#121518] font-semibold text-xs rounded-md flex items-center justify-between transition-colors"
                      >
                        <span>Explore Full Catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className="hover:text-[#F3661B] transition-colors py-1"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-[#F3661B] transition-colors py-1"
          >
            Contact
          </Link>

          <Link
            href="/downloads"
            className="hover:text-[#F3661B] transition-colors py-1"
          >
            Downloads
          </Link>
        </nav>

        {/* 3. Header Action Items — Crisp Architectural Rectangular Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search catalogue"
            className="w-9 h-9 rounded-md bg-white border border-[#E5E3DC] hover:border-[#121518] hover:bg-[#FBF9F5] text-[#121518] flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`View Cart, ${cartCount} items`}
            className="relative w-9 h-9 rounded-md bg-white border border-[#E5E3DC] hover:border-[#121518] hover:bg-[#FBF9F5] text-[#121518] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#F3661B] text-white text-[9px] font-bold rounded-sm flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/${settings.whatsappNumber || brand.whatsappNumber}?text=${encodeURIComponent(
              whatsappDefaults.generalGreeting
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 py-2 px-3.5 bg-[#121518] hover:bg-[#252A2F] text-white font-medium text-xs rounded-md transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#F3661B]" />
            <span>Contact Us</span>
          </a>

          {/* Minimalist Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden w-9 h-9 rounded-md bg-white border border-[#E5E3DC] hover:border-[#121518] hover:bg-[#FBF9F5] text-[#121518] flex flex-col items-center justify-center space-y-1 transition-colors cursor-pointer"
          >
            <span className="w-4 h-[1.5px] bg-[#121518] block"></span>
            <span className="w-4 h-[1.5px] bg-[#121518] block"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
