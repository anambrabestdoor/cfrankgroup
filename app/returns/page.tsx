"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import SearchOverlay from "../components/SearchOverlay";
import { RotateCcw, ShieldCheck, CheckCircle } from "lucide-react";

export default function ReturnsPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "help@anuaglobal.com";

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      <Header />
      <CartDrawer />
      <SearchOverlay />

      <div className="bg-black text-white py-16 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">30-Day Money Back Guarantee</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400">Returns & Refund Policy</p>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="bg-white p-8 border border-gray-200 rounded-2xl space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 text-black font-serif font-bold text-xl pb-4 border-b border-gray-100">
            <RotateCcw className="w-6 h-6 text-[#2B4636]" />
            <span>Hassle-Free 30-Day Returns</span>
          </div>

          <p>
            At ANUA, we stand behind the quality of our formulations. If you are not completely satisfied with your purchase, you may return unopened or gently used items within <strong>30 days of delivery</strong> for a full refund.
          </p>

          <h3 className="font-serif font-bold text-base text-black">How to Initiate a Return:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Email customer support at <a href={`mailto:${supportEmail}`} className="font-bold text-black underline">{supportEmail}</a> with your Order ID.</li>
            <li>Receive a prepaid return shipping label via email.</li>
            <li>Drop off the package at any authorized carrier location.</li>
            <li>Refund will be credited to your original payment method within 3-5 business days.</li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
}


