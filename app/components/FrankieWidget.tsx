"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Phone,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/app/context/AppContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggested_actions?: Array<{
    label: string;
    action_type: "prompt" | "link" | "call";
    payload?: string;
  }>;
}

export default function FrankieWidget() {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Frankie, What would you like to buy today? I can help you search our catalog and Whether you're building a new home, duplex, or hotel, ask me for door recommendations, pricing, sizes.",
      timestamp: new Date().toISOString(),
      suggested_actions: [
        {
          label: "Suggest doors for my new house",
          action_type: "prompt",
          payload: "Which doors do you recommend for a new duplex?",
        },
        {
          label: "HDF room doors in stock",
          action_type: "prompt",
          payload: "What HDF room doors do you have in stock?",
        },
        {
          label: "Turkish security door gauges",
          action_type: "prompt",
          payload: "Tell me about Turkish security door gauges and sizes.",
        },
        {
          label: "Waterproof bathroom doors",
          action_type: "prompt",
          payload: "What waterproof bathroom doors do you have?",
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/frankie/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (res.ok) {
        const data = await res.json();
        const asstMsg: ChatMessage = {
          id: `msg_asst_${Date.now()}`,
          role: "assistant",
          content: data.message || "How else can I help with your door order?",
          timestamp: new Date().toISOString(),
          suggested_actions: data.suggested_actions,
        };
        setMessages((prev) => [...prev, asstMsg]);
      } else {
        throw new Error("Failed to reach Frankie server");
      }
    } catch {
      const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        "Hello CFrank Enterprise, I would like to inquire about door orders and current stock."
      )}`;
      const callUrl = `tel:${settings.phone}`;

      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content:
          "I'm temporarily having trouble connecting. You can reach our sales desk directly on WhatsApp or call our sales line directly.",
        timestamp: new Date().toISOString(),
        suggested_actions: [
          { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
          { label: "Call Admin Directly", action_type: "call", payload: callUrl },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: {
    label: string;
    action_type: "prompt" | "link" | "call";
    payload?: string;
  }) => {
    if (action.action_type === "prompt" && action.payload) {
      handleSendMessage(action.payload);
    } else if (action.action_type === "link" && action.payload) {
      window.open(action.payload, "_blank", "noopener,noreferrer");
    } else if (action.action_type === "call" && action.payload) {
      window.location.href = action.payload;
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm Frankie, What would you like to buy today? I can help you search our catalog and Whether you're building a new home, duplex, or hotel, ask me for door recommendations, pricing, sizes.",
        timestamp: new Date().toISOString(),
        suggested_actions: [
          {
            label: "Suggest doors for my new house",
            action_type: "prompt",
            payload: "Which doors do you recommend for a new duplex?",
          },
          {
            label: "HDF room doors in stock",
            action_type: "prompt",
            payload: "What HDF room doors do you have in stock?",
          },
          {
            label: "Turkish security door gauges",
            action_type: "prompt",
            payload: "Tell me about Turkish security door gauges and sizes.",
          },
          {
            label: "Waterproof bathroom doors",
            action_type: "prompt",
            payload: "What waterproof bathroom doors do you have?",
          },
        ],
      },
    ]);
  };

  return (
    <div
      id="frankie-widget-container"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto"
      style={{ isolation: "isolate" }}
    >
      {/* 1. Open Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white rounded-xl shadow-lg border border-slate-300 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-3.5 sm:p-4 flex flex-col gap-2.5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-full bg-[#003296] text-white flex items-center justify-center font-black text-sm border border-blue-500">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white leading-tight">Frankie</span>
                    {/* Green pulsing dot showing active state */}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-[10px] text-emerald-300 font-semibold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset Conversation"
                  className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Handover Bar: WhatsApp + Call Admin */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  "Hello CFrank Enterprise, I would like to inquire about door orders and current stock."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat directly on WhatsApp"
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.778-.877-2.054-.977-.275-.101-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.3-.151-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.151-.677-1.632-.927-2.234-.244-.586-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.579-.087 1.778-.727 2.029-1.429.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.764.46 3.487 1.334 5.006L2 22.028l5.14-1.348a9.98 9.98 0 0 0 4.9 1.28c5.524 0 10.012-4.488 10.012-10.012A10.01 10.01 0 0 0 12.04 2zm0 18.293c-1.554 0-3.078-.418-4.409-1.209l-.316-.188-3.275.859.874-3.193-.206-.328a8.27 8.27 0 0 1-1.268-4.422c0-4.57 3.719-8.289 8.289-8.289 2.215 0 4.297.863 5.863 2.43 1.566 1.566 2.429 3.648 2.429 5.863 0 4.57-3.719 8.289-8.289 8.289z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                title={`Call Admin: ${settings.phoneDisplay}`}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>Call Admin</span>
              </a>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] p-3 sm:p-3.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#003296] text-white rounded-xl rounded-tr-xs shadow-xs"
                      : "bg-white text-slate-800 rounded-xl rounded-tl-xs border border-slate-200/90 shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Suggested Action Chips (if provided) */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.suggested_actions.map((act, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleActionClick(act)}
                        className={`text-[11px] font-semibold py-1 px-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                          act.action_type === "link"
                            ? "bg-blue-50 text-[#003296] border-blue-200 hover:bg-blue-100"
                            : act.action_type === "call"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        {act.action_type === "link" && act.payload?.includes("wa.me") ? (
                          <svg className="w-3 h-3 fill-current text-[#25D366] shrink-0" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.301-.15-1.778-.877-2.054-.977-.275-.101-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.3-.151-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.151-.677-1.632-.927-2.234-.244-.586-.492-.507-.677-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.2 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.635.722.23 1.38.197 1.9.12.579-.087 1.778-.727 2.029-1.429.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.764.46 3.487 1.334 5.006L2 22.028l5.14-1.348a9.98 9.98 0 0 0 4.9 1.28c5.524 0 10.012-4.488 10.012-10.012A10.01 10.01 0 0 0 12.04 2zm0 18.293c-1.554 0-3.078-.418-4.409-1.209l-.316-.188-3.275.859.874-3.193-.206-.328a8.27 8.27 0 0 1-1.268-4.422c0-4.57 3.719-8.289 8.289-8.289 2.215 0 4.297.863 5.863 2.43 1.566 1.566 2.429 3.648 2.429 5.863 0 4.57-3.719 8.289-8.289 8.289z" />
                          </svg>
                        ) : act.action_type === "link" ? (
                          <ExternalLink className="w-3 h-3 text-[#003296]" />
                        ) : null}
                        {act.action_type === "call" && <Phone className="w-3 h-3 text-emerald-700" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 py-2 px-3.5 bg-white border border-slate-200 rounded-xl rounded-tl-xs w-fit shadow-xs">
                <span className="text-xs text-slate-500 font-semibold">Typing...</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003296] animate-dot-1"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003296] animate-dot-2"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003296] animate-dot-3"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Frankie about doors, sizes, prices..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#003296] focus:bg-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                aria-label="Send message"
                className="w-9 h-9 rounded-xl bg-[#003296] hover:bg-[#002266] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Instant product information, sizes, and pricing.
            </p>
          </form>
        </div>
      )}

      {/* 2. Closed Floating Trigger Button (Icon Only) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Chat with Frankie"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#003296] hover:bg-[#002266] text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-blue-500"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="absolute top-1 right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#003296]"></span>
          </span>
        </button>
      )}
    </div>
  );
}
