import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary, getCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileBase64 = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file was provided in the upload request." }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || "image/png";
      fileBase64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    } else {
      const body = await req.json();
      fileBase64 = body.image || body.file || "";
    }

    if (!fileBase64) {
      return NextResponse.json({ error: "Image file or base64 data is required." }, { status: 400 });
    }

    // Upload to Cloudinary or fallback to base64 data URL
    const uploadResult = await uploadImageToCloudinary(fileBase64, "cfrank_payment_proofs");

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      data: uploadResult,
    });
  } catch (error: any) {
    console.error("[Cloudinary API Upload Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const instance = getCloudinary();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "unconfigured";
  return NextResponse.json({
    status: "Cloudinary API Operational",
    cloudName,
    hasApiKey: !!process.env.CLOUDINARY_API_SECRET,
  });
}
