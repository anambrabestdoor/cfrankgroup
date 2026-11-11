"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/app/context/AppContext";
import { X, CheckCircle, ExternalLink, BadgeCheck, Building2, Copy, Check } from "lucide-react";
import { brand } from "@/lib/brand";

export default function CacVerificationModal() {
  const { cacModalOpen, setCacModalOpen, settings } = useApp();
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [copied, setCopied] = useState(false);

  if (!cacModalOpen) return null;

  const currentImage = activePage === 1
    ? (settings.cacCertificateUrl || "/cac-status-report-page1.jpeg")
    : (settings.cacPage2Url || "/cac-proprietor-page2.jpeg");

  const copyBn = () => {
    navigator.clipboard.writeText((settings.cacNumber || brand.cacNumber).replace(/[^0-9]/g, "") || "9943925");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cac-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 animate-fade-in"
      onClick={() => setCacModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-md shadow-2xl border border-[#E5E3DC] overflow-hidden flex flex-col max-h-[94vh] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#E5E3DC] bg-[#FBF9F5] gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-[#121518] flex items-center justify-center text-[#F3661B] shrink-0">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 id="cac-modal-title" className="text-xs sm:text-base font-bold text-[#121518] leading-tight truncate">
                CAC Verified Corporate Registration
              </h2>
              <p className="text-[10px] sm:text-[11px] text-[#6B7280] truncate">
                Federal Republic of Nigeria, CAMA 2020 Legal Status Report
              </p>
            </div>
          </div>
          <button
            onClick={() => setCacModalOpen(false)}
            aria-label="Close verification modal"
            className="w-8 h-8 rounded-md bg-white hover:bg-[#E5E3DC] text-[#121518] border border-[#E5E3DC] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Official Verification Details Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-md bg-[#FBF9F5] border border-[#E5E3DC] text-xs">
                    <div>
                      <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Registered Entity</span>
                      <span className="font-bold text-[#121518] text-xs sm:text-sm">{brand.name} / Anambra Best Door</span>
                    </div>
                    <div>
                      <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">BN Number</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-[#121518] text-xs sm:text-sm">{settings.cacNumber || brand.cacNumber}</span>
                        <button
                          type="button"
                          onClick={copyBn}
                          title="Copy BN Number"
                          aria-label="Copy BN number"
                          className="p-1 hover:bg-[#E5E3DC] rounded text-[#6B7280] transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Proprietor / MD</span>
                      <span className="font-semibold text-[#121518] text-xs">{settings.proprietor || brand.proprietor}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Registered Market Address</span>
                      <span className="font-medium text-[#4A4A4A] text-xs leading-snug">{settings.address || brand.address}</span>
                    </div>
                    <div>
                        <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Status</span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] mt-0.5 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          {settings.cacStatus || "ACTIVE"}
                        </span>
                    </div>
                  </div>

                  {/* Document Switcher Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E3DC] pb-2">
                      <span className="text-xs font-semibold text-[#121518]">Certified Documents:</span>
                      <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center">
                        <button
                          type="button"
                          onClick={() => setActivePage(1)}
                          className={`py-1.5 px-3 rounded-md text-xs font-semibold text-center transition-colors ${activePage === 1
                            ? "bg-[#121518] text-white"
                            : "bg-[#FBF9F5] text-[#4A4A4A] hover:bg-[#E5E3DC]"
                          }`}
                        >
                          Page 1: Status Report
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePage(2)}
                          className={`py-1.5 px-3 rounded-md text-xs font-semibold text-center transition-colors ${activePage === 2
                            ? "bg-[#121518] text-white"
                            : "bg-[#FBF9F5] text-[#4A4A4A] hover:bg-[#E5E3DC]"
                          }`}
                        >
                          Page 2: Proprietor Details
                        </button>
                    </div>
                  </div>

        {/* Certificate Image Frame */}
        <div className="relative rounded-md border border-[#E5E3DC] bg-[#FBF9F5] overflow-hidden shadow-inner flex items-center justify-center min-h-[220px] sm:min-h-[380px] max-h-[460px]">
          <Image
            src={currentImage}
            alt={`Corporate Affairs Commission Status Report - Page ${activePage}`}
            width={720}
            height={1280}
            className="w-full h-auto max-h-[450px] object-contain"
            priority
          />
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#121518] text-white text-[9px] sm:text-[10px] font-medium rounded-xs flex items-center gap-1 shadow-md">
            <CheckCircle className="w-3 h-3 text-[#F3661B]" />
            <span>Certified CAC Extract</span>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="p-2.5 sm:p-3 rounded-md bg-[#FBF9F5] border border-[#E5E3DC] flex items-start gap-2 text-xs text-[#4A4A4A]">
          <Building2 className="w-4 h-4 text-[#F3661B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-[#121518] text-xs">Official Corporate Status</p>
            <p className="text-[10px] sm:text-[11px] leading-relaxed text-[#6B7280]">
              {brand.name} operating Anambra Best Door is a registered entity under CAMA 2020. You can verify this status online via the official CAC public portal using registration number: <strong className="text-[#121518] font-mono">{settings.cacNumber || brand.cacNumber}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-4 sm:px-5 py-3 border-t border-[#E5E3DC] bg-[#FBF9F5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
        <a
          href="https://search.cac.gov.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-[#121518] hover:text-[#F3661B] font-semibold hover:underline py-1"
        >
          <span>Verify on official CAC portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => setCacModalOpen(false)}
          className="w-full sm:w-auto px-4 py-2 bg-[#121518] hover:bg-[#252A2F] text-white font-medium rounded-md transition-colors text-xs text-center cursor-pointer"
        >
          Close Preview
        </button>
      </div>
                      </div>
                    </div>
                    );
}
