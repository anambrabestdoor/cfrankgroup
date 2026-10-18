"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle, ShieldCheck, Store, Send } from "lucide-react";

export default function ContactPage() {
  const { settings, setCacModalOpen } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", projectLocation: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect or trigger WhatsApp directly with the entered form details!
    const text = `Hello CFrank Enterprise (Anambra Best Door),\n\nContact Inquiry from Website:\n- Name: ${form.name}\n- Phone: ${form.phone}\n- Project Location: ${form.projectLocation}\n- Message: ${form.message}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#003296] block">
            Customer Service & Order Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Contact Anambra Best Door
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Visit our store depot or connect directly with our sales desk on WhatsApp for live price quotes, wall measurements, and nationwide delivery schedules.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Showroom & Depot Information Column */}
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
                Physical Depot & Market Hub
              </span>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our depot is strategically located in the Building Material International Market in Ogidi, providing immediate access to heavy-gauge steel security doors and hardware for clients across the South-East and nationwide.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Showroom Address */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Store & Depot Address</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{settings.address}</p>
                </div>
              </div>

              {/* Direct Phone Line */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone Calls & Inquiries</span>
                  <a href={`tel:${settings.phone}`} className="text-[#003296] font-semibold hover:underline block mt-0.5">
                    {settings.phoneDisplay}
                  </a>
                </div>
              </div>

              {/* Direct WhatsApp */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-xs flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block">Instant WhatsApp Sales Desk</span>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    Fast responses for stock confirmation, price lists, and photos.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I am contacting you from your website contact page.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 py-1.5 px-3 bg-[#25D366] text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                  >
                    Open WhatsApp Chat
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#003296] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Operating Hours</span>
                  <p className="text-slate-600 mt-0.5">{settings.workingHours} (Sundays Closed)</p>
                </div>
              </div>

              {/* Verified CAC & Jiji Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setCacModalOpen(true)}
                  className="py-2 px-3 bg-white border border-slate-200 hover:border-[#003296] rounded-xl text-[11px] font-semibold text-[#003296] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#003296]" />
                  <span>CAC BN: {settings.cacNumber} (Verify)</span>
                </button>
                <a
                  href={settings.jijiShopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-white border border-slate-200 hover:border-emerald-600 rounded-xl text-[11px] font-semibold text-emerald-700 flex items-center space-x-1.5 transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Verified Jiji.ng Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Contact & Quote Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Message Dispatched!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  Your inquiry has been compiled and sent to our sales desk. A sales representative will assist you promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="py-2 px-4 bg-[#003296] text-white text-xs font-semibold rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Send an Inquiry or Quote Request</h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Direct submission to CFrank Enterprise sales desk.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Chief Okonkwo / Engr. Emeka"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. 0803 000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project City / State</label>
                  <input
                    type="text"
                    value={form.projectLocation}
                    onChange={(e) => setForm({ ...form, projectLocation: e.target.value })}
                    placeholder="e.g. Onitsha, Awka, Lagos, Abuja, Asaba, Port Harcourt"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message or Required Door Specifications *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="State the door types (Security, Interior, Bathroom), quantity, and preferred dimensions..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#003296]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-transform active:scale-95 text-xs sm:text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Forward Inquiry via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
