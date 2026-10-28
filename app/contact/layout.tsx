import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Warehouse Location | Anambra Best Door",
  description:
    "Visit our physical showroom and warehouse at Maraim Plaza, Building Material International Market, Ogidi. Phone: 0803 521 8890. WhatsApp sales line and nationwide delivery coordination.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Anambra Best Door | Warehouse & Showroom",
    description:
      "Showroom directions, WhatsApp sales inquiries, phone numbers, and contractor offloading coordination.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
