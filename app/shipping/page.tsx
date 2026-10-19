"use client";

import React from "react";
import Link from "next/link";
import { Truck, Clock, MapPin, BadgeCheck, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ShippingPage() {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
            Nationwide Logistics & Waybill
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Depot Haulage & Site Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Direct door and sanitary ware dispatch from our Ogidi depot to building contractors, site engineers, and private homeowners across all 36 states.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <Truck className="w-7 h-7 mx-auto text-[#003296]" />
            <h3 className="font-bold text-sm text-slate-900">Direct Waybill Dispatch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidated waybill transport via trusted park logistics to Asaba, Lagos, Abuja, Port Harcourt, Enugu, and nationwide.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <Clock className="w-7 h-7 mx-auto text-[#003296]" />
            <h3 className="font-bold text-sm text-slate-900">Same-Day Southeast Loading</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Orders confirmed before 12:00 PM are inspected and loaded same-day for Southeast and South-South corridors.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
            <MapPin className="w-7 h-7 mx-auto text-[#003296]" />
            <h3 className="font-bold text-sm text-slate-900">Physical Depot Pickup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your driver or site truck can load directly at {settings.address} with verified loading gate pass.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <BadgeCheck className="w-5 h-5 text-[#003296]" />
            <span>Delivery Procedures & Packaging Protection</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">1. Heavy-Duty Protective Wrapping</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Every Turkish steel door, HDF pre-hung set, and sanitary ceramic fitting is padded with corrugated corners, bubble wrap, and waterproof plastic film to eliminate transit scratches.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">2. Delivery Locations & Estimated Durations</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li><strong>Anambra / Asaba / Delta / Enugu / Imo:</strong> Same-day to 24 hours.</li>
                <li><strong>Port Harcourt / Benin / Warri / South-South:</strong> 24 to 48 hours.</li>
                <li><strong>Lagos / Ibadan / Southwest:</strong> 1 to 3 business days via heavy truck freight.</li>
                <li><strong>Abuja / Jos / Kano / Northern States:</strong> 2 to 4 business days.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">3. Waybill Confirmation & Driver Tracking</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Once your consignment is loaded, our dispatch officer sends the official waybill invoice, transport park phone number, and driver phone contact via WhatsApp for real-time tracking.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Need haulage quote for bulk building project?</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I want to chat about delivery rates for my project location.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm Haulage on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
