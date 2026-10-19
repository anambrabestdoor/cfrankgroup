import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Depot Location | Maraim Plaza Ogidi, Onitsha",
  description:
    "Visit our physical store and warehouse at No 16/17 Maraim Plaza, Building Material Ogidi, Anambra State. Phone: 0803 521 8890. WhatsApp sales desk and nationwide haulage coordination.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Anambra Best Door Depot | Ogidi Onitsha",
    description:
      "Physical showroom directions, WhatsApp sales inquiries, phone numbers, and contractor offloading coordination at Maraim Plaza, Ogidi.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
