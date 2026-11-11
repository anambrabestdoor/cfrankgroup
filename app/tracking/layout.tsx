import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Waybill Tracking & Dispatch Verification | ${brand.name}`,
  description:
    `Track your product consignment from our warehouse. Verify waybill number and driver dispatch status directly with ${brand.name} logistics desk.`,
  alternates: {
    canonical: "/tracking",
  },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
