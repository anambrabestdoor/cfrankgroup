"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DoorProduct } from "@/app/data/doorsData";
import { useApp } from "@/app/context/AppContext";
import { ChevronRight, MessageSquare, Plus } from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";

interface ProductCardProps {
  product: DoorProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, settings } = useApp();

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = buildWhatsAppOrderUrl({
      productName: product.name,
      price: product.price && product.price > 0 ? product.price : undefined,
      quantity: 1,
      targetPhone: settings.whatsappNumber,
      inquiryTemplate: settings.whatsappInquiryTemplate,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-xl overflow-hidden hover-card-elevate flex flex-col justify-between">
      {/* Product Image Link */}
      <Link href={`/products/${product.slug}`} className="block relative w-full aspect-[4/5] bg-slate-100 overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.name} - ${product.categoryLabel} by CFrank Enterprise`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Status Badge in Top Right */}
        {product.badge && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wider rounded-md uppercase shadow-sm">
            {product.badge}
          </div>
        )}

        {/* Quick Add Button on Hover / Mobile touch */}
        <button
          onClick={handleQuickAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md hover:bg-[#003296] hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </Link>

      {/* Card Content & Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <Link href={`/products/${product.slug}`} className="block mb-2 group-hover:text-[#003296] transition-colors">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
            {product.categoryLabel}
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            {product.price && product.price > 0 ? (
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-slate-950">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] text-slate-400 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            ) : null}
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {product.stockStatus === "in_stock" ? "In Stock" : "Available to Order"}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleQuickWhatsApp}
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              aria-label={`View ${product.name} specifications`}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
