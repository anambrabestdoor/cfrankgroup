import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Delivery & Logistics Policy | ${brand.name}`,
  description:
    `Information on our verified waybill delivery across all 36 Nigerian states from ${brand.name}. Warehouse pickup and dedicated project transit.`,
  alternates: {
    canonical: "/shipping",
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
