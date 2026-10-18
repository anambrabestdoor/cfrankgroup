"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { ArrowLeft, MessageSquare, ShoppingBag, ShieldCheck, MapPin } from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";

export default function CheckoutPage() {
  const { cart, cartTotal, settings, clearCart } = useApp();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [notes, setNotes] = useState("");

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    let orderNote = "";
    if (customerName) orderNote += `Customer: ${customerName}\n`;
    if (customerPhone) orderNote += `Phone: ${customerPhone}\n`;
    if (deliveryState) orderNote += `Delivery Location: ${deliveryState}\n`;
    if (notes) orderNote += `Notes: ${notes}\n`;

    const url = buildWhatsAppOrderUrl({
      cartItems: cart.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
      })),
      total: cartTotal,
      additionalNotes: orderNote,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
              WhatsApp Order Finalization
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Review Your Door Order
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              We do not collect automated online card payments. Your order is sent directly to our sales manager on WhatsApp to confirm stock availability, verify dimensions, and calculate waybill delivery to your city.
            </p>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3 border-t border-b border-slate-100 py-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Your cart is empty. Please add doors from the catalogue before proceeding.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs py-2">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.name}</span>
                    <span className="text-slate-500 text-[11px]">
                      Qty: {item.quantity} {item.size ? `• Spec: ${item.size}` : ""}
                    </span>
                  </div>
                  <span className="font-bold text-[#003296]">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Estimated Total:</span>
            <span className="text-xl font-black text-[#003296]">₦{cartTotal.toLocaleString()}</span>
          </div>

          {/* Customer Details Form */}
          <form onSubmit={handleSendOrder} className="space-y-4 pt-2 text-xs">
            <h3 className="font-bold text-slate-800 text-sm">Delivery & Invoicing Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Engr. Chinedu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project City / State</label>
              <input
                type="text"
                required
                value={deliveryState}
                onChange={(e) => setDeliveryState(e.target.value)}
                placeholder="e.g. Asaba, Onitsha, Awka, Lagos, Abuja, Port Harcourt"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Order Notes (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify preferred delivery date, opening direction, or custom specifications..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50 text-xs sm:text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forward Order to WhatsApp Sales Desk</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            Showroom Depot: Shop 14 Chubby Plaza Ogidi • CAC BN: {settings.cacNumber}
          </div>
        </div>
      </div>
    </div>
  );
}
