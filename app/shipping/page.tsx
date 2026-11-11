"use client";

import React from "react";
import Link from "next/link";
import { Truck, Clock, MapPin, BadgeCheck, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ShippingPage() {
  const { settings } = useApp();

  const regions = settings.deliveryRegions && settings.deliveryRegions.length > 0
    ? settings.deliveryRegions
    : [
        {
          name: "South-East & Eastern States",
          duration: "Same-Day / 24h",
          coverage: "Onitsha, Ogidi, Awka, Nnewi, Asaba, Enugu, Owerri, Aba, Abakaliki, Makurdi",
        },
        {
          name: "South-South States",
          duration: "24h Transit",
          coverage: "Port Harcourt, Warri, Benin City, Uyo, Calabar",
        },
        {
          name: "South-West States",
          duration: "24h - 48h",
          coverage: "Lagos State, Ibadan, Abeokuta, Ogun",
        },
        {
          name: "North-Central & Northern States",
          duration: "24h - 48h",
          coverage: "Abuja (FCT), Jos, Lokoja, Kano, Kaduna",
        },
      ];

  const warehouseLocation = settings.marketLocation || "warehouse";

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <div className="bg-[#121518] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#F3661B] block">
            Nationwide Logistics & Waybill
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Warehouse Logistics & Site Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Direct product dispatch from our {warehouseLocation} to building contractors, site engineers, and private homeowners across all 36 states.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <Truck className="w-7 h-7 mx-auto text-[#F3661B]" />
            <h3 className="font-bold text-sm text-slate-900">Direct Waybill Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidated waybill transport via trusted park logistics to Asaba, Lagos, Abuja, Port Harcourt, Enugu, and nationwide.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <Clock className="w-7 h-7 mx-auto text-[#F3661B]" />
            <h3 className="font-bold text-sm text-slate-900">Same-Day Regional Loading</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {settings.deliverySummaryText || "Same-day loading for South-East and Asaba; 24 to 48 hours for Lagos, Abuja, Port Harcourt and other states."}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <MapPin className="w-7 h-7 mx-auto text-[#F3661B]" />
            <h3 className="font-bold text-sm text-slate-900">Physical Warehouse Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your driver or site truck can load directly at our warehouse with verified loading gate pass.
            </p>
          </div>
        </div>

        {/* Regional Delivery Schedule Cards */}
        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-xl space-y-5">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <Truck className="w-5 h-5 text-[#F3661B]" />
            <span>Regional Delivery Schedules & Durations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {regions.map((reg, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{reg.name}</span>
                  <span className="text-[10px] font-bold text-[#F3661B] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 whitespace-nowrap shrink-0">
                    {reg.duration}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Key Locations:</strong> {reg.coverage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Packaging & Verification Procedures */}
        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-xl space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <BadgeCheck className="w-5 h-5 text-[#F3661B]" />
            <span>Delivery Procedures & Packaging Protection</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">1. Heavy-Duty Protective Wrapping</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {settings.deliveryPackagingNote || "All doors and sanitary ware are strapped with protective edge guards, corrugated pads, and waterproof wrap before handover to verified commercial transport lines."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">2. Pre-Dispatch Video & Photo Verification</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {settings.preDispatchInspectionNote || "Before any door or sanitary fitting leaves our warehouse, our sales team records photos and video of the exact product, frame, hinges, and hardware for WhatsApp confirmation with the buyer or site engineer."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">3. Waybill Confirmation & Driver Tracking</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Once your consignment is loaded, our dispatch officer sends the official waybill invoice, transport park phone number, and driver phone contact via WhatsApp for real-time tracking.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Need a delivery quote for a large building project?</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I want to chat about delivery rates for my project location.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-[#25D366] hover:bg-[#1fb355] text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm Delivery on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
