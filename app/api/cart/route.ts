import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/cart — load the authenticated user's saved cart from DB
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ cart: [] });

    const payload = db.verifyToken(token);
    if (!payload?.email) return NextResponse.json({ cart: [] });

    const user = await db.getUserByEmail(payload.email);
    return NextResponse.json({ cart: user?.cart || [] });
  } catch {
    return NextResponse.json({ cart: [] });
  }
}

// PUT /api/cart — save the authenticated user's cart to DB
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = db.verifyToken(token);
    if (!payload?.email) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const body = await req.json();
    const cart = Array.isArray(body.cart) ? body.cart : [];

    await db.updateUserData(payload.email, { cart });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}
