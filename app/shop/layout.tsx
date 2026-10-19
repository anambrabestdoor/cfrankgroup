import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Door & Sanitary Catalogue | Prices & Specifications | Onitsha",
  description:
    "Explore our complete inventory of heavy-gauge Turkish steel security doors, interior luxury HDF room doors, waterproof bathroom doors, and sanitary wares in Ogidi, Anambra State. Physical inspection and nationwide delivery.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Door & Sanitary Inventory Catalogue | Anambra Best Door",
    description:
      "Direct warehouse inventory of Turkish security doors, luxury HDF room doors, Watson panels, and sanitary fittings at Maraim Plaza, Ogidi, Onitsha.",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
