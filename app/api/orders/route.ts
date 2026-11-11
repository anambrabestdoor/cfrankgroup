import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminRequest } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdminRequest(req);
    if (admin) {
      const allOrders = await db.getOrders();
      return NextResponse.json(allOrders);
    }

    const token = req.cookies.get("token")?.value;
    if (token) {
      const payload = db.verifyToken(token);
      if (payload?.email) {
        if (payload.role === "admin") {
          const allOrders = await db.getOrders();
          return NextResponse.json(allOrders);
        }
        const userOrders = await db.getOrdersByEmail(payload.email.toLowerCase().trim());
        return NextResponse.json(userOrders);
      }
    }

    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  } catch (error) {
    console.error("[Orders GET API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      orderId,
      email,
      phone,
      deliveryLocation,
      notes,
      divisions,
      items,
      total,
      customerName,
      paymentMethod,
      paymentProofUrl,
      channel,
    } = body;

    // Check if this is an order creation request (items & total provided)
    if (Array.isArray(items) && total !== undefined) {
      const token = req.cookies.get("token")?.value;
      const payload = token ? db.verifyToken(token) : null;
      const targetEmail = (email || payload?.email || (phone ? `${String(phone).replace(/[^0-9]/g, "")}@cfrank.internal` : "direct-order@cfrank.internal")).toLowerCase().trim();

      const newOrder = await db.createOrder({
        customerName: customerName ? customerName.trim() : (payload?.name || "Valued Customer"),
        email: targetEmail,
        phone: phone ? String(phone).trim() : undefined,
        deliveryLocation: deliveryLocation ? String(deliveryLocation).trim() : undefined,
        notes: notes ? String(notes).trim() : undefined,
        divisions: Array.isArray(divisions) ? divisions : [],
        items,
        total: Number(total),
        status: "pending",
        paymentMethod: paymentMethod || "whatsapp",
        paymentProofUrl,
        channel: channel || "whatsapp",
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


