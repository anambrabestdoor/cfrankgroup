import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EmailService } from "../../../../emailService";
// ─── DEV AUTH BYPASS ───────────────────────────────────────────────────────────
import { IS_DEV_AUTH, isDevAccountEmail } from "@/lib/devAuth";
// ───────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // ─── DEV AUTH: Skip email sending for predefined test accounts ───────────
    if (IS_DEV_AUTH && isDevAccountEmail(email)) {
      return NextResponse.json({
        success: true,
        isDevAccount: true,
        message:
          "[DEV MODE] Development account detected — use password login instead of OTP.",
      });
    }
    // ────────────────────────────────────────────────────────────────────────

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in our unified db layer
    await db.saveVerificationCode(email, code);

    // Dispatch verification email
    await EmailService.sendVerificationCode(email, code);

    // If RESEND_API_KEY is not configured on Vercel or in local dev, provide devCode for testing access
    const isResendConfigured = !!process.env.RESEND_API_KEY;

    return NextResponse.json({
      success: true,
      message: isResendConfigured 
        ? "Verification code sent to your email inbox." 
        : "Verification code generated! (Check server logs or dev code below)",
      devCode: !isResendConfigured || process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (error: any) {
    console.error("Error sending verification code API:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}


