"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingCart, FileText } from "lucide-react";
import { brand } from "@/lib/brand";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, sendWhatsAppOrder, clearCart, settings } = useApp();

  const handleRequestBoq = () => {
    if (cart.length === 0) return;
    const itemList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name}${item.size ? ` (Spec: ${item.size})` : ""} - Quantity: ${item.quantity}${item.price > 0 ? ` [₦${(item.price * item.quantity).toLocaleString()}]` : ""
          }`
      )
      .join("\n");

    const message = `Hello ${brand.name},\n\nPROJECT SCHEDULE / BOQ INQUIRY:\nI am requesting a formal quotation and delivery schedule for the following items from your catalogue:\n\n${itemList}\n\nProject Destination (City & State): [Please enter]\nEstimated Delivery Date: [Please enter]\n\nPlease advise on project bulk pricing and logistics waybill terms.`;

    const url = `https://wa.me/${settings.whatsappNumber || brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!cartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 animate-fade-in"
      onClick={() => setCartOpen(false)}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E5E3DC]">
            {/* Drawer Header */}
              <div className="px-6 py-4 border-b border-[#E5E3DC] flex items-center justify-between bg-[#FBF9F5]">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-[#F3661B]" />
                  <h2 className="text-sm font-bold text-[#121518]">Your Cart ({cart.length})</h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart drawer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E3DC] text-[#121518] flex items-center justify-center transition-colors cursor-pointer border border-[#E5E3DC]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-[#FBF9F5] text-[#6B7280] mx-auto flex items-center justify-center border border-[#E5E3DC]">
                        <ShoppingCart className="w-8 h-8 text-[#F3661B]" />
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-bold text-[#121518]">Your cart is currently empty</p>
                          <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
                            Browse our catalogue to add doors, sanitary wares, or building fittings.
                          </p>
                      </div>
                      <Link
                        href="/shop"
                        onClick={() => setCartOpen(false)}
                        className="inline-block py-2.5 px-5 bg-[#121518] text-white text-xs font-semibold rounded-lg hover:bg-[#252A2F] transition-colors"
                      >
                        Browse Catalogue
                      </Link>
                    </div>
                    ) : (
              cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex space-x-3.5 p-3 rounded-lg border border-[#E5E3DC] bg-white"
                    >
                        <div className="relative w-16 h-20 bg-[#FBF9F5] rounded-md overflow-hidden shrink-0 border border-[#E5E3DC]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                                <h3 className="text-xs font-semibold text-[#121518] line-clamp-1">
                                  {item.name}
                                </h3>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  aria-label={`Remove ${item.name} from cart`}
                                  className="text-[#6B7280] hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {item.size && (
                                <span className="text-[10px] text-[#6B7280] block">
                                  Spec: {item.size}
                                </span>
                      )}
                                {item.price && item.price > 0 ? (
                                    <span className="text-xs font-bold text-[#121518] block mt-0.5">
                                      ₦{item.price.toLocaleString()}
                                    </span>
                                    ) : (
                                      <span className="text-xs font-medium text-[#F3661B] block mt-0.5">
                                        Price on Request
                                      </span>
                      )}
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center space-x-2 pt-2">
                                        <div className="flex items-center border border-[#E5E3DC] rounded-md overflow-hidden bg-[#FBF9F5]">
                                          <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-6 h-6 flex items-center justify-center text-[#121518] hover:bg-[#E5E3DC] text-xs"
                                          >
                                            <Minus className="w-3 h-3" />
                                          </button>
                                            <span className="px-2 text-xs font-semibold text-[#121518]">
                                              {item.quantity}
                                            </span>
                                            <button
                                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                              className="w-6 h-6 flex items-center justify-center text-[#121518] hover:bg-[#E5E3DC] text-xs"
                                            >
                                              <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        {item.price && item.price > 0 ? (
                                            <span className="text-[11px] text-[#6B7280]">
                                              Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                            ) : (
                                              <span className="text-[11px] text-[#6B7280]">
                                                Qty: {item.quantity}
                                              </span>
                      )}
                                            </div>
                                          </div>
                </div>
                                      ))
            )}
                                    </div>

                                    {/* Drawer Footer & Actions */}
                                    {cart.length > 0 && (
                                      <div className="p-6 border-t border-[#E5E3DC] bg-[#FBF9F5] space-y-3.5">
                                        {cartTotal > 0 ? (
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#4A4A4A] font-medium">Estimated Total:</span>
                                            <span className="text-base font-bold text-[#121518]">
                                              ₦{cartTotal.toLocaleString()}
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#4A4A4A] font-medium">Pricing:</span>
                                            <span className="text-xs font-semibold text-[#F3661B]">
                                              Direct quote on WhatsApp
                                            </span>
                                          </div>
                                        )}

                                        <div className="p-3 rounded-lg bg-white border border-[#E5E3DC] text-[11px] text-[#4A4A4A] leading-snug">
                                          <strong>Order Coordination:</strong> Submitting will send your itemized schedule to {brand.name} to confirm real-time stock availability, specifications, and dispatch logistics.
                                        </div>

                                        <div className="space-y-2 pt-1">
                                          <button
                                            onClick={sendWhatsAppOrder}
                                            className="w-full py-3 px-4 bg-[#121518] hover:bg-[#252A2F] text-white font-medium rounded-lg flex items-center justify-center space-x-2 shadow-xs transition-transform active:scale-98 text-xs cursor-pointer"
                                          >
                                            <MessageSquare className="w-4 h-4 text-[#F3661B]" />
                                            <span>Send Cart Inquiry via WhatsApp</span>
                                          </button>

                                          <button
                                            onClick={handleRequestBoq}
                                            className="w-full py-2.5 px-4 bg-white hover:bg-[#FBF9F5] text-[#121518] border border-[#E5E3DC] font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors text-xs cursor-pointer"
                                          >
                                            <FileText className="w-4 h-4 text-[#F3661B]" />
                                            <span>Request BOQ / Project Quote</span>
                                          </button>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                          <button
                                            onClick={clearCart}
                                            className="text-[11px] text-[#6B7280] hover:text-red-600 transition-colors cursor-pointer"
                                          >
                                            Clear Cart
                                          </button>
                                          <button
                                            onClick={() => setCartOpen(false)}
                                            className="text-[11px] text-[#121518] hover:underline cursor-pointer"
                                          >
                                            Continue Browsing
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
      </div>
    </div>
  );
}
