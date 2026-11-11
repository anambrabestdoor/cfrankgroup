"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenuDrawer from "./MobileMenuDrawer";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import CacVerificationModal from "./CacVerificationModal";

export default function ConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <main className="w-full min-h-screen bg-slate-900">
        {children}
      </main>
    );
  }

  return (
    <>
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
    </>
  );
}
