"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { X, CheckCircle, ExternalLink, ShieldCheck, Building2, UserCheck, Copy, Check } from "lucide-react";

export default function CacVerificationModal() {
  const { cacModalOpen, setCacModalOpen, settings } = useApp();
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  if (!cacModalOpen) return null;

  const currentImage = activePage === 1 
    ? (settings.cacCertificateUrl || "/cac-status-report-page1.jpeg")
    : (settings.cacPage2Url || "/cac-proprietor-page2.jpeg");

  const copyBn = () => {
    navigator.clipboard.writeText(settings.cacNumber.replace(/[^0-9]/g, "") || "9943925");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cac-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={() => setCacModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#003296] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="cac-modal-title" className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Corporate Affairs Commission Registration
              </h2>
              <p className="text-[11px] text-slate-500">
                Official Business Name Status Report — Federal Republic of Nigeria
              </p>
            </div>
          </div>
          <button
            onClick={() => setCacModalOpen(false)}
            aria-label="Close verification modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Official Verification Details Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Business Name</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{settings.companyName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">BN Number</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-[#003296] text-xs sm:text-sm">{settings.cacNumber}</span>
                <button
                  type="button"
                  onClick={copyBn}
                  title="Copy BN Number"
                  className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Proprietor</span>
              <span className="font-semibold text-slate-900 text-xs sm:text-sm">{settings.proprietor || "Chidera Frank Okonkwo"}</span>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Principal Place of Business</span>
              <span className="font-medium text-slate-700 text-xs">{settings.address}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Status & Date</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                {settings.cacStatus || "ACTIVE"} ({settings.cacRegistrationDate || "Oct 16, 2026"})
              </span>
            </div>
          </div>

          {/* Page Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-semibold text-slate-700">Official Extract Documents:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActivePage(1)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  activePage === 1
                    ? "bg-[#003296] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Page 1: Status Report
              </button>
              <button
                type="button"
                onClick={() => setActivePage(2)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  activePage === 2
                    ? "bg-[#003296] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Page 2: Proprietor Details
              </button>
            </div>
          </div>

          {/* Certificate Image Frame */}
          <div className="relative rounded-xl border-2 border-slate-300 bg-slate-900/5 overflow-hidden shadow-inner flex items-center justify-center min-h-[380px] max-h-[500px]">
            <Image
              src={currentImage}
              alt={`Corporate Affairs Commission Status Report - Page ${activePage} for Anambra Best Door Enterprises`}
              width={720}
              height={1280}
              className="w-full h-auto max-h-[490px] object-contain"
              priority
            />
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-slate-900/90 text-white text-[10px] font-semibold rounded-md flex items-center gap-1 shadow-md">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Certified Extract Stamp</span>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-700">
            <Building2 className="w-4 h-4 text-[#003296] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">Direct Importer & Verified Corporate Vendor</p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Anambra Best Door Enterprises (CFrank Enterprise) is a registered commercial entity under the Companies and Allied Matters Act (CAMA 2020) for specialized construction activities and door fittings. You can verify this status online via the official CAC public portal using BN: <strong className="text-slate-900 font-mono">{settings.cacNumber}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs">
          <a
            href="https://search.cac.gov.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#003296] font-semibold hover:underline"
          >
            <span>Verify on official CAC portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setCacModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors ml-auto text-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
