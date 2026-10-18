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
import ChatWidgetSlot from "./components/ChatWidgetSlot";

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
    "Anambra Best Door (operated by CFrank Enterprise) is Nigeria's trusted direct importer of Turkish armoured security doors, interior wooden doors, waterproof bathroom doors, and biometric smart locks in Ogidi, Onitsha, Anambra State. Nationwide delivery.",
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
    "Chubby Plaza Ogidi",
  ],
  authors: [{ name: "CFrank Enterprise", url: baseUrl }],
  creator: "CFrank Enterprise",
  publisher: "Anambra Best Door",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: baseUrl,
    siteName: "Anambra Best Door by CFrank Enterprise",
    title: "Anambra Best Door | Heavy-Gauge Security Doors in Nigeria",
    description: "Heavy-gauge Turkish steel security doors, interior wooden doors, waterproof bathroom doors, and smart locks in Onitsha, Anambra State.",
    images: [
      {
        url: `${baseUrl}/products/steel-security-door-1.jpg`,
        width: 1200,
        height: 630,
        alt: "Turkish Heavy Gauge Steel Security Door by Anambra Best Door",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
          <ChatWidgetSlot />
        </AppProvider>
      </body>
    </html>
  );
}
