"use client";

import React, { useState } from "react";
import { Package, Search, Truck, CheckCircle2, MessageSquare, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function OrderTrackingPage() {
  const { settings } = useApp();
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
        setError(data.error || "No order or waybill found matching your search details.");
      }
    } catch {
      setError("Failed to fetch order status. Please check your network or contact sales desk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
            Depot Logistics & Dispatch Status
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Waybill & Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Check the processing, loading, or transport dispatch status of your door consignment from our Ogidi depot.
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-xl shadow-xs space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Order Reference or Waybill Number (e.g. CFK-102948)
              </label>
              <input
                type="text"
                placeholder="CFK-..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Or Customer Email / Phone
              </label>
              <input
                type="text"
                placeholder="customer@email.com or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!orderId && !email)}
              className="w-full py-3.5 bg-[#003296] hover:bg-[#002266] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Searching Depot Records..." : <><Search className="w-4 h-4" /><span>Track Dispatch Status</span></>}
            </button>
          </form>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-semibold">
              {error}
            </div>
          )}

          {trackedOrder && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <p className="text-base font-bold capitalize text-emerald-600 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {trackedOrder.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order Reference</p>
                  <p className="font-mono text-xs font-bold text-slate-900 mt-0.5">{trackedOrder.id}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-xs border border-slate-200/80">
                <p><strong>Customer:</strong> {trackedOrder.customerName}</p>
                <p><strong>Total Amount:</strong> ₦{(trackedOrder.total || 0).toLocaleString()}</p>
                <p><strong>Consignment Items:</strong> {trackedOrder.items?.length || 0} product(s)</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Waybill not reflecting or need driver number?</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hello CFrank Enterprise, I would like to check the tracking status of my consignment (Ref: ${orderId || "Pending"}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 bg-[#25D366] text-white font-bold rounded-lg flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Verify on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
