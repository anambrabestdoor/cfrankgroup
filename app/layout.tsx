import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppProvider } from "./context/AppContext";
import JsonLd from "./components/JsonLd";
import ConditionalShell from "./components/ConditionalShell";
import { brand, colors, seo } from "@/lib/brand";

const baseUrl = brand.appUrl;

export const viewport: Viewport = {
  themeColor: colors.charcoal,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: [...seo.keywords],
  authors: [{ name: brand.name, url: baseUrl }],
  creator: brand.name,
  publisher: brand.name,
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: baseUrl,
    siteName: brand.name,
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
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
