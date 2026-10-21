import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery & Haulage Policy | Direct Site Waybill Dispatch",
  description:
    "Information on our crated waybill delivery across all 36 Nigerian states. Warehouse pickup or heavy haulage dispatch to Lagos, Abuja, Port Harcourt, Asaba, and Enugu.",
  alternates: {
    canonical: "/shipping",
  },
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
