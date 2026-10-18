import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const newsletters = await db.getNewsletters();
    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Newsletter GET error:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const success = await db.subscribeNewsletter(email);
    if (!success) {
      return NextResponse.json({ message: "You are already subscribed to our newsletter." }, { status: 200 });
    }

    return NextResponse.json({ success: true, message: "Thank you for subscribing to our newsletter!" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter POST error:", error);
    return NextResponse.json({ error: "Failed to subscribe to newsletter." }, { status: 500 });
  }
}


