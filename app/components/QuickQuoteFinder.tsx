"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { Lock, Home, Droplets, Key, Check, ArrowRight, MessageSquare } from "lucide-react";
import { buildWhatsAppOrderUrl } from "@/lib/settings";

interface OptionItem {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const DOOR_TYPES: OptionItem[] = [
  {
    id: "security",
    label: "Security Entrance Door",
    description: "Heavy-gauge Turkish & Israeli steel doors for main entrances.",
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: "interior",
    label: "Interior Room Door",
    description: "Watson & HDF finished room doors with quiet latching.",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "bathroom",
    label: "Waterproof Bathroom Door",
    description: "100% waterproof WPC composite doors that never swell.",
    icon: <Droplets className="w-5 h-5" />,
  },
  {
    id: "smartlock",
    label: "Smart Digital Lock",
    description: "Biometric fingerprint and keypad smart locks.",
    icon: <Key className="w-5 h-5" />,
  },
];

const SIZE_OPTIONS: OptionItem[] = [
  {
    id: "single-3ft",
    label: "3ft x 7ft (Single Leaf)",
    description: "Standard standard entrance or room width (900mm x 2100mm).",
    icon: <span className="font-bold text-xs">3×7</span>,
  },
  {
    id: "semi-4ft",
    label: "4ft x 7ft (1.5 Leaf)",
    description: "One main leaf plus one secondary narrow leaf (1200mm).",
    icon: <span className="font-bold text-xs">4×7</span>,
  },
  {
    id: "double-5ft",
    label: "4.5ft / 5ft (Double Leaf)",
    description: "Grand dual opening doors for luxury entrances (1500mm).",
    icon: <span className="font-bold text-xs">5×7</span>,
  },
  {
    id: "custom",
    label: "Custom / Not Sure",
    description: "Request our technical team to advise on your wall openings.",
    icon: <span className="font-bold text-xs">?</span>,
  },
];

export default function QuickQuoteFinder() {
  const { settings } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<string>("security");
  const [selectedSize, setSelectedSize] = useState<string>("single-3ft");

  const currentTypeObj = DOOR_TYPES.find((t) => t.id === selectedType);
  const currentSizeObj = SIZE_OPTIONS.find((s) => s.id === selectedSize);

  const handleGetWhatsAppQuote = () => {
    const text = `Hello Anambra Best Door Enterprises (CFrank Enterprise),\n\nI used the Quick Quote tool on your website and would like a quote for:\n- Door Category: ${currentTypeObj?.label || selectedType}\n- Dimension/Spec: ${currentSizeObj?.label || selectedSize} (${currentSizeObj?.description || ""})\n- Warehouse: ${settings.marketLocation}\n\nPlease let me know available stock models, price breakdown, and delivery terms.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-12 px-4 sm:px-6 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator Header (From Video) */}
        <div className="mb-6 text-center sm:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#003296] block mb-1">
            Step {step} of 2 • Fast WhatsApp Quote
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {step === 1 ? "Select the type of door you need" : "Select your door dimension / size"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {step === 1
              ? "Choose your application to view matching materials and security grades."
              : "Specify your rough wall opening to calculate exact prices and accessories."}
          </p>
        </div>

        {/* Step 1: Door Types */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
            {DOOR_TYPES.map((item) => {
              const isSelected = selectedType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id)}
                  className={`p-4 rounded-xl text-left border transition-all flex items-start space-x-3.5 relative ${
                    isSelected
                      ? "border-[#003296] bg-blue-50/50 shadow-sm ring-1 ring-[#003296]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#003296] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 pr-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block mb-0.5">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">
                      {item.description}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#003296] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Dimensions */}
        {step === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
            {SIZE_OPTIONS.map((item) => {
              const isSelected = selectedSize === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSize(item.id)}
                  className={`p-4 rounded-xl text-left border transition-all flex items-start space-x-3.5 relative ${
                    isSelected
                      ? "border-[#003296] bg-blue-50/50 shadow-sm ring-1 ring-[#003296]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[#003296] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 pr-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block mb-0.5">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block">
                      {item.description}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#003296] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step Controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200/80">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
            >
              ← Back to Door Type
            </button>
          ) : (
            <div className="text-[11px] text-slate-400">
              Selected: <span className="font-semibold text-slate-700">{currentTypeObj?.label}</span>
            </div>
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-5 bg-[#003296] hover:bg-[#092b7c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95 ml-auto"
            >
              <span>Continue to Size</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleGetWhatsAppQuote}
              className="py-2.5 px-5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95 ml-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Get Instant WhatsApp Quote</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
