import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/adminAuth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !["pending", "processing", "shipped", "delivered"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    const success = await db.updateOrderStatus(id, status);
    if (!success) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order status updated successfully." });
  } catch (error) {
    console.error("Order PUT status error:", error);
    return NextResponse.json({ error: "Failed to update order status." }, { status: 500 });
  }
}

