import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await db.getFaqs();
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("FAQ GET error:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { items } = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Items must be an array." }, { status: 400 });
    }

    const updated = await db.updateFaqs(items);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("FAQ PUT error:", error);
    return NextResponse.json({ error: "Failed to update FAQs." }, { status: 500 });
  }
}


