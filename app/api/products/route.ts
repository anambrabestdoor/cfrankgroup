import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const products = await db.getProducts();
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    const isAdmin = payload?.role === "admin";

    // Standard storefront guests can only see active products
    const filteredProducts = isAdmin
      ? products
      : products.filter((p) => p.active);

    return NextResponse.json(filteredProducts);
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
    const { name, subtitle, description, price, originalPrice, rating, reviewsCount, image, category, subcategory, badge, active, stock, ingredients, skinConcerns, featured, kendallFav } = body;

    if (!name || !description || price === undefined || !image || !category || !subcategory) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const created = await db.createProduct({
      name,
      subtitle: subtitle || "",
      description,
      price: Number(price),
      originalPrice: originalPrice !== undefined ? Number(originalPrice) : Number(price),
      rating: rating !== undefined ? Number(rating) : 4.8,
      reviewsCount: reviewsCount !== undefined ? Number(reviewsCount) : 0,
      image,
      category,
      subcategory,
      badge: badge || null,
      active: active !== undefined ? !!active : true,
      stock: stock !== undefined ? Number(stock) : 10,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      skinConcerns: Array.isArray(skinConcerns) ? skinConcerns : [],
      featured: !!featured,
      kendallFav: !!kendallFav,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: "Failed to create product." }, { status: 500 });
  }
}


