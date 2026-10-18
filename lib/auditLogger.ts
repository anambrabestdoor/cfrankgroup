import { db } from "./db";

export interface AuditLogPayload {
  action: string;
  category: "Products" | "Orders" | "Settings" | "Support" | "Promotions" | "Reviews" | "FAQs" | "Navigation" | "User Management";
  adminEmail?: string;
  details: Record<string, any>;
}

/**
 * Redacts sensitive keys before logging to Telegram
 */
function sanitizeDetails(details: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ["password", "token", "secret", "jwt", "authorization", "passwordHash"];
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(details)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = "************";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeDetails(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sends structured admin activity logs to Telegram
 */
export async function logAdminAction(payload: AuditLogPayload): Promise<boolean> {
  try {
    const settings = await db.getSettings();
    const botToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegramBotToken;
    const chatId = process.env.TELEGRAM_CHAT_ID || settings.telegramChatId;

    if (!botToken || !chatId) {
      return false;
    }

    const cleanDetails = sanitizeDetails(payload.details);
    const detailLines = Object.entries(cleanDetails)
      .map(([k, v]) => `• *${k}:* \`${typeof v === "object" ? JSON.stringify(v) : v}\``)
      .join("\n");

    const messageText = [
      `🛡️ *ANUA Admin Audit Log*`,
      ``,
      `📌 *Action:* ${payload.action}`,
      `📁 *Category:* ${payload.category}`,
      `👤 *Admin:* \`${payload.adminEmail || "Administrator"}\``,
      `⏰ *Time:* \`${new Date().toISOString()}\``,
      ``,
      `📋 *Inputs & Parameters:*`,
      detailLines || "• _No additional inputs_",
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
    console.error("[AuditLogger] Failed to send Telegram log:", err);
    return false;
  }
}
