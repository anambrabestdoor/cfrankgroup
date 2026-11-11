"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DoorProduct } from "@/app/data/doorsData";
import { useApp } from "@/app/context/AppContext";
import { ChevronRight, MessageSquare, Plus, Check } from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";
import { brand } from "@/lib/brand";

interface ProductCardProps {
  product: DoorProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, settings } = useApp();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const safeName = product.name || "Quality Product";
  const safeCategoryLabel = product.categoryLabel || product.category || "Building Materials";
  const safeSlug = product.slug || product.id || "shop";
  const safeImage =
    product.image && typeof product.image === "string" && product.image.trim() !== ""
      ? product.image.trim()
      : "/products/security-steel-door.jpg";
  const isExternal = safeImage.startsWith("http://") || safeImage.startsWith("https://");

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = buildWhatsAppOrderUrl({
      productName: safeName,
      price: product.price && product.price > 0 ? product.price : undefined,
      quantity: 1,
      targetPhone: settings.whatsappNumber || brand.whatsappNumber,
      inquiryTemplate: settings.whatsappInquiryTemplate,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stockBadgeLabel =
    product.stockStatus === "in_stock"
      ? "In Stock"
      : product.stockStatus === "low_stock"
      ? "Low Stock"
      : product.stockStatus === "made_to_order"
      ? "Made to Order"
      : "Available on Order";

  return (
    <div className="group relative bg-white border border-[#E5E3DC] rounded-lg overflow-hidden hover:border-[#F3661B]/60 hover:shadow-sm transition-all flex flex-col justify-between">
      {/* Product Image Link */}
      <Link href={`/products/${safeSlug}`} className="block relative w-full aspect-[4/5] bg-[#F5F2EB] overflow-hidden">
        <Image
          src={safeImage}
          alt={`${safeName} - ${safeCategoryLabel} | ${brand.name}`}
          fill
          unoptimized={isExternal}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-104"
          loading="lazy"
        />

        {/* Status Badge in Top Right */}
        {product.badge && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#F3661B] text-white text-[9px] font-bold tracking-wider rounded uppercase shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Quick Add Button on Hover / Mobile */}
        <button
          onClick={handleQuickAdd}
          aria-label={`Add ${safeName} to cart`}
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full border border-[#E5E3DC] flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
            added
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white text-[#121518] hover:bg-[#121518] hover:text-white"
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </Link>

      {/* Card Content & Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <Link href={`/products/${safeSlug}`} className="block mb-2 group-hover:text-[#F3661B] transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7077] block mb-0.5">
            {safeCategoryLabel}
          </span>
          <h3 className="text-xs sm:text-sm font-semibold text-[#121518] line-clamp-2 leading-snug">
            {safeName}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E5E3DC] flex items-end justify-between gap-2">
          <div>
            {product.price && product.price > 0 ? (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xs sm:text-sm font-bold text-[#121518]">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] text-[#6B7077] line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-[#F3661B]">
                Price on Request
              </span>
            )}
            <span className="text-[10px] text-[#6B7077] block mt-0.5">
              {stockBadgeLabel}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleQuickWhatsApp}
              title="Inquire on WhatsApp"
              aria-label={`Inquire about ${product.name} on WhatsApp`}
              className="w-7 h-7 rounded-full bg-[#FBF9F5] text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors border border-[#E5E3DC] cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              aria-label={`View ${product.name} specifications`}
              className="w-7 h-7 rounded-full bg-[#FBF9F5] text-[#121518] hover:bg-[#E5E3DC] flex items-center justify-center transition-colors border border-[#E5E3DC]"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
