import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Door Specifications & Waybill Delivery",
  description:
    "Common trade questions answered: Turkish steel security door gauges, foreign HDF door package contents, WPC waterproof bathroom doors, depot visits at Maraim Plaza Ogidi, and nationwide delivery across Nigeria.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Anambra Best Door",
    description:
      "Answers on Turkish door thickness, rough opening dimensions, CAC verification, and waybill delivery across Nigeria.",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
