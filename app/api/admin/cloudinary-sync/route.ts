import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCloudinary } from "@/lib/cloudinary";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";

export async function GET() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const isConfigured = Boolean(cloudName && apiKey && apiSecret);

  // Count local images in public/products
  const productsDir = path.join(process.cwd(), "public", "products");
  let localImagesCount = 0;
  if (fs.existsSync(productsDir)) {
    localImagesCount = fs.readdirSync(productsDir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).length;
  }

  // Count products using cloudinary vs local
  const cloudinaryImagesCount = DOOR_PRODUCTS.filter((p) => p.image && p.image.includes("cloudinary.com")).length;

  return NextResponse.json({
    configured: isConfigured,
    cloudName: cloudName || null,
    hasApiKey: Boolean(apiKey),
    hasApiSecret: Boolean(apiSecret),
    localImagesCount,
    cloudinaryImagesCount,
    totalProducts: DOOR_PRODUCTS.length,
    message: isConfigured
      ? `Cloudinary is connected to '${cloudName}'. Ready to upload or sync.`
      : "Cloudinary credentials not yet provided in environment. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
  });
}

export async function POST(req: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      {
        success: false,
        error: "Cloudinary credentials missing",
        message:
          "Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env.local or Vercel Environment Variables.",
      },
      { status: 400 }
    );
  }

  try {
    const cloudinary = getCloudinary();
    const productsDir = path.join(process.cwd(), "public", "products");

    if (!fs.existsSync(productsDir)) {
      return NextResponse.json({ success: false, error: "Products directory not found" }, { status: 404 });
    }

    const files = fs.readdirSync(productsDir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
    const results: Array<{ file: string; url: string; success: boolean; error?: string }> = [];

    for (const file of files) {
      const filePath = path.join(productsDir, file);
      try {
        const fileBase64 = `data:image/jpeg;base64,${fs.readFileSync(filePath).toString("base64")}`;
        const sanitizedName = file.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");

        const uploadRes = await cloudinary.uploader.upload(fileBase64, {
          folder: "anambra_best_door/products",
          public_id: sanitizedName,
          resource_type: "image",
          overwrite: true,
        });

        results.push({
          file,
          url: uploadRes.secure_url,
          success: true,
        });
      } catch (err: any) {
        results.push({
          file,
          url: "",
          success: false,
          error: err?.message || "Upload failed",
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      total: files.length,
      uploaded: successCount,
      failed: files.length - successCount,
      results,
      message: `Successfully uploaded ${successCount} of ${files.length} images to Cloudinary!`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to push images to Cloudinary" },
      { status: 500 }
    );
  }
}
