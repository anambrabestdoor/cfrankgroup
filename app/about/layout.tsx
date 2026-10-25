import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Heavy-Gauge Security Doors & Fittings | Anambra Best Door",
  description:
    "See more about CFrank Enterprise and Anambra Best Door, registered direct importers (CAC BN: 9943925) of Turkish armoured doors, luxury HDF room doors, and sanitary wares with physical warehouse and showroom at Maraim Plaza, Building Material International Market, Ogidi.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Anambra Best Door & CFrank Enterprise",
    description:
      "Physical warehouse operations, and direct import supply of household doors, security doors, building materials sanitary wares and architectural fittings in Anambra State.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
