"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { Search, X, ChevronRight } from "lucide-react";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, products } = useApp();
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const list = products && products.length > 0 ? products : DOOR_PRODUCTS;
    return list.filter(
      (p) =>
        p.active !== false &&
        (p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        (p.specifications && Object.values(p.specifications).some((val) => val.toLowerCase().includes(q))))
    ).slice(0, 6);
  }, [query, products]);

  if (!searchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Doors Catalogue"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Turkish steel doors, Watson room doors, smart locks..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1 mr-1 text-xs"
            >
              Clear
            </button>
          ) : null}
          <button
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 overflow-y-auto space-y-3">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <p>Type a keyword, door specification, or category (e.g. "Turkish", "Waterproof", "Double leaf").</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              <p className="font-semibold text-slate-700">No matching doors found for "{query}"</p>
              <p className="mt-1 text-slate-400">Contact our sales desk on WhatsApp for custom orders.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => setSearchOpen(false)}
                className="flex items-center space-x-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="relative w-12 h-14 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {product.categoryLabel}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {product.name}
                  </h4>
                  {product.price && product.price > 0 ? (
                    <span className="text-xs font-extrabold text-[#003296]">
                      ₦{product.price.toLocaleString()}
                    </span>
                  ) : null}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
