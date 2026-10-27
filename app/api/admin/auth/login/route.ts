import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, validateAdminCredentials, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// In-memory rate limiting map for login attempts: IP -> { attempts, lockedUntil }
const loginAttempts = new Map<string, { attempts: number; lockedUntil: number }>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const now = Date.now();

    // Check rate limiter
    const attemptRecord = loginAttempts.get(ip);
    if (attemptRecord && attemptRecord.lockedUntil > now) {
      const waitMinutes = Math.ceil((attemptRecord.lockedUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Account temporarily locked for security. Try again in ${waitMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, rememberMe = false } = body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const authResult = await validateAdminCredentials(email, password);

    if (!authResult.valid) {
      // Record failed attempt
      const prev = attemptRecord || { attempts: 0, lockedUntil: 0 };
      const newAttempts = prev.attempts + 1;

      if (newAttempts >= 5) {
        // Lock for 15 minutes
        loginAttempts.set(ip, { attempts: newAttempts, lockedUntil: now + 15 * 60 * 1000 });
        return NextResponse.json(
          { error: "Too many failed attempts. Security lock engaged for 15 minutes." },
          { status: 429 }
        );
      } else {
        loginAttempts.set(ip, { attempts: newAttempts, lockedUntil: 0 });
        const remaining = 5 - newAttempts;
        return NextResponse.json(
          { error: `Invalid credentials. (${remaining} attempt(s) remaining before security lockout)` },
          { status: 401 }
        );
      }
    }

    // Reset rate limiter on successful login
    loginAttempts.delete(ip);

    // Sign cryptographic JWT session token with role
    const token = await signAdminToken(authResult.email, authResult.role, rememberMe);

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 8 * 60 * 60; // 30 days vs 8 hours

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully",
      email: authResult.email,
      role: authResult.role,
      name: authResult.name,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (err: any) {
    console.error("[ADMIN_LOGIN_ERROR]", err);
    return NextResponse.json({ error: "Internal server error during authentication." }, { status: 500 });
  }
}
