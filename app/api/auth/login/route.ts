import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanPassword = String(password).trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    let user = await db.getUserByEmail(cleanEmail);

    // Optional Supabase Auth Integration check
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        const { error: authError } = await (supabase.auth as any).signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });
        if (authError && !user) {
          return NextResponse.json(
            { error: authError.message },
            { status: 401 }
          );
        }
      } catch (sbErr) {
        console.warn("[Auth Login] Supabase auth fallback to local DB layer:", sbErr);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Secure bcrypt password verification
    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(cleanPassword, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
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
      message: "Login successful.",
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        newsletterSubscribed: user.newsletterSubscribed,
        joinDate: user.joinDate,
      },
    });

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
    console.error("[Login API Error]:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}


