'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  currentImageUrl?: string;
}

export default function CloudinaryUploader({
  onUploadSuccess,
  folder = 'anua_products',
  currentImageUrl = '',
}: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Read file as base64 string
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const response = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            folder,
          }),
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.error || 'Failed to upload image to Cloudinary');
        }

        const uploadedUrl = resData.data.url;
        onUploadSuccess(uploadedUrl);
        setSuccess(true);
        setUploading(false);
      };
    } catch (err: any) {
      console.error('Cloudinary upload error:', err);
      setError(err?.message || 'Error uploading file');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold tracking-wider uppercase rounded-xl border border-neutral-300 transition-colors">
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 text-neutral-600" />
              <span>Upload via Cloudinary</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Image uploaded and optimized on Cloudinary CDN!</span>
        </div>
      )}

      {currentImageUrl && (
        <div className="relative mt-2 w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImageUrl}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}


