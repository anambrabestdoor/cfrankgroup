"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import { DOOR_PRODUCTS, CATEGORIES } from "@/app/data/doorsData";
import { ChevronDown, Search, MessageSquare, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

const PRODUCTS_PER_PAGE = 12;

function ShopContent() {
  const { settings, products } = useApp();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlQuery = searchParams.get("q") || searchParams.get("search");

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery || "");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (urlQuery) setSearchQuery(urlQuery);
    if (urlCategory) {
      if (urlCategory === "doors") {
        setSelectedGroup("doors");
        setSelectedCategory("all");
      } else if (urlCategory === "sanitary" || urlCategory === "sanitary-fittings") {
        setSelectedGroup("all");
        setSelectedCategory("sanitary-fittings");
      } else {
        setSelectedGroup("all");
        setSelectedCategory(urlCategory);
      }
    }
  }, [urlCategory, urlQuery]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGroup, selectedCategory, searchQuery, sortBy]);

  const filteredProducts = useMemo(() => {
    const activeList = products && products.length > 0 ? products : DOOR_PRODUCTS;
    const filtered = activeList.filter((product) => {
      if (!product || !product.active) return false;

      if (selectedGroup !== "all" && product.group && product.group !== selectedGroup) return false;
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesName = (product.name || "").toLowerCase().includes(q);
        const matchesDesc = (product.shortDescription || product.description || "").toLowerCase().includes(q);
        const matchesSub = (product.subcategory || "").toLowerCase().includes(q);
        const specs =
          product.specifications && typeof product.specifications === "object"
            ? Object.values(product.specifications)
            : [];
        const matchesSpec = specs.some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesSub && !matchesSpec) return false;
      }
      return true;
    });

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "featured") {
        // Featured first, then by creation time
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      // "latest" and default: newest first (products from DB already come newest-first, preserve order)
      const getTime = (p: typeof a) => {
        if (p.createdAt) {
          const t = new Date(p.createdAt).getTime();
          if (!isNaN(t) && t > 0) return t;
        }
        const match = (p.id || "").match(/\d{10,}/);
        return match ? Number(match[0]) : 0;
      };
      return getTime(b) - getTime(a);
    });
  }, [selectedGroup, selectedCategory, searchQuery, sortBy, products]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE
  );

  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSelectedGroup("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("latest");
    setCurrentPage(1);
  };

  // Build page numbers array (show max 7 page buttons)
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
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
            Doors &amp; Sanitary Ware Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Direct importer rates on heavy-gauge Turkish security doors, luxury foreign HDF room doors, waterproof bathroom doors, and commercial sanitary fittings.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Main Group Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[
            { label: "All Items", group: "all", category: "all" },
            { label: "Doors & Entrances", group: "doors", category: "all" },
            { label: "Bathrooms & Sanitary", group: "all", category: "sanitary-fittings" },
            { label: "Paint & Finishes", group: "all", category: "paint" },
            { label: "Roof Tiles", group: "all", category: "roof-tiles" },
            { label: "Real Estate", group: "all", category: "real-estate" },
            { label: "Careers", group: "all", category: "careers" },
          ].map(({ label, group, category }) => {
            const isActive =
              selectedGroup === group &&
              (category === "all" ? selectedCategory === "all" : selectedCategory === category);
            return (
              <button
                key={label}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedCategory(category);
                }}
                className={`py-2 px-4 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#003296] text-white shadow-sm"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {label}
              </button>
            );
          })}
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
                  <option value="latest">Latest First</option>
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
            Showing{" "}
            <strong className="text-slate-900">
              {(safePage - 1) * PRODUCTS_PER_PAGE + 1}–{Math.min(safePage * PRODUCTS_PER_PAGE, filteredProducts.length)}
            </strong>{" "}
            of <strong className="text-slate-900">{filteredProducts.length}</strong> items
            {totalPages > 1 && (
              <span className="text-slate-400 ml-1">· page {safePage} of {totalPages}</span>
            )}
          </span>
          {(selectedGroup !== "all" || selectedCategory !== "all" || searchQuery !== "" || sortBy !== "latest") && (
            <button
              onClick={resetFilters}
              className="text-[#003296] font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
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
                Clear Search &amp; Filters
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
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 pt-4 pb-2 flex-wrap">
                {/* Prev */}
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-2 text-xs text-slate-400 select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page as number)}
                      aria-label={`Go to page ${page}`}
                      aria-current={safePage === page ? "page" : undefined}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        safePage === page
                          ? "bg-[#003296] text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
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
