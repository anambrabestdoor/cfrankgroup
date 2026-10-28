"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Phone } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

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
    "Hello CFrank Enterprise, I was looking for a product on your website that could not be found. Please assist me with availability."
  );
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${whatsappMessage}`;

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
    <div className="bg-white min-h-[65vh] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Main Status & Error Message */}
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Error 404
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
            The page, product model, or collection link you requested does not exist or may have been moved. Search our warehouse catalog below or continue to a department.
          </p>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl">
          <label htmlFor="catalog-search" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Search Inventory
          </label>
          <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-[#003296] focus-within:ring-1 focus-within:ring-[#003296] overflow-hidden">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Turkish doors, HDF room doors, basins, taps..."
              className="w-full py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#003296] hover:bg-[#092b7c] text-white px-5 py-2.5 text-xs font-bold tracking-wide transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Departments Directory */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
            Browse Core Catalog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map((dept) => (
              <Link
                key={dept.href}
                href={dept.href}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50 transition-colors block group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#003296] transition-colors">
                    {dept.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#003296] transition-colors" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {dept.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Warehouse Help & Direct Contacts */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-900 block">Direct Warehouse Assistance</span>
            <span className="text-slate-500">
              Building Materials International Market, Ogidi, Anambra State
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/"
              className="text-[#003296] hover:underline font-semibold"
            >
              Homepage
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/shop"
              className="text-[#003296] hover:underline font-semibold"
            >
              All Products
            </Link>
            <span className="text-slate-300">|</span>
            <a
              href={`tel:${settings.phone}`}
              className="text-slate-700 hover:text-slate-900 font-semibold inline-flex items-center space-x-1"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{settings.phone}</span>
            </a>
            <span className="text-slate-300">|</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
