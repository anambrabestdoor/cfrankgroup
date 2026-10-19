"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";

const ARTICLES = [
  {
    id: "turkish-vs-israeli-doors",
    title: "Turkish Armoured Steel Doors vs. Israeli Security Doors: What Nigerian Builders Must Know",
    date: "October 14, 2026",
    category: "Security Doors",
    excerpt: "A direct comparison of gauge thickness, rockwool thermal acoustic core insulation, multi-point deadbolt locks, and exterior powder-coat durability in Nigerian weather.",
    image: "/products/turkish-luxury-door.jpg",
  },
  {
    id: "standard-door-sizes-nigeria",
    title: "Standard Door Rough Openings in Nigeria: 3ft Single Leaf vs. 4ft & 5ft Double Leaf",
    date: "September 28, 2026",
    category: "Site Measurements",
    excerpt: "Prevent costly masonry rework on your site. Accurate blockwork rough opening specifications for Turkish steel frames, Watson room doors, and luxury entrances.",
    image: "/products/security-steel-door.jpg",
  },
  {
    id: "waterproof-wpc-vs-wood-doors",
    title: "Why Normal Wooden Doors Swell in Restrooms and Why 100% Waterproof WPC is Essential",
    date: "September 15, 2026",
    category: "Bathroom Doors",
    excerpt: "How high humidity and direct shower splashes ruin untreated HDF, and why polymer-bonded composite doors provide lifelong termite and moisture immunity.",
    image: "/products/waterproof-bathroom-door.jpg",
  },
  {
    id: "sanitary-ware-inspection-guide",
    title: "How to Inspect Water Closets, Ceramic Basins, and Brassware Before Offloading on Site",
    date: "August 30, 2026",
    category: "Sanitary Wares",
    excerpt: "Key checklists for building contractors: siphon jet dual-flush testing, ceramic glaze hairline checks, and solid brass cartridge verification for long-lasting plumbing.",
    image: "/products/luxury-toilet-wc.jpg",
  },
];

export default function BlogPage() {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 block">
            Construction & Architecture Advice
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Depot Trade Notes & Builder Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Practical buying guides, door installation tips, and sanitary ware specifications from our technical sales desk.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-[#003296] transition-colors flex flex-col"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/85 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {article.category}
                </span>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                  </div>
                  <h2 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/shop`}
                    className="text-xs font-bold text-[#003296] hover:underline flex items-center space-x-1"
                  >
                    <span>View Related Depot Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
