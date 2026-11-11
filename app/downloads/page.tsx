import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, FileText, CheckCircle2, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Download Trade Catalogues | ${brand.name}`,
  description:
    `Download official PDF catalogues for ${brand.name} covering certified Turkish steel security doors, interior luxury HDF room doors, stone-coated roof tiles, and sanitary fittings.`,
  openGraph: {
    title: `Download Trade Catalogues | ${brand.name}`,
    description:
      `Official PDF trade catalogues for doors and sanitary fittings available from ${brand.name}.`,
  },
};

const CATALOGS = [
  {
    id: "door-catalog",
    title: "ANAMBRA BEST DOOR CATALOG",
    subtitle: "Foreign HDF Room Doors & Turkish Steel Security Doors",
    description:
      "Complete catalogue covering foreign luxury HDF room doors, heavy-gauge Turkish security doors, Watson panel designs, matching architraves, frames, and mortise locksets.",
    fileName: "Anambra-Best-Door-Catalog.pdf",
    fileUrl: "/Anambra-Best-Door-Catalog.pdf",
    fileSize: "2.2 MB",
    pageCount: "Full Range",
    category: "Doors & Entrances",
    featuredImage: "/products/interior-luxury-foreign-hdf-door.jpeg",
    highlights: [
      "Heavy-gauge Turkish steel security entrance doors",
      "Foreign HDF pre-hung room doors with matching architraves",
      "Waterproof composite bathroom & toilet doors",
      "Standard Nigerian building dimensions (3ft & 4ft x 7ft)",
    ],
  },
  {
    id: "sanitary-catalog",
    title: "ANAMBRA BEST SANITARY WARE CATALOG",
    subtitle: "Modern Water Closets, Wash Basins & Bathroom Fittings",
    description:
      "Comprehensive product guide covering dual-flush ceramic water closets, wash hand basins, luxury executive vanity counters, power showers, and durable brass mixer taps.",
    fileName: "Anambra-Best-Sanitary-Ware-Catalog.pdf",
    fileUrl: "/Anambra-Best-Sanitary-Ware-Catalog.pdf",
    fileSize: "3.4 MB",
    pageCount: "Full Range",
    category: "Sanitary Wares & Fittings",
    featuredImage: "/products/Excutive WC.jpeg",
    highlights: [
      "Dual-flush ceramic water closets & vanity sink sets",
      "Cabinet and dining wash hand basins",
      "Power showers, mixer taps & water heaters",
      "Site-ready fittings for residential & commercial builds",
    ],
  },
];

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      {/* Hero Header */}
      <div className="bg-[#121518] text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#F3661B] block">
            Official Product Catalogues
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Download Trade Catalogues
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Download our complete PDF catalogues for offline reference, architectural planning, and physical warehouse stock verification.
          </p>
        </div>
      </div>

      {/* Main 2-Grid Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATALOGS.map((catalog) => (
            <div
              key={catalog.id}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-[#F3661B] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Featured Image */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <Image
                    src={catalog.featuredImage}
                    alt={catalog.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/85 text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                    {catalog.category}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-white/95 text-slate-800 text-[10px] font-extrabold rounded shadow-xs">
                    PDF • {catalog.fileSize}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="text-lg sm:text-xl font-black text-[#F3661B] tracking-tight leading-snug">
                      {catalog.title}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      {catalog.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {catalog.description}
                  </p>

                  {/* Highlights */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Inside This Catalogue:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {catalog.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F3661B] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 sm:p-7 pt-0 space-y-3">
                <a
                  href={catalog.fileUrl}
                  download={catalog.fileName}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-xs sm:text-sm tracking-wider uppercase rounded-lg shadow-xs transition-all hover:shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD NOW »</span>
                </a>

                <div className="flex items-center justify-between text-xs px-1 text-slate-500">
                  <a
                    href={catalog.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold hover:text-[#F3661B] hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open / Preview in Browser</span>
                  </a>
                  <span className="font-mono text-[11px] text-slate-400">
                    {catalog.fileSize}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Assistance Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-base font-bold text-slate-900">
              Need a Custom Quote or Wall Opening Sizing Guide?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              If your architectural schedule requires non-standard heights or multi-unit project quantities, our customer care agent will calculate your bill of quantities and waybill costs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
                `Hello ${brand.name}, I have downloaded your trade catalogue and would like to inquire about pricing and availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-4 bg-[#25D366] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#1EBE5D] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              <span>Browse Online Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
