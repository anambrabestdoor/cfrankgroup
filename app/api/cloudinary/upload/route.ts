import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary, getCloudinary } from '@/lib/cloudinary';
import { validateImageUpload, validateVideoUpload } from '@/lib/mediaLimits';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileBase64 = "";
    let mimeType = "image/png";
    let sizeBytes = 0;
    let folder = "anambra_best_door/products";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const requestedFolder = formData.get("folder") as string | null;
      if (requestedFolder) folder = requestedFolder;

      if (!file) {
        return NextResponse.json({ error: "No file was provided in the upload request." }, { status: 400 });
      }

      mimeType = file.type || "image/png";
      sizeBytes = file.size;

      const isVideo = mimeType.startsWith("video/");
      const validation = isVideo
        ? validateVideoUpload(mimeType, sizeBytes)
        : validateImageUpload(mimeType, sizeBytes);

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      if (isVideo && !requestedFolder) {
        folder = "anambra_best_door/videos";
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileBase64 = `data:${mimeType};base64,${buffer.toString("base64")}`;
    } else {
      const body = await req.json();
      fileBase64 = body.image || body.file || body.video || "";
      if (body.folder) folder = body.folder;

      if (fileBase64.startsWith("data:")) {
        const matches = fileBase64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          sizeBytes = Math.round((matches[2].length * 3) / 4);
        }
      }

      const isVideo = mimeType.startsWith("video/");
      const validation = isVideo
        ? validateVideoUpload(mimeType, sizeBytes)
        : validateImageUpload(mimeType, sizeBytes);

      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      if (isVideo && !body.folder) {
        folder = "anambra_best_door/videos";
      }
    }

    if (!fileBase64) {
      return NextResponse.json({ error: "Media file or base64 data is required." }, { status: 400 });
    }

    // Upload to Cloudinary or fallback
    const uploadResult = await uploadImageToCloudinary(fileBase64, folder);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type || (mimeType.startsWith("video/") ? "video" : "image"),
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
