"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import {
  ArrowLeft,
  MessageSquare,
  ShoppingCart,
  MapPin,
  Building2,
  CheckCircle,
  Truck,
  FileCheck2,
  Package,
} from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";
import { brand } from "@/lib/brand";

export default function CheckoutPage() {
  const { cart, cartTotal, settings, clearCart } = useApp();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submittedOrder, setSubmittedOrder] = useState<string | null>(null);

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderId = `CFG-${Date.now().toString().slice(-6)}`;

    // Build structured order summary
    let itemSummary = "";
    cart.forEach((item, index) => {
      const itemPrice = item.price && item.price > 0 ? `₦${(item.price * item.quantity).toLocaleString()}` : "Price on Request";
      itemSummary += `${index + 1}. ${item.name} | Qty: ${item.quantity}${item.size ? ` (${item.size})` : ""}: ${itemPrice}\n`;
    });

    let orderNote = `*${brand.name} Order #${orderId}*\n`;
    if (customerName) orderNote += `• Client / Company: ${customerName}\n`;
    if (customerPhone) orderNote += `• Phone: ${customerPhone}\n`;
    if (customerEmail) orderNote += `• Email: ${customerEmail}\n`;
    if (deliveryState || deliveryAddress) {
      orderNote += `• Delivery Destination: ${deliveryAddress ? `${deliveryAddress}, ` : ""}${deliveryState}\n`;
    }
    if (notes) orderNote += `• Project Notes: ${notes}\n`;

    orderNote += `\n--- ORDER ITEMS ---\n${itemSummary}`;
    if (cartTotal > 0) {
      orderNote += `\n*TOTAL ESTIMATED VALUE:* ₦${cartTotal.toLocaleString()}\n`;
    }
    orderNote += `\n(Dispatched via CFrank Group Logistics)`;

    // Save order record to customer's browser storage for Tracking
    try {
      const storedOrders = JSON.parse(localStorage.getItem("cfg_customer_orders") || "[]");
      storedOrders.unshift({
        id: orderId,
        date: new Date().toISOString(),
        customerName,
        customerPhone,
        customerEmail,
        deliveryLocation: `${deliveryAddress ? `${deliveryAddress}, ` : ""}${deliveryState}`,
        total: cartTotal,
        itemsCount: cart.length,
        status: "processing",
        items: cart.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          size: i.size,
        })),
      });
      localStorage.setItem("cfg_customer_orders", JSON.stringify(storedOrders.slice(0, 20)));
    } catch {
      // storage quota or disabled, ignore
    }

    // Persist order to server database for central admin oversight & public tracking
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: customerName || "Valued Client",
        email: customerEmail || undefined,
        phone: customerPhone || undefined,
        deliveryLocation: `${deliveryAddress ? `${deliveryAddress}, ` : ""}${deliveryState}`,
        notes,
        items: cart.map((i) => ({
          productId: i.id,
          productName: i.name,
          price: i.price || 0,
          quantity: i.quantity,
          size: i.size,
          orientation: i.orientation,
        })),
        total: cartTotal,
        paymentMethod: "whatsapp_boq",
        channel: "whatsapp",
      }),
    }).catch((err) => console.warn("Failed to record order to backend:", err));

    const targetNumber = settings.whatsappNumber || brand.whatsappNumber;
    const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(orderNote)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    setSubmittedOrder(orderId);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/shop"
          className="inline-flex items-center space-x-1.5 text-xs text-[#6B7280] hover:text-[#121518] font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping in Unified Shop</span>
        </Link>

        {submittedOrder ? (
          <div className="bg-white p-8 sm:p-12 rounded-xl border border-[#E5E3DC] shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B]">
                Order Coordinated
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#121518]">
                Project Order #{submittedOrder} Dispatched
              </h1>
              <p className="text-xs sm:text-sm text-[#4A4A4A] max-w-md mx-auto leading-relaxed">
                Your order schedule has been sent to our customer care agent. A representative will verify real-time stock and finalize haulage terms.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/tracking?id=${submittedOrder}`}
                className="py-2.5 px-5 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Track Consignment Status
              </Link>
              <Link
                href="/shop"
                className="py-2.5 px-5 bg-[#FBF9F5] hover:bg-[#E5E3DC] text-[#121518] border border-[#E5E3DC] text-xs font-semibold rounded-lg transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#E5E3DC] shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F3661B] uppercase tracking-wider mb-1">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>CFrank Hybrid Checkout</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#121518] tracking-tight">
                  Review &amp; Coordinate Order
                </h1>
                <p className="text-xs text-[#73787E] mt-1 leading-relaxed">
                  Consolidated multi-category checkout. Items are coordinated under single corporate billing with direct depot dispatch.
                </p>
              </div>

              <form onSubmit={handleSendOrder} className="space-y-4 text-xs">
                <div className="border-t border-[#E5E3DC] pt-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#121518] mb-3">
                    Client & Delivery Information
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-[#121518] mb-1">
                        Full Name / Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Engr. Chinedu Okafor / Apex Build"
                        className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-[#121518] focus:outline-none focus:border-[#121518]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#121518] mb-1">
                          Phone Number (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0803 123 4567"
                          className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-[#121518] focus:outline-none focus:border-[#121518]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#121518] mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="client@company.com"
                          className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-[#121518] focus:outline-none focus:border-[#121518]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#121518] mb-1">
                          Delivery City / State *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryState}
                          onChange={(e) => setDeliveryState(e.target.value)}
                          placeholder="e.g. Asaba, Delta State / Awka, Anambra"
                          className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-[#121518] focus:outline-none focus:border-[#121518]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#121518] mb-1">
                          Street / Site Address
                        </label>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. Plot 14, Ngozika Estate"
                          className="w-full px-3 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-[#121518] focus:outline-none focus:border-[#121518]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#121518] mb-1">
                        Site Offloading Notes / Special Instructions
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Specify door wall openings, preferred delivery timeframe, or phased site schedule..."
                        className="w-full px-3 py-2 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-[#121518] focus:outline-none focus:border-[#121518]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className="w-full py-3.5 px-6 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-2 shadow-xs transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <MessageSquare className="w-4 h-4 text-[#F3661B]" />
                    <span>Coordinate Order on WhatsApp</span>
                  </button>

                  <p className="text-[10px] text-[#73787E] text-center mt-2">
                    Submitting sends your itemized schedule to a Customer Care Agent to verify stock and generate the commercial proforma.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-[#E5E3DC] shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#E5E3DC] pb-3">
                  <h2 className="font-bold text-[#121518] text-sm flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#F3661B]" />
                    <span>Order Schedule ({cart.length} Items)</span>
                  </h2>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-[#73787E]">
                    Your cart is empty. Add items from the catalogue before checking out.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Items List */}
                    <div className="p-3.5 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] space-y-2.5">
                      <div className="space-y-2.5">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-start gap-2 text-xs">
                            <div className="min-w-0">
                              <span className="font-semibold text-[#121518] block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#73787E]">
                                Qty: {item.quantity} {item.size ? `• ${item.size}` : ""}
                              </span>
                            </div>
                            <span className="font-bold text-[#121518] shrink-0 text-right">
                              {item.price && item.price > 0
                                ? `₦${(item.price * item.quantity).toLocaleString()}`
                                : "Quote on WhatsApp"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="pt-3 border-t border-[#E5E3DC] flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#121518]">Total Estimated Value:</span>
                      <span className="text-lg font-bold text-[#121518]">
                        {cartTotal > 0 ? `₦${cartTotal.toLocaleString()}` : "Quoted by Customer Care Agent"}
                      </span>
                    </div>

                    <div className="p-3 bg-[#FBF9F5] rounded-lg border border-[#E5E3DC] text-[11px] text-[#4A4A4A] space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-[#121518]">
                        <Truck className="w-3.5 h-3.5 text-[#F3661B]" />
                        <span>Direct Consolidated Dispatch</span>
                      </div>
                      <p className="text-[#73787E] leading-relaxed">
                        Items from multiple divisions are pre-inspected and loaded onto coordinated haulage directly from our warehouse facility.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
