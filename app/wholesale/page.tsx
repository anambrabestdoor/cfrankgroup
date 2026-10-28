"use client";

import React, { useState } from "react";
import { Building2, Send, CheckCircle2, MessageSquare, Truck, ShieldCheck } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function WholesalePage() {
  const { settings } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    projectLocation: "",
    estimatedVolume: "10 - 25 Doors (Duplex / Residential Project)",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactPerson: `${formData.contactPerson} (Tel: ${formData.phone}, Site: ${formData.projectLocation})`,
          email: formData.email,
          estimatedVolume: formData.estimatedVolume,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit wholesale application");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
            Direct Importer Container Rates
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Contractor & Wholesale Project Supply
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Direct container and bulk pricing for estate builders, project engineers, institutional contractors, and door dealers across all 36 states.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <Building2 className="w-7 h-7 mx-auto text-[#003296]" />
            <h3 className="font-bold text-sm text-slate-900">Direct Importer Pricing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cut out secondary distributor markups. Receive container-direct factory rates on Turkish armoured doors and luxury HDF sets.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <Truck className="w-7 h-7 mx-auto text-[#003296]" />
            <h3 className="font-bold text-sm text-slate-900">Direct Site Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Consolidated trailer and truckway loads directly dispatched to your construction site anywhere in Nigeria.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
            <MessageSquare className="w-7 h-7 mx-auto text-[#003296]" />
            <h3 className="font-bold text-sm text-slate-900">Dedicated Project Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dedicated corporate account manager for project bills of quantities (BOQ) and custom specification architectural schedules.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-xl shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">Contractor Quote Request Received</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Our wholesale project team at {settings.address} will review your bill of quantities and contact you via phone and email within 4 business hours.
              </p>
              <div className="pt-3">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    `Hello CFrank Enterprise, I just submitted a wholesale inquiry for ${formData.companyName} (${formData.estimatedVolume}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 py-3 px-6 bg-[#25D366] text-white font-bold rounded-xl text-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Follow Up Instantly on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">Contractor & Distributor Application</h2>
                <p className="text-xs text-slate-500">Provide your project or store requirements for wholesale volume discounts.</p>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Developer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Construction & Properties Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person & Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Chidi (Project Manager)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (WhatsApp Preferred)</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Site City / State</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asaba, Delta State / Lekki, Lagos"
                    value={formData.projectLocation}
                    onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Order Scale</label>
                  <select
                    value={formData.estimatedVolume}
                    onChange={(e) => setFormData({ ...formData, estimatedVolume: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#003296]"
                  >
                    <option>10 - 25 Doors (Duplex / Residential Project)</option>
                    <option>26 - 50 Doors (Block of Flats / Commercial Hotel)</option>
                    <option>51 - 100+ Doors (Estate Housing Development)</option>
                    <option>Sanitary Ware & Door Container Package</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#003296] hover:bg-[#002266] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <span>{loading ? "Submitting Application..." : "Submit Project Bill of Quantities Request"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
