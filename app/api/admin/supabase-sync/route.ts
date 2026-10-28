import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { db } from "@/lib/db";

export async function GET() {
  const configured = isSupabaseConfigured();
  if (!configured) {
    return NextResponse.json({
      configured: false,
      message:
        "Supabase is not yet configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local or Vercel.",
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    // Test count on products table
    const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        configured: true,
        connected: false,
        error: error.message,
        hint: "Make sure you have run supabase_schema.sql in your Supabase SQL Editor to create the tables.",
      });
    }

    return NextResponse.json({
      configured: true,
      connected: true,
      productsInDatabase: count ?? 0,
      totalCatalogProducts: DOOR_PRODUCTS.length,
      message: `Supabase is connected! Found ${count ?? 0} products currently in the database.`,
    });
  } catch (err: any) {
    return NextResponse.json({
      configured: true,
      connected: false,
      error: err?.message || "Failed to reach Supabase database.",
    });
  }
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase environment variables missing.",
        message: "Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    // 1. Prepare products payload
    const rows = DOOR_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      category_label: p.categoryLabel,
      price: p.price || 0,
      original_price: p.originalPrice || 0,
      price_on_request: p.priceOnRequest !== false,
      image: p.image,
      gallery: p.gallery || [p.image],
      badge: p.badge || null,
      stock_status: p.stockStatus || "in_stock",
      stock: p.stock || 10,
      short_description: p.shortDescription || "",
      description: p.description || "",
      features: p.features || [],
      specifications: p.specifications || {},
      jiji_url: p.jijiUrl || null,
      active: p.active !== false,
      updated_at: new Date().toISOString(),
    }));

    // Upsert products in batches of 20
    const { data: upsertData, error: prodError } = await supabase
      .from("products")
      .upsert(rows, { onConflict: "id" })
      .select("id");

    if (prodError) {
      throw new Error(`Products sync error: ${prodError.message}`);
    }

    // 2. Upsert site settings
    const currentSettings = await db.getSettings();
    const settingsPayload = {
      id: "global",
      company_name: currentSettings.companyName || DEFAULT_SITE_SETTINGS.companyName,
      parent_company: currentSettings.parentCompany || DEFAULT_SITE_SETTINGS.parentCompany,
      cac_number: currentSettings.cacNumber || DEFAULT_SITE_SETTINGS.cacNumber,
      phone: currentSettings.phone || DEFAULT_SITE_SETTINGS.phone,
      phone_display: currentSettings.phoneDisplay || DEFAULT_SITE_SETTINGS.phoneDisplay,
      whatsapp_number: currentSettings.whatsappNumber || DEFAULT_SITE_SETTINGS.whatsappNumber,
      email: currentSettings.salesEmail || DEFAULT_SITE_SETTINGS.salesEmail,
      address: currentSettings.address || DEFAULT_SITE_SETTINGS.address,
      second_address: currentSettings.secondAddress || DEFAULT_SITE_SETTINGS.secondAddress || "",
      market_location: currentSettings.marketLocation || DEFAULT_SITE_SETTINGS.marketLocation,
      working_hours: currentSettings.workingHours || DEFAULT_SITE_SETTINGS.workingHours,
      jiji_shop_url: currentSettings.jijiShopUrl || DEFAULT_SITE_SETTINGS.jijiShopUrl,
      whatsapp_inquiry_template: currentSettings.whatsappInquiryTemplate || DEFAULT_SITE_SETTINGS.whatsappInquiryTemplate,
      whatsapp_cart_template: currentSettings.whatsappCartTemplate || DEFAULT_SITE_SETTINGS.whatsappCartTemplate,
      updated_at: new Date().toISOString(),
    };

    const { error: settingsError } = await supabase
      .from("site_settings")
      .upsert(settingsPayload, { onConflict: "id" });

    if (settingsError) {
      console.warn("Settings upsert warning:", settingsError.message);
    }

    return NextResponse.json({
      success: true,
      syncedProductsCount: rows.length,
      syncedSettings: !settingsError,
      message: `Successfully pushed all ${rows.length} products and settings to Supabase!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to push data to Supabase" },
      { status: 500 }
    );
  }
}
