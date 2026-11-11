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
  Play,
  Package,
  Building2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";
import { brand } from "@/lib/brand";

interface ProductDetailClientProps {
  product: DoorProduct;
  relatedProducts: DoorProduct[];
}

interface MediaItem {
  type: "image" | "video";
  url: string;
}

const isVideoUrl = (url: string) => {
  if (!url) return false;
  return (
    /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) ||
    url.includes("/video/upload/") ||
    url.includes("resource_type=video")
  );
};

export const isDoorProduct = (p: { group?: string; category?: string; name?: string }) => {
  if (p.group === "doors") return true;
  if (p.group && p.group !== "doors") return false;

  const doorCategories = [
    "security-doors",
    "interior-doors",
    "bathroom-doors",
    "hdf-doors",
    "luxury-doors",
  ];
  if (doorCategories.includes(p.category || "")) return true;

  const nonDoorCategories = [
    "sanitary",
    "sanitary-fittings",
    "paint",
    "roof-tiles",
    "bathrooms",
  ];
  if (nonDoorCategories.includes(p.category || "")) return false;

  return Boolean(p.category && p.category.toLowerCase().includes("door"));
};

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addToCart, settings } = useApp();
  const isDoor = isDoorProduct(product);

  // Combine product image, gallery array, and video(s)
  const rawMediaList: MediaItem[] = [];
  if (product.image) {
    rawMediaList.push({
      type: isVideoUrl(product.image) ? "video" : "image",
      url: product.image,
    });
  }
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((url) => {
      if (url && !rawMediaList.some((m) => m.url === url)) {
        rawMediaList.push({
          type: isVideoUrl(url) ? "video" : "image",
          url,
        });
      }
    });
  }
  if (product.video && !rawMediaList.some((m) => m.url === product.video)) {
    rawMediaList.push({
      type: "video",
      url: product.video,
    });
  }
  if (product.videos && Array.isArray(product.videos)) {
    product.videos.forEach((v) => {
      if (v && !rawMediaList.some((m) => m.url === v)) {
        rawMediaList.push({
          type: "video",
          url: v,
        });
      }
    });
  }

  const mediaList = rawMediaList;
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    isDoor ? "Standard 3ft x 7ft" : "Standard Specification"
  );
  const [selectedOrientation, setSelectedOrientation] = useState(
    isDoor ? "Right Inward" : ""
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];

  const nextMedia = () => {
    setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
  };

  const prevMedia = () => {
    setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleAddToCart = () => {
    addToCart(product, { quantity, size: selectedSize, orientation: selectedOrientation });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleDirectWhatsApp = () => {
    const specNote = isDoor
      ? `\n- Dimension: ${selectedSize}\n- Orientation: ${selectedOrientation}\n- Quantity: ${quantity}`
      : `\n- Quantity: ${quantity}`;

    const url = buildWhatsAppOrderUrl({
      productName: product.name,
      price: product.price && product.price > 0 ? product.price : undefined,
      quantity,
      size: isDoor ? `${selectedSize} (${selectedOrientation})` : undefined,
      targetPhone: settings.whatsappNumber || brand.whatsappNumber,
      additionalNotes: specNote,
      inquiryTemplate: settings.whatsappInquiryTemplate,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Safe specification lookups
  const specMaterial =
    product.specifications?.["Material"] ||
    product.specifications?.["Finish"] ||
    (isDoor ? "Architectural Core" : "Vitreous China");

  const specHardwareOrType = isDoor
    ? product.specifications?.["Lock Type"] || "Multi-Point Deadbolt"
    : product.specifications?.["Flush Mechanism"] || product.specifications?.["Installation"] || "Standard Mount";

  const specAcousticOrFeature = isDoor
    ? product.specifications?.["Acoustic Rating"] || product.specifications?.["Infill"] || "Rockwool Insulated"
    : product.specifications?.["Glaze"] || "Anti-Bacterial Nano Glaze";

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-2 text-xs text-[#73787E] flex-wrap"
        >
          <Link href="/" className="hover:text-[#121518] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#F3661B]" />
          <Link href="/shop" className="hover:text-[#121518] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#F3661B]" />
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-[#F3661B] transition-colors font-medium text-[#121518]"
          >
            {product.categoryLabel}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#F3661B]" />
          <span className="text-[#121518] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white rounded-xl border border-[#E5E3DC] p-4 sm:p-8 shadow-xs">
          {/* Gallery / Media Column */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FBF9F5] border border-[#E5E3DC] group flex items-center justify-center">
              {activeMedia ? (
                activeMedia.type === "video" ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      key={activeMedia.url}
                      src={activeMedia.url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <Image
                    src={activeMedia.url}
                    alt={`${product.name} - ${product.categoryLabel} | ${brand.name}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-all duration-300"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-[#73787E]">
                  <Package className="w-12 h-12 text-[#F3661B] mb-2 stroke-1" />
                  <span className="text-xs font-semibold text-[#121518]">Product Photo Pending</span>
                  <span className="text-[11px] text-[#73787E] mt-0.5">Contact customer care agent for depot photos</span>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#121518] text-[#FBF9F5] text-[10px] font-semibold rounded uppercase tracking-wider z-10 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-[#F3661B]" />
                <span>{product.categoryLabel}</span>
              </div>

              {product.badge && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#F3661B] text-[#121518] text-[10px] font-bold rounded uppercase tracking-wider z-10">
                  {product.badge}
                </div>
              )}

              {/* Gallery Navigation Arrows */}
              {mediaList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      prevMedia();
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                    aria-label="Previous item"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      nextMedia();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
                    aria-label="Next item"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {mediaList.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {mediaList.map((item, idx) => {
                  const isCurrent = idx === activeMediaIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        isCurrent
                          ? "border-[#121518] ring-2 ring-[#F3661B]"
                          : "border-[#E5E3DC] opacity-70 hover:opacity-100"
                      }`}
                    >
                      {item.type === "video" ? (
                        <div className="w-full h-full bg-[#121518] flex flex-col items-center justify-center text-white">
                          <Play className="w-4 h-4 text-[#F3661B]" />
                          <span className="text-[9px] uppercase font-bold mt-0.5">Video</span>
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details & Ordering Column */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3661B]">
                  {product.categoryLabel}
                </span>
                <span className="text-[#73787E] text-[10px]">•</span>
                <span className="text-[10px] font-semibold text-[#121518]">
                  {brand.name}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#121518] tracking-tight leading-snug">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#4A4A4A] mt-2 leading-relaxed">
                {product.shortDescription || product.description}
              </p>
            </div>

            {/* Quick Visual Specification Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
              <div className="p-2.5 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#F3661B] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#73787E] uppercase tracking-wider block">
                    Material
                  </span>
                  <span className="text-xs font-bold text-[#121518] truncate block">
                    {specMaterial}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center space-x-2">
                {isDoor ? (
                  <Lock className="w-4 h-4 text-[#F3661B] shrink-0" />
                ) : (
                  <Package className="w-4 h-4 text-[#F3661B] shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#73787E] uppercase tracking-wider block">
                    {isDoor ? "Hardware" : "Configuration"}
                  </span>
                  <span className="text-xs font-bold text-[#121518] truncate block">
                    {specHardwareOrType}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center space-x-2">
                {isDoor ? (
                  <VolumeX className="w-4 h-4 text-[#F3661B] shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-[#F3661B] shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#73787E] uppercase tracking-wider block">
                    {isDoor ? "Acoustic" : "Glaze"}
                  </span>
                  <span className="text-xs font-bold text-[#121518] truncate block">
                    {specAcousticOrFeature}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#F3661B] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#73787E] uppercase tracking-wider block">
                    Delivery
                  </span>
                  <span className="text-xs font-bold text-[#121518] truncate block">
                    Nationwide Waybill
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Quantity Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#FBF9F5] border border-[#E5E3DC] space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-[#73787E] uppercase tracking-wider block mb-0.5">
                    Price:
                  </span>
                  {product.price && product.price > 0 ? (
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl sm:text-3xl font-bold text-[#121518]">
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-[#73787E] line-through">
                          ₦{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm sm:text-base font-bold text-[#121518]">
                      {product.priceMode === "price_on_request" || product.priceOnRequest
                        ? "Price on Request"
                        : "Contact for Quote"}
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

              {/* Quantity Stepper */}
              <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-xs">
                <span className="font-bold text-[#121518]">Order Quantity:</span>
                <div className="flex items-center border border-[#E5E3DC] rounded-lg overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#121518] min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Standardized Dimension Buttons - DOORS ONLY */}
            {isDoor && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#121518] block">
                  Select Door Opening Dimension:
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
                          className={`h-10 px-3 text-xs font-bold rounded-lg border flex items-center justify-center text-center transition-colors cursor-pointer ${
                            isSelected
                              ? "border-[#121518] bg-[#121518] text-white shadow-xs"
                              : "border-[#E5E3DC] text-[#4A4A4A] bg-white hover:border-[#F3661B] hover:bg-[#FBF9F5]"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Opening Orientation Buttons - DOORS ONLY */}
            {isDoor && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#121518] block">
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
                        className={`h-10 px-3 text-xs font-bold rounded-lg border flex items-center justify-center text-center transition-colors cursor-pointer ${
                          isSelected
                            ? "border-[#121518] bg-[#121518] text-white shadow-xs"
                            : "border-[#E5E3DC] text-[#4A4A4A] bg-white hover:border-[#F3661B] hover:bg-[#FBF9F5]"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full py-3 px-6 bg-[#121518] hover:bg-[#22262B] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#F3661B]" />
                <span>Order via WhatsApp Desk</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-white hover:bg-[#FBF9F5] text-[#121518] border border-[#E5E3DC] text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[#F3661B]" />
                <span>{addedNotice ? "Added to Cart / Project Schedule!" : "Add to Cart / Project Schedule"}</span>
              </button>
            </div>

            {/* Procurement Assurance Box */}
            <div className="p-3.5 rounded-lg bg-white border border-[#E5E3DC] space-y-1.5 text-xs text-[#4A4A4A]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#121518] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#F3661B]" />
                  <span>Physical Warehouse Stock</span>
                </span>
                <span className="text-[11px] font-semibold text-[#F3661B]">
                  Verified Inventory
                </span>
              </div>
              <p className="text-[11px] text-[#73787E] leading-relaxed">
                Direct warehouse inventory at Building Materials International Market, Ogidi. Pre-dispatch physical inspection and nationwide haulage supervised directly under {brand.name}.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Specifications Table */}
        <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E5E3DC] pb-4">
            <h2 className="text-lg font-bold text-[#121518]">Certified Technical Specifications</h2>
            <p className="text-xs text-[#73787E]">
              Factory specifications for this model verified by {brand.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-[#E5E3DC]">
                <span className="font-medium text-[#4A4A4A]">{key}:</span>
                <span className="font-bold text-[#121518] text-right">{val}</span>
              </div>
            ))}
          </div>

          {/* Full Long Description */}
          <div className="pt-4 border-t border-[#E5E3DC] space-y-2">
            <h3 className="text-sm font-bold text-[#121518]">Product Details & Description</h3>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Warehouse Delivery Notice */}
          <div className="pt-5 border-t border-[#E5E3DC]">
            <div className="p-4 bg-[#FBF9F5] rounded-lg border border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-[#121518]">
                  <Truck className="w-4 h-4 text-[#F3661B]" />
                  <span>Direct Waybill Dispatch: Central Warehouse</span>
                </div>
                <p className="text-[#4A4A4A] text-[11px] leading-relaxed">
                  Same-day loading for Anambra, Asaba, and Enugu; 24 to 48 hours for Port Harcourt, Owerri, Lagos, Abuja, and nationwide sites.
                </p>
              </div>
              <Link
                href="/shipping"
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#121518] hover:text-[#F3661B] underline shrink-0"
              >
                <span>View Regional Shipping Terms</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#121518]">
                Related Products & Architectural Fittings
              </h2>
              <Link href="/shop" className="text-xs font-bold text-[#F3661B] hover:underline">
                View All in Shop
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <Link href={`/products/${p.slug}`} className="block group">
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#FBF9F5] border border-[#E5E3DC] mb-2">
                      <Image
                        src={p.image}
                        alt={`${p.name} - ${p.categoryLabel}`}
                        fill
                        className="object-cover group-hover:scale-104 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#73787E] block">
                      {p.categoryLabel}
                    </span>
                    <h3 className="text-xs font-bold text-[#121518] line-clamp-1 group-hover:text-[#F3661B] transition-colors">
                      {p.name}
                    </h3>
                    <span className="text-xs font-bold text-[#121518] block mt-0.5">
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
