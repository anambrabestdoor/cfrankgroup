import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${brand.name}`,
  description:
    `Frequently asked questions regarding products, specifications, waybill delivery, contractor pricing, and corporate verification at ${brand.name}.`,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: `Frequently Asked Questions | ${brand.name}`,
    description:
      `Answers on product specifications, rough opening dimensions, CAC verification, and waybill delivery across Nigeria.`,
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
