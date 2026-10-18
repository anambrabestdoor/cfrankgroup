import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/wishlist — load the authenticated user's saved wishlist from DB
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ wishlist: [] });

    const payload = db.verifyToken(token);
    if (!payload?.email) return NextResponse.json({ wishlist: [] });

    const user = await db.getUserByEmail(payload.email);
    return NextResponse.json({ wishlist: user?.wishlist || [] });
  } catch {
    return NextResponse.json({ wishlist: [] });
  }
}

// PUT /api/wishlist — save the authenticated user's wishlist to DB
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = db.verifyToken(token);
    if (!payload?.email) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const body = await req.json();
    const wishlist = Array.isArray(body.wishlist) ? body.wishlist : [];

    await db.updateUserData(payload.email, { wishlist });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save wishlist" }, { status: 500 });
  }
}
