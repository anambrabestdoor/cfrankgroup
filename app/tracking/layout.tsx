import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waybill Tracking & Dispatch Verification",
  description:
    "Track your product shipment from our warehouse. Verify waybill number and driver dispatch status directly with our logistics desk.",
  alternates: {
    canonical: "/tracking",
  },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
