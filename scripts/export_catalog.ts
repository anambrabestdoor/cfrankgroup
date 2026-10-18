import { DOOR_PRODUCTS } from "../app/data/doorsData";
import fs from "fs";
import path from "path";

console.log(`Loaded ${DOOR_PRODUCTS.length} products from doorsData.ts`);

const escapeSql = (str?: string | null) => {
  if (!str) return "''";
  return `'${str.replace(/'/g, "''")}'`;
};

let sqlOutput = `-- ============================================================================
-- ANAMBRA BEST DOOR / CFRANK ENTERPRISE - SEED PRODUCTS SQL
-- Populates Supabase products table with all 26 authentic doors and sanitary wares
-- ============================================================================

INSERT INTO public.products (
  id,
  name,
  slug,
  category,
  category_label,
  price,
  original_price,
  price_on_request,
  image,
  badge,
  stock_status,
  stock,
  short_description,
  description,
  features,
  specifications,
  jiji_url,
  active
) VALUES\n`;

const valueRows = DOOR_PRODUCTS.map((p) => {
  const featuresSql = `ARRAY[${(p.features || []).map((f) => escapeSql(f)).join(", ")}]::TEXT[]`;
  const specsJson = escapeSql(JSON.stringify(p.specifications || {}));

  return `(
    ${escapeSql(p.id)},
    ${escapeSql(p.name)},
    ${escapeSql(p.slug)},
    ${escapeSql(p.category)},
    ${escapeSql(p.categoryLabel)},
    ${p.price || 0},
    ${p.originalPrice || 0},
    ${p.priceOnRequest !== false ? "TRUE" : "FALSE"},
    ${escapeSql(p.image)},
    ${p.badge ? escapeSql(p.badge) : "NULL"},
    ${escapeSql(p.stockStatus || "in_stock")},
    ${p.stock || 10},
    ${escapeSql(p.shortDescription || "")},
    ${escapeSql(p.description || "")},
    ${featuresSql},
    ${specsJson}::JSONB,
    ${p.jijiUrl ? escapeSql(p.jijiUrl) : "NULL"},
    TRUE
  )`;
});

sqlOutput += valueRows.join(",\n") + "\nON CONFLICT (id) DO UPDATE SET\n";
sqlOutput += `  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  price_on_request = EXCLUDED.price_on_request,
  image = EXCLUDED.image,
  features = EXCLUDED.features,
  specifications = EXCLUDED.specifications,
  updated_at = NOW();\n`;

fs.writeFileSync(path.join(__dirname, "../supabase_seed_products.sql"), sqlOutput);
console.log(`Successfully generated supabase_seed_products.sql with ${DOOR_PRODUCTS.length} authentic items.`);

// Also write a JSON export for easy import via API
fs.writeFileSync(
  path.join(__dirname, "products_catalog.json"),
  JSON.stringify(DOOR_PRODUCTS, null, 2)
);
console.log("Successfully generated scripts/products_catalog.json");
