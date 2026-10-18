"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import SearchOverlay from "../components/SearchOverlay";
import { Sparkles, Calendar, User, ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    id: 1,
    title: "How to Build a Glass Skin Routine with Heartleaf & PDRN",
    date: "July 26, 2026",
    author: "ANUA Skincare Lab",
    excerpt: "Learn how pairing 77% Heartleaf extract with low-molecular Salmon PDRN restores skin barrier balance and creates an instant, long-lasting glass-skin glow.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Fading Post-Acne Dark Spots",
    date: "July 20, 2026",
    author: "Dr. Sarah Kim, Dermatologist",
    excerpt: "Discover why 10% Niacinamide + 4% Tranexamic Acid is the dermatologist-recommended duo for hyperpigmentation and acne scars.",
    image: "https://images.unsplash.com/photo-1608248597260-2e4a643e2264?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Why Double Cleansing is Essential for Clogged Pores",
    date: "July 14, 2026",
    author: "Kendall's Beauty Team",
    excerpt: "How oil cleansing dissolves sebum without clogging pores or stripping natural moisture.",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      <Header />
      <CartDrawer />
      <SearchOverlay />

      <div className="bg-black text-white py-16 px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">ANUA Journal</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">Blog & Skincare Tips</h1>
        <p className="text-sm text-gray-300 max-w-lg mx-auto">
          Expert insights, science-backed formulation breakdowns, and glass-skin routines.
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-black hover:underline">{article.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}


