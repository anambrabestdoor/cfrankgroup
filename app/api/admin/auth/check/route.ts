import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
    const authHeader = req.headers.get("authorization");

    let token = cookie?.value;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await verifyAdminToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
      role: session.role,
    });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
