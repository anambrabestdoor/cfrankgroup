"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/app/context/AppContext";
import { brand, colors } from "@/lib/brand";
import ProtectedDocumentViewer from "@/app/components/ProtectedDocumentViewer";
import {
  Building2,
  BadgeCheck,
  Truck,
  CheckCircle,
  ExternalLink,
  MapPin,
  Store,
  Users,
  Award,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

export default function AboutPage() {
  const { settings, setCacModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Corporate Header Banner */}
      <section className="bg-[#121518] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#22262B]">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F3661B] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Corporate Background</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            About {brand.name}
          </h1>
          <p className="text-sm sm:text-base text-[#D1D1CC] max-w-2xl mx-auto leading-relaxed">
            A diversified Nigerian commercial group delivering direct factory building materials, architectural door systems, executive sanitary wares, and property holdings from the commercial heart of South-Eastern Nigeria.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {/* Executive Overview Card */}
        <section className="bg-white rounded-xl border border-[#E5E3DC] p-6 sm:p-10 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3661B] block">
              Corporate Structure & Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#121518] tracking-tight">
              Bridging factory-direct quality and site-ready procurement
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              Headquartered at the Building Materials International Market in Ogidi, Anambra State, {brand.name} operates its flagship door distribution and architectural building supplies warehouse through its registered property, Anambra Best Door Enterprises (CAC BN: {settings.cacNumber || brand.cacNumber}). The enterprise was established by {brand.proprietor} to address persistent quality discrepancies in the Nigerian construction supply market.
            </p>
            <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
              Rather than acting as intermediary brokers, the group maintains direct factory relationships with steel and wood fabricators across Turkey and global industrial centers. By housing inventory in physical warehouses and conducting multi-point quality checks prior to dispatch, we provide developers, architects, and private builders with certified structural products that perform reliably over decades.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="py-2.5 px-4 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <span>Browse Product Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F3661B]" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber || brand.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Group, I found you on your website and would like to inquire about your products and services.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-bold rounded-lg inline-flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-5 relative aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E3DC] bg-[#121518] shadow-sm">
            <Image
              src="/products/bullet-proof-door.jpeg"
              alt="CFrank Group Physical Warehouse Stock"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute bottom-3 left-3 right-3 p-2 bg-[#121518]/90 rounded text-white text-[10px] font-semibold flex items-center justify-between">
              <span>Commercial Warehousing</span>
              <span className="text-[#F3661B]">Active Physical Inventory</span>
            </div>
          </div>
        </section>

        {/* Operating Pillars */}
        <section className="space-y-6">
          <div className="border-b border-[#E5E3DC] pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B]">
              Operational Principles
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#121518] mt-1">
              How we serve our commercial and private clients
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#E5E3DC] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center justify-center text-[#F3661B]">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#121518]">Certified Material Gauge</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                We reject downgraded sheet metals and thin-wall imitations. Our steel entrance doors meet true Turkish heavy-gauge specifications with certified internal rockwool acoustic cores.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E3DC] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center justify-center text-[#F3661B]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#121518]">Direct Site Logistics</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                From single residential shipments to multi-trailer project orders, our logistics desk manages safe transit and waybill delivery directly to job sites throughout Nigeria.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E5E3DC] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] flex items-center justify-center text-[#F3661B]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#121518]">Pre-Hung Systems</h3>
              <p className="text-xs text-[#4A4A4A] leading-relaxed">
                Doors are delivered as unified sets complete with matching sub-frames, architraves, hinges, and calibrated multi-point locksets to minimize on-site carpentry adjustments.
              </p>
            </div>
          </div>
        </section>

        {/* SCUML Compliance Section */}
        <section className="bg-white rounded-xl border border-[#E5E3DC] p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3DC] pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <BadgeCheck className="w-4 h-4" />
                <span>Anti-Money Laundering Compliance</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#121518]">
                SCUML Certificate of Registration
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <ProtectedDocumentViewer
                src="/scuml-certificate.jpg"
                alt="SCUML Certificate of Registration - Anambra Best Door Enterprises"
                aspectRatio="aspect-[4/3]"
                badgeText="SCUML RN: SC 041603036"
                watermarkText="CFRANK GROUP • OFFICIAL VERIFICATION COPY • NOT VALID FOR THIRD PARTY RE-USE"
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] space-y-3 text-xs">
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Issuing Authority</span>
                  <span className="font-bold text-[#121518] text-sm">Special Control Unit Against Money Laundering (SCUML)</span>
                </div>
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Registered Entity</span>
                  <span className="font-semibold text-[#121518]">Anambra Best Door Enterprises</span>
                </div>
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Registration Number</span>
                  <span className="font-mono font-bold text-[#121518] text-sm">SC 041603036</span>
                </div>
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">Legal Basis</span>
                  <span className="text-[#4A4A4A] leading-relaxed block">Section 17(2)(a) of the Money Laundering (Prevention and Prohibition) Act, 2022</span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/60 space-y-2 text-xs">
                <span className="font-bold text-[#121518] text-[11px] uppercase tracking-wide block">Payment Account Notice</span>
                <p className="text-[#4A4A4A] leading-relaxed">
                  All bank transfers must be made exclusively to accounts bearing the exact business name <span className="font-bold text-[#121518]">Anambra Best Door Enterprises</span>. The account must be verified and approved by a verified customer care agent of the company before any transfer is made. Any payment instruction for a different account name is not from us.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CAC Registration Status Section */}
        <section className="bg-white rounded-xl border border-[#E5E3DC] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E3DC] pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Verified Legal Entity</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#121518]">
                Corporate Affairs Commission (CAC) Status Report
              </h2>
            </div>
            <button
              onClick={() => setCacModalOpen(true)}
              className="py-2.5 px-4 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg flex items-center gap-2 self-start sm:self-auto shrink-0 transition-colors cursor-pointer"
            >
              <span>View Certified Extract</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F3661B]" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 cursor-pointer" onClick={() => setCacModalOpen(true)}>
              <ProtectedDocumentViewer
                src={settings.cacCertificateUrl || "/cac-status-report-page1.jpeg"}
                alt="CAC Legal Status Report"
                aspectRatio="aspect-[3/4]"
                badgeText="CAC Certified Extract"
                watermarkText="CFRANK GROUP • OFFICIAL CAC STATUS REPORT • VERIFICATION COPY ONLY"
                onExpand={() => setCacModalOpen(true)}
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-4 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] space-y-3 text-xs">
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">
                    Operating Property & Registered Entity
                  </span>
                  <span className="font-bold text-[#121518] text-sm">Anambra Best Door Enterprises (Property of {brand.name})</span>
                </div>
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">
                    Business Number (BN)
                  </span>
                  <span className="font-mono font-bold text-[#121518] text-sm">
                    {settings.cacNumber || brand.cacNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">
                    Proprietor / Managing Director
                  </span>
                  <span className="font-semibold text-[#121518]">{settings.proprietor || brand.proprietor}</span>
                </div>
                <div>
                  <span className="text-[#73787E] block text-[10px] uppercase font-bold tracking-wider">
                    Registered Market Address
                  </span>
                  <span className="text-[#4A4A4A] leading-relaxed block">
                    {settings.address || brand.address}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="https://search.cac.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#121518] hover:text-[#F3661B] hover:underline"
                >
                  <span>Verify online at official CAC portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
