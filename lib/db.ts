import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { DOOR_PRODUCTS, DoorProduct } from "@/app/data/doorsData";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";

export interface User {
  email: string;
  name: string;
  role: "admin" | "editor" | "user";
  joinDate: string;
  newsletterSubscribed: boolean;
  passwordHash: string;
  cart?: CartItemData[];
  wishlist?: string[];
}

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  category: string;
}

export type Product = DoorProduct & {
  rating?: number;
  reviewsCount?: number;
  subtitle?: string;
  ingredients?: string[];
  skinConcerns?: string[];
  handle?: string;
  sizes?: string[];
};

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  email: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentMethod?: string;
  paymentProofUrl?: string;
}

export interface Settings {
  promoText: string;
  geoRedirectEnabled: boolean;
  defaultCurrency: string;
  exchangeRate: number;
  allowSignups: boolean;
  heroVideoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  companyName?: string;
  parentCompany?: string;
  proprietor?: string;
  address?: string;
  secondAddress?: string;
  marketLocation?: string;
  phone?: string;
  phoneDisplay?: string;
  whatsappNumber?: string;
  salesEmail?: string;
  workingHours?: string;
  cacNumber?: string;
  cacRegistrationDate?: string;
  cacStatus?: string;
  instagramUrl?: string;
  jijiShopUrl?: string;
  githubUrl?: string;
  whatsappInquiryTemplate?: string;
  whatsappCartTemplate?: string;
  deliverySummaryHeading?: string;
  deliverySummaryText?: string;
  deliveryRegions?: Array<{
    name: string;
    duration: string;
    coverage: string;
  }>;
  deliveryPackagingNote?: string;
  preDispatchInspectionNote?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  productName: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface Newsletter {
  email: string;
  subscribedAt: string;
}

export interface VerificationCode {
  email: string;
  code: string;
  expiresAt: string;
}

export interface WholesaleApplication {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  estimatedVolume: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const JWT_SECRET = process.env.JWT_SECRET || "anambra-best-door-cfrank-secret-2026-key";
const DEFAULT_ADMIN_HASH = bcrypt.hashSync("admin123", 10);
function getDbFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpPath = path.join("/tmp", "db.json");
    if (!fs.existsSync(tmpPath)) {
      try {
        const bundledPath = path.join(process.cwd(), "db.json");
        if (fs.existsSync(bundledPath)) {
          fs.copyFileSync(bundledPath, tmpPath);
        } else {
          fs.writeFileSync(tmpPath, JSON.stringify({ users: [], products: [], orders: [] }), "utf-8");
        }
      } catch (err) {
        console.warn("[DB] Could not initialize /tmp/db.json:", err);
      }
    }
    return tmpPath;
  }
  return path.join(process.cwd(), "db.json");
}

interface DiskData {
  users: User[];
  products: DoorProduct[];
  deletedProductIds?: string[];
  orders: Order[];
  settings?: Settings;
  reviews?: Review[];
  faqs?: FaqItem[];
  newsletters?: Newsletter[];
  wholesale?: WholesaleApplication[];
}

function readDiskDb(): DiskData {
  try {
    const filePath = getDbFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        products: Array.isArray(parsed.products) ? parsed.products : [],
        deletedProductIds: Array.isArray(parsed.deletedProductIds) ? parsed.deletedProductIds : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        settings: parsed.settings,
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
        newsletters: Array.isArray(parsed.newsletters) ? parsed.newsletters : [],
        wholesale: Array.isArray(parsed.wholesale) ? parsed.wholesale : [],
      };
    }
  } catch (e) {
    console.warn("[DB] Error reading db.json disk file:", e);
  }
  return { users: [], products: [], orders: [] };
}

