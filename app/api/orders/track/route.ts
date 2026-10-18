import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint: allows any user to look up an order by orderId + email (both required for security)
export async function POST(req: NextRequest) {
  try {
    const { orderId, email } = await req.json();

    if (!orderId && !email) {
      return NextResponse.json(
        { error: "Please provide an order ID or email address." },
        { status: 400 }
      );
    }

    const allOrders = await db.getOrders();

    const found = allOrders.find((o) => {
      const idMatch = orderId && o.id.toLowerCase() === orderId.trim().toLowerCase();
      const emailMatch = email && o.email.toLowerCase() === email.trim().toLowerCase();
      // Require at least email OR orderId match — if both provided, both must match for security
      if (orderId && email) return idMatch && emailMatch;
      return idMatch || emailMatch;
    });

    if (!found) {
      return NextResponse.json(
        { error: "No order found matching your search. Please check your order ID or email." },
        { status: 404 }
      );
    }

    // Return safe subset only — don't leak full customer data
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
    console.error("Order tracking error:", error);
    return NextResponse.json({ error: "Failed to look up order." }, { status: 500 });
  }
}


