"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, MessageSquare } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F8FAFC]">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xs space-y-6">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#003296] mx-auto flex items-center justify-center font-bold text-xl">
          !
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            The page could not be displayed completely. You can reload this view or return to the main inventory catalogue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#003296] text-white text-xs font-bold hover:bg-[#002266] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Page</span>
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
          Need immediate assistance? Contact our Ogidi sales desk via{" "}
          <a
            href="https://wa.me/2347070070305"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#003296] font-semibold underline"
          >
            WhatsApp (+234 707 007 0305)
          </a>
        </div>
      </div>
    </div>
  );
}
