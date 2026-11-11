"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { Search, X, ChevronRight } from "lucide-react";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";
import { brand } from "@/lib/brand";

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
      aria-label="Search Catalogue"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 animate-fade-in"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-md shadow-2xl border border-[#E5E3DC] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#E5E3DC] bg-[#FBF9F5]">
            <Search className="w-5 h-5 text-[#6B7280] shrink-0 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${brand.name} products, doors, sanitary fittings...`}
              autoFocus
              className="w-full bg-transparent text-sm sm:text-base text-[#121518] placeholder:text-[#6B7280] focus:outline-none"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                className="text-[#6B7280] hover:text-[#121518] p-1 mr-1 text-xs"
              >
                Clear
              </button>
            ) : null}
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="w-8 h-8 rounded-full bg-white text-[#121518] border border-[#E5E3DC] flex items-center justify-center hover:bg-[#E5E3DC] transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Results Area */}
          <div className="p-4 overflow-y-auto space-y-3">
            {query.trim() === "" ? (
                <div className="py-8 text-center text-xs text-[#6B7280]">
                  <p>Type a keyword, product name, or specification (e.g. "Security door", "HDF", "Water closet").</p>
                </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#4A4A4A]">
                    <p className="font-semibold text-[#121518]">No matching items found for "{query}"</p>
                    <p className="mt-1 text-[#6B7280]">Contact a customer care agent for custom or special orders.</p>
                  </div>
                  ) : (
            filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center space-x-3.5 p-2.5 rounded-lg hover:bg-[#FBF9F5] transition-colors border border-transparent hover:border-[#E5E3DC]"
                  >
                      <div className="relative w-12 h-14 bg-[#FBF9F5] rounded-md overflow-hidden shrink-0 border border-[#E5E3DC]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-[#73787E] block">
                            {product.categoryLabel}
                          </span>
                            <h4 className="text-xs sm:text-sm font-semibold text-[#121518] truncate">
                              {product.name}
                            </h4>
                            {product.price && product.price > 0 ? (
                    <span className="text-xs font-bold text-[#121518]">
                      ₦{product.price.toLocaleString()}
                    </span>
                  ) : null}
                </div>
                <ChevronRight className="w-4 h-4 text-[#73787E] shrink-0" />
              </Link>
                          ))
          )}
                      </div>
                    </div>
                </div>
                );
}
