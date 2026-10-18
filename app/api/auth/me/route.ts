import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = db.verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }

    // Always fetch fresh details from the database
    const user = await db.getUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        newsletterSubscribed: user.newsletterSubscribed,
        joinDate: user.joinDate,
      },
    });
  } catch (error: any) {
    console.error("Auth Me API error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}


