"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Minimize2, Circle, ChevronLeft } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  avatar: string;
  roleTitle: string;
  status: "online" | "offline" | "busy";
  department: string;
}

interface ChatMessage {
  id: string;
  sender: "visitor" | "agent";
  text: string;
  agentName?: string;
  time: string;
}

interface Department {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const DEPARTMENTS: Department[] = [
  { id: "general",     label: "General Inquiry",   emoji: "💬", description: "ANUA policies, general questions & more" },
  { id: "skincare",    label: "Skincare Advice",    emoji: "🌿", description: "Routines, ingredients & skin concerns" },
  { id: "orders",      label: "Orders & Shipping",  emoji: "📦", description: "Track, return or refund an order" },
  { id: "technical",   label: "Technical Support",  emoji: "🛠️", description: "Website, account & payment issues" },
  { id: "suggestions", label: "Suggestions",        emoji: "💡", description: "Share feedback, ideas & wishlists" },
];

const DEFAULT_AGENTS: Agent[] = [
  { id: "agent-1", name: "Sophia Chen",   avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", roleTitle: "Lead Skincare Specialist",    status: "online", department: "skincare" },
  { id: "agent-2", name: "Mia Kim",       avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80", roleTitle: "K-Beauty Advisor",            status: "online", department: "general" },
  { id: "agent-3", name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", roleTitle: "Dermatology Care Specialist", status: "online", department: "skincare" },
  { id: "agent-4", name: "James Park",    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", roleTitle: "Order & Delivery Support",   status: "online", department: "orders" },
  { id: "agent-5", name: "Lena Kovacs",   avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80", roleTitle: "Technical Support Specialist",status: "online", department: "technical" },
];

function getSessionId(): string {
  if (typeof window === "undefined") return `sess_${Date.now()}`;
  const stored = sessionStorage.getItem("anua_chat_session");
  if (stored) return stored;
  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem("anua_chat_session", id);
  return id;
}

function assignAgentForDept(agents: Agent[], dept: string, sessionId: string): Agent {
  const deptAgents = agents.filter((a) => a.status === "online" && a.department === dept);
  const pool = deptAgents.length > 0 ? deptAgents : agents.filter((a) => a.status === "online");
  const fallback = pool.length > 0 ? pool : agents;
  const hash = sessionId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return fallback[hash % fallback.length];
}

// View states for the widget
type ChatView = "departments" | "chat";

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<ChatView>("departments");
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [assignedAgent, setAssignedAgent] = useState<Agent | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "help@anuaglobal.com";

  // Initialize unique per-browser session ID on client mount
  useEffect(() => {
    let id = sessionStorage.getItem("anua_chat_session");
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem("anua_chat_session", id);
    }
    setSessionId(id);
  }, []);

  // Fetch agents
  useEffect(() => {
    fetch("/api/support/agents")
      .then((r) => r.json())
      .then((data: Agent[]) => { if (Array.isArray(data) && data.length > 0) setAgents(data); })
      .catch(() => {});
  }, []);

  // SSE for real-time replies — stays open, typing indicator persists until real reply arrives
  useEffect(() => {
    if (!isOpen || view !== "chat" || !sessionId) return;
    const es = new EventSource(`/api/livechat/stream?sessionId=${sessionId}`);
    eventSourceRef.current = es;
    es.onmessage = (event) => {
      // Ignore keep-alive pings (empty data)
      if (!event.data || event.data.trim() === "") return;
      try {
        const msg = JSON.parse(event.data);
        // Guard: only process messages for this exact session
        if (msg.sessionId && msg.sessionId !== sessionId) return;
        if (msg.sender !== "agent") return; // only show agent replies
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            sender: "agent",
            agentName: msg.agentName,
            text: msg.text,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        // Clear typing indicator ONLY when real reply received
        setIsAgentTyping(false);
        if (!isOpen) setHasUnread(true);
      } catch { /* ignore malformed data */ }
    };
    es.onerror = () => {
      // Connection dropped — reconnect silently (browser retries automatically)
    };
    return () => { es.close(); eventSourceRef.current = null; };
  }, [isOpen, view, sessionId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isAgentTyping]);
  useEffect(() => { if (isOpen) setHasUnread(false); }, [isOpen]);

  // When a department is selected, assign agent and start chat
  const handleSelectDept = (dept: Department) => {
    setSelectedDept(dept);
    const agent = assignAgentForDept(agents, dept.id, sessionId);
    setAssignedAgent(agent);
    setMessages([{
      id: "welcome",
      sender: "agent",
      agentName: agent.name,
      text: `Hi! I'm ${agent.name} from our ${dept.label} team. 💚 ${
        dept.id === "skincare"    ? "I'd love to help you build the perfect routine. What's your skin concern?" :
        dept.id === "orders"      ? "I can help track, return, or answer questions about your order. What's the order number?" :
        dept.id === "technical"   ? "I'm here to troubleshoot any website or account issues. What's going wrong?" :
        dept.id === "suggestions" ? "We love hearing from you! What product or experience would you like to share feedback on?" :
        "How can I assist you today?"
      }`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setView("chat");
  };

  const handleBackToDepts = () => {
    setView("departments");
    setSelectedDept(null);
    setAssignedAgent(null);
    setMessages([]);
    setInput("");
    setIsAgentTyping(false);
    if (eventSourceRef.current) { eventSourceRef.current.close(); eventSourceRef.current = null; }
  };

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !assignedAgent || !selectedDept) return;
    const text = input.trim();
    setMessages((prev) => [...prev, {
      id: `client-${Date.now()}`, sender: "visitor", text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setInput("");
    setIsAgentTyping(true);

    try {
      await fetch("/api/livechat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId, visitorName: "Visitor", text,
          agentId: assignedAgent.id, agentName: assignedAgent.name,
          department: selectedDept.id,
        }),
      });
    } catch { /* non-fatal */ }
  }, [input, assignedAgent, selectedDept, sessionId]);

  const statusColor = assignedAgent?.status === "online" ? "bg-emerald-400" : assignedAgent?.status === "busy" ? "bg-amber-400" : "bg-gray-400";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Toggle Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-black text-white px-5 py-3.5 rounded-full shadow-2xl hover:bg-neutral-800 transition-all flex items-center gap-2.5 font-semibold text-xs uppercase tracking-widest"
          aria-label="Open Live Chat"
          id="live-chat-toggle"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Live Chat</span>
          {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />}
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className={`w-[360px] sm:w-[390px] bg-white rounded-3xl border border-gray-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isMinimized ? "h-[72px]" : view === "departments" ? "h-auto max-h-[580px]" : "h-[540px]"}`}
          style={{ animation: "fadeSlideUp 0.25s ease" }}
        >
          {/* ── Header ── */}
          <div className="bg-black text-white px-5 py-4 flex items-center justify-between shrink-0">
            {view === "chat" && assignedAgent ? (
              <div className="flex items-center gap-3">
                <button onClick={handleBackToDepts} className="p-1 text-gray-400 hover:text-white transition-colors mr-1" aria-label="Back to departments">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assignedAgent.avatar} alt={assignedAgent.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedAgent.name)}&background=fff&color=000&size=80`; }}
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black ${statusColor}`} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{assignedAgent.name}</p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {selectedDept?.emoji} {selectedDept?.label}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">💚</div>
                <div>
                  <p className="font-semibold text-sm">ANUA Support</p>
                  <p className="text-[10px] text-gray-400">How can we help you today?</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized((v) => !v)} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10" aria-label="Minimize">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10" aria-label="Close chat">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* ═══════════════════════════════════════
                  VIEW: DEPARTMENT SELECTION
              ═══════════════════════════════════════ */}
              {view === "departments" && (
                <div className="flex flex-col">
                  {/* Trust badge */}
                  <div className="bg-neutral-50 border-b border-gray-100 px-4 py-2.5 text-[10px] text-gray-500 flex items-center justify-between">
                    <span>🔒 Verified ANUA Advisors · Avg reply <strong className="text-black">~2 min</strong></span>
                    <a href={`mailto:${supportEmail}`} className="text-black font-semibold underline underline-offset-2">{supportEmail}</a>
                  </div>

                  {/* Department cards */}
                  <div className="p-4 space-y-2.5 overflow-y-auto bg-[#FAFAF8]">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Select a department</p>
                    {DEPARTMENTS.map((dept) => {
                      const deptAgents = agents.filter((a) => a.department === dept.id && a.status === "online");
                      const agentCount = deptAgents.length;
                      return (
                        <button
                          key={dept.id}
                          onClick={() => handleSelectDept(dept)}
                          className="w-full flex items-center gap-3.5 bg-white border border-gray-200 hover:border-black hover:shadow-sm rounded-2xl px-4 py-3.5 transition-all text-left group"
                        >
                          <span className="text-2xl flex-shrink-0">{dept.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-black leading-tight">{dept.label}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{dept.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${agentCount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                              {agentCount > 0 ? `${agentCount} online` : "Leave msg"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom agents preview strip */}
                  <div className="border-t border-gray-100 bg-white px-4 py-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {agents.slice(0, 4).map((a) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img key={a.id} src={a.avatar} alt={a.name}
                          className="w-6 h-6 rounded-full border-2 border-white object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=000&color=fff&size=40`; }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      <strong className="text-black">{agents.filter((a) => a.status === "online").length}</strong> agents online across all departments
                    </p>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════
                  VIEW: ACTIVE CHAT
              ═══════════════════════════════════════ */}
              {view === "chat" && (
                <>
                  {/* Trust badge */}
                  <div className="bg-neutral-50 border-b border-gray-100 px-5 py-2 text-[10px] text-gray-500 flex items-center justify-between shrink-0">
                    <span>🔒 Verified ANUA Advisor · Avg reply <strong className="text-black">~2 min</strong></span>
                    <a href={`mailto:${supportEmail}`} className="text-black font-semibold underline underline-offset-2">{supportEmail}</a>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAFAF8]">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-2.5 ${msg.sender === "visitor" ? "flex-row-reverse" : "flex-row"}`}>
                        {msg.sender === "agent" && assignedAgent && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={agents.find((a) => a.name === msg.agentName)?.avatar || assignedAgent.avatar}
                            alt={msg.agentName || "Agent"}
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-auto border border-gray-100"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.agentName || "A")}&background=000&color=fff&size=56`; }}
                          />
                        )}
                        <div className={`flex flex-col gap-1 max-w-[78%] ${msg.sender === "visitor" ? "items-end" : "items-start"}`}>
                          {msg.sender === "agent" && msg.agentName && (
                            <span className="text-[9px] text-gray-400 font-medium px-1">{msg.agentName}</span>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === "visitor"
                              ? "bg-black text-white rounded-br-none"
                              : "bg-white text-black border border-gray-200 rounded-bl-none shadow-sm"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-gray-400 px-1">{msg.time}</span>
                        </div>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {isAgentTyping && assignedAgent && (
                      <div className="flex items-end gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={assignedAgent.avatar} alt={assignedAgent.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-100" />
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Message ${assignedAgent?.name || "support"}...`}
                      className="flex-1 bg-neutral-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs focus:outline-none focus:border-black text-black placeholder:text-gray-400 transition-colors"
                      id="chat-input"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shrink-0 hover:bg-neutral-800 disabled:opacity-40 transition-all"
                      aria-label="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}


