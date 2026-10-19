/**
 * Centralized media limits & validation for CFrank Enterprise (Anambra Best Door)
 * Based on technicals.md specifications for Cloudinary & file handling
 */

export const MEDIA_LIMITS = {
  images: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    maxSizeMB: 5,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"] as const,
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".avif"] as const,
    maxDimension: 3000,
  },
  videos: {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    maxSizeMB: 50,
    allowedMimeTypes: ["video/mp4", "video/webm"] as const,
    allowedExtensions: [".mp4", ".webm"] as const,
    maxDurationSeconds: 90,
  },
} as const;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageUpload(mimeType: string, sizeBytes: number): ValidationResult {
  const allowed = MEDIA_LIMITS.images.allowedMimeTypes as readonly string[];
  if (!allowed.includes(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file format (${mimeType}). Supported image formats: JPEG, PNG, WEBP, AVIF.`,
    };
  }

  if (sizeBytes > MEDIA_LIMITS.images.maxSizeBytes) {
    const sizeInMB = (sizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeInMB}MB) exceeds the maximum allowed limit of ${MEDIA_LIMITS.images.maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}

export function validateVideoUpload(mimeType: string, sizeBytes: number): ValidationResult {
  const allowed = MEDIA_LIMITS.videos.allowedMimeTypes as readonly string[];
  if (!allowed.includes(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid video format (${mimeType}). Supported video formats: MP4, WEBM.`,
    };
  }

  if (sizeBytes > MEDIA_LIMITS.videos.maxSizeBytes) {
    const sizeInMB = (sizeBytes / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Video size (${sizeInMB}MB) exceeds the maximum allowed limit of ${MEDIA_LIMITS.videos.maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}
