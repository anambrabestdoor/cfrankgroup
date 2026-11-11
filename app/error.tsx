"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, MessageSquare } from "lucide-react";
import { brand } from "@/lib/brand";

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
          <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#F7F6F2]">
            <div className="max-w-md w-full bg-white border border-[#E5E5E0] rounded-xl p-8 text-center shadow-xs space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#171A1D] text-[#F3661B] mx-auto flex items-center justify-center font-bold text-xl">
                !
              </div>

              <div className="space-y-2">
                  <h1 className="text-xl font-bold text-[#171A1D] tracking-tight">
                    Something unexpected occurred
                  </h1>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      The requested view could not be rendered completely. You can reload this view or return to the main catalogue.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => reset()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#171A1D] text-white text-xs font-semibold hover:bg-[#252A2F] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#F3661B]" />
                      <span>Reload View</span>
                    </button>
                    <Link
                      href="/"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#F7F6F2] text-[#171A1D] text-xs font-semibold hover:bg-[#E5E5E0] border border-[#E5E5E0] transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Home</span>
                    </Link>
                  </div>

                    <div className="pt-4 border-t border-[#E5E5E0] text-[11px] text-[#6B7280]">
                      Need immediate support? Contact our customer care agent via{" "}
                      <a
                        href={`https://wa.me/${brand.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#171A1D] font-semibold underline hover:text-[#F3661B]"
                      >
                        WhatsApp ({brand.phoneDisplay})
                      </a>
                    </div>
                  </div>
              </div>
              );
}
