// Shared mutable promotions store for Anambra Best Door / CFrank Enterprise

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
    title: "Estate Bulk Discount - 10% Off 10+ Doors",
    description: "Special builder and contractor terms for 10 or more Turkish security doors or foreign HDF room doors.",
    discountPercent: 10,
    voucherCode: "CFRANKBULK",
    expiresAt: "2026-12-31T23:59:59Z",
    heroImage: "/products/bullet-proof-door.jpg",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "promo-2",
    title: "Complete Sanitary & Bathroom Package Deal",
    description: "Special project pricing on executive water closets, dining basins, and shower rooms.",
    discountPercent: 8,
    voucherCode: "SANITARYSET",
    expiresAt: "2026-12-31T23:59:59Z",
    heroImage: "/products/cubicle-shower-room.jpg",
    active: true,
    createdAt: new Date().toISOString(),
  },
];
