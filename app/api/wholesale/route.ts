import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const applications = await db.getWholesaleApplications();
    return NextResponse.json({ applications });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve wholesale applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, contactPerson, email, estimatedVolume } = body;

    if (!companyName || !contactPerson || !email) {
      return NextResponse.json(
        { error: "Missing required wholesale application fields" },
        { status: 400 }
      );
    }

    const application = await db.createWholesaleApplication({
      companyName,
      contactPerson,
      email,
      estimatedVolume: estimatedVolume || "$1,000 - $5,000",
    });

    return NextResponse.json(
      { success: true, application, message: "Wholesale application submitted successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit wholesale application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid ID or status" },
        { status: 400 }
      );
    }

    const success = await db.updateWholesaleApplicationStatus(id, status);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update wholesale application status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing application ID" },
        { status: 400 }
      );
    }

    const success = await db.deleteWholesaleApplication(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete wholesale application" },
      { status: 500 }
    );
  }
}
