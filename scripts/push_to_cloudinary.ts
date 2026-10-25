/**
 * Script to push all local product images from public/products/ to Cloudinary.
 * Run with: npx tsx scripts/push_to_cloudinary.ts
 */
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

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

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

async function run() {
  console.log("==================================================");
  console.log("ANAMBRA BEST DOOR — Cloudinary Image Migration");
  console.log("==================================================");

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("❌ ERROR: Cloudinary credentials not found in environment!");
    console.log("Please define these in .env.local or your environment:");
    console.log("  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name");
    console.log("  CLOUDINARY_API_KEY=your_api_key");
    console.log("  CLOUDINARY_API_SECRET=your_api_secret\n");
    process.exit(1);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const productsDir = path.join(__dirname, "../public/products");
  if (!fs.existsSync(productsDir)) {
    console.error(`❌ ERROR: Directory not found: ${productsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(productsDir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
  console.log(`Found ${files.length} images in ${productsDir}`);

  const urlMap: Record<string, string> = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(productsDir, file);
    const sanitizedName = file.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${file}... `);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        folder: "anambra_best_door/products",
        public_id: sanitizedName,
        resource_type: "image",
        overwrite: true,
      });

      urlMap[file] = res.secure_url;
      console.log(`✅ OK: ${res.secure_url}`);
    } catch (err: any) {
      console.log(`❌ FAILED: ${err.message}`);
    }
  }

  const outPath = path.join(__dirname, "cloudinary_mapping.json");
  fs.writeFileSync(outPath, JSON.stringify(urlMap, null, 2));
  console.log(`\n🎉 Upload completed. Mapping saved to ${outPath}`);
}

run().catch(console.error);
