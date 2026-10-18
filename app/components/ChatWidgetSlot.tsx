"use client";

import React, { useState } from "react";
import { useApp } from "@/app/context/AppContext";
import { MessageSquare, X } from "lucide-react";

export default function ChatWidgetSlot() {
  const { settings } = useApp();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <div
      id="chat-widget-container"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto"
      style={{ isolation: "isolate" }}
    >
      {/* Optional Inactive/Dismissable Notification Balloon */}
      {tooltipOpen && (
        <div className="mb-2 p-3 bg-white border border-slate-200 rounded-xl shadow-lg max-w-xs text-xs text-slate-800 animate-fade-in relative">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute top-1 right-1 text-slate-400 hover:text-slate-600 p-1"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-bold text-slate-900 mb-0.5">Need door advice or price quotes?</p>
          <p className="text-[11px] text-slate-500">
            Our Ogidi showroom sales desk is available on WhatsApp to answer your inquiries.
          </p>
        </div>
      )}

      {/* Floating Trigger Button */}
      <a
        href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I would like to chat with a sales representative regarding door orders.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Anambra Best Door on WhatsApp"
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-6 h-6" />

        {/* Pulse beacon */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse"></span>
      </a>

      {/* Designated mount point for future AI agent / Bot integration */}
      <div id="ai-agent-mount-slot" className="hidden" aria-hidden="true" />
    </div>
  );
}
