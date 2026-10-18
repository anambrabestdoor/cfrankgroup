import { v2 as cloudinary } from 'cloudinary';

// Lazy initialization pattern to prevent crashes if credentials are not yet supplied
let isConfigured = false;

export function getCloudinary() {
  if (!isConfigured) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      isConfigured = true;
    }
  }
  return cloudinary;
}

/**
 * Transforms an image URL into an auto-optimized Cloudinary delivery URL with f_auto, q_auto
 */
export function getCloudinaryOptimizedUrl(publicIdOrUrl: string, options?: { width?: number; height?: number; crop?: string }): string {
  if (!publicIdOrUrl) return '';
  if (publicIdOrUrl.includes('res.cloudinary.com') && publicIdOrUrl.includes('/upload/')) {
    const params = ['f_auto', 'q_auto'];
    if (options?.width) params.push(`w_${options.width}`);
    if (options?.height) params.push(`h_${options.height}`);
    if (options?.crop) params.push(`c_${options.crop}`);
    return publicIdOrUrl.replace('/upload/', `/upload/${params.join(',')}/`);
  }
  return publicIdOrUrl;
}

/**
 * Server-side upload function for image assets
 */
export async function uploadImageToCloudinary(fileBase64: string, folder = 'anambra_best_door') {
  const instance = getCloudinary();
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.warn('[Cloudinary] CLOUDINARY_API_SECRET missing. Returning standard image asset URI.');
    return {
      url: fileBase64.startsWith('data:') ? '/products/bullet-proof-door.jpg' : fileBase64,
      public_id: `demo_${Date.now()}`,
    };
  }

  try {
    const result = await instance.uploader.upload(fileBase64, {
      folder,
      resource_type: 'auto',
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (err) {
    console.error('[Cloudinary Upload Error]:', err);
    throw err;
  }
}
