"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { brand } from "@/lib/brand";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  Building2,
  Send,
  Store,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    categoryInterest: "all",
    projectLocation: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello ${brand.name},\n\nContact Inquiry:\n- Name: ${form.name}\n- Phone: ${form.phone}\n- Category: ${form.categoryInterest}\n- Project Location: ${form.projectLocation}\n- Message: ${form.message}`;
    const url = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Header Banner */}
      <section className="bg-[#121518] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#22262B]">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F3661B] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Corporate Contacts & Depots</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Connect with {brand.name}
          </h1>
          <p className="text-sm sm:text-base text-[#D1D1CC] max-w-2xl mx-auto leading-relaxed">
            Visit our physical showrooms and wholesale warehouses in Ogidi, Anambra State, or connect directly with our customer care agents.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Depots & Divisional Contact Information */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B]">
                Physical Infrastructure
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#121518]">
                Warehouse & Showroom Locations
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                Contractors, developers, and private builders are welcome to inspect doors, locks, sanitary fixtures, and building finishes directly in person.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Central Wholesale Depot */}
              <div className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] text-[#F3661B] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-sm text-[#121518] block">
                    Central Wholesale Warehouse & Depot
                  </span>
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {settings.address || brand.address}
                  </p>
                  <p className="text-[11px] text-[#73787E]">
                    Security doors, interior doors, sanitary wares, and roofing materials direct supply.
                  </p>
                </div>
              </div>

              {/* Branch Showroom */}
              {settings.secondAddress && (
                <div className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC] text-[#F3661B] flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-[#121518] block">
                      Branch Showroom
                    </span>
                    <p className="text-[#4A4A4A] leading-relaxed">
                      {settings.secondAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* General Telephone & WhatsApp Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787E] block">
                    Telephone
                  </span>
                  <a
                    href={`tel:${brand.phone}`}
                    className="text-xs font-bold font-mono text-[#121518] hover:text-[#F3661B] block"
                  >
                    {brand.phoneDisplay}
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787E] block">
                    Corporate Email
                  </span>
                  <a
                    href={`mailto:${brand.email}`}
                    className="text-xs font-bold text-[#121518] hover:text-[#F3661B] block truncate"
                  >
                    {brand.email}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#F3661B] shrink-0" />
                <div>
                  <span className="font-bold text-[#121518] block">Trading Hours</span>
                  <span className="text-[#4A4A4A]">{brand.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Procurement Specializations */}
            <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B] block">
                Primary Product Lines
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC]">
                  <span className="font-bold text-[#121518] block">Security & Armoured Doors</span>
                  <span className="text-[11px] text-[#73787E] block mt-0.5">Turkish steel & Israeli multi-bolt</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC]">
                  <span className="font-bold text-[#121518] block">Foreign HDF Interior Doors</span>
                  <span className="text-[11px] text-[#73787E] block mt-0.5">Pre-hung room & bathroom doors</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC]">
                  <span className="font-bold text-[#121518] block">Sanitary Wares & WC Suites</span>
                  <span className="text-[11px] text-[#73787E] block mt-0.5">Vitreous china, washbasins & showers</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E5E3DC]">
                  <span className="font-bold text-[#121518] block">Stone-Coated Roof Tiles</span>
                  <span className="text-[11px] text-[#73787E] block mt-0.5">Bond, Classic & Shingle profiles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Trade Inquiry Form */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-[#E5E3DC] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3661B] block">
                Order & Quotation Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#121518] mt-1">
                Send an Inquiry or Schedule
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A4A] mt-1">
                Provide your requirements below. Inquiries are processed directly through our customer care agent.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-950">Inquiry Dispatched</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your details have been coordinated. A representative will confirm availability and specifications.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-emerald-900 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#121518] mb-1">
                    Your Full Name / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Arc. Emeka Okafor / Apex Build Ltd"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E3DC] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#121518] text-xs text-[#121518]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#121518] mb-1">
                      Phone Number (WhatsApp preferred) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E3DC] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#121518] text-xs text-[#121518]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#121518] mb-1">
                      Product Category of Interest
                    </label>
                    <select
                      value={form.categoryInterest}
                      onChange={(e) => setForm({ ...form, categoryInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E3DC] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#121518] text-xs text-[#121518]"
                    >
                      <option value="all">Entire Project Procurement / Multi-Category</option>
                      <option value="Security Doors">Security & Armoured Doors</option>
                      <option value="Interior Doors">Foreign HDF Interior Doors</option>
                      <option value="Sanitary Wares">Sanitary Wares & Water Closets</option>
                      <option value="Stone-Coated Roofing">Stone-Coated Roof Tiles</option>
                      <option value="Smart Locks">Smart Biometric Locks</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#121518] mb-1">
                    Project Location / Delivery City
                  </label>
                  <input
                    type="text"
                    value={form.projectLocation}
                    onChange={(e) => setForm({ ...form, projectLocation: e.target.value })}
                    placeholder="e.g. Awka, Asaba, Port Harcourt, Enugu, Lagos"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E3DC] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#121518] text-xs text-[#121518]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#121518] mb-1">
                    Requirements, Quantities, or Schedule Summary *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Specify door models, rough opening sizes (3ft, 4ft, 5ft), sanitary fixtures, or project stage..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E3DC] bg-[#FBF9F5] focus:bg-white focus:outline-none focus:border-[#121518] text-xs text-[#121518]"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-5 bg-[#121518] hover:bg-[#22262B] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#F3661B]" />
                    <span>Submit to Customer Care Agent (WhatsApp Dispatch)</span>
                  </button>

                  <p className="text-[10px] text-[#73787E] text-center">
                    Submitting connects your inquiry directly to our customer care agent for real-time quotation.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
