import { MetadataRoute } from "next";
import { brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = brand.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/admin/*",
          "/checkout",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
