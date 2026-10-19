"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DOOR_PRODUCTS, DoorProduct } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS, SiteSettings, buildWhatsAppOrderUrl } from "@/lib/settings";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  category: string;
  size?: string;
  orientation?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: DoorProduct, options?: { size?: string; orientation?: string; quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  cacModalOpen: boolean;
  setCacModalOpen: (open: boolean) => void;
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  products: DoorProduct[];
  setProducts: React.Dispatch<React.SetStateAction<DoorProduct[]>>;
  sendWhatsAppOrder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cacModalOpen, setCacModalOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [products, setProducts] = useState<DoorProduct[]>(DOOR_PRODUCTS);

  // Load cart, settings, and products from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("abd_cart_items");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedSettings = localStorage.getItem("abd_site_settings");
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
      const savedProducts = localStorage.getItem("abd_products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          setProducts(parsed.filter((p): p is DoorProduct => Boolean(p && typeof p === "object" && p.id)));
        }
      }
    } catch {
      // LocalStorage error or private browsing fallback
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("abd_cart_items", JSON.stringify(cart));
    } catch {
      // storage quota or private window
    }
  }, [cart]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("abd_products", JSON.stringify(products));
    } catch {
      // storage quota or private window
    }
  }, [products]);

  const addToCart = useCallback(
    (product: DoorProduct, options?: { size?: string; orientation?: string; quantity?: number }) => {
      const qty = options?.quantity || 1;
      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + qty,
            size: options?.size || next[existingIndex].size,
            orientation: options?.orientation || next[existingIndex].orientation,
          };
          return next;
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            quantity: qty,
            category: product.category,
            size: options?.size,
            orientation: options?.orientation,
          },
        ];
      });
      setCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem("abd_site_settings", JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = useCallback(() => {
    if (cart.length === 0) return;
    const url = buildWhatsAppOrderUrl({
      cartItems: cart.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
      })),
      total: cartTotal > 0 ? cartTotal : undefined,
      targetPhone: settings.whatsappNumber,
      cartTemplate: settings.whatsappCartTemplate,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }, [cart, cartTotal, settings.whatsappNumber, settings.whatsappCartTemplate]);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartOpen,
        setCartOpen,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchOpen,
        setSearchOpen,
        cacModalOpen,
        setCacModalOpen,
        settings,
        updateSettings,
        products,
        setProducts,
        sendWhatsAppOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
