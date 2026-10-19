import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Heavy-Gauge Security Doors Depot | Ogidi Onitsha",
  description:
    "Learn about CFrank Enterprise and Anambra Best Door, registered direct importers (CAC BN: 9943925) of Turkish armoured doors, luxury HDF room doors, and sanitary wares with physical depot at Maraim Plaza, Ogidi, Anambra State.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Anambra Best Door & CFrank Enterprise",
    description:
      "Physical depot operations, corporate CAC registration, and direct import supply of security doors and architectural fittings in Anambra State.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
