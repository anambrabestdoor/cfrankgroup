import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { promotionsStore } from "@/lib/promotionsStore";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const updates = await req.json();
    const idx = promotionsStore.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Promotion not found." }, { status: 404 });
    }

    promotionsStore[idx] = { ...promotionsStore[idx], ...updates };
    return NextResponse.json(promotionsStore[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update promotion." }, { status: 500 });
  }
}

