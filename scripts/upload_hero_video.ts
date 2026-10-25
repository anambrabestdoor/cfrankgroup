/**
 * Uploads Hero Video & missing assets to Cloudinary.
 * Run with: npx tsx scripts/upload_hero_video.ts
 */
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Load environment from .env.local
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

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary credentials!");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

async function main() {
  console.log("Starting Hero Video and Missing Assets Upload to Cloudinary...");

  const results: Record<string, string> = {};

  // 1. Upload Hero Video: WhatsApp Video 2026-10-19 at 7.46.16 AM.mp4
  const heroVideoPath = path.join(__dirname, "../public/WhatsApp Video 2026-10-19 at 7.46.16 AM.mp4");
  if (fs.existsSync(heroVideoPath)) {
    console.log("Uploading Hero Video (WhatsApp Video 2026-10-19 at 7.46.16 AM.mp4)...");
    try {
      const res = await cloudinary.uploader.upload(heroVideoPath, {
        folder: "anambra_best_door/videos",
        public_id: "hero_warehouse_offloading",
        resource_type: "video",
        overwrite: true,
      });
      console.log("✅ Hero Video uploaded successfully:", res.secure_url);
      results["hero_video"] = res.secure_url;
    } catch (err: any) {
      console.error("❌ Hero Video upload failed:", err.message);
    }
  } else {
    console.warn("⚠️ Hero video not found at:", heroVideoPath);
  }

  // 2. Upload Second Video: WhatsApp Video 2026-10-19 at 7.46.17 AM.mp4
  const secondVideoPath = path.join(__dirname, "../public/WhatsApp Video 2026-10-19 at 7.46.17 AM.mp4");
  if (fs.existsSync(secondVideoPath)) {
    console.log("Uploading Second Video (WhatsApp Video 2026-10-19 at 7.46.17 AM.mp4)...");
    try {
      const res = await cloudinary.uploader.upload(secondVideoPath, {
        folder: "anambra_best_door/videos",
        public_id: "warehouse_depot_tour",
        resource_type: "video",
        overwrite: true,
      });
      console.log("✅ Second Video uploaded successfully:", res.secure_url);
      results["second_video"] = res.secure_url;
    } catch (err: any) {
      console.error("❌ Second Video upload failed:", err.message);
    }
  }

  // 3. Upload missing product image: interior-luxury-foreign-hdf-door.jpeg
  const missingImgPath = path.join(__dirname, "../public/products/interior-luxury-foreign-hdf-door.jpeg");
  if (fs.existsSync(missingImgPath)) {
    console.log("Uploading missing product image (interior-luxury-foreign-hdf-door.jpeg)...");
    try {
      const res = await cloudinary.uploader.upload(missingImgPath, {
        folder: "anambra_best_door/products",
        public_id: "interior-luxury-foreign-hdf-door",
        resource_type: "image",
        overwrite: true,
      });
      console.log("✅ Image uploaded successfully:", res.secure_url);
      results["interior-luxury-foreign-hdf-door.jpeg"] = res.secure_url;

      // Update cloudinary_mapping.json
      const mapPath = path.join(__dirname, "cloudinary_mapping.json");
      if (fs.existsSync(mapPath)) {
        const mapping = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
        mapping["interior-luxury-foreign-hdf-door.jpeg"] = res.secure_url;
        fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2));
        console.log("Updated cloudinary_mapping.json with missing image.");
      }
    } catch (err: any) {
      console.error("❌ Image upload failed:", err.message);
    }
  }

  const outPath = path.join(__dirname, "hero_video_cloudinary.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log("Finished. Output saved to:", outPath);
}

main().catch(console.error);
