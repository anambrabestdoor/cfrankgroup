"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import SearchOverlay from "../components/SearchOverlay";
import { Truck, ShieldCheck, Clock, Globe } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      <Header />
      <CartDrawer />
      <SearchOverlay />

      <div className="bg-black text-white py-16 px-6 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Shipping & Delivery Policy</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400">Fast & reliable delivery worldwide</p>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <Truck className="w-8 h-8 mx-auto mb-3 text-[#2B4636]" />
            <h3 className="font-serif font-bold text-base mb-1">Free Shipping</h3>
            <p className="text-xs text-gray-500">Automatically unlocked on all orders $120+</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <Clock className="w-8 h-8 mx-auto mb-3 text-[#2B4636]" />
            <h3 className="font-serif font-bold text-base mb-1">Processing Time</h3>
            <p className="text-xs text-gray-500">Dispatched within 1-2 business days</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
            <Globe className="w-8 h-8 mx-auto mb-3 text-[#2B4636]" />
            <h3 className="font-serif font-bold text-base mb-1">Worldwide Delivery</h3>
            <p className="text-xs text-gray-500">Delivering to 120+ countries globally</p>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-200 rounded-2xl space-y-4 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-serif font-bold text-xl text-black">Shipping Options & Rates</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li><strong>Standard US Shipping (3-5 Business Days):</strong> $5.99 (Free over $120)</li>
            <li><strong>Express US Shipping (1-2 Business Days):</strong> $12.99</li>
            <li><strong>International Shipping (5-10 Business Days):</strong> Calculated at checkout based on location</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}


