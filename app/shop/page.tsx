"use client";

import React, { useState, useMemo } from "react";
import ProductCard from "@/app/components/ProductCard";
import { DOOR_PRODUCTS, CATEGORIES } from "@/app/data/doorsData";
import { SlidersHorizontal, ChevronDown, Search, ArrowRight, MessageSquare, RotateCcw } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function ShopPage() {
  const { settings } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  const filteredProducts = useMemo(() => {
    return DOOR_PRODUCTS.filter((product) => {
      if (!product.active) return false;
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesSpec = Object.values(product.specifications).some((val) =>
          val.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesSpec) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return 0; // default featured order
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Archive Header */}
      <div className="bg-[#0A192F] text-white py-12 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Security Doors & Building Fittings
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            All prices in Nigerian Naira (₦). Genuine heavy-gauge steel, precision joinery, and reliable door hardware. Available for retail and contractor wholesale with nationwide dispatch.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Filter, Search & Sort Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by door model, steel gauge, size..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003296]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-3 self-end md:self-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#003296] cursor-pointer"
                >
                  <option value="featured">Featured Inventory</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#003296] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items in catalogue
          </span>
          {(selectedCategory !== "all" || searchQuery !== "" || sortBy !== "featured") && (
            <button
              onClick={resetFilters}
              className="text-[#003296] font-semibold hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid: 2-Column Mobile, 3-Column Tablet, 4-Column Desktop */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <p className="text-base font-bold text-slate-800">No matching products found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We may have unlisted variations in stock at Shop 14 Chubby Plaza Ogidi.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={resetFilters}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl"
              >
                Clear Search & Filters
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am looking for a specific door not listed on your shop page.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center space-x-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Direct Inquiries Callout */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#003296] block">
              Architectural & Project Supply
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Need custom door dimensions or bulk building waybill?
            </h3>
            <p className="text-xs text-slate-500">
              We supply whole building packages (Main Entrance, Rooms, Bathrooms, and Locksets) with certified contractor delivery.
            </p>
          </div>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I would like to discuss a bulk project quote for building doors.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center space-x-2 shadow-sm shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Project Quote</span>
          </a>
        </div>
      </main>
    </div>
  );
}
