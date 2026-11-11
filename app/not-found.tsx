"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Phone } from "lucide-react";
import { useApp } from "@/app/context/AppContext";
import { brand } from "@/lib/brand";

export default function NotFound() {
  const router = useRouter();
  const { settings } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  const whatsappMessage = encodeURIComponent(
      `Hello ${brand.name}, I was looking for a product or service on your website that could not be found. Please assist me with availability.`
  );
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber || brand.whatsappNumber}?text=${whatsappMessage}`;

  const departments = [
    {
      title: "Security & Steel Doors",
      description: "Turkish steel entrance doors and armoured multi-lock systems",
      href: "/collections/security-doors",
    },
    {
      title: "Foreign HDF Room Doors",
      description: "Interior luxury room doors and Watson panels with frames",
      href: "/collections/hdf-doors",
    },
    {
      title: "Waterproof Bathroom Doors",
      description: "Moisture-resistant WPC and composite doors for restrooms",
      href: "/collections/bathroom-doors",
    },
    {
      title: "Sanitary Wares & Fittings",
      description: "Water closets, washbasins, cubicle showers, and mixer taps",
      href: "/collections/sanitary-fittings",
    },
  ];

  return (
      <div className="bg-[#F7F6F2] min-h-[65vh] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E0]">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* Main Status & Error Message */}
          <div className="space-y-3">
              <p className="text-xs font-mono font-bold text-[#73787E] uppercase tracking-widest">
                Error 404
              </p>
                <h1 className="text-2xl sm:text-3xl font-black text-[#171A1D] tracking-tight">
                  Page Not Found
                </h1>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-xl">
                    The page, product model, or collection link you requested does not exist or may have been moved. Search our catalogue below or browse a department.
                  </p>
                </div>

                {/* Search Field */}
                <form onSubmit={handleSearchSubmit} className="max-w-xl">
                    <label htmlFor="catalog-search" className="block text-xs font-semibold text-[#171A1D] uppercase tracking-wider mb-2">
                      Search Catalogue
                    </label>
                        <div className="flex items-center rounded-lg border border-[#E5E5E0] bg-white focus-within:border-[#171A1D] focus-within:ring-1 focus-within:ring-[#171A1D] overflow-hidden">
                          <div className="pl-3.5 text-[#73787E]">
                            <Search className="w-4 h-4" />
                          </div>
                          <input
                            id="catalog-search"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search doors, sanitary fittings, taps, building supplies..."
                            className="w-full py-2.5 px-3 text-sm text-[#171A1D] placeholder:text-[#6B7280] focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="bg-[#171A1D] hover:bg-[#252A2F] text-white px-5 py-2.5 text-xs font-semibold tracking-wide transition-colors shrink-0"
                          >
                            Search
                          </button>
                        </div>
                      </form>

                      {/* Departments Directory */}
                      <div className="space-y-4 pt-2">
                          <h2 className="text-xs font-bold text-[#171A1D] uppercase tracking-wider border-b border-[#E5E5E0] pb-2">
                            Browse Core Catalogue
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {departments.map((dept) => (
                              <Link
                                key={dept.href}
                                href={dept.href}
                                className="p-4 rounded-lg border border-[#E5E5E0] hover:border-[#F3661B] bg-white transition-colors block group"
                              >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-[#171A1D] group-hover:text-[#F3661B] transition-colors">
                                      {dept.title}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#73787E] group-hover:text-[#F3661B] transition-colors" />
                                </div>
                                  <p className="text-[11px] text-[#6B7280] mt-1 leading-normal">
                                    {dept.description}
                                  </p>
                              </Link>
                            ))}
                          </div>
                      </div>

                        {/* Help & Direct Contacts */}
                        <div className="pt-4 border-t border-[#E5E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#4A4A4A]">
                          <div>
                              <span className="font-semibold text-[#171A1D] block">{brand.name} Showroom</span>
                              <span className="text-[#6B7280]">
                                {settings.address || brand.address}
                              </span>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <Link
                              href="/"
                              className="text-[#171A1D] hover:text-[#F3661B] font-semibold"
                            >
                              Home
                            </Link>
                            <span className="text-[#E5E5E0]">|</span>
                            <Link
                              href="/shop"
                              className="text-[#171A1D] hover:text-[#F3661B] font-semibold"
                            >
                              All Products
                            </Link>
                            <span className="text-[#E5E5E0]">|</span>
                            <a
                              href={`tel:${settings.phone || brand.phone}`}
                              className="text-[#171A1D] hover:text-[#F3661B] font-semibold inline-flex items-center space-x-1"
                            >
                              <Phone className="w-3 h-3 text-[#73787E]" />
                              <span>{settings.phoneDisplay || brand.phoneDisplay}</span>
                            </a>
                            <span className="text-[#E5E5E0]">|</span>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 font-semibold"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>
                    );
}
