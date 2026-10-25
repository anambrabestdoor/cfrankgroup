import { MetadataRoute } from "next";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";

const COLLECTION_SLUGS = [
  "hdf-doors",
  "security-doors",
  "interior-doors",
  "bathroom-doors",
  "luxury-doors",
  "sanitary-fittings",
  "paint",
  "roof-tiles",
  "bathrooms",
  "real-estate",
  "careers",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";
  const currentDate = new Date().toISOString();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/wholesale`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tracking`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/downloads`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Clean canonical category / collection routes (HDF and Security doors prioritized)
  const collectionRoutes: MetadataRoute.Sitemap = COLLECTION_SLUGS.map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: slug === "hdf-doors" || slug === "security-doors" ? 0.9 : 0.8,
  }));

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = DOOR_PRODUCTS.filter((p) => p.active).map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: p.featured ? 0.85 : 0.8,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
