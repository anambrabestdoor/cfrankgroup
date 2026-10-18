import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// In-memory message store — keyed by sessionId
// Shape: { sessionId: Message[] }
export interface ChatMessage {
  id: string;
  sessionId: string;
  agentId: string;
  agentName: string;
  visitorName: string;
  text: string;
  sender: "visitor" | "agent";
  timestamp: number;
  department?: string;
}

// Shared store accessible from webhook route
export const chatStore: Map<string, ChatMessage[]> = new Map();
// SSE subscribers: sessionId → Set of response controllers (supports multi-tab / reconnects)
export const sseClients: Map<string, Set<ReadableStreamDefaultController<Uint8Array>>> = new Map();

export async function POST(req: NextRequest) {
  try {
    const { sessionId, visitorName, text, agentId, agentName, department } = await req.json();

    if (!sessionId || !text) {
      return NextResponse.json({ error: "sessionId and text are required." }, { status: 400 });
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId,
      agentId: agentId || "agent-1",
      agentName: agentName || "Sophia Chen",
      visitorName: visitorName || "Visitor",
      text,
      sender: "visitor",
      timestamp: Date.now(),
      department: department || "general",
    };

    // Store message
    if (!chatStore.has(sessionId)) chatStore.set(sessionId, []);
    chatStore.get(sessionId)!.push(message);

    // Forward to Telegram
    const settings = await db.getSettings();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegramBotToken;
    const chatId = process.env.TELEGRAM_CHAT_ID || settings.telegramChatId;

    if (botToken && chatId) {
      const deptLabels: Record<string, string> = {
        general: "💬 General Inquiry",
        skincare: "🌿 Skincare Advice",
        orders: "📦 Orders & Shipping",
        technical: "🛠️ Technical Support",
        suggestions: "💡 Suggestions",
      };
      const deptLabel = deptLabels[department || "general"] || department || "General";

      const telegramText = [
        `🌿 *ANUA Live Chat — New Message*`,
        ``,
        `🏷️ *Department:* ${deptLabel}`,
        `👤 *Visitor:* ${visitorName || "Anonymous"}`,
        `💬 *Session:* \`${sessionId}\``,
        `👩‍💼 *Assigned Agent:* ${agentName || "Sophia Chen"}`,
        ``,
        `📝 *Message:*`,
        `_${text}_`,
        ``,
        `💡 Reply with: \`[${agentName || "Sophia"}]: your reply here\``,
        `And include session ID: \`session:${sessionId}\``,
      ].join("\n");

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramText,
            parse_mode: "Markdown",
          }),
        });
      } catch {
        // Telegram failure is non-fatal — chat still works
        console.warn("[LiveChat] Telegram notification failed");
      }
    }

    return NextResponse.json({ success: true, messageId: message.id });
  } catch {
    return NextResponse.json({ error: "Failed to process chat message." }, { status: 500 });
  }
}