function writeDiskDb(data: Partial<DiskData>) {
  try {
    const filePath = getDbFilePath();
    const current = readDiskDb();
    const updated = {
      users: data.users !== undefined ? data.users : current.users,
      products: data.products !== undefined ? data.products : current.products,
      deletedProductIds: data.deletedProductIds !== undefined ? data.deletedProductIds : current.deletedProductIds,
      orders: data.orders !== undefined ? data.orders : current.orders,
      settings: data.settings !== undefined ? data.settings : current.settings,
      reviews: data.reviews !== undefined ? data.reviews : current.reviews,
      faqs: data.faqs !== undefined ? data.faqs : current.faqs,
      newsletters: data.newsletters !== undefined ? data.newsletters : current.newsletters,
      wholesale: data.wholesale !== undefined ? data.wholesale : current.wholesale,
    };
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    console.warn("[DB] Error writing to db.json disk file:", e);
  }
}

// Memory Stores for zero-latency operations
const MEMORY_USERS = new Map<string, User>();

// Initialize memory users from disk
const initialDisk = readDiskDb();
if (initialDisk.users && initialDisk.users.length > 0) {
  initialDisk.users.forEach((u) => {
    if (u.email) {
      MEMORY_USERS.set(u.email.toLowerCase().trim(), {
        ...u,
        email: u.email.toLowerCase().trim(),
        passwordHash: u.passwordHash || DEFAULT_ADMIN_HASH,
      });
    }
  });
}

const MEMORY_NEWSLETTERS = new Map<string, Newsletter>();
const MEMORY_VERIFICATION_CODES = new Map<string, { code: string; expiresAt: number }>();
const MEMORY_WHOLESALE: WholesaleApplication[] = initialDisk.wholesale || [];

