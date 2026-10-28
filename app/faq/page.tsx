"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { useApp } from "@/app/context/AppContext";

export default function FAQPage() {
  const { settings } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const doorFaqs = [
    {
      id: "faq-1",
      question: "What steel gauge are your Turkish security entrance doors?",
      answer:
        "Our Turkish armoured security doors are constructed with genuine 1.5mm to 2.0mm electro-galvanized cold-rolled steel plates with internal vertical and horizontal steel stiffeners and high-density rockwool insulation. We welcome clients to inspect leaf weight and steel gauge physically at our warehouse.",
    },
    {
      id: "faq-2",
      question: "Can I inspect the doors in person before placing an order?",
      answer:
        "Yes, absolutely. Our showroom and warehouse is open Monday through Saturday from 8:00 AM to 5:30 PM for clients and site representatives to examine doors, lock mechanisms, and finishes in person.",
    },
    {
      id: "faq-3",
      question: "How does nationwide waybill delivery work?",
      answer:
        "Once your order is confirmed with our sales team on WhatsApp, your products are thoroughly inspected, protective bubble-wrapped, corner-guarded, and crated. We dispatch via verified transport park logistics from Onitsha to major hubs in Lagos, Abuja, Port Harcourt, Asaba, Enugu, and all Nigerian states.",
    },
    {
      id: "faq-4",
      question: "Are your bathroom doors genuinely 100% waterproof?",
      answer:
        "Yes. Unlike ordinary flush doors that swell and peel in moist bathrooms, our WPC (Wood-Plastic Composite) bathroom doors are monolithic polymer blends completely immune to water, steam, humidity, and termites.",
    },
    {
      id: "faq-5",
      question: "How do your biometric smart locks operate during power outages?",
      answer:
        "Our smart digital locks run on 4 standard AA alkaline batteries with a standby lifespan of 10 to 12 months. When batteries run low, the lock sounds an audible alert. In an emergency, you can power it via an external USB-C port or use the included physical laser-cut mechanical override keys.",
    },
    {
      id: "faq-6",
      question: "Is CFrank Enterprise legally registered in Nigeria?",
      answer: `Yes. CFrank Enterprise is registered with the Corporate Affairs Commission (CAC BN: ${settings.cacNumber}) under the Companies and Allied Matters Act. You can inspect our certificate directly on this website or verify on search.cac.gov.ng.`,
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: doorFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* FAQ Schema for Google Rich Accordion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-[#0A192F] text-white py-16 px-4 text-center border-b border-slate-800">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
            Contractor & Homeowner Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-slate-300">
            Everything you need to know about our steel security doors, interior room doors, warehouse visits, and nationwide delivery.
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        {doorFaqs.map((faq, idx) => (
          <div
            key={faq.id}
            className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 shrink-0 ml-3 transition-transform ${
                  openIdx === idx ? "rotate-180 text-[#003296]" : ""
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        <div className="pt-8 text-center bg-white p-8 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Have a specific question about your wall openings?</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Our sales team is available on WhatsApp to review your dimensions, confirm stock, and provide quotes.
          </p>
          <a
            href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
              "Hello CFrank Enterprise, I have a question regarding door dimensions and waybill delivery."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 py-2.5 px-5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </main>
    </div>
  );
}
