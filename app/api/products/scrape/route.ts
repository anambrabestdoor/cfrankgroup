import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

function cleanHtmlText(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function determineCategory(title: string, productType: string, tags: string[]): { category: string; subcategory: string } {
  const t = (title + " " + productType + " " + tags.join(" ")).toLowerCase();
  
  if (t.includes("toner") || t.includes("pad")) {
    return { category: "Toner & Pad", subcategory: "Soothing Toner" };
  }
  if (t.includes("cleans") || t.includes("oil") || t.includes("foam")) {
    return { category: "Cleanser", subcategory: "Cleansing Oil" };
  }
  if (t.includes("serum") || t.includes("ampoule") || t.includes("drop")) {
    return { category: "Serum & Ampoule", subcategory: "Glass Skin Serum" };
  }
  if (t.includes("cream") || t.includes("lotion") || t.includes("moistur")) {
    return { category: "Moisturizer", subcategory: "Barrier Cream" };
  }
  if (t.includes("sun") || t.includes("spf")) {
    return { category: "Sunscreen", subcategory: "SPF Protection" };
  }
  if (t.includes("mask") || t.includes("sheet")) {
    return { category: "Face Masks", subcategory: "Sheet Mask" };
  }
  return { category: "Best Sellers", subcategory: "Skincare Essential" };
}

function determineSkinConcerns(title: string, desc: string, tags: string[]): string[] {
  const text = (title + " " + desc + " " + tags.join(" ")).toLowerCase();
  const concerns: string[] = [];

  if (text.includes("acne") || text.includes("soothing") || text.includes("calm") || text.includes("heartleaf")) {
    concerns.push("Acne", "Sensitive");
  }
  if (text.includes("blackhead") || text.includes("pore") || text.includes("cleansing")) {
    concerns.push("Blackheads & Clogged Pores");
  }
  if (text.includes("dark spot") || text.includes("niacinamide") || text.includes("bright") || text.includes("peach")) {
    concerns.push("Dark Spots", "Dullness");
  }
  if (text.includes("barrier") || text.includes("moistur") || text.includes("dry") || text.includes("hydrat")) {
    concerns.push("Dryness & Skin Barrier");
  }
  if (text.includes("pdrn") || text.includes("wrinkle") || text.includes("aging") || text.includes("firm")) {
    concerns.push("Signs of Aging", "Textural Irregularities");
  }

  return concerns.length > 0 ? concerns : ["Acne", "Sensitive"];
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

    let sourceUrl = "https://anua.com/products.json?limit=30";
    try {
      const body = await req.json();
      if (body.url) {
        const cleanUrl = body.url.replace(/\/$/, "");
        if (cleanUrl.endsWith(".json")) {
          sourceUrl = cleanUrl;
        } else {
          sourceUrl = `${cleanUrl}/products.json?limit=30`;
        }
      }
    } catch {
      // Body empty, default to anua.com
    }

    console.log(`[Scraper] Ingesting products from: ${sourceUrl}`);
    const res = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch products from source (${res.status} ${res.statusText})` }, { status: 502 });
    }

    const data = await res.json();
    const rawProducts = data.products;

    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      return NextResponse.json({ error: "No products found at target endpoint." }, { status: 404 });
    }

    const existingProducts = await db.getProducts();
    const existingMap = new Map(existingProducts.map((p) => [p.handle || p.name.toLowerCase().replace(/[^a-z0-9]/g, "-"), p]));

    const imported: any[] = [];
    const limit = Math.min(rawProducts.length, 30);

    for (let i = 0; i < limit; i++) {
      const raw = rawProducts[i];
      const title = raw.title || "Anua Skincare Product";
      const handle = raw.handle || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const rawDesc = cleanHtmlText(raw.body_html || "");
      const description = rawDesc.length > 10 ? rawDesc : `${title} - Premium clean Korean skincare formulation by ANUA.`;
      
      const variant = raw.variants && raw.variants[0] ? raw.variants[0] : {};
      const price = Number(variant.price) || 24.00;
      const compareAtPrice = Number(variant.compare_at_price);
      const originalPrice = compareAtPrice && compareAtPrice > price ? compareAtPrice : Math.round(price * 1.2 * 100) / 100;

      // Extract original absolute image URL directly
      let imageUrl = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80";
      if (raw.images && raw.images.length > 0 && raw.images[0].src) {
        imageUrl = raw.images[0].src;
        if (imageUrl.startsWith("//")) {
          imageUrl = `https:${imageUrl}`;
        }
      }

      const tags: string[] = Array.isArray(raw.tags) ? raw.tags : typeof raw.tags === "string" ? raw.tags.split(",") : [];
      const productType = raw.product_type || "";
      const { category, subcategory } = determineCategory(title, productType, tags);
      const skinConcerns = determineSkinConcerns(title, description, tags);

      // Extract key ingredients or generate default
      const ingredients = tags.filter((t) => t.length < 25 && !t.includes(":")).slice(0, 5);
      if (ingredients.length === 0) {
        ingredients.push("Heartleaf Extract 77%", "Niacinamide", "Centella Asiatica", "Hyaluronic Acid");
      }

      let badge: string | null = null;
      const titleLower = title.toLowerCase();
      if (titleLower.includes("bestseller") || titleLower.includes("77%") || i < 3) badge = "BESTSELLER";
      else if (titleLower.includes("pdrn")) badge = "VIRAL PDRN";
      else if (titleLower.includes("peach")) badge = "TRENDING";
      else if (titleLower.includes("set") || titleLower.includes("kit") || titleLower.includes("bundle")) badge = "VALUE SET";

      const productPayload = {
        name: title,
        subtitle: `${subcategory} · ${category}`,
        description,
        price,
        originalPrice,
        rating: Math.round((4.6 + Math.random() * 0.4) * 10) / 10,
        reviewsCount: Math.floor(500 + Math.random() * 5000),
        image: imageUrl,
        category,
        subcategory,
        badge,
        active: true,
        stock: 100,
        ingredients,
        skinConcerns,
        handle,
        featured: i < 8,
        kendallFav: titleLower.includes("heartleaf") || titleLower.includes("pdrn") || i % 4 === 0,
      };

      const existing = existingMap.get(handle);
      if (existing) {
        const updated = await db.updateProduct(existing.id, productPayload);
        if (updated) imported.push(updated);
      } else {
        const created = await db.createProduct(productPayload);
        if (created) imported.push(created);
      }
    }

    // Trigger instant Next.js revalidation across all relevant routes
    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections/[slug]", "page");
      revalidatePath("/products/[id]", "page");
    } catch (e) {
      console.warn("[Scraper] Path revalidation warning:", e);
    }

    return NextResponse.json({
      success: true,
      count: imported.length,
      message: `Successfully ingested and persisted ${imported.length} products from ${sourceUrl}`,
      products: imported,
    });
  } catch (error: any) {
    console.error("[Scraper API Error]:", error);
    return NextResponse.json({ error: error?.message || "Failed to process scraping request." }, { status: 500 });
  }
}
