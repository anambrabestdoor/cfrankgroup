import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = DOOR_PRODUCTS.find((p) => p.slug === id || p.id === id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested door or architectural fitting is not listed in our warehouse inventory.",
    };
  }

  const title = product.seoTitle || `${product.name} - Price & Specs | Anambra Best Door`;
  const description =
    product.seoDescription ||
    `${product.name}. Direct supply from CFrank Enterprise. Available in standard 3ft x 7ft and custom openings. Nationwide delivery.`;

  const ogImageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${baseUrl}/products/${product.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: `${baseUrl}/products/${product.slug}`,
      siteName: DEFAULT_SITE_SETTINGS.companyName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 1000,
          alt: `${product.name} - ${product.categoryLabel}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = DOOR_PRODUCTS.find((p) => p.slug === id || p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-[#F8FAFC]">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-xl border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900">Door Model Not Found</h1>
          <p className="text-xs text-slate-500">
            The requested door or fitting is not currently listed in our online inventory or may have been updated.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="py-2.5 px-5 bg-[#003296] text-white text-xs font-bold rounded-xl inline-block"
            >
              Browse Full Catalogue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = DOOR_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.featured)
  ).slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [`${baseUrl}${product.image}`],
    description: product.description || product.shortDescription,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: DEFAULT_SITE_SETTINGS.parentCompany,
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "NGN",
      price: product.price && product.price > 0 ? product.price : 0,
      availability:
        product.stockStatus === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "LocalBusiness",
        name: `${DEFAULT_SITE_SETTINGS.companyName} (${DEFAULT_SITE_SETTINGS.parentCompany})`,
        telephone: DEFAULT_SITE_SETTINGS.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: DEFAULT_SITE_SETTINGS.address,
          addressLocality: "Ogidi",
          addressRegion: "Anambra State",
          addressCountry: "NG",
        },
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Catalogue",
        item: `${baseUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.categoryLabel,
        item: `${baseUrl}/collections/${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${baseUrl}/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
