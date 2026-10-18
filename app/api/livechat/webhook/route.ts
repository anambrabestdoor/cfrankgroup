import { NextRequest, NextResponse } from "next/server";
import { chatStore, sseClients, ChatMessage } from "../message/route";
import { db } from "@/lib/db";

// GET Endpoint — Auto-registers Telegram webhook for your live site
export async function GET(req: NextRequest) {
  try {
    const settings = await db.getSettings();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegramBotToken;
    if (!botToken) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN is not configured in environment or settings." },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "anuaglobal.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const webhookUrl = `${protocol}://${host}/api/livechat/webhook`;

    const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
    const data = await res.json();

    return NextResponse.json({
      success: data.ok,
      webhookUrl,
      telegramResponse: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Endpoint — Receives replies from Telegram bot
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const rawText: string = message.text;

    // 1. Extract session ID: check message text first, then check reply_to_message text
    let sessionId: string | null = null;
    
    // Look for session:sess_xxx or sess_xxx directly in raw text
    const directSessionMatch = rawText.match(/session:(sess_[^\s\n]+)/i) || rawText.match(/(sess_[a-zA-Z0-9_-]+)/i);
    if (directSessionMatch) {
      sessionId = directSessionMatch[1] || directSessionMatch[0];
    } else if (message.reply_to_message?.text) {
      // Check original Telegram message that admin tapped "Reply" on
      const replySessionMatch = message.reply_to_message.text.match(/session:(sess_[^\s\n]+)/i) || 
                                message.reply_to_message.text.match(/`?(sess_[a-zA-Z0-9_-]+)`?/i);
      if (replySessionMatch) {
        sessionId = replySessionMatch[1] || replySessionMatch[0];
      }
    }

    if (!sessionId) {
      console.warn("[Webhook] Reply received without session ID:", rawText);
      return NextResponse.json({ ok: true });
    }

    // Clean any backticks or formatting from sessionId
    sessionId = sessionId.replace(/[`\s]/g, "");

    // 2. Extract agent name and reply text
    let agentName = "Sophia Chen"; // default agent name
    let replyText = rawText;

    // Check for explicit [AgentName]: prefix in reply text first
    const agentMatch = rawText.match(/^\[([^\]]+)\]:\s*(.+)/s);
    if (agentMatch) {
      agentName = agentMatch[1].trim();
      replyText = agentMatch[2].replace(/session:[^\s\n]+/gi, "").trim();
    } else {
      // No explicit prefix — extract agent name from the original notification message
      // The notification template contains: "👩‍💼 *Assigned Agent:* Sophia Chen"
      const originalText = message.reply_to_message?.text || "";
      const assignedAgentMatch = originalText.match(/Assigned Agent:\*?\s*(.+)/i);
      if (assignedAgentMatch) {
        agentName = assignedAgentMatch[1].trim();
      }
      replyText = rawText.replace(/session:[^\s\n]+/gi, "").trim();
    }

    if (!replyText) {
      return NextResponse.json({ ok: true });
    }

    const outMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId,
      agentId: agentName.toLowerCase().replace(/\s+/, "-"),
      agentName,
      visitorName: "",
      text: replyText,
      sender: "agent",
      timestamp: Date.now(),
    };

    // Store the agent reply in chat memory
    if (!chatStore.has(sessionId)) chatStore.set(sessionId, []);
    chatStore.get(sessionId)!.push(outMessage);

    // Push to active SSE client(s) if visitor is connected
    const controllers = sseClients.get(sessionId);
    if (controllers && controllers.size > 0) {
      const data = JSON.stringify(outMessage);
      const encoded = new TextEncoder().encode(`data: ${data}\n\n`);
      controllers.forEach((cnt) => {
        try {
          cnt.enqueue(encoded);
        } catch {
          controllers.delete(cnt);
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ ok: true });
  }
}
