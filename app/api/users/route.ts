import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

async function checkAdmin(req: NextRequest) {
  // 1. Check HTTP-only admin cookie
  const adminCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (adminCookie) {
    const session = await verifyAdminToken(adminCookie);
    if (session && session.role === "admin") {
      return session;
    }
  }

  // 2. Check Bearer Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearer = authHeader.substring(7);
    const session = await verifyAdminToken(bearer);
    if (session && session.role === "admin") {
      return session;
    }
  }

  // 3. Fallback to legacy db token cookie if present
  const token = req.cookies.get("token")?.value;
  if (token) {
    const payload = db.verifyToken(token);
    if (payload && payload.role === "admin") {
      return { email: payload.email, role: "admin" };
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const users = await db.getUsers();
    // Exclude password hashes
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);

    // Ensure super-admin from environment is included in the directory view
    const superAdminEmail = (process.env.ADMIN_EMAIL || "anambrabestdoor@gmail.com").trim().toLowerCase();
    const hasSuperAdmin = safeUsers.some((u) => u.email.toLowerCase() === superAdminEmail);

    const allTeam = hasSuperAdmin
      ? safeUsers
      : [
          {
            email: superAdminEmail,
            name: "Owner / Super Administrator",
            role: "admin",
            joinDate: "Primary Account",
            isSuperAdmin: true,
          },
          ...safeUsers,
        ];

    return NextResponse.json(allTeam);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Administrator access required." }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role = "editor" } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await db.getUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    const newUser = await db.createUser({
      name: name?.trim() || cleanEmail.split("@")[0],
      email: cleanEmail,
      password: password.trim(),
      role: role === "admin" ? "admin" : "editor",
    });

    const { passwordHash, ...safeUser } = newUser as any;

    return NextResponse.json(
      {
        success: true,
        message: `Account created for ${newUser.name} with ${newUser.role} access.`,
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Users POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const superAdminEmail = (process.env.ADMIN_EMAIL || "anambrabestdoor@gmail.com").trim().toLowerCase();

    // Protect super administrators from deletion
    if (
      cleanEmail === superAdminEmail ||
      cleanEmail === "anambrabestdoor@gmail.com" ||
      cleanEmail === "elijahkator180@gmail.com"
    ) {
      return NextResponse.json({ error: "Cannot delete the primary super administrator." }, { status: 403 });
    }

    const success = await db.deleteUser(cleanEmail);
    if (!success) {
      return NextResponse.json({ error: "User not found or already removed." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required." }, { status: 400 });
    }

    if (!["admin", "editor", "user"].includes(role)) {
      return NextResponse.json({ error: "role must be 'admin', 'editor', or 'user'." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const superAdminEmail = (process.env.ADMIN_EMAIL || "anambrabestdoor@gmail.com").trim().toLowerCase();

    if (cleanEmail === superAdminEmail) {
      return NextResponse.json({ error: "Cannot modify role of the primary super administrator." }, { status: 403 });
    }

    const success = await db.updateUserRole(cleanEmail, role);
    if (!success) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User role updated to ${role}.` });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user role." }, { status: 500 });
  }
}
