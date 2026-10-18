import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const cleanEmail = payload.email.toLowerCase().trim();

    if (payload.role === "admin") {
      const allOrders = await db.getOrders();
      return NextResponse.json(allOrders);
    }

    const userOrders = await db.getOrdersByEmail(cleanEmail);
    return NextResponse.json(userOrders);
  } catch (error) {
    console.error("[Orders GET API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, email, items, total, customerName, paymentMethod, paymentProofUrl } = body;

    // Check if this is an order creation request (items & total provided)
    if (Array.isArray(items) && total !== undefined) {
      const token = req.cookies.get("token")?.value;
      const payload = token ? db.verifyToken(token) : null;
      const targetEmail = (email || payload?.email || "").toLowerCase().trim();

      if (!targetEmail) {
        return NextResponse.json({ error: "Customer email is required to place an order." }, { status: 400 });
      }

      const newOrder = await db.createOrder({
        customerName: customerName ? customerName.trim() : (payload?.name || "Valued Customer"),
        email: targetEmail,
        items,
        total: Number(total),
        status: "pending",
        paymentMethod,
        paymentProofUrl,
      });

      return NextResponse.json(newOrder, { status: 201 });
    }

    // Otherwise, handle public order tracking lookup
    if (!orderId && !email) {
      return NextResponse.json(
        { error: "Please provide an order ID or email address." },
        { status: 400 }
      );
    }

    const allOrders = await db.getOrders();

    const found = allOrders.find((o) => {
      const idMatch = orderId && o.id.toLowerCase() === String(orderId).trim().toLowerCase();
      const emailMatch = email && o.email.toLowerCase() === String(email).trim().toLowerCase();
      if (orderId && email) return idMatch && emailMatch;
      return idMatch || emailMatch;
    });

    if (!found) {
      return NextResponse.json(
        { error: "No order found matching your search. Please check your order ID or email." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: found.id,
      status: found.status,
      date: found.date,
      total: found.total,
      items: found.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error("[Orders POST API Error]:", error);
    return NextResponse.json({ error: "Failed to process order request." }, { status: 500 });
  }
}


