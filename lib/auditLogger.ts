import fs from "fs";
import path from "path";

export interface AuditLogPayload {
  action: string;
  category: "Products" | "Orders" | "Settings" | "Support" | "Promotions" | "Reviews" | "FAQs" | "Navigation" | "User Management";
  adminEmail?: string;
  details: Record<string, any>;
}

/**
 * Redacts sensitive keys before logging locally
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
 * Logs structured admin activity locally to disk without sending to external services
 */
export async function logAdminAction(payload: AuditLogPayload): Promise<boolean> {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, "admin-audit.jsonl");
    const cleanDetails = sanitizeDetails(payload.details);

    const entry = {
      timestamp: new Date().toISOString(),
      action: payload.action,
      category: payload.category,
      adminEmail: payload.adminEmail || "Administrator",
      details: cleanDetails,
    };

    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n", "utf-8");
    return true;
  } catch (err) {
    console.error("[AuditLogger] Failed to write local log:", err);
    return false;
  }
}
