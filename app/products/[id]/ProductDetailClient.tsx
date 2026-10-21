"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DoorProduct } from "@/app/data/doorsData";
import { useApp } from "@/app/context/AppContext";
import {
  Lock,
  Truck,
  MessageSquare,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Layers,
  VolumeX,
} from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";

interface ProductDetailClientProps {
  product: DoorProduct;
  relatedProducts: DoorProduct[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart, settings } = useApp();

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const activeImage = galleryImages[currentImageIndex] || product.image;

  const [selectedSize, setSelectedSize] = useState<string>("Standard 3ft x 7ft");
  const [selectedOrientation, setSelectedOrientation] = useState<string>("Right Inward");
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleDirectWhatsApp = () => {
    const url = buildWhatsAppOrderUrl({
      productName: product.name,
      price: product.price && product.price > 0 ? product.price : undefined,
      quantity,
      size: selectedSize,
      orientation: selectedOrientation,
      targetPhone: settings.whatsappNumber,
      inquiryTemplate: settings.whatsappInquiryTemplate,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      size: selectedSize,
      orientation: selectedOrientation,
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  // Dynamic specification fallbacks
  const specMaterial =
    product.specifications?.Material ||
    (product.category === "security-doors"
      ? "Armoured Steel"
      : product.category === "bathroom-doors"
      ? "Waterproof WPC"
      : "HDF Wooden Board");

  const specHardware =
    product.specifications?.["Locking Mechanism"] ||
    product.specifications?.Hardware ||
    "Mortise Lockset Included";

  const specAcoustic =
    product.specifications?.Infill ||
    product.specifications?.Core ||
    "Sound Dampening Core";

  return (
    <div className="bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-[#003296] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/shop" className="hover:text-[#003296] transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/collections/${product.category}`}
            className="hover:text-[#003296] transition-colors"
          >
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white rounded-xl border border-slate-200/90 p-4 sm:p-8 shadow-xs">
          {/* Gallery / Image Column */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <Image
                src={activeImage}
                alt={`${product.name} - ${product.categoryLabel} available at Anambra Best Door`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-all duration-300"
              />
              {product.badge && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                  {product.badge}
                </div>
              )}

              {/* Gallery Navigation Arrows (if multiple images available) */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      prevImage();
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextImage();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Gallery Thumbnails (only displayed when multiple photos exist) */}
            {galleryImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1 pt-1">
                {galleryImages.map((img, idx) => {
                  const isSelected = currentImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#003296] ring-1 ring-[#003296]"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details & Ordering Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
                {product.categoryLabel} • CFrank Enterprise
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Quick Visual Specification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#003296] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Material</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {specMaterial}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#003296] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hardware</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {specHardware}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-2">
                <VolumeX className="w-4 h-4 text-[#003296] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Acoustic</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {specAcoustic}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#003296] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivery</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    Nationwide Waybill
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Quantity Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Price:
                  </span>
                  {product.price && product.price > 0 ? (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#003296]">
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ₦{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm sm:text-base font-bold text-slate-800">
                      Contact for Wholesale / Project Price
                    </div>
                  )}
                </div>

                <div className="text-right flex items-center gap-2">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <Check className="w-3 h-3" />
                    <span>
                      {product.stockStatus === "in_stock" ? "In Stock" : "Available to Order"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Quantity Stepper integrated directly in Price Box */}
              <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Order Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 min-w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Standardized Dimension Pill Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Select Door Dimension / Opening Size:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Standard 3ft x 7ft", "4ft x 7ft (1.5 Leaf)", "4.5ft x 7ft (Double)", "Custom Opening"].map(
                  (s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`h-11 px-3 text-xs font-bold rounded-xl border flex items-center justify-center text-center transition-colors cursor-pointer ${
                          isSelected
                            ? "border-[#003296] bg-[#003296] text-white shadow-xs"
                            : "border-slate-200 text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Standardized Opening Orientation Pill Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Opening Orientation:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Right Inward", "Left Inward", "Right Outward", "Left Outward"].map((o) => {
                  const isSelected = selectedOrientation === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setSelectedOrientation(o)}
                      className={`h-11 px-3 text-xs font-bold rounded-xl border flex items-center justify-center text-center transition-colors cursor-pointer ${
                        isSelected
                          ? "border-[#003296] bg-[#003296] text-white shadow-xs"
                          : "border-slate-200 text-slate-700 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Buttons (Directly below option selectors) */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full py-3.5 px-6 bg-[#003296] hover:bg-[#002266] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-slate-700" />
                <span>{addedNotice ? "Added to Quote / Cart!" : "Add to Quote / Cart"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Specifications Table */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Detailed Specs</h2>
            <p className="text-xs text-slate-500">
              Factory specifications for this model supplied by CFrank Enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-600">{key}:</span>
                <span className="font-bold text-slate-900 text-right">{val}</span>
              </div>
            ))}
          </div>

          {/* Full Long Description */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Product Description</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Related Doors & Architectural Fittings
              </h2>
              <Link href="/shop" className="text-xs font-bold text-[#003296] hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <Link href={`/products/${p.slug}`} className="block group">
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                      <Image
                        src={p.image}
                        alt={`${p.name} - ${p.categoryLabel}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {p.categoryLabel}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#003296]">
                      {p.name}
                    </h3>
                    <span className="text-xs font-extrabold text-slate-950 block mt-0.5">
                      {p.price && p.price > 0 ? `₦${p.price.toLocaleString()}` : "Price on Request"}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
