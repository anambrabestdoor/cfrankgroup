import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export interface AdminAuditLog {
    timestamp: string;
    adminEmail: string;
    action: string;
    category: "Products" | "Orders" | "Settings" | "Support" | "Promotions" | "Reviews" | "FAQs" | "Users";
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    status: "success" | "failure";
}

/**
 * Local audit log file path
 */
const AUDIT_LOG_PATH = path.join(process.cwd(), "logs", "admin-audit.jsonl");

/**
 * Sanitize sensitive data before logging
 */
function sanitizeForLogging(obj: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ["password", "token", "secret", "jwt", "authorization", "apiKey", "firebaseKey"];
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
            sanitized[key] = "***REDACTED***";
        } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeForLogging(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Append audit log entry locally (JSONL format - one JSON per line)
 */
export async function appendAuditLog(entry: AdminAuditLog): Promise<void> {
    try {
        const logsDir = path.dirname(AUDIT_LOG_PATH);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const sanitizedEntry = {
            ...entry,
            details: sanitizeForLogging(entry.details),
        };

        fs.appendFileSync(AUDIT_LOG_PATH, JSON.stringify(sanitizedEntry) + "\n");
    } catch (error) {
        console.error("[AuditLogger] Failed to append local log:", error);
    }
}

/**
 * Commit audit logs to GitHub
 * Run this periodically (e.g., daily cron job)
 */
export async function pushAuditLogsToGitHub(): Promise<boolean> {
    try {
        if (!fs.existsSync(AUDIT_LOG_PATH)) {
            console.log("[AuditLogger] No audit logs to push.");
            return false;
        }

        // Read current logs
        const logsContent = fs.readFileSync(AUDIT_LOG_PATH, "utf-8");
        const lineCount = logsContent.trim().split("\n").length;

        if (lineCount === 0) {
            console.log("[AuditLogger] No new entries to push.");
            return false;
        }

        // Stage and commit
        try {
            execSync("git add logs/admin-audit.jsonl", { cwd: process.cwd() });
            execSync(`git commit -m "audit: admin actions log - ${new Date().toISOString()}"`, {
                cwd: process.cwd(),
            });
            execSync("git push origin main", { cwd: process.cwd() });

            console.log(`[AuditLogger] ✅ Pushed ${lineCount} audit entries to GitHub.`);
            return true;
        } catch (gitError: any) {
            if (gitError.message?.includes("nothing to commit")) {
                console.log("[AuditLogger] No changes to commit.");
                return false;
            }
            throw gitError;
        }
    } catch (error) {
        console.error("[AuditLogger] Failed to push logs to GitHub:", error);
        return false;
    }
}

/**
 * Log admin action with both local file and optional Telegram notification
 */
export async function logAdminActionWithGitHub(
    payload: Omit<AdminAuditLog, "timestamp">
): Promise<void> {
    const entry: AdminAuditLog = {
        timestamp: new Date().toISOString(),
        ...payload,
    };

    // Append to local log file
    await appendAuditLog(entry);

    // Optional: Send to Telegram for real-time alerts
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            const message = [
                `🛡️ *ANUA Admin Action Log*`,
                `👤 *Admin:* \`${entry.adminEmail}\``,
                `📌 *Action:* ${entry.action}`,
                `📁 *Category:* ${entry.category}`,
                `⏰ *Time:* ${entry.timestamp}`,
                `📊 *Status:* ${entry.status === "success" ? "✅ Success" : "❌ Failed"}`,
            ].join("\n");

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown",
                }),
            });
        }
    } catch (error) {
        console.error("[AuditLogger] Telegram notification failed:", error);
    }
}

/**
 * Query audit logs (e.g., for admin dashboard)
 */
export async function queryAuditLogs(options?: {
    adminEmail?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}): Promise<AdminAuditLog[]> {
    try {
        if (!fs.existsSync(AUDIT_LOG_PATH)) {
            return [];
        }

        const content = fs.readFileSync(AUDIT_LOG_PATH, "utf-8");
        const logs = content
            .trim()
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => JSON.parse(line) as AdminAuditLog)
            .reverse(); // Most recent first

        let filtered = logs;

        if (options?.adminEmail) {
            filtered = filtered.filter((log) => log.adminEmail === options.adminEmail);
        }

        if (options?.category) {
            filtered = filtered.filter((log) => log.category === options.category);
        }

        if (options?.startDate) {
            filtered = filtered.filter((log) => new Date(log.timestamp) >= options.startDate!);
        }

        if (options?.endDate) {
            filtered = filtered.filter((log) => new Date(log.timestamp) <= options.endDate!);
        }

        if (options?.limit) {
            filtered = filtered.slice(0, options.limit);
        }

        return filtered;
    } catch (error) {
        console.error("[AuditLogger] Query failed:", error);
        return [];
    }
}
