import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AppProvider } from "./context/AppContext";
import JsonLd from "./components/JsonLd";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileMenuDrawer from "./components/MobileMenuDrawer";
import CartDrawer from "./components/CartDrawer";
import SearchOverlay from "./components/SearchOverlay";
import CacVerificationModal from "./components/CacVerificationModal";
import FrankieWidget from "./components/FrankieWidget";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://anambrabestdoor.com";

export const viewport: Viewport = {
  themeColor: "#0A192F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Anambra Best Door | Heavy-Gauge Steel Security Doors & Building Fittings | Onitsha",
    template: "%s | Anambra Best Door",
  },
  description:
    "Anambra Best Door (operated by CFrank Enterprise) is Nigeria's trusted direct importer of quality HDF doors, Turkish armoured security doors, interior wooden doors, waterproof bathroom doors, and biometric smart locks in Ogidi, Onitsha, Anambra State. Nationwide delivery.",
  keywords: [
    "Security doors Onitsha",
    "Turkish security doors Nigeria",
    "Steel security doors Anambra",
    "Building materials Ogidi market",
    "Armoured doors Nigeria",
    "HDF interior room doors",
    "Watson room doors",
    "Waterproof bathroom doors WPC",
    "Biometric smart door locks",
    "Stainless steel door handles",
    "CFrank Enterprise",
    "Anambra Best Door",
    "Maraim Plaza Ogidi",
    "Sanitary wares Ogidi",
  ],
  authors: [{ name: "CFrank Enterprise", url: baseUrl }],
  creator: "CFrank Enterprise",
  publisher: "Anambra Best Door",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: baseUrl,
    siteName: "Anambra Best Door by CFrank Enterprise",
    title: "Anambra Best Door | Heavy-Gauge Security Doors & Sanitary Wares",
    description: "Heavy-gauge Turkish steel security doors, interior luxury HDF room doors, waterproof bathroom doors, and sanitary fittings in Anambra State.",
    images: [
      {
        url: `${baseUrl}/products/bullet-proof-door.jpg`,
        width: 1200,
        height: 630,
        alt: "Bullet Proof Security Door by Anambra Best Door",
      },
    ],
  },
  manifest: "/site.webmanifest",
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
  verification: {
    google: "iBRJRBa4MEc-8HGKT_j8rtYi8twd964563fAsFqdQs8",
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
        <meta name="google-site-verification" content="iBRJRBa4MEc-8HGKT_j8rtYi8twd964563fAsFqdQs8" />
        <meta name="theme-color" content="#003296" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Anambra Best Door" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <JsonLd />
      </head>
      <body className="antialiased text-slate-900 bg-white font-sans min-h-screen flex flex-col justify-between" suppressHydrationWarning>
        <AppProvider>
          <div className="flex-1 flex flex-col w-full">
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>

          {/* Interactive Drawers & Overlays */}
          <MobileMenuDrawer />
          <CartDrawer />
          <SearchOverlay />
          <CacVerificationModal />
          <FrankieWidget />
        </AppProvider>
      </body>
    </html>
  );
}
