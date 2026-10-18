import { NextRequest, NextResponse } from "next/server";
import { IS_DEV_AUTH, authenticateDevAccount, DEV_ACCOUNTS } from "@/lib/devAuth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  // Strict Production Safety Shield: Never run in production
  if (!IS_DEV_AUTH) {
    return NextResponse.json(
      { error: "Development authentication mode is disabled in production builds." },
      { status: 403 }
    );
  }

  try {
    const { email, password, accountEmail } = await req.json();

    const targetEmail = accountEmail || email;
    if (!targetEmail) {
      return NextResponse.json(
        { error: "Email or account Email is required for dev login." },
        { status: 400 }
      );
    }

    // Authenticate against dev accounts list
    const devAcc = authenticateDevAccount(targetEmail, password);
    if (!devAcc) {
      return NextResponse.json(
        { error: "Invalid dev credentials. Default Admin: admin@example.com / Admin123!, Customer: user@example.com / User123!" },
        { status: 401 }
      );
    }

    // Ensure user profile exists in database/memory fallback
    let user = await db.getUserByEmail(devAcc.email);
    if (!user) {
      user = await db.createUser({
        email: devAcc.email.toLowerCase(),
        name: devAcc.name,
        role: devAcc.role,
        joinDate: devAcc.joinDate,
        newsletterSubscribed: devAcc.newsletterSubscribed,
      });
    }

    // Seed sample orders for user@example.com if none exist yet
    if (devAcc.sampleOrders && devAcc.sampleOrders.length > 0) {
      const existingOrders = await db.getOrders();
      const userOrders = existingOrders.filter((o) => o.email.toLowerCase() === devAcc.email.toLowerCase());
      if (userOrders.length === 0) {
        for (const orderData of devAcc.sampleOrders) {
          await db.createOrder(orderData);
        }
      }
    }

    // Generate JWT session token
    const token = db.generateToken({
      email: user.email,
      name: user.name,
      role: user.role,
      joinDate: user.joinDate,
      newsletterSubscribed: user.newsletterSubscribed,
    });

    const response = NextResponse.json({
      message: "[DEV MODE] Authentication successful.",
      isDevAuth: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        newsletterSubscribed: user.newsletterSubscribed,
      },
    });

    // Set authenticated session cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: false, // Dev mode over http/https
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Dev Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error in dev auth mode." },
      { status: 500 }
    );
  }
}

// GET endpoint returns available test accounts list in dev mode only
export async function GET() {
  if (!IS_DEV_AUTH) {
    return NextResponse.json({ isDevAuth: false, accounts: [] });
  }

  return NextResponse.json({
    isDevAuth: true,
    accounts: DEV_ACCOUNTS.map((a) => ({
      email: a.email,
      password: a.password,
      name: a.name,
      role: a.role,
    })),
  });
}


