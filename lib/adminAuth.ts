import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "./db";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "cfrank-enterprise-jwt-secret-key-ogidi-anambra-2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export const ADMIN_COOKIE_NAME = "abd_admin_token";

export interface AdminSession {
  email: string;
  role: "admin" | "editor";
  name?: string;
  isSuperAdmin?: boolean;
}

export interface AdminValidationResult {
  valid: boolean;
  email: string;
  role: "admin" | "editor";
  name?: string;
  isSuperAdmin: boolean;
}

/**
 * Signs a cryptographic JWT session token for the administrator or editor.
 */
export async function signAdminToken(
  email: string,
  role: "admin" | "editor" = "admin",
  rememberMe = false
): Promise<string> {
  const expiration = rememberMe ? "30d" : "8h";

  return await new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(SECRET_KEY);
}

/**
 * Verifies an admin or editor JWT token. Returns session payload if valid, null otherwise.
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (
      payload &&
      (payload.role === "admin" || payload.role === "editor") &&
      typeof payload.email === "string"
    ) {
      return {
        email: payload.email,
        role: payload.role as "admin" | "editor",
        name: typeof payload.name === "string" ? payload.name : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates server-side admin or editor credentials.
 * 1. Checks primary environment variables (Super Administrator).
 * 2. Checks secondary editors and administrators registered in the database.
 */
export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<AdminValidationResult> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Primary Super Administrator (env vars)
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (configuredEmail && configuredPassword && cleanEmail === configuredEmail && password === configuredPassword) {
    return {
      valid: true,
      email: configuredEmail,
      role: "admin",
      name: "Super Administrator",
      isSuperAdmin: true,
    };
  }

  // 2. Database Editors and Secondary Administrators
  try {
    const user = await db.getUserByEmail(cleanEmail);
    if (user && (user.role === "admin" || (user as any).role === "editor") && user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        return {
          valid: true,
          email: user.email,
          role: (user.role as "admin" | "editor") || "editor",
          name: user.name || "Content Editor",
          isSuperAdmin: false,
        };
      }
    }
  } catch (err) {
    console.error("[AUTH_DB_LOOKUP_ERROR]", err);
  }

  return {
    valid: false,
    email: cleanEmail,
    role: "editor",
    isSuperAdmin: false,
  };
}
