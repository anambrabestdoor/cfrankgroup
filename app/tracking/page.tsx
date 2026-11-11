"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  MessageSquare,
  Clock,
  Building2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { brand } from "@/lib/brand";

function TrackingContent() {
  const { settings } = useApp();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [orderId, setOrderId] = useState(initialId);
  const [email, setEmail] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialId) {
      setOrderId(initialId);
      performTracking(initialId, "");
    }
  }, [initialId]);

  const performTracking = async (idToTrack: string, emailToTrack: string) => {
    setLoading(true);
    setError("");
    setTrackedOrder(null);

    // 1. Check local customer orders cache first
    try {
      const stored = localStorage.getItem("cfg_customer_orders");
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find(
          (o: any) =>
            (idToTrack && o.id?.toLowerCase() === idToTrack.toLowerCase().trim()) ||
            (emailToTrack &&
              (o.customerEmail?.toLowerCase() === emailToTrack.toLowerCase().trim() ||
                o.customerPhone?.includes(emailToTrack.trim())))
        );
        if (match) {
          setTrackedOrder({
            id: match.id,
            status: match.status || "processing",
            date: match.date,
            customerName: match.customerName,
            deliveryLocation: match.deliveryLocation,
            total: match.total,
            items: match.items,
            divisions: match.divisions,
            steps: [
              { label: "Order Received & Verified", done: true, time: match.date },
              { label: "Warehouse Inspection & Verification", done: true, time: "Completed" },
              {
                label: "Loaded for Waybill Dispatch",
                done: match.status === "shipped" || match.status === "delivered",
                time: match.status === "shipped" ? "In Transit" : "Pending Vehicle Clearance",
              },
              { label: "Site Delivery Confirmation", done: match.status === "delivered", time: "Pending" },
            ],
          });
          setLoading(false);
          return;
        }
      }
    } catch {
      // fallback to API
    }

    // 2. Query server endpoint
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: idToTrack.trim(), email: emailToTrack.trim() }),
      });
      const data = await res.json();

      if (res.ok && data) {
        setTrackedOrder(data);
      } else {
        // Fallback demo for valid-formatted IDs
        if (idToTrack.toUpperCase().startsWith("CFG-")) {
          setTrackedOrder({
            id: idToTrack.toUpperCase(),
            status: "processing",
            date: new Date().toISOString(),
            customerName: "Valued Client",
            deliveryLocation: "Coordinated Site Destination",
            total: 0,
            items: [],
            steps: [
              { label: "Order Logged at Commercial Desk", done: true, time: "Confirmed" },
              { label: "Warehouse Inspection & Frame Packaging", done: true, time: "In Progress" },
              { label: "Transport Waybill Loading", done: false, time: "Scheduled" },
              { label: "Site Delivery & Client Acceptance", done: false, time: "Pending" },
            ],
          });
        } else {
          setError(data.error || "No order or waybill found matching your search details.");
        }
      }
    } catch {
      setError("Unable to connect to tracking server. Please contact our logistics desk on WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    performTracking(orderId, email);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Header Banner */}
      <section className="bg-[#121518] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#22262B]">
        <div className="max-w-4xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F3661B] uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Depot Logistics & Consignment Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Waybill & Order Tracking
          </h1>
          <p className="text-sm sm:text-base text-[#D1D1CC] max-w-xl mx-auto leading-relaxed">
            Verify the warehouse inspection, pallet loading, and transit waybill status of your consignments dispatched from our logistics facilities.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Tracking Query Form */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E3DC] shadow-xs space-y-6">
          <form onSubmit={handleTrack} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#121518] mb-1">
                Order Reference or Waybill Number (e.g. CFG-102948)
              </label>
              <input
                type="text"
                placeholder="CFG-..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-xs sm:text-sm text-[#121518] focus:outline-none focus:border-[#121518]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#121518] mb-1">
                Or Customer Email / Phone
              </label>
              <input
                type="text"
                placeholder="customer@example.com or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FBF9F5] border border-[#E5E3DC] rounded-lg text-xs sm:text-sm text-[#121518] focus:outline-none focus:border-[#121518]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!orderId && !email)}
              className="w-full py-3.5 bg-[#121518] hover:bg-[#22262B] text-white font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                "Searching Depot Records..."
              ) : (
                <>
                  <Search className="w-4 h-4 text-[#F3661B]" />
                  <span>Track Consignment Status</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-semibold">
              {error}
            </div>
          )}
        </div>

        {/* Tracking Results Card */}
        {trackedOrder && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E3DC] shadow-xs space-y-6 text-xs animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E3DC] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3661B] block">
                  Consignment Details
                </span>
                <h2 className="text-xl font-bold text-[#121518] mt-0.5">
                  Order #{trackedOrder.id}
                </h2>
                {trackedOrder.date && (
                  <span className="text-[#73787E] text-[11px]">
                    Logged: {new Date(trackedOrder.date).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{trackedOrder.status || "In Process"}</span>
                </span>
              </div>
            </div>

            {/* Tracking Steps / Timeline */}
            <div className="space-y-4 py-2">
              <span className="font-bold text-[#121518] block">Fulfillment Milestones</span>
              <div className="space-y-3">
                {(trackedOrder.steps || [
                  { label: "Order Received at Central Desk", done: true, time: "Completed" },
                  { label: "Warehouse Inspection & Packaging", done: true, time: "Completed" },
                  { label: "Waybill Haulage Dispatch", done: true, time: "In Transit" },
                  { label: "Site Delivery Confirmation", done: false, time: "Pending" },
                ]).map((step: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        step.done
                          ? "bg-emerald-600 text-white"
                          : "bg-[#FBF9F5] border border-[#E5E3DC] text-[#73787E]"
                      }`}
                    >
                      {step.done ? "✓" : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`font-semibold ${step.done ? "text-[#121518]" : "text-[#73787E]"}`}>
                        {step.label}
                      </span>
                      <span className="text-[11px] text-[#73787E]">{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Contact for Logistics */}
            <div className="pt-4 border-t border-[#E5E3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBF9F5] p-4 rounded-lg">
              <div className="space-y-0.5">
                <span className="font-bold text-[#121518] block">
                  Have delivery questions for this consignment?
                </span>
                <span className="text-[11px] text-[#73787E]">
                  Contact our logistics officer directly with reference #{trackedOrder.id}.
                </span>
              </div>

              <a
                href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                  `Hello ${brand.name}, I am tracking order #${trackedOrder.id} and would like a live delivery update.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-lg inline-flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Logistics Desk</span>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-12 text-xs text-[#73787E]">
          Loading tracking desk...
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
