import { NextRequest, NextResponse } from "next/server";
import { DOOR_PRODUCTS, DoorProduct } from "@/app/data/doorsData";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // If Supabase or DB is configured, we could read from it, otherwise return authentic catalog
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let products: DoorProduct[] = DOOR_PRODUCTS;

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = db.verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      category,
      categoryLabel,
      price,
      originalPrice,
      priceOnRequest,
      image,
      badge,
      stockStatus,
      stock,
      shortDescription,
      description,
      features,
      specifications,
      jijiUrl,
    } = body;

    if (!name || !image || !category) {
      return NextResponse.json({ error: "Missing required fields (name, image, category)." }, { status: 400 });
    }

    const newProduct: DoorProduct = {
      id: `prod-${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category,
      categoryLabel: categoryLabel || category.replace(/-/g, " ").toUpperCase(),
      price: price ? Number(price) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      priceOnRequest: priceOnRequest !== false,
      image,
      gallery: [image],
      badge: badge || undefined,
      stockStatus: stockStatus || "in_stock",
      stock: stock !== undefined ? Number(stock) : 10,
      shortDescription: shortDescription || "",
      description: description || "",
      features: Array.isArray(features) ? features : [],
      specifications: specifications || {},
      jijiUrl: jijiUrl || undefined,
      seoTitle: `${name} | Anambra Best Door`,
      seoDescription: shortDescription || description || name,
      focusKeyphrase: name,
      active: true,
    };

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}
