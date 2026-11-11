import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Inspection & Replacement Policy | ${brand.name}`,
  description:
    `Inspection protocols, factory defect replacements, and pre-dispatch quality verification procedures at ${brand.name}.`,
  alternates: {
    canonical: "/returns",
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
