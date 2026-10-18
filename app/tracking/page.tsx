"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import SearchOverlay from "../components/SearchOverlay";
import { Package, Search, Truck, CheckCircle2 } from "lucide-react";

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTrackedOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setTrackedOrder(data);
      } else {
        setError(data.error || "No order found matching your search.");
      }
    } catch {
      setError("Failed to fetch order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      <Header />
      <CartDrawer />
      <SearchOverlay />

      <div className="bg-black text-white py-16 px-6 text-center">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-80" />
        <h1 className="font-serif text-4xl font-bold mb-2">Track Your Order</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400">Enter your order details below</p>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white p-8 border border-gray-200 rounded-2xl shadow-xs space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Order Number (e.g. ANU-102948)</label>
              <input
                type="text"
                placeholder="ANU-..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Or Customer Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!orderId && !email)}
              className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Searching..." : <><Search className="w-4 h-4" /><span>Track Package</span></>}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          {trackedOrder && (
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                  <p className="font-serif text-lg font-bold capitalize text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    {trackedOrder.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase">Order ID</p>
                  <p className="font-mono text-sm font-bold text-black">{trackedOrder.id}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
                <p><strong>Customer:</strong> {trackedOrder.customerName}</p>
                <p><strong>Total Amount:</strong> ${trackedOrder.total?.toFixed(2)}</p>
                <p><strong>Items:</strong> {trackedOrder.items?.length || 0} product(s)</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


