import { db } from "./db";

export type CustomerEventType =
  | "ADD_TO_CART"
  | "REMOVE_FROM_CART"
  | "CHECKOUT_STARTED"
  | "ORDER_COMPLETED"
  | "NEWSLETTER_SIGNUP"
  | "WISHLIST_TOGGLED"
  | "PRODUCT_VIEWED";

export interface CustomerEventPayload {
  event: CustomerEventType;
  customerEmail?: string;
  customerName?: string;
  details: Record<string, any>;
}

/**
 * Ensures sensitive financial credentials (CVV, full card numbers, passwords) are NEVER logged
 */
function sanitizeMarketingDetails(details: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ["cardnumber", "cvv", "securitycode", "password", "token", "secret", "expdate"];
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(details)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      continue; // Omit sensitive checkout/auth fields completely
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeMarketingDetails(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

const EVENT_EMOJIS: Record<CustomerEventType, string> = {
  ADD_TO_CART: "🛒",
  REMOVE_FROM_CART: "🗑️",
  CHECKOUT_STARTED: "💳",
  ORDER_COMPLETED: "🎉",
  NEWSLETTER_SIGNUP: "✉️",
  WISHLIST_TOGGLED: "💖",
  PRODUCT_VIEWED: "👀",
};

/**
 * Streams customer buyer & marketing events to Telegram in real-time
 */
export async function logCustomerEvent(payload: CustomerEventPayload): Promise<boolean> {
  try {
    const settings = await db.getSettings();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegramBotToken;
    const chatId = process.env.TELEGRAM_CHAT_ID || settings.telegramChatId;

    if (!botToken || !chatId) {
      return false;
    }

    const emoji = EVENT_EMOJIS[payload.event] || "🔔";
    const cleanDetails = sanitizeMarketingDetails(payload.details);
    const detailLines = Object.entries(cleanDetails)
      .map(([k, v]) => `• *${k}:* \`${typeof v === "object" ? JSON.stringify(v) : v}\``)
      .join("\n");

    const messageText = [
      `${emoji} *ANUA Marketing Alert: ${payload.event.replace(/_/g, " ")}*`,
      ``,
      `👤 *Customer:* ${payload.customerName || payload.customerEmail || "Guest Visitor"}`,
      `📧 *Email:* \`${payload.customerEmail || "Not provided"}\``,
      `⏰ *Time:* \`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}\``,
      ``,
      `📊 *Event Data:*`,
      detailLines || "• _No details_",
    ].join("\n");

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "Markdown",
      }),
    });

    return true;
  } catch (err) {
    console.error("[MarketingLogger] Failed to send Telegram customer alert:", err);
    return false;
  }
}
