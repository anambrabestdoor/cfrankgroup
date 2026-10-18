import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name, newsletterSubscribed } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).trim();
    const cleanPassword = String(password).trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if signups are currently allowed
    const settings = await db.getSettings();
    if (settings && settings.allowSignups === false) {
      return NextResponse.json(
        { error: "New user registrations are currently disabled by the administrator." },
        { status: 403 }
      );
    }

    // Check if user already exists in database
    const existingUser = await db.getUserByEmail(cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    // Determine role based on email matches
    const role = (cleanEmail === "elijahkator180@gmail.com" || cleanEmail === "admin@anambrabestdoor.com") 
      ? "admin" 
      : "user";

    // Create the user in persistent database (awaits bcrypt hashing & persistence)
    const createdUser = await db.createUser({
      email: cleanEmail,
      name: cleanName,
      role,
      joinDate: new Date().toISOString().split("T")[0],
      newsletterSubscribed: !!newsletterSubscribed,
      password: cleanPassword,
    });

    if (!createdUser || !createdUser.email) {
      throw new Error("Failed to create user record in database.");
    }

    // If newsletter selected, also add to newsletters list
    if (newsletterSubscribed) {
      await db.subscribeNewsletter(cleanEmail).catch((err) => {
        console.warn("[Signup] Newsletter subscription warning:", err);
      });
    }

    // Auto login on success — generate JWT token
    const token = db.generateToken({
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      joinDate: createdUser.joinDate,
      newsletterSubscribed: createdUser.newsletterSubscribed,
    });

    const response = NextResponse.json({
      message: "Registration successful.",
      user: {
        email: createdUser.email,
        name: createdUser.name,
        role: createdUser.role,
        newsletterSubscribed: createdUser.newsletterSubscribed,
        joinDate: createdUser.joinDate,
      },
    }, { status: 201 });

    // Set HTTP-Only session cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[Signup API Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}


