/**
 * Development-Only Authentication Module
 * 
 * IMPORTANT: This module is strictly active during development (NODE_ENV !== "production").
 * It provides hardcoded administrator and customer accounts to test end-to-end flows,
 * bypassing external email verification until Resend or an email provider is integrated.
 * 
 * When deployed to production, IS_DEV_AUTH resolves to false and all dev routes/accounts are disabled.
 */

export const IS_DEV_AUTH = process.env.NODE_ENV !== "production";

export interface DevAccount {
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  joinDate: string;
  newsletterSubscribed: boolean;
  profile?: {
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  sampleOrders?: Array<{
    id: string;
    customerName: string;
    email: string;
    total: number;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered";
    items: Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
    }>;
  }>;
}

export const DEV_ACCOUNTS: DevAccount[] = [
  {
    email: process.env.DEV_ADMIN_EMAIL || "admin@example.com",
    password: process.env.DEV_ADMIN_PASSWORD || "",
    name: "Development Administrator",
    role: "admin",
    joinDate: "2026-01-01",
    newsletterSubscribed: true,
  },
  {
    email: process.env.DEV_ADMIN_EMAIL_2 || "admin@anua.com",
    password: process.env.DEV_ADMIN_PASSWORD_2 || "",
    name: "ANUA System Admin",
    role: "admin",
    joinDate: "2026-01-01",
    newsletterSubscribed: true,
  },
  {
    email: process.env.DEV_ADMIN_EMAIL_3 || "help.anuaglobal@gmail.com",
    password: process.env.DEV_ADMIN_PASSWORD_3 || "",
    name: "Anua (God Admin)",
    role: "admin",
    joinDate: "2026-01-01",
    newsletterSubscribed: true,
  },
  {
    email: process.env.DEV_CUSTOMER_EMAIL || "user@example.com",
    password: process.env.DEV_CUSTOMER_PASSWORD || "",
    name: "Sophia Miller (Customer)",
    role: "user",
    joinDate: "2026-02-15",
    newsletterSubscribed: true,
    profile: {
      address: "742 Evergreen Terrace",
      city: "Beverly Hills",
      state: "CA",
      zip: "90210",
      phone: "+1 (555) 234-5678",
    },
    sampleOrders: [
      {
        id: "ANU-982104",
        customerName: "Sophia Miller",
        email: "user@example.com",
        total: 72.0,
        date: "2026-07-20",
        status: "delivered",
        items: [
          {
            productId: "p1",
            productName: "PDRN Collagen Glow Facial Serum Spray",
            price: 29.0,
            quantity: 2,
          },
          {
            productId: "p2",
            productName: "Azelaic Acid 10 Hyaluron Redness Soothing Serum",
            price: 24.0,
            quantity: 1,
          },
        ],
      },
      {
        id: "ANU-847291",
        customerName: "Sophia Miller",
        email: "user@example.com",
        total: 45.0,
        date: "2026-07-28",
        status: "processing",
        items: [
          {
            productId: "p3",
            productName: "PDRN Hyaluronic Acid 100 Moisturizing Cream",
            price: 32.0,
            quantity: 1,
          },
        ],
      },
    ],
  },
];

/**
 * Authenticates a dev user by email and password in development mode.
 * Returns null if dev auth is disabled or credentials don't match.
 */
export function authenticateDevAccount(email: string, password?: string): DevAccount | null {
  if (!IS_DEV_AUTH) return null;

  const cleanEmail = email.trim().toLowerCase();
  const account = DEV_ACCOUNTS.find((a) => a.email.toLowerCase() === cleanEmail);

  if (!account) return null;

  // If password provided, verify password
  if (password && account.password !== password) {
    return null;
  }

  return account;
}

/**
 * Checks whether an email is a predefined dev account.
 */
export function isDevAccountEmail(email: string): boolean {
  if (!IS_DEV_AUTH) return false;
  return DEV_ACCOUNTS.some((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}
