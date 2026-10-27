import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

async function checkAdmin(req: NextRequest) {
  const adminCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (adminCookie) {
    const session = await verifyAdminToken(adminCookie);
    if (session && session.role === "admin") {
      return session;
    }
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearer = authHeader.substring(7);
    const session = await verifyAdminToken(bearer);
    if (session && session.role === "admin") {
      return session;
    }
  }

  const token = req.cookies.get("token")?.value;
  if (token) {
    const payload = db.verifyToken(token);
    if (payload && payload.role === "admin") {
      return { email: payload.email, role: "admin" };
    }
  }

  return null;
}

export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const updated = await db.updateSettings(body);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
