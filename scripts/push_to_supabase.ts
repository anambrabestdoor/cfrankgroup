/**
 * Script to push all products from doorsData.ts and site settings to Supabase.
 * Run with: npx tsx scripts/push_to_supabase.ts
 */
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { DOOR_PRODUCTS } from "../app/data/doorsData";
import { DEFAULT_SITE_SETTINGS } from "../lib/settings";

// Load environment from .env.local if present
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  console.log("==================================================");
  console.log("ANAMBRA BEST DOOR — Supabase Data Sync");
  console.log("==================================================");

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
    console.error("❌ ERROR: Supabase credentials not found or unconfigured in .env.local!");
    console.log("Please define these in .env.local or your environment:");
    console.log("  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
    console.log("  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key");
    console.log("  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Connecting to: ${supabaseUrl}`);

  // 1. Sync Products
  console.log(`Syncing ${DOOR_PRODUCTS.length} products to public.products...`);
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

  const { error: prodError } = await supabase.from("products").upsert(rows, { onConflict: "id" });
  if (prodError) {
    console.error(`❌ Products upsert failed: ${prodError.message}`);
  } else {
    console.log(`✅ Successfully synced ${rows.length} products to Supabase.`);
  }

  // 2. Sync Site Settings
  console.log("Syncing site settings to public.site_settings...");
  const settingsRow = {
    id: "global",
    company_name: DEFAULT_SITE_SETTINGS.companyName,
    parent_company: DEFAULT_SITE_SETTINGS.parentCompany,
    cac_number: DEFAULT_SITE_SETTINGS.cacNumber,
    phone: DEFAULT_SITE_SETTINGS.phone,
    phone_display: DEFAULT_SITE_SETTINGS.phoneDisplay,
    whatsapp_number: DEFAULT_SITE_SETTINGS.whatsappNumber,
    email: DEFAULT_SITE_SETTINGS.salesEmail,
    address: DEFAULT_SITE_SETTINGS.address,
    second_address: DEFAULT_SITE_SETTINGS.secondAddress || "",
    market_location: DEFAULT_SITE_SETTINGS.marketLocation,
    working_hours: DEFAULT_SITE_SETTINGS.workingHours,
    jiji_shop_url: DEFAULT_SITE_SETTINGS.jijiShopUrl,
    whatsapp_inquiry_template: DEFAULT_SITE_SETTINGS.whatsappInquiryTemplate,
    whatsapp_cart_template: DEFAULT_SITE_SETTINGS.whatsappCartTemplate,
    updated_at: new Date().toISOString(),
  };

  const { error: setErr } = await supabase.from("site_settings").upsert(settingsRow, { onConflict: "id" });
  if (setErr) {
    console.error(`❌ Settings upsert failed: ${setErr.message}`);
  } else {
    console.log(`✅ Successfully synced site settings to Supabase.`);
  }

  console.log("\n🎉 Supabase sync complete!");
}

run().catch(console.error);