export const db = {
  // --- PRODUCTS MANAGEMENT ---
  async getProducts(): Promise<DoorProduct[]> {
    const productMap = new Map<string, DoorProduct>();

    // 1. Seed with bundled catalogue products
    DOOR_PRODUCTS.forEach((p) => productMap.set(p.id, p));

    // 2. Overlay disk DB custom additions or modifications
    try {
      const disk = readDiskDb();
      const deleted = new Set(disk.deletedProductIds || []);

      if (disk.products && disk.products.length > 0) {
        disk.products.forEach((p) => {
          if (p && p.id && !deleted.has(p.id)) {
            const existing = productMap.get(p.id);
            productMap.set(p.id, { ...(existing || {}), ...p });
          }
        });
      }

      // 3. Filter out any explicitly deleted product IDs
      deleted.forEach((id) => productMap.delete(id));
    } catch (e) {
      console.warn("[DB] Error reading disk DB in getProducts:", e);
    }

    return Array.from(productMap.values());
  },

  async getProductById(id: string): Promise<DoorProduct | null> {
    const all = await this.getProducts();
    const query = id.toLowerCase().trim();
    return (
      all.find(
        (p) =>
          p.id.toLowerCase() === query ||
          (p.slug && p.slug.toLowerCase() === query)
      ) || null
    );
  },

  async saveProduct(product: DoorProduct): Promise<DoorProduct> {
    const disk = readDiskDb();
    if (!disk.products) disk.products = [];
    if (!disk.deletedProductIds) disk.deletedProductIds = [];

    // Remove from deleted list if re-added
    disk.deletedProductIds = disk.deletedProductIds.filter(
      (id) => id !== product.id && id !== product.slug
    );

    const idx = disk.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      disk.products[idx] = { ...disk.products[idx], ...product };
    } else {
      disk.products.unshift(product);
    }

    writeDiskDb(disk);
    return product;
  },

  async createProduct(product: Omit<DoorProduct, "id"> | DoorProduct): Promise<DoorProduct> {
    const docId = ("id" in product && product.id) ? product.id : `prod-${Date.now()}`;
    const newProd: DoorProduct = { ...product, id: docId } as DoorProduct;
    return await this.saveProduct(newProd);
  },

  async updateProduct(id: string, updatedFields: Partial<DoorProduct>): Promise<DoorProduct | null> {
    const all = await this.getProducts();
    const existing = all.find((p) => p.id === id || p.slug === id);
    if (!existing) return null;

    const merged: DoorProduct = { ...existing, ...updatedFields, id: existing.id };
    await this.saveProduct(merged);
    return merged;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const disk = readDiskDb();
      if (!disk.deletedProductIds) disk.deletedProductIds = [];
      if (!disk.deletedProductIds.includes(id)) {
        disk.deletedProductIds.push(id);
      }
      if (disk.products) {
        disk.products = disk.products.filter((p) => p.id !== id);
      }
      writeDiskDb(disk);
      return true;
    } catch {
      return false;
    }
  },

  // --- ORDERS MANAGEMENT ---
  async getOrders(): Promise<Order[]> {
    const disk = readDiskDb();
    return disk.orders || [];
  },

  async getOrdersByEmail(email: string): Promise<Order[]> {
    const cleanEmail = email.toLowerCase().trim();
    const all = await this.getOrders();
    return all.filter((o) => o.email && o.email.toLowerCase().trim() === cleanEmail);
  },

  async createOrder(order: Omit<Order, "id" | "date">): Promise<Order> {
    const cleanEmail = order.email.toLowerCase().trim();
    const generatedOrderId = "ABD-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toISOString().split("T")[0];

    const newOrder: Order = {
      id: generatedOrderId,
      email: cleanEmail,
      customerName: order.customerName || "Valued Customer",
      items: order.items,
      total: Number(order.total),
      date: dateStr,
      status: order.status || "pending",
      paymentMethod: order.paymentMethod,
      paymentProofUrl: order.paymentProofUrl,
    };

    try {
      const disk = readDiskDb();
      if (!disk.orders) disk.orders = [];
      disk.orders.unshift(newOrder);
      writeDiskDb(disk);
    } catch (e) {
      console.warn("[DB] Error saving order to disk:", e);
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<boolean> {
    try {
      const disk = readDiskDb();
      if (!disk.orders) return false;
      const order = disk.orders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        writeDiskDb(disk);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // --- USER MANAGEMENT ---
  async getUsers(): Promise<User[]> {
    const disk = readDiskDb();
    const userMap = new Map<string, User>();

    MEMORY_USERS.forEach((u, email) => userMap.set(email.toLowerCase(), u));
    (disk.users || []).forEach((u) => {
      if (u.email) userMap.set(u.email.toLowerCase().trim(), u);
    });

    return Array.from(userMap.values());
  },

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const isConfiguredAdmin = !!(envAdminEmail && cleanEmail === envAdminEmail);

    // 1. Check memory map
    const memUser = MEMORY_USERS.get(cleanEmail);
    if (memUser) return memUser;

    // 2. Check disk
    const disk = readDiskDb();
    const diskUser = (disk.users || []).find((u) => u.email && u.email.toLowerCase().trim() === cleanEmail);
    if (diskUser) {
      const user: User = {
        email: cleanEmail,
        name: diskUser.name || cleanEmail.split("@")[0],
        role: diskUser.role || (isConfiguredAdmin ? "admin" : "user"),
        joinDate: diskUser.joinDate || new Date().toISOString().split("T")[0],
        newsletterSubscribed: !!diskUser.newsletterSubscribed,
        passwordHash: diskUser.passwordHash || (isConfiguredAdmin ? DEFAULT_ADMIN_HASH : ""),
      };
      MEMORY_USERS.set(cleanEmail, user);
      return user;
    }

    // 3. Fallback configured admin from environment if matched
    if (isConfiguredAdmin) {
      const defaultAdmin: User = {
        email: cleanEmail,
        name: "Primary Administrator",
        role: "admin",
        joinDate: "Primary Account",
        newsletterSubscribed: true,
        passwordHash: DEFAULT_ADMIN_HASH,
      };
      MEMORY_USERS.set(cleanEmail, defaultAdmin);
      return defaultAdmin;
    }

    return null;
  },

  async createUser(newUser: Partial<Omit<User, "passwordHash">> & { email: string; password?: string; passwordHash?: string }): Promise<User> {
    const cleanEmail = newUser.email.toLowerCase().trim();
    if (!cleanEmail) {
      throw new Error("Email address is required to create an account.");
    }

    let passwordHash = newUser.passwordHash || "";
    if (!passwordHash && newUser.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(newUser.password, salt);
    }
    if (!passwordHash) {
      const randomPassword = Math.random().toString(36).substring(2, 12);
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(randomPassword, salt);
    }

    const envAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const isConfiguredAdmin = !!(envAdminEmail && cleanEmail === envAdminEmail);

    const createdUser: User = {
      email: cleanEmail,
      name: newUser.name ? newUser.name.trim() : cleanEmail.split("@")[0],
      role: newUser.role || (isConfiguredAdmin ? "admin" : "user"),
      joinDate: newUser.joinDate || new Date().toISOString().split("T")[0],
      newsletterSubscribed: !!newUser.newsletterSubscribed,
      passwordHash,
    };

    MEMORY_USERS.set(cleanEmail, createdUser);

    try {
      const disk = readDiskDb();
      if (!disk.users) disk.users = [];
      const existingIdx = disk.users.findIndex((u) => u.email && u.email.toLowerCase().trim() === cleanEmail);
      if (existingIdx >= 0) {
        disk.users[existingIdx] = createdUser;
      } else {
        disk.users.push(createdUser);
      }
      writeDiskDb(disk);
    } catch (e) {
      console.warn("[DB] Error saving user to disk:", e);
    }

    return createdUser;
  },

  async updateUserRole(email: string, role: "admin" | "editor" | "user"): Promise<boolean> {
    return this.updateUserData(email, { role });
  },

  async updateUserData(email: string, fields: Partial<Omit<User, "email">>): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const memUser = MEMORY_USERS.get(cleanEmail);
    if (memUser) {
      Object.assign(memUser, fields);
      MEMORY_USERS.set(cleanEmail, memUser);
    }

    try {
      const disk = readDiskDb();
      if (!disk.users) disk.users = [];
      const item = disk.users.find((u) => u.email && u.email.toLowerCase().trim() === cleanEmail);
      if (item) {
        Object.assign(item, fields);
        writeDiskDb(disk);
      }
    } catch {}

    return true;
  },

  async deleteUser(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    MEMORY_USERS.delete(cleanEmail);
    try {
      const disk = readDiskDb();
      if (disk.users) {
        disk.users = disk.users.filter((u) => !u.email || u.email.toLowerCase().trim() !== cleanEmail);
        writeDiskDb(disk);
      }
      return true;
    } catch {
      return false;
    }
  },

  // --- NEWSLETTER SUBSCRIPTIONS ---
  async getNewsletters(): Promise<Newsletter[]> {
    const disk = readDiskDb();
    return disk.newsletters || Array.from(MEMORY_NEWSLETTERS.values());
  },

  async subscribeNewsletter(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const item: Newsletter = { email: cleanEmail, subscribedAt: new Date().toISOString() };
    MEMORY_NEWSLETTERS.set(cleanEmail, item);

    try {
      const disk = readDiskDb();
      if (!disk.newsletters) disk.newsletters = [];
      if (!disk.newsletters.some((n) => n.email === cleanEmail)) {
        disk.newsletters.push(item);
        writeDiskDb(disk);
      }
    } catch {}

    return true;
  },

  // --- VERIFICATION CODES ---
  async saveVerificationCode(email: string, code: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    MEMORY_VERIFICATION_CODES.set(cleanEmail, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
  },

  async verifyVerificationCode(email: string, code: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const memData = MEMORY_VERIFICATION_CODES.get(cleanEmail);
    if (memData) {
      if (memData.code === code && memData.expiresAt > Date.now()) {
        MEMORY_VERIFICATION_CODES.delete(cleanEmail);
        return true;
      }
    }
    return false;
  },

  // --- SETTINGS ---
  async getSettings(): Promise<Settings> {
    const disk = readDiskDb();
    const defaults: Settings = {
      promoText: "Nationwide delivery on all Turkish armoured steel security doors & bathroom doors",
      geoRedirectEnabled: false,
      defaultCurrency: "NGN",
      exchangeRate: 1,
      allowSignups: true,
      heroTitle: "Heavy-Gauge Steel Security Doors & Building Fittings",
      heroSubtitle: "Direct Importer of Turkish Security Doors, Luxury Room Doors & Sanitary Wares",
      heroCtaText: "Explore Catalogue",
      heroCtaLink: "/shop",
      companyName: DEFAULT_SITE_SETTINGS.companyName,
      parentCompany: DEFAULT_SITE_SETTINGS.parentCompany,
      proprietor: DEFAULT_SITE_SETTINGS.proprietor,
      address: DEFAULT_SITE_SETTINGS.address,
      marketLocation: DEFAULT_SITE_SETTINGS.marketLocation,
      phone: DEFAULT_SITE_SETTINGS.phone,
      phoneDisplay: DEFAULT_SITE_SETTINGS.phoneDisplay,
      whatsappNumber: DEFAULT_SITE_SETTINGS.whatsappNumber,
      salesEmail: DEFAULT_SITE_SETTINGS.salesEmail,
      workingHours: DEFAULT_SITE_SETTINGS.workingHours,
      cacNumber: DEFAULT_SITE_SETTINGS.cacNumber,
      cacRegistrationDate: DEFAULT_SITE_SETTINGS.cacRegistrationDate,
      cacStatus: DEFAULT_SITE_SETTINGS.cacStatus,
      instagramUrl: DEFAULT_SITE_SETTINGS.instagramUrl,
      jijiShopUrl: DEFAULT_SITE_SETTINGS.jijiShopUrl,
      githubUrl: DEFAULT_SITE_SETTINGS.githubUrl,
      whatsappInquiryTemplate: DEFAULT_SITE_SETTINGS.whatsappInquiryTemplate,
      whatsappCartTemplate: DEFAULT_SITE_SETTINGS.whatsappCartTemplate,
      deliverySummaryHeading: DEFAULT_SITE_SETTINGS.deliverySummaryHeading,
      deliverySummaryText: DEFAULT_SITE_SETTINGS.deliverySummaryText,
      deliveryRegions: DEFAULT_SITE_SETTINGS.deliveryRegions,
      deliveryPackagingNote: DEFAULT_SITE_SETTINGS.deliveryPackagingNote,
      preDispatchInspectionNote: DEFAULT_SITE_SETTINGS.preDispatchInspectionNote,
    };

    if (disk.settings) {
      return { ...defaults, ...disk.settings };
    }
    return defaults;
  },

  async updateSettings(updatedSettings: Partial<Settings>): Promise<Settings> {
    const current = await this.getSettings();
    const merged = { ...current, ...updatedSettings };
    const disk = readDiskDb();
    disk.settings = merged;
    writeDiskDb(disk);
    return merged;
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    const disk = readDiskDb();
    if (disk.reviews && disk.reviews.length > 0) {
      return disk.reviews;
    }
    return [
      {
        id: "rev-1",
        author: "Chief Emeka O.",
        rating: 5,
        date: "October 12, 2026",
        title: "Top quality steel doors delivered to Awka site",
        comment: "Supplied 14 Turkish security doors and HDF interior doors for my duplex project. Heavy gauge steel, neat lock mechanisms, and direct waybill delivery was smooth.",
        verified: true,
        productName: "Bullet Proof Security Door",
      },
      {
        id: "rev-2",
        author: "Engr. Kenneth M.",
        rating: 5,
        date: "October 5, 2026",
        title: "Solid construction fittings and reliable warehouse",
        comment: "Inspected at Maraim Plaza Building Material Ogidi warehouse before purchase. Frank provided accurate wall measurements and prompt loading.",
        verified: true,
        productName: "Italian Copper Finish Door",
      },
    ];
  },

  async createReview(review: Omit<Review, "id">): Promise<Review> {
    const newId = `rev-${Date.now()}`;
    const fullReview: Review = { id: newId, ...review };
    const disk = readDiskDb();
    if (!disk.reviews) disk.reviews = [];
    disk.reviews.unshift(fullReview);
    writeDiskDb(disk);
    return fullReview;
  },

  async deleteReview(id: string): Promise<boolean> {
    const disk = readDiskDb();
    if (disk.reviews) {
      disk.reviews = disk.reviews.filter((r) => r.id !== id);
      writeDiskDb(disk);
      return true;
    }
    return false;
  },

  // --- FAQS ---
  async getFaqs(): Promise<FaqItem[]> {
    const disk = readDiskDb();
    if (disk.faqs && disk.faqs.length > 0) {
      return disk.faqs;
    }
    return [
      {
        id: "faq-1",
        category: "Product & Specifications",
        question: "What wall opening sizes do your security doors come in?",
        answer: "Our standard security doors are available in 3ft (900mm x 2100mm) and 4ft (1200mm x 2100mm / 1500mm x 2100mm for luxury double doors). Custom dimensions can also be confirmed with our sales desk on WhatsApp.",
      },
      {
        id: "faq-2",
        category: "Ordering & Delivery",
        question: "Do you deliver doors outside Anambra State?",
        answer: "Yes, we handle nationwide waybill delivery and logistics across Delta (Asaba), Enugu, Imo, Lagos, Abuja, Port Harcourt, and other states with verified packing and loading from our warehouse.",
      },
      {
        id: "faq-3",
        category: "Registration & Verification",
        question: "Is CFrank Enterprise / Anambra Best Door registered with CAC?",
        answer: "Yes, CFrank Enterprise is registered with the Corporate Affairs Commission (CAC BN: 9943925) for specialized building completion and construction activities.",
      },
    ];
  },

  async updateFaqs(items: FaqItem[]): Promise<FaqItem[]> {
    const disk = readDiskDb();
    disk.faqs = items;
    writeDiskDb(disk);
    return items;
  },

  // --- WHOLESALE APPLICATIONS ---
  async getWholesaleApplications(): Promise<WholesaleApplication[]> {
    const disk = readDiskDb();
    return disk.wholesale || MEMORY_WHOLESALE;
  },

  async createWholesaleApplication(data: Omit<WholesaleApplication, "id" | "submittedAt" | "status">): Promise<WholesaleApplication> {
    const newId = `ws-${Date.now()}`;
    const newApp: WholesaleApplication = {
      id: newId,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      email: data.email,
      estimatedVolume: data.estimatedVolume,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    MEMORY_WHOLESALE.unshift(newApp);
    const disk = readDiskDb();
    if (!disk.wholesale) disk.wholesale = [];
    disk.wholesale.unshift(newApp);
    writeDiskDb(disk);
    return newApp;
  },

  async updateWholesaleApplicationStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<boolean> {
    const disk = readDiskDb();
    if (disk.wholesale) {
      const item = disk.wholesale.find((w) => w.id === id);
      if (item) {
        item.status = status;
        writeDiskDb(disk);
        return true;
      }
    }
    return false;
  },

  async deleteWholesaleApplication(id: string): Promise<boolean> {
    const disk = readDiskDb();
    if (disk.wholesale) {
      disk.wholesale = disk.wholesale.filter((w) => w.id !== id);
      writeDiskDb(disk);
      return true;
    }
    return false;
  },

  // --- AUTH UTILS & TOKENS ---
  generateToken(user: Omit<User, "passwordHash">): string {
    return jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  },

  verifyToken(token: string): Omit<User, "passwordHash"> | null {
    try {
      return jwt.verify(token, JWT_SECRET) as Omit<User, "passwordHash">;
    } catch {
      return null;
    }
  },
};
