// Shared mutable promotions store (in-memory)
// Replace array mutations with Firestore calls for production persistence

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  voucherCode: string;
  expiresAt: string;
  heroImage: string;
  active: boolean;
  createdAt: string;
}

export const promotionsStore: Promotion[] = [
  {
    id: "promo-1",
    title: "Welcome Glow — 15% Off Your First Order",
    description: "New to ANUA? Start your clean Korean skincare journey with 15% off your first order.",
    discountPercent: 15,
    voucherCode: "ANUAFIRST",
    expiresAt: "2026-12-31T23:59:59Z",
    heroImage: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "promo-2",
    title: "PDRN Summer Bundle — Save 25%",
    description: "Stock up on our viral PDRN collection at 25% off. Limited time offer.",
    discountPercent: 25,
    voucherCode: "PDRNBUNDLE",
    expiresAt: "2026-09-01T23:59:59Z",
    heroImage: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=600&auto=format&fit=crop",
    active: true,
    createdAt: new Date().toISOString(),
  },
];
