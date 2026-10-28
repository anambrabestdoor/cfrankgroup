import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DOOR_PRODUCTS, DoorProduct } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { db } from "@/lib/db";
import { isSupabaseConfigured, getSupabase } from "@/lib/supabase";
import { generateGeoKeywords, generateGeoDescription } from "@/lib/geoKeywords";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";

async function fetchProduct(id: string): Promise<DoorProduct | undefined> {
  const fromDb = await db.getProductById(id);
  if (fromDb) return fromDb;

  const local = DOOR_PRODUCTS.find((p) => p.slug === id || p.id === id);
  if (local) return local;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`slug.eq.${id},id.eq.${id}`)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id,
          slug: data.slug,
          name: data.name,
          group: data.group || undefined,
          subcategory: data.subcategory || undefined,
          category: data.category,
          categoryLabel: data.category_label || data.category,
          price: data.price ? Number(data.price) : undefined,
          originalPrice: data.original_price ? Number(data.original_price) : undefined,
          priceOnRequest: data.price_on_request ?? false,
          priceMode: data.price_mode || "blank",
          image: data.image || "",
          gallery: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : (data.image ? [data.image] : []),
          video: data.video || undefined,
          videos: data.videos || (data.video ? [data.video] : undefined),
          badge: data.badge || undefined,
          stockStatus: data.stock_status || "in_stock",
          stock: data.stock !== undefined ? Number(data.stock) : 10,
          shortDescription: data.short_description || "",
          description: data.description || "",
          specifications: data.specifications || {},
          features: Array.isArray(data.features) ? data.features : [],
          jijiUrl: data.jiji_url || "https://jiji.ng/shop/anambrabestdoor",
          seoTitle: data.seo_title || `${data.name} | Anambra Best Door`,
          seoDescription: data.seo_description || data.short_description || "",
          focusKeyphrase: data.focus_keyphrase || data.name,
          featured: data.featured ?? false,
          active: data.active ?? true,
        };
      }
    } catch {
      // Supabase offline or read failure fallback
    }
  }

  return undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested door or architectural fitting is not listed in our warehouse inventory.",
    };
  }

  const title = product.seoTitle || `${product.name} - Price & Specs | Anambra Best Door`;
  const description = generateGeoDescription(
    product.name,
    product.seoDescription || product.shortDescription
  );
  const keywords = generateGeoKeywords(product.name, product.categoryLabel);

  const ogImageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  return {
    title: { absolute: title },
    description,
    keywords,
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
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  const allProducts = await db.getProducts();
  const isDoor =
    product.group === "doors" ||
    ["security-doors", "interior-doors", "bathroom-doors", "hdf-doors", "luxury-doors"].includes(
      product.category
    );

  const relatedProducts = allProducts
    .filter((p) => {
      if (p.id === product.id) return false;
      if (p.category === product.category) return true;
      const pIsDoor =
        p.group === "doors" ||
        ["security-doors", "interior-doors", "bathroom-doors", "hdf-doors", "luxury-doors"].includes(
          p.category
        );
      return isDoor ? pIsDoor : !pIsDoor;
    })
    .slice(0, 4);

  const priceValidUntil =
    product.priceValidUntil ||
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

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
      priceValidUntil,
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
          addressCountry: "NG",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NG",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnInStore",
        returnFees: "https://schema.org/FreeReturn",
        returnShippingFeesAmount: {
          "@type": "MonetaryAmount",
          currency: "NGN",
          value: "0",
        },
        url: `${baseUrl}/returns`,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          currency: "NGN",
          value: "0",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "NG",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
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
