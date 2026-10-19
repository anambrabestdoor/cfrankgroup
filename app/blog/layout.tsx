import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Guides & Door Installation Notes",
  description:
    "Practical architectural guides for Nigerian building projects: rough masonry openings, Turkish vs. Israeli security door comparisons, WPC waterproof bathroom doors, and sanitary ware inspection tips.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Depot Trade Notes & Architectural Buying Guides | Anambra Best Door",
    description:
      "Site measurement advice, steel gauge comparisons, and door durability tips from our depot team at Maraim Plaza, Ogidi, Onitsha.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
