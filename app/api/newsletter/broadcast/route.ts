import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { EmailService } from "@/emailService";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { title, subtitle, voucherCode, discountPercent, heroImage } = await req.json();

    if (!title || !subtitle || !voucherCode || !discountPercent) {
      return NextResponse.json({ error: "Missing required promotion fields." }, { status: 400 });
    }

    // Get all subscribers
    const subscribers = await db.getNewsletters();
    const emails = subscribers.map((sub: any) => sub.email);

    if (emails.length === 0) {
      return NextResponse.json({ error: "There are no subscribed users in your newsletter list to broadcast to." }, { status: 400 });
    }

    // Trigger Resend promotional dispatch
    const result = await EmailService.sendPromotionalBroadcast(emails, {
      title,
      subtitle,
      voucherCode,
      discountPercent: Number(discountPercent),
      heroImage
    });

    return NextResponse.json({
      success: true,
      message: `Successfully broadcast promotional code [${voucherCode}] to ${result.successCount} active subscribers!`,
      details: result
    });
  } catch (error) {
    console.error("Newsletter Broadcast error:", error);
    return NextResponse.json({ error: "Failed to broadcast announcement." }, { status: 500 });
  }
}


