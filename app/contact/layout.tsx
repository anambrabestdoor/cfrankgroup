import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Contact & Locations | ${brand.name}`,
  description:
    `Contact ${brand.name}. Headquarters and showrooms in Ogidi, Anambra State. Phone: ${brand.phoneDisplay}. WhatsApp customer care agent and nationwide logistics coordination.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact ${brand.name} | Headquarters & Showrooms`,
    description:
      `Get in touch with ${brand.name} for corporate inquiries, contractor orders, and retail purchases.`,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
