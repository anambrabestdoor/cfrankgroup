"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  Bot,
  ExternalLink,
  ChevronRight,
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
        "Hello! I'm Frankie, your trade specialist at Anambra Best Door (CFrank Enterprise, owned by Chidera Frank Okonkwo). Whether you're building a new home, duplex, or hotel, ask me for door recommendations, pricing, sizes, or depot inspection at Ogidi.",
      timestamp: new Date().toISOString(),
      suggested_actions: [
        {
          label: "Suggest doors for my new house",
          action_type: "prompt",
          payload: "Which doors do you recommend for a new duplex?",
        },
        {
          label: "What HDF room doors are in stock?",
          action_type: "prompt",
          payload: "What HDF room doors do you have in stock?",
        },
        {
          label: "Turkish security door gauges",
          action_type: "prompt",
          payload: "Tell me about Turkish security door gauges and sizes.",
        },
        {
          label: "Who owns CFrank Enterprise?",
          action_type: "prompt",
          payload: "Who owns CFrank Enterprise and what is your CAC registration?",
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
        "Hello CFrank Enterprise, I was chatting with Frankie and would like to confirm door details."
      )}`;
      const callUrl = `tel:${settings.phone}`;

      const fallbackMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: "assistant",
        content:
          "I'm temporarily having trouble connecting. You can reach our sales desk directly on WhatsApp or call our Ogidi depot admin.",
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
          "Hello! I'm Frankie, your trade specialist at Anambra Best Door (CFrank Enterprise, owned by Chidera Frank Okonkwo). Whether you're building a new home, duplex, or hotel, ask me for door recommendations, pricing, sizes, or depot inspection at Ogidi.",
        timestamp: new Date().toISOString(),
        suggested_actions: [
          {
            label: "Suggest doors for my new house",
            action_type: "prompt",
            payload: "Which doors do you recommend for a new duplex?",
          },
          {
            label: "What HDF room doors are in stock?",
            action_type: "prompt",
            payload: "What HDF room doors do you have in stock?",
          },
          {
            label: "Turkish security door gauges",
            action_type: "prompt",
            payload: "Tell me about Turkish security door gauges and sizes.",
          },
          {
            label: "Who owns CFrank Enterprise?",
            action_type: "prompt",
            payload: "Who owns CFrank Enterprise and what is your CAC registration?",
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
        <div className="mb-3 w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-3.5 sm:p-4 flex flex-col gap-2.5 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="relative w-8 h-8 rounded-lg bg-[#003296] text-white flex items-center justify-center font-black text-sm shadow-sm border border-blue-400/30">
                  <Bot className="w-4 h-4 text-blue-200" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-white leading-tight">Frankie</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-900/80 text-blue-200 rounded font-bold uppercase tracking-wider">
                      AI Specialist
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Anambra Best Door • Maraim Plaza Ogidi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Reset Conversation"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="w-7 h-7 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Handover Bar: WhatsApp + Call Admin */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                  "Hello CFrank Enterprise, I was chatting with Frankie on your site and would like to speak directly with a sales representative."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${settings.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg border border-white/15 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-blue-300" />
                <span>Call Admin</span>
              </a>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 bg-slate-50/70">
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
                        {act.action_type === "link" && <ExternalLink className="w-3 h-3" />}
                        {act.action_type === "call" && <Phone className="w-3 h-3" />}
                        {act.action_type === "prompt" && <Sparkles className="w-3 h-3 text-[#003296]" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-1.5 p-3 bg-white border border-slate-200 rounded-xl rounded-tl-xs w-fit shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003296] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#003296] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#003296] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-400 font-medium ml-1">Frankie is typing...</span>
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
              Trained on Anambra Best Door products, Ogidi depot stock, and delivery.
            </p>
          </form>
        </div>
      )}

      {/* 2. Closed Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Frankie AI Assistant"
          className="group relative flex items-center gap-2 py-3 px-4 rounded-full bg-[#003296] hover:bg-[#002266] text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#003296] animate-pulse"></span>
          </div>
          <span className="text-xs font-bold tracking-tight">Chat with Frankie</span>
        </button>
      )}
    </div>
  );
}
