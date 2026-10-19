import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale & Estate Supply | Direct Importer Pricing",
  description:
    "Direct container-load and pallet wholesale supply of Turkish steel security doors, luxury HDF interior room doors, waterproof bathroom doors, and sanitary wares for Nigerian building contractors, developers, and door dealers.",
  alternates: {
    canonical: "/wholesale",
  },
  openGraph: {
    title: "Wholesale Door & Sanitary Supply in Nigeria | CFrank Enterprise",
    description:
      "Bulk developer pricing, direct container offloading, and scheduled site waybill deliveries across Anambra, Asaba, Enugu, Port Harcourt, Lagos, and Abuja.",
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
