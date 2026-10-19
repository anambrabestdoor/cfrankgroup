import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspection & Replacement Policy",
  description:
    "Inspection protocols for offloading security doors, wooden doors, and sanitary wares. Factory defect replacements and pre-dispatch verification procedures at CFrank Enterprise.",
  alternates: {
    canonical: "/returns",
  },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
