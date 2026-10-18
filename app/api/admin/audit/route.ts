import { NextRequest, NextResponse } from "next/server";
import { logAdminAction } from "@/lib/auditLogger";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { action, category, details } = body;

    if (!action || !category) {
      return NextResponse.json({ error: "Action and category are required." }, { status: 400 });
    }

    await logAdminAction({
      action,
      category,
      adminEmail: payload.email,
      details: details || {},
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to dispatch audit log." }, { status: 500 });
  }
}


