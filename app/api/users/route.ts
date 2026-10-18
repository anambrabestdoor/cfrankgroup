import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const users = await db.getUsers();
    // Exclude password hashes for security
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Check that we aren't deleting the protected super administrator
    if (email.toLowerCase() === "elijahkator180@gmail.com" || email.toLowerCase() === "admin@anambrabestdoor.com") {
      return NextResponse.json({ error: "Cannot delete the super administrator." }, { status: 403 });
    }

    const success = await db.deleteUser(email);
    if (!success) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: "email and role are required." }, { status: 400 });
    }

    if (!["admin", "user"].includes(role)) {
      return NextResponse.json({ error: "role must be 'admin' or 'user'." }, { status: 400 });
    }

    // Protect the primary superuser from demotion
    const PROTECTED = ["elijahkator180@gmail.com", "admin@anambrabestdoor.com"];
    if (role === "user" && PROTECTED.includes(email.toLowerCase())) {
      return NextResponse.json({ error: "Cannot demote the protected super administrator." }, { status: 403 });
    }

    const success = await db.updateUserRole(email, role);
    if (!success) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User role updated to ${role}.` });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user role." }, { status: 500 });
  }
}


