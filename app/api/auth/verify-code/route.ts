import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code, newsletterSubscribed } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    // Verify the code
    const isValid = await db.verifyVerificationCode(email, code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired verification code." },
        { status: 401 }
      );
    }

    // Check if user profile already exists
    let user = await db.getUserByEmail(email);

    if (!user) {
      // If user doesn't exist, register them seamlessly
      const derivedName = email.split("@")[0];
      const name = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      
      // Determine role: verified admin emails
      const isSystemAdmin = 
        email.toLowerCase() === "elijahkator180@gmail.com" || 
        email.toLowerCase() === "admin@anambrabestdoor.com";

      user = await db.createUser({
        email: email.toLowerCase(),
        name,
        role: isSystemAdmin ? "admin" : "user",
        joinDate: new Date().toISOString().split("T")[0],
        newsletterSubscribed: !!newsletterSubscribed,
      });

      // Subscribe to newsletter if opted-in
      if (newsletterSubscribed) {
        await db.subscribeNewsletter(email);
      }
    } else if (newsletterSubscribed && !user.newsletterSubscribed) {
      // If user exists and opted-in to newsletter but wasn't subscribed, subscribe them now
      await db.subscribeNewsletter(email);
      user.newsletterSubscribed = true;
    }

    // Generate JWT token
    const token = db.generateToken({
      email: user.email,
      name: user.name,
      role: user.role,
      joinDate: user.joinDate,
      newsletterSubscribed: user.newsletterSubscribed,
    });

    const response = NextResponse.json({
      message: "Login successful.",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        newsletterSubscribed: user.newsletterSubscribed,
      },
    });

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error in verify-code API route:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}


