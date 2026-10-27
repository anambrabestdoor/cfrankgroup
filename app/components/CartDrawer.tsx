"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingCart, FileText } from "lucide-react";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal, sendWhatsAppOrder, clearCart, settings } = useApp();

  const handleRequestBoq = () => {
    if (cart.length === 0) return;
    const itemList = cart
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name}${item.size ? ` (Spec: ${item.size})` : ""} - Quantity: ${item.quantity}${
            item.price > 0 ? ` [₦${(item.price * item.quantity).toLocaleString()}]` : ""
          }`
      )
      .join("\n");

    const message = `Hello CFrank Enterprise,\n\nPROJECT SCHEDULE / WHOLE-HOUSE BOQ INQUIRY:\nI am requesting a formal quotation and delivery schedule for the following items from your catalogue:\n\n${itemList}\n\nProject Destination (City & State): [Please enter]\nEstimated Installation Date: [Please enter]\n\nPlease advise on contractor wholesale pricing, lock handing (left/right open), and waybill delivery terms.`;

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!cartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setCartOpen(false)}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-[#003296]" />
              <h2 className="text-sm font-bold text-slate-900">Your Cart ({cart.length})</h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              aria-label="Close cart drawer"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">Your cart is currently empty</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse our high-gauge security doors, luxury HDF room doors, or bathroom fittings to add items.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setCartOpen(false)}
                  className="inline-block py-2.5 px-5 bg-[#003296] text-white text-xs font-semibold rounded-xl hover:bg-[#002266] transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3.5 p-3 rounded-xl border border-slate-200/90 bg-white"
                >
                  <div className="relative w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
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
                        <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.size && (
                        <span className="text-[10px] text-slate-500 block">
                          Spec: {item.size}
                        </span>
                      )}
                      {item.price && item.price > 0 ? (
                        <span className="text-xs font-extrabold text-[#003296] block mt-0.5">
                          ₦{item.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#003296] block mt-0.5">
                          Price on Request
                        </span>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {item.price && item.price > 0 ? (
                        <span className="text-[11px] text-slate-400">
                          Subtotal: ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Qty: {item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & WhatsApp Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/70 space-y-3.5">
              {cartTotal > 0 ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Estimated Total:</span>
                  <span className="text-base font-extrabold text-slate-950">
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 font-medium">Pricing:</span>
                  <span className="text-xs font-bold text-[#003296]">
                    Direct quote on WhatsApp
                  </span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-700 leading-snug">
                <strong>WhatsApp Order Coordination:</strong> Submitting will send your itemized schedule to CFrank Enterprise to confirm real-time stock availability, key specifications, and dispatch logistics.
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={sendWhatsAppOrder}
                  className="w-full py-3 px-4 bg-[#003296] hover:bg-[#002266] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-xs transition-transform active:scale-98 text-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Cart Inquiry via WhatsApp</span>
                </button>

                <button
                  onClick={handleRequestBoq}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors text-xs cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#003296]" />
                  <span>Request Whole-House BOQ / Project Quote</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-[11px] text-slate-600 hover:underline cursor-pointer"
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
