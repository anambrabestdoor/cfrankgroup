"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, BadgeCheck, CheckCircle2, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ReturnsPage() {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
            Quality Assurance & Depot Standards
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Inspection, Exchange & Return Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Transparent quality verification from pre-dispatch depot inspection to on-site delivery for all doors and sanitary fittings.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-xl space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <BadgeCheck className="w-5 h-5 text-[#003296]" />
            <span>Pre-Dispatch Verification Commitment</span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 mb-1">1. Depot Video & Photo Sign-Off Before Waybill</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Before any door or sanitary set leaves our warehouse, our warehouse team records clear photos and a short video clip of your exact unit (verifying door hand/swing direction, leaf dimensions, finish, keys, handles, and accessories) and sends it directly to your WhatsApp for approval.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">2. On-Arrival Inspection at Offloading Point</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Inspect your items immediately upon offloading at the transport park or your building site. If any factory imperfection or transit defect is detected, alert our sales desk immediately before signing the carrier release receipt.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">3. Exchange Guidelines</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>Items must be in original unwrapped condition, without mortar, cement splashes, or frame modifications.</li>
                <li>Standard sizes (3ft x 7ft, 4ft x 7ft) can be swapped for alternative opening swings (inward-left vs. inward-right) subject to stock availability.</li>
                <li>Custom-fabricated orders (special width/height cuts or custom sprayed HDF designs) are made to client architectural schedule and cannot be exchanged once fabricated.</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Questions about item specifications or swaps?</span>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I have a question regarding item inspection and exchange policy.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Sales Desk</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
