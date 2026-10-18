"use client";

import React, { use } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { DOOR_PRODUCTS, CATEGORIES, DoorProduct } from "@/app/data/doorsData";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface CollectionMeta {
  title: string;
  desc: string;
  categoryKey?: DoorProduct["category"];
}

const DOOR_COLLECTIONS: Record<string, CollectionMeta> = {
  "security-doors": {
    title: "Heavy-Gauge Security & Steel Doors",
    desc: "Reinforced structural steel entrance doors, bullet proof doors, and multi-lock perimeter defense doors.",
    categoryKey: "security-doors",
  },
  "interior-doors": {
    title: "Interior Wooden Room Doors",
    desc: "Watson doors, luxury foreign HDF models, and pre-hung room doors with matching architraves and mortise locks.",
    categoryKey: "interior-doors",
  },
  "hdf-doors": {
    title: "HDF & Engineered Flush Doors",
    desc: "High-density fibreboard doors, complete door packages, and custom on-demand project fabrication.",
    categoryKey: "hdf-doors",
  },
  "bathroom-doors": {
    title: "Waterproof Bathroom & Restroom Doors",
    desc: "100% moisture-proof, rot-proof, and termite-proof doors for humid environments and domestic restrooms.",
    categoryKey: "bathroom-doors",
  },
  "luxury-doors": {
    title: "Luxury Cast Aluminium & Copper Doors",
    desc: "Ornamental Bible cast doors and electro-plated Italian copper doors for prestigious entrances.",
    categoryKey: "luxury-doors",
  },
};

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const collection = DOOR_COLLECTIONS[slug] || {
    title: "Door Collection",
    desc: "Explore genuine heavy-gauge security and interior doors from Anambra Best Door Enterprises.",
  };

  const filtered = DOOR_PRODUCTS.filter((p) => {
    if (!p.active) return false;
    if (collection.categoryKey) {
      return p.category === collection.categoryKey;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/shop" className="hover:text-[#003296] flex items-center space-x-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Products</span>
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-800">{collection.title}</span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#003296] text-[11px] font-bold uppercase tracking-wider">
            Verified Inventory • Maraim Plaza Ogidi
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {collection.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            {collection.desc}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-sm font-bold text-slate-800">No doors currently listed under this category.</p>
            <Link
              href="/shop"
              className="inline-block py-2.5 px-5 bg-[#003296] text-white text-xs font-bold rounded-xl"
            >
              Browse Full Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((door) => (
              <ProductCard key={door.id} product={door} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
