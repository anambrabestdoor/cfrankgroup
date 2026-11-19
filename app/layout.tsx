import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppProvider } from "./context/AppContext";
import JsonLd from "./components/JsonLd";
import ConditionalShell from "./components/ConditionalShell";
import { brand, colors, seo } from "@/lib/brand";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || brand.url || "https://cfrankgroup.com";

export const viewport: Viewport = {
  themeColor: colors.charcoal,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CFrank Group | Official Website of CFrank Enterprise",
    template: `%s | CFrank Group`,
  },
  description:
    "Official website of CFrank Enterprise (CFrank Group). Direct factory supply of certified Turkish security doors, luxury interior doors, sanitary wares, stone-coated roofing tiles, and furniture, with Anambra Best Door operating as our dedicated subsidiary division.",
  keywords: [
    "CFrank Enterprise",
    "CFrank Group",
    "C. Frank Enterprise",
    "CFrank Enterprises",
    "CFrank official website",
    "CFrank Group Nigeria",
    "Anambra Best Door parent company",
    "Anambra Best Door",
    ...seo.keywords,
  ],
  authors: [{ name: "CFrank Enterprise", url: baseUrl }],
  creator: "CFrank Enterprise",
  publisher: "CFrank Group",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: baseUrl,
    siteName: "CFrank Group (CFrank Enterprise)",
    title: "CFrank Group | Official Website of CFrank Enterprise",
    description:
      "Official parent website of CFrank Enterprise (CFrank Group). Certified Turkish security doors, luxury interior doors, sanitary wares, roofing tiles, and furniture. Anambra Best Door operates as our subsidiary division.",
    images: [
      {
        url: `${baseUrl}/cfrank_hero_completed_house.png`,
        width: 1200,
        height: 630,
        alt: "CFrank Group architectural supply and luxury building projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CFrank Group | Official Website of CFrank Enterprise",
    description:
      "Official website of CFrank Enterprise (CFrank Group). Turkish security doors, sanitary wares, roofing tiles, and furniture. Anambra Best Door is our subsidiary division.",
    images: [`${baseUrl}/cfrank_hero_completed_house.png`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={colors.charcoal} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={brand.shortName} />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <JsonLd />
      </head>
      <body className="antialiased text-slate-900 bg-white font-sans min-h-screen flex flex-col justify-between" suppressHydrationWarning>
        <AppProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </AppProvider>
      </body>
    </html>
  );
}
