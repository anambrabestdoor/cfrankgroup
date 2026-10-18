import { MetadataRoute } from "next";
import { DOOR_PRODUCTS, CATEGORIES } from "@/app/data/doorsData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";
  const currentDate = new Date().toISOString();

  // Static routes
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
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Category filter routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter((c) => c.id !== "all").map((cat) => ({
    url: `${baseUrl}/shop?category=${cat.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = DOOR_PRODUCTS.filter((p) => p.active).map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
