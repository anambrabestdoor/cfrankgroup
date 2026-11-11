"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShieldCheck, Eye, Lock } from "lucide-react";

interface ProtectedDocumentViewerProps {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "aspect-[4/3]" or "aspect-[3/4]"
  badgeText?: string;
  watermarkText?: string;
  className?: string;
  onExpand?: () => void;
}

export default function ProtectedDocumentViewer({
  src,
  alt,
  aspectRatio = "aspect-[4/3]",
  badgeText = "SCUML RN: SC 041603036",
  watermarkText = "OFFICIAL VERIFICATION COPY • CFRANK GROUP PROPERTY • NOT FOR RE-USE",
  className = "",
  onExpand,
}: ProtectedDocumentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (isCancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: false });
      if (!ctx) return;

      // High-DPI canvas dimensions
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const targetWidth = img.naturalWidth || 1200;
      const targetHeight = img.naturalHeight || 900;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // 1. Draw base image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // 2. Burn protective anti-tamper diagonal watermark pattern directly into pixel buffer
      ctx.save();
      ctx.rotate((-28 * Math.PI) / 180);
      ctx.font = `bold ${Math.round(targetWidth / 34)}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = "rgba(18, 21, 24, 0.13)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const stepX = targetWidth * 0.45;
      const stepY = targetHeight * 0.18;

      for (let x = -targetWidth; x < targetWidth * 2; x += stepX) {
        for (let y = -targetHeight; y < targetHeight * 2; y += stepY) {
          ctx.fillText(watermarkText, x, y);
        }
      }
      ctx.restore();

      // 3. Subtle micro security stamp at corner
      ctx.save();
      ctx.fillStyle = "rgba(18, 21, 24, 0.45)";
      ctx.font = `600 ${Math.round(targetWidth / 70)}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText(`CFRANK GROUP SECURE ASSET #${Date.now().toString(36).toUpperCase()}`, 24, targetHeight - 24);
      ctx.restore();

      setLoaded(true);
    };

    img.onerror = () => {
      if (!isCancelled) setError(true);
    };

    return () => {
      isCancelled = true;
    };
  }, [src, watermarkText]);

  // Shield events against right-click, saving, dragging, inspection
  const preventAction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div
      ref={containerRef}
      onContextMenu={preventAction}
      onDragStart={preventAction}
      className={`relative ${aspectRatio} w-full rounded-lg overflow-hidden border border-[#E5E3DC] bg-[#FBF9F5] shadow-xs select-none group print:hidden ${className}`}
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      {/* Canvas rendering (No <img> tag in DOM) */}
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        className={`w-full h-full object-contain p-2.5 transition-opacity duration-300 pointer-events-none select-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      />

      {/* Loading state skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FBF9F5] space-y-2 text-[#73787E]">
          <div className="w-5 h-5 border-2 border-[#F3661B] border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] font-semibold">Verifying secure document...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FBF9F5] p-4 text-center space-y-1 text-[#73787E]">
          <Lock className="w-5 h-5 text-[#F3661B]" />
          <span className="text-xs font-bold text-[#121518]">Protected Document</span>
          <span className="text-[11px]">Verification available upon request via Customer Care.</span>
        </div>
      )}

      {/* Transparent Click Shield & Interaction Layer */}
      {/* This layer sits in front of the canvas. When inspecting element, the browser targets this empty div */}
      <div
        className="absolute inset-0 z-10 cursor-default bg-transparent select-none"
        onContextMenu={preventAction}
        onDragStart={preventAction}
        onClick={onExpand}
        title="Protected Document - CFrank Group Official Verification"
      />

      {/* Bottom Floating Verification Badge */}
      <div className="absolute bottom-2.5 right-2.5 z-20 px-2.5 py-1 bg-[#121518]/90 text-white text-[10px] font-bold rounded flex items-center gap-1.5 shadow-sm pointer-events-none select-none">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>{badgeText}</span>
      </div>

      {/* Top Floating Security Pill */}
      <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-white/90 border border-[#E5E3DC] text-[#73787E] text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1 pointer-events-none select-none">
        <Lock className="w-2.5 h-2.5 text-[#F3661B]" />
        <span>Protected Verification Copy</span>
      </div>
    </div>
  );
}

