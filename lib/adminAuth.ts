import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "cfrank-enterprise-jwt-secret-key-ogidi-anambra-2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);

export const ADMIN_COOKIE_NAME = "abd_admin_token";

export interface AdminSession {
  email: string;
  role: "admin";
}

/**
 * Signs a cryptographic JWT session token for the administrator.
 */
export async function signAdminToken(email: string, rememberMe = false): Promise<string> {
  const expiration = rememberMe ? "30d" : "8h";

  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(SECRET_KEY);
}

/**
 * Verifies an admin JWT token. Returns session payload if valid, null otherwise.
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (payload && payload.role === "admin" && typeof payload.email === "string") {
      return {
        email: payload.email,
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates server-side admin credentials strictly against environment variables.
 * Never hardcodes any real email or password in source code.
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredEmail || !configuredPassword) {
    console.error("[AUTH_CONFIG_ERROR] ADMIN_EMAIL or ADMIN_PASSWORD environment variable is not configured.");
    return false;
  }

  const cleanEmail = email.trim().toLowerCase();

  return cleanEmail === configuredEmail && password === configuredPassword;
}
