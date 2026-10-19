import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Waybill Tracking & Dispatch Verification",
  description:
    "Track your door and sanitary shipment from our Maraim Plaza Ogidi depot. Verify haulage waybill number and driver dispatch status directly with our logistics desk.",
  alternates: {
    canonical: "/tracking",
  },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
