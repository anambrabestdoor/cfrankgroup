/**
 * Development-Only Authentication Module
 * 
 * Active strictly during local development (NODE_ENV !== "production")
 * for testing admin operations.
 */

export const IS_DEV_AUTH = process.env.NODE_ENV !== "production";

export interface DevAccount {
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  joinDate: string;
  newsletterSubscribed: boolean;
}

export const DEV_ACCOUNTS: DevAccount[] = [
  {
    email: process.env.DEV_ADMIN_EMAIL || "anambrabestdoor@gmail.com",
    password: process.env.DEV_ADMIN_PASSWORD || "admin123",
    name: "Chidera Frank Okonkwo",
    role: "admin",
    joinDate: "2026-10-16",
    newsletterSubscribed: true,
  },
];

export function authenticateDevAccount(email: string, password?: string): DevAccount | null {
  if (!IS_DEV_AUTH) return null;

  const cleanEmail = email.trim().toLowerCase();
  const account = DEV_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) return null;

  if (password && account.password !== password) {
    return null;
  }

  return account;
}

export function isDevAccountEmail(email: string): boolean {
  if (!IS_DEV_AUTH) return false;
  return DEV_ACCOUNTS.some((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}
