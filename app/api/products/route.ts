import { NextRequest, NextResponse } from "next/server";
import { DoorProduct } from "@/app/data/doorsData";
import { db } from "@/lib/db";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

async function verifyAdminAuth(req: NextRequest) {
  const token =
    req.cookies.get(ADMIN_COOKIE_NAME)?.value ||
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return null;

  const adminSession = await verifyAdminToken(token);
  if (adminSession) return adminSession;

  try {
    const dbPayload = db.verifyToken(token);
    if (dbPayload && (dbPayload.role === "admin" || dbPayload.role === "editor")) {
      return dbPayload;
    }
  } catch {}

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const group = searchParams.get("group");

    let products: DoorProduct[] = await db.getProducts();

    if (group && group !== "all") {
      products = products.filter((p) => p.group === group);
    }

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      name,
      slug,
      group,
      category,
      categoryLabel,
      subcategory,
      price,
      originalPrice,
      priceOnRequest,
      priceMode,
      priceValidUntil,
      image,
      gallery,
      video,
      videos,
      badge,
      stockStatus,
      stock,
      shortDescription,
      description,
      specifications,
      features,
      jijiUrl,
      seoTitle,
      seoDescription,
      focusKeyphrase,
      featured,
      active,
    } = body;

    if (!name || (!image && (!gallery || gallery.length === 0)) || !category) {
      return NextResponse.json(
        { error: "Missing required fields (name, image, category)." },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProduct: DoorProduct = {
      id: id || `door-${Date.now()}`,
      slug: cleanSlug,
      name: name.trim(),
      group: group || "doors",
      category,
      categoryLabel: categoryLabel || category.replace(/-/g, " ").toUpperCase(),
      subcategory: subcategory || undefined,
      price: price ? Number(price) : undefined,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      priceOnRequest: priceOnRequest !== false,
      priceMode: priceMode || (price ? "show_price" : "blank"),
      priceValidUntil: priceValidUntil || undefined,
      image: image || (gallery && gallery.length > 0 ? gallery[0] : ""),
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [image],
      video: video || undefined,
      videos: Array.isArray(videos) ? videos : (video ? [video] : undefined),
      badge: badge || undefined,
      stockStatus: stockStatus || "in_stock",
      stock: stock !== undefined ? Number(stock) : 10,
      shortDescription: shortDescription || "",
      description: description || "",
      specifications: specifications || {},
      features: Array.isArray(features) ? features : [],
      jijiUrl: jijiUrl || "https://jiji.ng/shop/anambrabestdoor",
      seoTitle: seoTitle || `${name} | Anambra Best Door`,
      seoDescription: seoDescription || shortDescription || description || name,
      focusKeyphrase: focusKeyphrase || name,
      featured: featured ?? false,
      active: active !== false,
    };

    const saved = await db.saveProduct(newProduct);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    if (!body || !body.id) {
      return NextResponse.json({ error: "Product id is required for update." }, { status: 400 });
    }

    const saved = await db.saveProduct(body as DoorProduct);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("Products PUT error:", error);
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    }

    const deleted = await db.deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product could not be deleted." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Products DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}
