import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { promotionsStore, Promotion } from "@/lib/promotionsStore";

export async function GET() {
  return NextResponse.json(promotionsStore);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { title, description, discountPercent, voucherCode, expiresAt, heroImage } = await req.json();

    if (!title || !voucherCode || !discountPercent) {
      return NextResponse.json({ error: "title, voucherCode, and discountPercent are required." }, { status: 400 });
    }

    const promo: Promotion = {
      id: `promo-${Date.now()}`,
      title,
      description: description || "",
      discountPercent: Number(discountPercent),
      voucherCode: voucherCode.toUpperCase().trim(),
      expiresAt: expiresAt || "2027-01-01T00:00:00Z",
      heroImage: heroImage || "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
      active: true,
      createdAt: new Date().toISOString(),
    };

    promotionsStore.push(promo);
    return NextResponse.json(promo, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create promotion." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Promotion ID required." }, { status: 400 });

    const idx = promotionsStore.findIndex((p) => p.id === id);
    if (idx !== -1) promotionsStore.splice(idx, 1);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete promotion." }, { status: 500 });
  }
}


