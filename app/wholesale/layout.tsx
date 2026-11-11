import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Wholesale & Contractor Supply | ${brand.name}`,
  description:
    `Direct bulk supply and container pricing for building contractors, developers, and institutions across Nigeria from ${brand.name}.`,
  alternates: {
    canonical: "/wholesale",
  },
  openGraph: {
    title: `Wholesale & Commercial Project Supply | ${brand.name}`,
    description:
      `Bulk developer pricing, direct container offloading, and scheduled site waybill deliveries across Nigeria.`,
  },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
