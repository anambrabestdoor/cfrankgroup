"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { DOOR_PRODUCTS, CATEGORIES } from "@/app/data/doorsData";
import { brand } from "@/lib/brand";
import {
  ChevronDown,
  Search,
  MessageSquare,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Building2,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { useApp } from "@/app/context/AppContext";

const PRODUCTS_PER_PAGE = 12;

function ShopContent() {
  const { settings, products } = useApp();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get("category");
  const urlBusiness = searchParams.get("business");
  const urlQuery = searchParams.get("q") || searchParams.get("search");

  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || "all");
  const [searchQuery, setSearchQuery] = useState<string>(urlQuery || "");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Sync with URL params
  useEffect(() => {
    if (urlQuery) setSearchQuery(urlQuery);
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlCategory, urlQuery]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy, inStockOnly]);

  const filteredProducts = useMemo(() => {
    const activeList = products && products.length > 0 ? products : DOOR_PRODUCTS;

    const filtered = activeList.filter((product) => {
      if (!product || product.active === false) return false;

      // Filter by Category
      if (selectedCategory !== "all") {
        if (product.category !== selectedCategory) return false;
      }

      // Filter by in-stock status
      if (inStockOnly && product.stockStatus !== "in_stock") {
        return false;
      }

      // Filter by Search Query
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

        if (!matchesName && !matchesDesc && !matchesSub && !matchesSpec) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
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
  }, [selectedCategory, searchQuery, sortBy, inStockOnly, products]);

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
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("latest");
    setInStockOnly(false);
    setCurrentPage(1);
  };

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
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Archive Header Banner */}
      <section className="bg-[#121518] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#22262B]">
        <div className="max-w-7xl mx-auto space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F3661B] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Product Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            CFrank Group Shop
          </h1>
          <p className="text-xs sm:text-sm text-[#D1D1CC] max-w-2xl leading-relaxed">
            Order quality security doors, foreign HDF luxury doors, stone-coated roof tiles, and sanitary wares directly from our inventory.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Category Selector Tabs */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#73787E] block text-center sm:text-left">
            Filter by Category
          </span>
          <div className="flex items-center justify-start gap-2 flex-wrap pb-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`py-2 px-3.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#121518] text-white shadow-xs"
                  : "bg-white text-[#4A4A4A] hover:bg-[#E5E3DC] border border-[#E5E3DC]"
              }`}
            >
              All Products ({products?.length || DOOR_PRODUCTS.length})
            </button>
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
              const count = (products || DOOR_PRODUCTS).filter(
                (p) => p.category === cat.id
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`py-2 px-3.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-[#121518] text-white shadow-xs"
                      : "bg-white text-[#4A4A4A] hover:bg-[#E5E3DC] border border-[#E5E3DC]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-[#F3661B] font-semibold">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-md border border-[#E5E3DC] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#73787E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product name, specification, finish, door size..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-md text-xs sm:text-sm text-[#121518] placeholder:text-[#73787E] focus:outline-none focus:border-[#121518]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#73787E] hover:text-[#121518] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Controls: Category Dropdown & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-md text-xs font-semibold text-[#121518] focus:outline-none focus:border-[#121518] cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#73787E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-md text-xs font-semibold text-[#121518] focus:outline-none focus:border-[#121518] cursor-pointer"
                >
                  <option value="latest">Sort: Newest First</option>
                  <option value="featured">Sort: Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#73787E] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* In-Stock Toggle */}
              <label className="flex items-center gap-2 text-xs text-[#4A4A4A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-[#E5E3DC] text-[#121518] focus:ring-0"
                />
                <span>In-Stock Only</span>
              </label>

              {(selectedCategory !== "all" ||
                searchQuery ||
                inStockOnly ||
                sortBy !== "latest") && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#F3661B] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-[#73787E] pt-2 border-t border-[#E5E3DC]">
            <div>
              Showing <strong className="text-[#121518]">{filteredProducts.length}</strong> items
              {selectedCategory !== "all" && (
                <span> in <strong className="text-[#121518]">{CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory}</strong></span>
              )}
            </div>

            <Link
              href="/wholesale"
              className="text-[#121518] hover:text-[#F3661B] font-semibold inline-flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-[#F3661B]" />
              <span>Project BOQ Sourcing</span>
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-md border border-[#E5E3DC] space-y-4">
            <div className="w-14 h-14 rounded-md bg-[#FBF9F5] border border-[#E5E3DC] text-[#73787E] mx-auto flex items-center justify-center">
              <Search className="w-5 h-5 text-[#F3661B]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#121518]">No matching items found</h3>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                No items matched your current filter criteria. Try clearing filters or contacting our customer care agent for offline stock.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="py-2.5 px-5 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-md transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 sm:gap-2 pt-6">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className="p-2 rounded-md border border-[#E5E3DC] bg-white text-[#121518] hover:bg-[#FBF9F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-xs text-[#73787E]">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page as number)}
                  className={`w-9 h-9 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    safePage === page
                      ? "bg-[#121518] text-white shadow-xs"
                      : "bg-white border border-[#E5E3DC] text-[#121518] hover:bg-[#FBF9F5]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-2 rounded-md border border-[#E5E3DC] bg-white text-[#121518] hover:bg-[#FBF9F5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-12 text-xs text-[#73787E]">
          Loading CFrank Group Unified Shop...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
