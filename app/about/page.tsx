"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { BadgeCheck, Lock, Building2, Truck, ExternalLink, MapPin, CheckCircle, MessageSquare } from "lucide-react";

export default function AboutPage() {
  const { settings, setCacModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-[#0A192F] text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
            Corporate Entity & Physical Warehouse
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            About {settings.parentCompany} & {settings.companyName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Direct importers and suppliers of heavy-gauge security doors, contemporary interior wooden doors, and specialized construction fittings in Ogidi, Onitsha, Anambra State.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Entity Introduction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-8 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block">
              Business Relationship & Identity
            </span>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              {settings.companyName} is operated by {settings.parentCompany}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Operating out of {settings.address}, {settings.parentCompany} (Proprietor: {settings.proprietor || "Chidera Frank Okonkwo"}) supplies residential developers, commercial builders, architects, and private homeowners across Nigeria.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We specialize in heavy-gauge bullet proof doors, cast ornamental security doors, seasoned Watson interior room doors, and 100% waterproof bathroom solutions with nationwide delivery.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hello ${settings.parentCompany}, I want to chat about your doors and sanitary inventory at ${settings.marketLocation}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-lg inline-flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
            <Image
              src="/products/bullet-proof-door.jpeg"
              alt="Anambra Best Door Product Stock at Maraim Plaza"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-slate-900/90 backdrop-blur-md rounded-md text-white text-[11px] font-semibold flex items-center justify-between">
              <span className="truncate max-w-[220px]">Warehouse: {settings.marketLocation}</span>
              <span className="text-blue-300 font-bold shrink-0">In Stock</span>
            </div>
          </div>
        </div>

        {/* CAC Corporate Affairs Commission Verification Section */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Legal Registration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Corporate Affairs Commission (CAC) Status Report
              </h2>
            </div>
            <button
              onClick={() => setCacModalOpen(true)}
              className="py-2.5 px-4 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 self-start sm:self-auto shrink-0 shadow-sm"
            >
              <span>View Certified Extract</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Certificate Preview Frame */}
            <div
              onClick={() => setCacModalOpen(true)}
              className="lg:col-span-5 relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-900/5 cursor-pointer group shadow-sm flex items-center justify-center"
            >
              <Image
                src={settings.cacCertificateUrl || "/cac-status-report-page1.jpeg"}
                alt="CAC Certified Extract for Anambra Best Door Enterprises"
                fill
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                <span>Click to Inspect Official Extract</span>
              </div>
            </div>

            {/* Registration Metadata */}
            <div className="lg:col-span-7 space-y-3.5 text-xs text-slate-700">
              <p className="leading-relaxed text-slate-600">
                To guarantee absolute transparency for corporate builders and homeowners, <strong>{settings.companyName}</strong> is fully registered under the Companies and Allied Matters Act 2020 for specialized construction and door fittings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Entity</span>
                  <span className="font-bold text-slate-900 text-sm">{settings.companyName}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Business Number (BN)</span>
                  <span className="font-bold text-[#003296] text-sm">{settings.cacNumber}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Proprietor</span>
                  <span className="font-bold text-slate-900 text-xs">{settings.proprietor || "Chidera Frank Okonkwo"}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registration Status</span>
                  <span className="font-bold text-emerald-700 text-xs">{settings.cacStatus || "ACTIVE"} ({settings.cacRegistrationDate || "Oct 16, 2026"})</span>
                </div>
              </div>
              <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-500">
                <BadgeCheck className="w-4 h-4 text-[#003296]" />
                <span>Publicly verifiable on search.cac.gov.ng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003296] mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Tested Heavy Steel</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every security door imported features solid gauge leaf plating, multi-point deadbolts, and internal structural steel stiffeners.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003296] mx-auto flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Physical Market Hub</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Visit our warehouse & showroom at {settings.marketLocation} to personally inspect leaf finishes, lock cylinders, and frame alignments.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003296] mx-auto flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Safe Nationwide Waybill</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We handle direct transit and insured waybill packaging for orders across Anambra, Asaba, Enugu, Lagos, and Abuja.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
