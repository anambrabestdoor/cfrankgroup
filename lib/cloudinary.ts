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
    console.warn('[Cloudinary] CLOUDINARY_API_SECRET missing. Returning uploaded image data URL directly.');
    return {
      url: fileBase64,
      public_id: `local_${Date.now()}`,
      resource_type: 'image',
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
      resource_type: result.resource_type,
    };
  } catch (err) {
    console.error('[Cloudinary Upload Error]:', err);
    throw err;
  }
}

/**
 * List media resources from Cloudinary for admin media library
 */
export async function listCloudinaryMedia(options?: {
  max_results?: number;
  next_cursor?: string;
  resource_type?: 'image' | 'video';
}) {
  const instance = getCloudinary();
  if (!process.env.CLOUDINARY_API_SECRET) {
    return { resources: [], next_cursor: null };
  }

  const resourceType = options?.resource_type || 'image';
  const maxResults = options?.max_results || 40;

  try {
    const result = await instance.api.resources({
      type: 'upload',
      prefix: 'anambra_best_door',
      max_results: maxResults,
      next_cursor: options?.next_cursor || undefined,
      resource_type: resourceType,
    });

    const resources = (result.resources || []).map((r: any) => ({
      public_id: r.public_id,
      url: r.secure_url || r.url,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      created_at: r.created_at,
      resource_type: r.resource_type,
    }));

    return {
      resources,
      next_cursor: result.next_cursor || null,
    };
  } catch (err: any) {
    console.error('[Cloudinary List Error]:', err);
    // Fallback without prefix in case assets were stored in other folders
    try {
      const fallbackResult = await instance.api.resources({
        type: 'upload',
        max_results: maxResults,
        next_cursor: options?.next_cursor || undefined,
        resource_type: resourceType,
      });

      const resources = (fallbackResult.resources || []).map((r: any) => ({
        public_id: r.public_id,
        url: r.secure_url || r.url,
        format: r.format,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        created_at: r.created_at,
        resource_type: r.resource_type,
      }));

      return {
        resources,
        next_cursor: fallbackResult.next_cursor || null,
      };
    } catch (fallbackErr) {
      console.error('[Cloudinary Fallback List Error]:', fallbackErr);
      throw err;
    }
  }
}

/**
 * Delete a media resource from Cloudinary storage
 */
export async function deleteCloudinaryMedia(
  public_id: string,
  resource_type: 'image' | 'video' = 'image'
) {
  const instance = getCloudinary();
  if (!process.env.CLOUDINARY_API_SECRET) {
    return { result: 'ok', mock: true };
  }

  try {
    const result = await instance.uploader.destroy(public_id, {
      resource_type,
      invalidate: true,
    });
    return result;
  } catch (err) {
    console.error('[Cloudinary Delete Error]:', err);
    throw err;
  }
}

