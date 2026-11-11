import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `About Us | ${brand.name}`,
  description:
    `Learn more about ${brand.name}, registered as Anambra Best Door Enterprises (BN: ${brand.cacNumber}), supplying quality security doors, foreign interior doors, stone-coated roof tiles, and sanitary wares from Ogidi, Anambra State.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${brand.name}`,
    description:
      `Corporate profile, verified CAC registration, leadership, and physical warehouse operations of ${brand.name}.`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
