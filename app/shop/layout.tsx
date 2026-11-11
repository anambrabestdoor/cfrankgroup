import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Catalogue & Store | ${brand.name}`,
  description:
    `Explore products from ${brand.name}, featuring security doors, interior room doors, sanitary wares, and building fittings with nationwide delivery.`,
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: `Products Catalogue | ${brand.name}`,
    description:
      `Complete commercial catalogue of security doors, luxury HDF room doors, and sanitary wares from ${brand.name}.`,
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
