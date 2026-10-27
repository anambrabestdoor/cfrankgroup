import { NextRequest, NextResponse } from "next/server";
import { listCloudinaryMedia, deleteCloudinaryMedia } from "@/lib/cloudinary";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

async function checkAdmin(req: NextRequest) {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  const authHeader = req.headers.get("authorization");

  let token = cookie?.value;
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const session = await checkAdmin(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const nextCursor = searchParams.get("next_cursor") || undefined;
    const resourceType = (searchParams.get("resource_type") as "image" | "video") || "image";

    const data = await listCloudinaryMedia({
      max_results: 50,
      next_cursor: nextCursor,
      resource_type: resourceType,
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Cloudinary Resources API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to list media resources" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await checkAdmin(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let publicId = searchParams.get("public_id");
    let resourceType: "image" | "video" = (searchParams.get("resource_type") as "image" | "video") || "image";

    if (!publicId) {
      const body = await req.json().catch(() => ({}));
      publicId = body.public_id;
      if (body.resource_type) resourceType = body.resource_type;
    }

    if (!publicId) {
      return NextResponse.json({ error: "Missing public_id parameter" }, { status: 400 });
    }

    const result = await deleteCloudinaryMedia(publicId, resourceType);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("[Cloudinary Delete API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to delete media resource" },
      { status: 500 }
    );
  }
}
