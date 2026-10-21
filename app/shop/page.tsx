"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import { DOOR_PRODUCTS, CATEGORIES, CATEGORY_GROUPS } from "@/app/data/doorsData";
import { ChevronDown, Search, ArrowRight, MessageSquare, RotateCcw } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

function ShopContent() {
  const { settings } = useApp();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSub = searchParams.get("sub");

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    if (urlCategory) {
      if (urlCategory === "doors") {
        setSelectedGroup("doors");
        setSelectedCategory("all");
      } else if (urlCategory === "sanitary" || urlCategory === "sanitary-fittings") {
        setSelectedGroup("sanitary");
        setSelectedCategory("sanitary-fittings");
      } else {
        setSelectedCategory(urlCategory);
      }
    }
  }, [urlCategory]);

  const filteredProducts = useMemo(() => {
    return DOOR_PRODUCTS.filter((product) => {
      if (!product || !product.active) return false;

      // Group filter (Doors vs Sanitary)
      if (selectedGroup !== "all" && product.group && product.group !== selectedGroup) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesSub = product.subcategory?.toLowerCase().includes(q);
        const matchesSpec = Object.values(product.specifications).some((val) =>
          val.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesSub && !matchesSpec) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      return 0; // default featured order
    });
  }, [selectedGroup, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedGroup("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Archive Header */}
      <div className="bg-white border-b border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block">
            Direct Warehouse Inventory • Nationwide Delivery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Doors & Sanitary Ware Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Direct importer rates on heavy-gauge Turkish security doors, luxury foreign HDF room doors, waterproof bathroom doors, and commercial sanitary fittings.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Main Group Switcher Tabs: All / Doors & Entrances / Sanitary Wares & Fittings */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => {
              setSelectedGroup("all");
              setSelectedCategory("all");
            }}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGroup === "all"
                ? "bg-[#003296] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            All Products
          </button>

          <button
            onClick={() => {
              setSelectedGroup("doors");
              setSelectedCategory("all");
            }}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGroup === "doors"
                ? "bg-[#003296] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            Doors & Entrances
          </button>

          <button
            onClick={() => {
              setSelectedGroup("sanitary");
              setSelectedCategory("all");
            }}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGroup === "sanitary"
                ? "bg-[#003296] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            Sanitary Wares & Fittings
          </button>
        </div>

        {/* Filter, Search & Sort Bar */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by model, HDF, steel gauge, WC, tap..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003296]"
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
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
              </div>
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Types
            </button>
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#003296] text-white shadow-xs"
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
          {(selectedGroup !== "all" || selectedCategory !== "all" || searchQuery !== "" || sortBy !== "featured") && (
            <button
              onClick={resetFilters}
              className="text-[#003296] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid: 2-Column Mobile, 3-Column Tablet, 4-Column Desktop */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
            <p className="text-base font-bold text-slate-800">No matching products found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We may have unlisted variations in stock at our warehouse.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={resetFilters}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Clear Search & Filters
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am looking for a specific door or sanitary ware not listed on your shop page.")}`}
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
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8 text-xs text-slate-500">Loading catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
