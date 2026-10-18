import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
  db as firestore, 
  handleFirestoreError, 
  OperationType,
  withTimeout
} from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";

export interface User {
  email: string;
  name: string;
  role: "admin" | "user";
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

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  subcategory: string;
  badge?: string | null;
  active: boolean;
  stock: number;
  ingredients: string[];
  skinConcerns?: string[];
  handle?: string;
  featured?: boolean;
  kendallFav?: boolean;
}

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
  firestoreDocId?: string;
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
  telegramBotToken?: string;
  telegramChatId?: string;
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankInstructions?: string;
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

import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "anua-clean-skincare-secret-key-2026";

const DEFAULT_ADMIN_HASH = bcrypt.hashSync("admin123", 10);

const DB_FILE_PATH = path.join(process.cwd(), "db.json");

function readDiskDb(): { users: User[]; products: Product[]; orders: Order[] } {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        products: Array.isArray(parsed.products) ? parsed.products : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      };
    }
  } catch (e) {
    console.warn("[DB] Error reading db.json disk file:", e);
  }
  return { users: [], products: [], orders: [] };
}

function writeDiskDb(data: { users?: User[]; products?: Product[]; orders?: Order[] }) {
  try {
    const current = readDiskDb();
    const updated = {
      users: data.users !== undefined ? data.users : current.users,
      products: data.products !== undefined ? data.products : current.products,
      orders: data.orders !== undefined ? data.orders : current.orders,
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e) {
    console.warn("[DB] Error writing to db.json disk file:", e);
  }
}

// Seed memory users from disk db if present
const initialDiskDb = readDiskDb();

// Global in-memory fallback stores for high-availability auth
const MEMORY_USERS = new Map<string, User>([
  [
    "help.anuaglobal@gmail.com",
    {
      email: "help.anuaglobal@gmail.com",
      name: "Anua (God Admin)",
      role: "admin",
      joinDate: "2026-01-01",
      newsletterSubscribed: true,
      passwordHash: DEFAULT_ADMIN_HASH,
    },
  ],
  [
    "admin@anua.com",
    {
      email: "admin@anua.com",
      name: "ANUA Admin",
      role: "admin",
      joinDate: "2026-01-01",
      newsletterSubscribed: true,
      passwordHash: DEFAULT_ADMIN_HASH,
    },
  ],
]);

// Initialize MEMORY_USERS with disk users
if (initialDiskDb.users) {
  initialDiskDb.users.forEach((u) => {
    if (u.email) {
      MEMORY_USERS.set(u.email.toLowerCase().trim(), {
        ...u,
        email: u.email.toLowerCase().trim(),
      });
    }
  });
}

const MEMORY_NEWSLETTERS = new Map<string, Newsletter>();
const MEMORY_VERIFICATION_CODES = new Map<string, { code: string; expiresAt: number }>();
const MEMORY_WHOLESALE: WholesaleApplication[] = [];

// Initial seed products for Anua Skincare storefront
const SEED_PRODUCTS: Omit<Product, "id">[] = [
  {
    name: "PDRN Collagen Glow Facial Serum Spray",
    description: "Instant glass skin on the go. Formulated with vegan PDRN, low-molecular-weight collagen, and nourishing botanical oils to give an immediate radiant, dewy finish while boosting elasticity and skin-barrier strength.",
    price: 25,
    originalPrice: 25,
    rating: 4.8,
    reviewsCount: 78,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
    category: "Best Sellers",
    subcategory: "Serum",
    badge: "BEST SELLER",
    active: true,
    stock: 45,
    ingredients: ["Vegan PDRN","Collagen Extract","Niacinamide","Squalane","Centella Asiatica"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Azelaic Acid 10 Hyaluronic Acid Soothing Serum",
    description: "A powerful soothing treatment targeting acne blemishes, dark spots, and redness. Contains 10% pure Azelaic Acid to refine texture, minimize pores, and calm sensitive breakout-prone skin.",
    price: 24,
    originalPrice: 24,
    rating: 4.7,
    reviewsCount: 115,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-azelaic-acid-10-hyaluron-redness-soothing-serum-10ml-1245700569.jpg?v=1782191112",
    category: "Best Sellers",
    subcategory: "Serum",
    badge: "BEST SELLER",
    active: true,
    stock: 32,
    ingredients: ["Azelaic Acid 10%","Hyaluronic Acid","Panthenol","Allantoin","Licorice Root"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "PDRN Hyaluronic Acid 100 Moisturizing Cream",
    description: "Deep cellular locking hydration cream. Infused with skin-renewing PDRN and five weights of Hyaluronic Acid to create a non-greasy moisture barrier, leaving skin plump, bouncy, and deeply hydrated.",
    price: 25,
    originalPrice: 25,
    rating: 4.9,
    reviewsCount: 91,
    image: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    category: "Best Sellers",
    subcategory: "Moisturizer",
    badge: "BEST SELLER",
    active: true,
    stock: 50,
    ingredients: ["PDRN 1%","Multi-Hyaluronic Acid","Ceramide NP","Shea Butter","Adenosine"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Niacinamide 10 + TXA 4 Serum for Brightening and Dark Spots",
    description: "An advanced dark spot corrector and tone-evening complex. Combines 10% Niacinamide and 4% Tranexamic Acid to effectively fade stubborn post-breakout marks, sun spots, and melasma.",
    price: 24,
    originalPrice: 24,
    rating: 4.8,
    reviewsCount: 686,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop",
    category: "Best Sellers",
    subcategory: "Serum",
    badge: "BEST SELLER",
    active: true,
    stock: 120,
    ingredients: ["Niacinamide 10%","Tranexamic Acid 4%","Glutathione","Alpha-Arbutin","Beta-Glucan"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Double Cleansing Duo Set",
    description: "The ultimate pore-clearing routine. Contains Anua’s legendary Heartleaf Pore Control Cleansing Oil to melt away sebum and waterproof makeup, paired with our hydrating foam cleanser for a pristine double-cleanse.",
    price: 38,
    originalPrice: 42,
    rating: 4.9,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    category: "Best Sellers",
    subcategory: "Cleanser",
    badge: "BOGO",
    active: true,
    stock: 25,
    ingredients: ["Heartleaf Extract","Jojoba Seed Oil","Olive Fruit Oil","Grape Seed Oil","Salicylic Acid"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Zero-cast Moisturizing Fresh Sunscreen",
    description: "A revolutionary, ultra-light daily sunscreen providing SPF 50+ PA++++ chemical protection. Glides on like a water cream with zero white cast, zero stickiness, and is loaded with soothing Heartleaf extract.",
    price: 18,
    originalPrice: 18,
    rating: 4.7,
    reviewsCount: 85,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
    category: "SPF Collection",
    subcategory: "Sunscreen",
    badge: "BEST SELLER",
    active: true,
    stock: 75,
    ingredients: ["Diethylamino Hydroxybenzoyl Hexyl Benzoate","Ethylhexyl Triazone","Heartleaf Extract","Centella Asiatica"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Invisible Glow Fresh Sunstick",
    description: "Ultra-portable sun protection that leaves a natural, luminous glow. Easily reapplied over makeup without smudging, providing a cooling effect and sebum control throughout hot summer days.",
    price: 10.8,
    originalPrice: 12,
    rating: 4.6,
    reviewsCount: 16,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop",
    category: "SPF Collection",
    subcategory: "Sunscreen",
    badge: "NEW",
    active: true,
    stock: 60,
    ingredients: ["Silica","Tocopheryl Acetate","Camellia Sinensis Leaf Extract","Licorice Root Extract"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Invisible Matte Sunscreen",
    description: "A weightless physical sunscreen offering SPF 50+ broad-spectrum shield with a beautiful velvety, zero-shine matte finish. Perfect for oily and combination skin types under humid weather.",
    price: 22,
    originalPrice: 22,
    rating: 4.5,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
    category: "SPF Collection",
    subcategory: "Sunscreen",
    badge: "NEW",
    active: true,
    stock: 40,
    ingredients: ["Zinc Oxide","Titanium Dioxide","Tea Tree Leaf Extract","Silica","Aloe Vera Juice"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Heartleaf 77% Soothing Toner",
    description: "The viral, award-winning toner that perfectly prep, calms, and hydrates sensitive skin. Infused with 77% Heartleaf extract grown in Korea, it is clinically proven to soothe redness, control acne, and rebalance oils.",
    price: 23,
    originalPrice: 23,
    rating: 4.9,
    reviewsCount: 1450,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop",
    category: "Kendall Essentials",
    subcategory: "Toner",
    badge: "BEST SELLER",
    active: true,
    stock: 95,
    ingredients: ["Houttuynia Cordata (Heartleaf) Extract 77%","Centella Asiatica","Chamomile Extract","Portulaca Oleracea","Apple Fruit Extract"],
    subtitle: "",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Sun-Ready Travel Kit",
    description: "[PERFECT FOR TRAVEL &amp; ON-THE-GO] A must-have Anua's set of mini essentials, perfectly sized for travel and daily adventures.",
    price: 35,
    originalPrice: 42,
    rating: 4.6,
    reviewsCount: 450,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-bundle-sun-ready-travel-kit-1239193754.jpg?v=1779176049",
    category: "Sunscreen",
    subcategory: "SPF Protection",
    badge: "BESTSELLER",
    active: true,
    stock: 100,
    ingredients: ["off bestseller","☆BLACKHEADS","☆BUNDLE","☆NEW"],
    skinConcerns: ["Blackheads & Clogged Pores"],
    handle: "sun-ready-travel-kit",
    subtitle: "SPF Protection · Sunscreen",
    featured: true,
    kendallFav: true,
  },
  {
    name: "Serum Mini Discovery Set",
    description: "[3 BEST SERUMS, ONE POWER KIT] A compact and lightweight serum kit featuring 3 essentials for daily skincare, perfect for on-the-go routines and starting their skincare journey.",
    price: 35,
    originalPrice: 42,
    rating: 4.7,
    reviewsCount: 770,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-ampoule-serum-serum-mini-discovery-set-serum-mini-discovery-set-1186763653.jpg?v=1755853888",
    category: "Serum & Ampoule",
    subcategory: "Glass Skin Serum",
    badge: "BESTSELLER",
    active: true,
    stock: 100,
    ingredients: ["☆BUNDLE","☆DRYNESS","☆NEW","☆SERUM"],
    skinConcerns: ["Dryness & Skin Barrier"],
    handle: "serum-mini-discovry-set",
    subtitle: "Glass Skin Serum · Serum & Ampoule",
    featured: true,
    kendallFav: false,
  },
  {
    name: "Heartleaf 77 Soothing Toner",
    description: "#1 Bestseller Facial Toner on Amazon A soothing toner formulated with Heartleaf Extract, designed to calm irritation and moisturize the skin.",
    price: 23,
    originalPrice: 27.6,
    rating: 4.8,
    reviewsCount: 1090,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-toner-heartleaf-77-soothing-toner-1239193744.jpg?v=1779181932",
    category: "Toner & Pad",
    subcategory: "Soothing Toner",
    badge: "BESTSELLER",
    active: true,
    stock: 100,
    ingredients: ["☆BEST","☆DRYNESS","☆HEARTLEAF","☆Memorial","☆TEXTURE"],
    skinConcerns: ["Acne","Sensitive","Dryness & Skin Barrier"],
    handle: "heartleaf-77-soothing-toner-1",
    subtitle: "Soothing Toner · Toner & Pad",
    featured: true,
    kendallFav: true,
  },
  {
    name: "BHA 2% Gentle Exfoliating Toner",
    description: "A gentle exfoliating toner formulated with 2% BHA, designed to exfoliate dead skin cells, help clogged pores, and improve skin clarity and balance.",
    price: 20,
    originalPrice: 24,
    rating: 4.8,
    reviewsCount: 1410,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-toner-150ml-bha-2-gentle-exfoliating-toner-1161173069.png?v=1767594654",
    category: "Toner & Pad",
    subcategory: "Soothing Toner",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆ACNE","☆BEST","☆BHA","☆BLACKHEADS","☆Memorial"],
    skinConcerns: ["Acne","Sensitive","Blackheads & Clogged Pores"],
    handle: "bha-2-gentle-exfoliating-toner",
    subtitle: "Soothing Toner · Toner & Pad",
    featured: true,
    kendallFav: false,
  },
  {
    name: "7-Day Glass Skin Set",
    description: "Experience the look of glass skin in as little as 7 days. This all-in-one routine is designed to visibly improve multiple skin concerns, including the appearance of dark spots, visible redness, pores, and dryness, while supporting a healthy-looking skin barrier.",
    price: 125,
    originalPrice: 157,
    rating: 4.9,
    reviewsCount: 1730,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-bundle-7-day-glass-skin-set-1252990122.jpg?v=1785905829",
    category: "Best Sellers",
    subcategory: "Skincare Essential",
    badge: "VALUE SET",
    active: true,
    stock: 100,
    ingredients: ["Best(new)","☆BUNDLE"],
    skinConcerns: ["Blackheads & Clogged Pores","Dark Spots","Dullness","Dryness & Skin Barrier"],
    handle: "7-day-glass-skin-set",
    subtitle: "Skincare Essential · Best Sellers",
    featured: true,
    kendallFav: true,
  },
  {
    name: "Clear Skin Essentials Set",
    description: "A 4-step routine to clarify pores and help prevent future breakouts. Powered by our bestselling Azelaic Acid Serum for acne-prone skin and our NEW dermatologist-approved Intensive Cream to soothe and stregthen the skin barrier.",
    price: 86,
    originalPrice: 96,
    rating: 4.6,
    reviewsCount: 2050,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-bundle-clear-skin-essentials-set-1252990123.jpg?v=1785905891",
    category: "Best Sellers",
    subcategory: "Skincare Essential",
    badge: "VALUE SET",
    active: true,
    stock: 100,
    ingredients: ["☆ACNE","☆Azelaic","☆BUNDLE","☆SENSITIVE"],
    skinConcerns: ["Acne","Sensitive","Blackheads & Clogged Pores","Dryness & Skin Barrier"],
    handle: "clear-skin-essentials-set",
    subtitle: "Skincare Essential · Best Sellers",
    featured: true,
    kendallFav: false,
  },
  {
    name: "Heartleaf Quercetinol Pore Deep Cleansing Foam (25ml)",
    description: "Heartleaf Quercetinol Pore Deep Cleansing Foam (25ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.7,
    reviewsCount: 2370,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-heartleaf-quercetinol-pore-deep-cleansing-foam-25ml-1245700561.jpg?v=1782190749",
    category: "Cleanser",
    subcategory: "Cleansing Oil",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["GWP","GWP2","samples"],
    skinConcerns: ["Acne","Sensitive","Blackheads & Clogged Pores"],
    handle: "heartleaf-quercetinol-pore-deep-cleansing-foam-25ml",
    subtitle: "Cleansing Oil · Cleanser",
    featured: true,
    kendallFav: true,
  },
  {
    name: "Heartleaf Pore Control Cleansing Oil (20ml)",
    description: "Heartleaf Pore Control Cleansing Oil (20ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.8,
    reviewsCount: 2690,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-heartleaf-pore-control-cleansing-oil-20ml-1245864647.jpg?v=1782277089",
    category: "Cleanser",
    subcategory: "Cleansing Oil",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["GWP","GWP2","samples"],
    skinConcerns: ["Acne","Sensitive","Blackheads & Clogged Pores"],
    handle: "heartleaf-pore-control-cleansing-oil-20ml",
    subtitle: "Cleansing Oil · Cleanser",
    featured: true,
    kendallFav: true,
  },
  {
    name: "PDRN 100 Hyaluronic Acid Glow Pad (10ea)",
    description: "PDRN 100 Hyaluronic Acid Glow Pad (10ea) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.8,
    reviewsCount: 3010,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-pdrn-100-hyaluronic-acid-glow-pad-10ea-1245700563.jpg?v=1782190813",
    category: "Toner & Pad",
    subcategory: "Soothing Toner",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["GWP","GWP2","samples"],
    skinConcerns: ["Signs of Aging","Textural Irregularities"],
    handle: "pdrn-100-hyaluronic-acid-glow-pad-10ea",
    subtitle: "Soothing Toner · Toner & Pad",
    featured: false,
    kendallFav: true,
  },
  {
    name: "PDRN Hyaluronic Acid 100 Moisturizing Cream (30ml)",
    description: "PDRN Hyaluronic Acid 100 Moisturizing Cream (30ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.9,
    reviewsCount: 3330,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-pdrn-hyaluronic-acid-100-moisturizing-cream-30ml-1245700564.jpg?v=1782190870",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["GWP2","samples"],
    skinConcerns: ["Dryness & Skin Barrier","Signs of Aging","Textural Irregularities"],
    handle: "pdrn-hyaluronic-acid-100-moisturizing-cream-30ml",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: true,
  },
  {
    name: "PDRN Hyaluronic Acid Moisturizing Cleansing Foam (40ml)",
    description: "PDRN Hyaluronic Acid Moisturizing Cleansing Foam (40ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.6,
    reviewsCount: 3650,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-pdrn-hyaluronic-acid-moisturizing-cleansing-foam-40ml-1245700565.jpg?v=1782190931",
    category: "Cleanser",
    subcategory: "Cleansing Oil",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["GWP2","samples"],
    skinConcerns: ["Blackheads & Clogged Pores","Dryness & Skin Barrier","Signs of Aging","Textural Irregularities"],
    handle: "pdrn-hyaluronic-acid-moisturizing-cleansing-foam-40ml",
    subtitle: "Cleansing Oil · Cleanser",
    featured: false,
    kendallFav: true,
  },
  {
    name: "PDRN 100 Hyaluronic Acid Booster Toner (40ml)",
    description: "PDRN 100 Hyaluronic Acid Booster Toner (40ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.7,
    reviewsCount: 3970,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-pdrn-100-hyaluronic-acid-booster-toner-40ml-1245700566.jpg?v=1782190994",
    category: "Toner & Pad",
    subcategory: "Soothing Toner",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["GWP2","samples"],
    skinConcerns: ["Signs of Aging","Textural Irregularities"],
    handle: "pdrn-100-hyaluronic-acid-booster-toner-40ml",
    subtitle: "Soothing Toner · Toner & Pad",
    featured: false,
    kendallFav: true,
  },
  {
    name: "PDRN Hyaluronic Acid Capsule 100 Serum (10ml)",
    description: "PDRN Hyaluronic Acid Capsule 100 Serum (10ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.8,
    reviewsCount: 4290,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-pdrn-hyaluronic-acid-capsule-100-serum-10ml-1245700567.jpg?v=1782191051",
    category: "Serum & Ampoule",
    subcategory: "Glass Skin Serum",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["GWP2","samples"],
    skinConcerns: ["Signs of Aging","Textural Irregularities"],
    handle: "pdrn-hyaluronic-acid-capsule-100-serum-10ml",
    subtitle: "Glass Skin Serum · Serum & Ampoule",
    featured: false,
    kendallFav: true,
  },
  {
    name: "Azelaic Acid 10 Hyaluron Redness Soothing Serum (10ml)",
    description: "Azelaic Acid 10 Hyaluron Redness Soothing Serum (10ml) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.8,
    reviewsCount: 4610,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-azelaic-acid-10-hyaluron-redness-soothing-serum-10ml-1245700569.jpg?v=1782191112",
    category: "Serum & Ampoule",
    subcategory: "Glass Skin Serum",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["GWP2","samples"],
    skinConcerns: ["Acne","Sensitive"],
    handle: "azelaic-acid-10-hyaluron-redness-soothing-serum-10ml",
    subtitle: "Glass Skin Serum · Serum & Ampoule",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Niacinamide 10 TXA 4 Serum for Brightening and Dark Spots (10ml)",
    description: "A serum formulated with 10% Niacinamide and 4% TXA, designed to look more radiant and balanced.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.9,
    reviewsCount: 4930,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-niacinamide-10-txa-4-serum-for-brightening-and-dark-spots-10ml-1245700570.jpg?v=1782191170",
    category: "Serum & Ampoule",
    subcategory: "Glass Skin Serum",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["GWP2","samples"],
    skinConcerns: ["Dark Spots","Dullness"],
    handle: "first-purchase-gift-dark-spot-serum-mini",
    subtitle: "Glass Skin Serum · Serum & Ampoule",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Niacinamide 5 TXA Brightening Pad (10ea)",
    description: "Niacinamide 5 TXA Brightening Pad (10ea) - Premium clean Korean skincare formulation by ANUA.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.6,
    reviewsCount: 5250,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/gwp-2-niacinamide-5-txa-brightening-pad-10ea-1245700568.jpg?v=1782191230",
    category: "Toner & Pad",
    subcategory: "Soothing Toner",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["GWP","GWP2","samples"],
    skinConcerns: ["Dark Spots","Dullness"],
    handle: "50-free-txa-toner-pad-10ea-1",
    subtitle: "Soothing Toner · Toner & Pad",
    featured: false,
    kendallFav: false,
  },
  {
    name: "[Amazon's Choice] PDRN Hyaluronic Acid 100 Moisturising Cream",
    description: "[Amazon's Choice] PDRN Hyaluronic Acid 100 Moisturising Cream - Premium clean Korean skincare formulation by ANUA.",
    price: 39.95,
    originalPrice: 66.58,
    rating: 4.7,
    reviewsCount: 5570,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/hidden-amazon-1-pdrn-hyaluronic-acid-100-moisturizing-cream-1252727818.png?v=1785834130",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["Hidden"],
    skinConcerns: ["Dryness & Skin Barrier","Signs of Aging","Textural Irregularities"],
    handle: "amazon-choice-pdrn-hyaluronic-acid-100-moisturising-cream",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: true,
  },
  {
    name: "Heartleaf Low pH Deep Cleansing Water",
    description: "A cleansing water with a low pH formula and the power of micellar water, experience the lightness of water.",
    price: 22,
    originalPrice: 26.4,
    rating: 4.8,
    reviewsCount: 5890,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-cleanser-heartleaf-low-ph-deep-cleansing-water-1239193737.jpg?v=1779178152",
    category: "Cleanser",
    subcategory: "Cleansing Oil",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆HEARTLEAF","☆SENSITIVE"],
    skinConcerns: ["Acne","Sensitive","Blackheads & Clogged Pores"],
    handle: "heartleaf-low-ph-deep-cleansing-water-1",
    subtitle: "Cleansing Oil · Cleanser",
    featured: false,
    kendallFav: true,
  },
  {
    name: "Invisible Glow Finish Sunstick",
    description: "Portable sunstick design allows easy mess free application and quick reapplication anytime anywhere, ideal for outdoor activities and sports.",
    price: 18,
    originalPrice: 21.6,
    rating: 4.8,
    reviewsCount: 6210,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-sunscreen-invisible-glow-finish-sunstick-1241027759.jpg?v=1780290130",
    category: "Sunscreen",
    subcategory: "SPF Protection",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["Best(new)","☆NEW"],
    skinConcerns: ["Acne","Sensitive"],
    handle: "invisible-glow-finish-sunstick-1",
    subtitle: "SPF Protection · Sunscreen",
    featured: false,
    kendallFav: false,
  },
  {
    name: "3 Ceramide Panthenol Moisture Barrier Cream",
    description: "A hydrating face moisturizer designed to soothe sensitive skin and help maintain the skin’s moisture barrier. This gentle formula locks in moisture to reduce redness caused by dryness and leaves the skin looking refreshed.",
    price: 22,
    originalPrice: 26.4,
    rating: 4.9,
    reviewsCount: 6530,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-3-ceramide-panthenol-moisture-barrier-cream-1239193739.jpg?v=1779177070",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["off bestseller","☆CERAMIDE","☆DRYNESS","☆NEW","☆SENSITIVE"],
    skinConcerns: ["Dryness & Skin Barrier"],
    handle: "3-ceramide-panthenol-moisture-barrier-cream-1",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Recharge Your Summer Skin Full Set",
    description: "Recharge your summer skin with Anua’s most wanted icons. This all-in-one viral routine brings together everything you need to reset your skin—from our viral cleansing duo to the next-gen plumping and barrier-repairing power of PDRN.",
    price: 128,
    originalPrice: 175,
    rating: 4.6,
    reviewsCount: 6850,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-bundle-all-in-one-viral-routine-kit-1245623381.jpg?v=1782118750",
    category: "Best Sellers",
    subcategory: "Skincare Essential",
    badge: "VALUE SET",
    active: true,
    stock: 100,
    ingredients: ["Best(new)","☆AGING","☆BUNDLE","☆NEW"],
    skinConcerns: ["Blackheads & Clogged Pores","Dryness & Skin Barrier","Signs of Aging","Textural Irregularities"],
    handle: "recharge-your-summer-skin-set-copy",
    subtitle: "Skincare Essential · Best Sellers",
    featured: false,
    kendallFav: true,
  },
  {
    name: "Peach 77 Niacin Enriched Cream",
    description: "Lightweight, non-sticky cream incorporates the benefits of fermented peaches and three fermented ingredients to replenish moisture, helping to smooth and soften the skin.",
    price: 26,
    originalPrice: 31.2,
    rating: 4.7,
    reviewsCount: 7170,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-global-moisturizer-peach-77-niacin-enriched-cream-1239201497.jpg?v=1779181630",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: "TRENDING",
    active: true,
    stock: 100,
    ingredients: ["☆DULLNESS","☆NIACINAMIDE","☆PEACH"],
    skinConcerns: ["Dark Spots","Dullness","Dryness & Skin Barrier"],
    handle: "peach-77-niacin-enriched-cream-1",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Barrier Reboot Water Gel Cream",
    description: "Dermatologist co-developed and clinically proven to reduce redness within 30 minutes, this daily formula delivers deep, skin-compatible barrier care without clogging pores.",
    price: 26,
    originalPrice: 31.2,
    rating: 4.8,
    reviewsCount: 7490,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-barrier-reboot-water-gel-cream-1251177200.jpg?v=1785149950",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆DRYNESS","☆NEW","☆SENSITIVE"],
    skinConcerns: ["Blackheads & Clogged Pores","Dryness & Skin Barrier"],
    handle: "barrier-reboot-water-gel-cream-1",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Barrier Reboot Intensive Cream",
    description: "A dermatologist co-developed, fragrance-free cream clinically proven to sustain 120-hour hydration and safely comfort even breakout-prone skin.",
    price: 26,
    originalPrice: 31.2,
    rating: 4.8,
    reviewsCount: 7810,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-barrier-reboot-intensive-cream-1251177202.jpg?v=1785149831",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆DRYNESS","☆NEW","☆SENSITIVE"],
    skinConcerns: ["Dryness & Skin Barrier"],
    handle: "barrier-reboot-intensive-cream-1",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Barrier Reboot Daily Moisturizer",
    description: "A dermatologist co-developed cream clinically proven to deliver 120-hour hydration and visibly reduce redness for a smoother, healthier barrier.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.9,
    reviewsCount: 8130,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-barrier-reboot-daily-moisturizer-1251177201.jpg?v=1785149890",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆DRYNESS","☆NEW"],
    skinConcerns: ["Dryness & Skin Barrier"],
    handle: "barrier-reboot-daily-moisturizer-1",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: true,
  },
  {
    name: "Barrier Reboot Intensive Cream",
    description: "A dermatologist co-developed, fragrance-free cream clinically proven to sustain 120-hour hydration and safely comfort even breakout-prone skin.",
    price: 26,
    originalPrice: 31.2,
    rating: 4.6,
    reviewsCount: 450,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-barrier-reboot-intensive-cream-1251177202.jpg?v=1785149831",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆DRYNESS","☆NEW","☆SENSITIVE"],
    skinConcerns: ["Dryness & Skin Barrier"],
    handle: "barrier-reboot-intensive-cream",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Barrier Reboot Daily Moisturizer",
    description: "A dermatologist co-developed cream clinically proven to deliver 120-hour hydration and visibly reduce redness for a smoother, healthier barrier.",
    price: 24,
    originalPrice: 28.8,
    rating: 4.7,
    reviewsCount: 770,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-barrier-reboot-daily-moisturizer-1251177201.jpg?v=1785149890",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆DRYNESS","☆NEW"],
    skinConcerns: ["Dryness & Skin Barrier"],
    handle: "barrier-reboot-daily-moisturizer",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Barrier Reboot Water Gel Cream",
    description: "Dermatologist co-developed and clinically proven to reduce redness within 30 minutes, this daily formula delivers deep, skin-compatible barrier care without clogging pores.",
    price: 26,
    originalPrice: 31.2,
    rating: 4.8,
    reviewsCount: 1090,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-moisturizer-barrier-reboot-water-gel-cream-1251177200.jpg?v=1785149950",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: null,
    active: true,
    stock: 100,
    ingredients: ["☆DRYNESS","☆NEW","☆SENSITIVE"],
    skinConcerns: ["Blackheads & Clogged Pores","Dryness & Skin Barrier"],
    handle: "barrier-reboot-water-gel-cream",
    subtitle: "Barrier Cream · Moisturizer",
    featured: false,
    kendallFav: false,
  },
  {
    name: "PDRN Hyaluronic Acid Capsule 100 Serum",
    description: "Triple Revitalizing Complex ─ Combining PDRN, Hyaluronic Acid, and Collagen for this formula helps maintain the skin’s natural moisture barrier for hydration and a luminous appearance.",
    price: 30,
    originalPrice: 36,
    rating: 4.8,
    reviewsCount: 1410,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/anua-us-ampoule-serum-pdrn-hyaluronic-acid-capsule-100-serum-1239193734.jpg?v=1779177370",
    category: "Serum & Ampoule",
    subcategory: "Glass Skin Serum",
    badge: "VIRAL PDRN",
    active: true,
    stock: 100,
    ingredients: ["Best(new)","Fly Bundles","☆AGING","☆BEST","☆DRYNESS"],
    skinConcerns: ["Dryness & Skin Barrier","Signs of Aging","Textural Irregularities"],
    handle: "pdrn-hyaluronic-acid-capsule-100-serum-1",
    subtitle: "Glass Skin Serum · Serum & Ampoule",
    featured: false,
    kendallFav: true,
  },
  {
    name: "[Secret Deal🤐] Amazon x TikTok Viral Set",
    description: "The Most Viral Korean Skincare on Amazon &amp; TikTok — All in One Set! Get a FREE $18 Zero White Cast Sunscreen with your purchase.",
    price: 80,
    originalPrice: 100,
    rating: 4.9,
    reviewsCount: 1730,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/hidden-secret-deal-amazon-x-tiktok-viral-set-1249261332.png?v=1784170930",
    category: "Best Sellers",
    subcategory: "Skincare Essential",
    badge: "VALUE SET",
    active: true,
    stock: 100,
    ingredients: ["Fly Bundles","Hidden"],
    skinConcerns: ["Acne","Sensitive"],
    handle: "secret-deal-amazon-x-tiktok-viral-set",
    subtitle: "Skincare Essential · Best Sellers",
    featured: false,
    kendallFav: false,
  },
  {
    name: "ANUA Nano Retinol 0.3% Renewal Night Serum",
    description: "Advanced anti-aging night serum powered by 0.3% encapsulated Nano Retinol and natural Bakuchiol. Smooths fine lines, accelerates cellular turnover, and refines skin texture without irritation.",
    price: 28,
    originalPrice: 34,
    rating: 4.9,
    reviewsCount: 3820,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    category: "Serum & Ampoule",
    subcategory: "Anti-Aging Serum",
    badge: "NEW FORMULA",
    active: true,
    stock: 85,
    ingredients: ["Nano Retinol 0.3%","Niacinamide 4%","Bakuchiol 1%","Ceramide NP","Adenosine"],
    skinConcerns: ["Signs of Aging","Textural Irregularities","Dullness"],
    handle: "anua-nano-retinol-03-renewal-night-serum",
    subtitle: "0.3% Nano Retinol + Bakuchiol (30ml)",
    featured: true,
    kendallFav: false,
  },
  {
    name: "ANUA Retinol 0.1% Gentle Youth Eye Cream",
    description: "Targeted gentle eye treatment designed to firm delicate under-eye skin, fade dark circles, and diminish crow's feet using micro-encapsulated Retinol and peptides.",
    price: 25,
    originalPrice: 30,
    rating: 4.8,
    reviewsCount: 2410,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    category: "Moisturizer",
    subcategory: "Eye Care",
    badge: "POPULAR",
    active: true,
    stock: 90,
    ingredients: ["Retinol 0.1%","5-Peptide Complex","Adenosine","Hyaluronic Acid","Niacinamide"],
    skinConcerns: ["Signs of Aging","Dryness & Skin Barrier","Dark Spots"],
    handle: "anua-retinol-01-gentle-youth-eye-cream",
    subtitle: "0.1% Retinol + 5-Peptide Complex (25ml)",
    featured: false,
    kendallFav: false,
  },
  {
    name: "ANUA Retinol 0.2% + Ceramide Barrier Night Oil",
    description: "Luxurious night treatment oil combining 0.2% Retinol with nourishing Ceramides and botanical Squalane to restore elasticity while locking in deep moisture barrier defense.",
    price: 30,
    originalPrice: 36,
    rating: 4.9,
    reviewsCount: 1890,
    image: "https://images.unsplash.com/photo-1608248597260-2e4a643e2264?auto=format&fit=crop&w=800&q=80",
    category: "Serum & Ampoule",
    subcategory: "Night Treatment Oil",
    badge: "NIGHT REPAIR",
    active: true,
    stock: 75,
    ingredients: ["Retinol 0.2%","Ceramide NP","Squalane 100%","Rosehip Seed Oil","Tocopherol"],
    skinConcerns: ["Signs of Aging","Textural Irregularities","Dryness & Skin Barrier"],
    handle: "anua-retinol-02-ceramide-barrier-night-oil",
    subtitle: "Retinol + Ceramide NP + Squalane (30ml)",
    featured: true,
    kendallFav: true,
  },
  {
    name: "ANUA Rice 70% Glow Intense Serum",
    description: "Deeply illuminating Korean glass skin serum containing 70% organic Korean Rice Bran Water to clarify dull skin tones, hydrate, and achieve an instant luminous glow.",
    price: 26,
    originalPrice: 32,
    rating: 4.8,
    reviewsCount: 4120,
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
    category: "Serum & Ampoule",
    subcategory: "Glass Skin Serum",
    badge: "GLASS SKIN",
    active: true,
    stock: 110,
    ingredients: ["70% Rice Bran Water","Niacinamide 5%","Alpha-Arbutin","Ceramide NP","Madecassoside"],
    skinConcerns: ["Dullness","Dark Spots","Dryness & Skin Barrier"],
    handle: "anua-rice-70-glow-intense-serum",
    subtitle: "70% Rice Bran Water + 5% Niacinamide (30ml)",
    featured: true,
    kendallFav: true,
  },
  {
    name: "ANUA Peach 70% Niacin Sheet Mask (5 Pack)",
    description: "Concentrated conditioning sheet mask set soaked in 70% Peach Fruit Extract and Niacinamide for instant hydration, refined skin texture, and glass skin radiance.",
    price: 18,
    originalPrice: 22,
    rating: 4.9,
    reviewsCount: 3100,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    category: "Face Masks",
    subcategory: "Sheet Mask",
    badge: "5 PACK VALUE",
    active: true,
    stock: 120,
    ingredients: ["70% Peach Fruit Extract","Niacinamide 5%","Desert Yeast Oil","Cyanocobalamin","Hyaluronic Acid"],
    skinConcerns: ["Dullness","Dark Spots","Textural Irregularities"],
    handle: "anua-peach-70-niacin-sheet-mask-5-pack",
    subtitle: "70% Peach Extract + Niacinamide (5 Sheets)",
    featured: false,
    kendallFav: false,
  },
  {
    name: "ANUA Peach 77% Niacin Moisture Cleansing Foam",
    description: "Ultra-gentle hydrating foam cleanser infused with 77% Peach Extract and Niacinamide. Deeply purifies pores without stripping moisture.",
    price: 19,
    originalPrice: 23,
    rating: 4.8,
    reviewsCount: 2890,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    category: "Cleanser",
    subcategory: "Foam Cleanser",
    badge: "BESTSELLER",
    active: true,
    stock: 105,
    ingredients: ["77% Peach Fruit Extract","Niacinamide 2%","Ceramide NP","Centella Asiatica","Allantoin"],
    skinConcerns: ["Dullness","Dryness & Skin Barrier","Sensitive"],
    handle: "anua-peach-77-niacin-moisture-cleansing-foam",
    subtitle: "77% Peach Extract + 2% Niacinamide (150ml)",
    featured: false,
    kendallFav: true,
  },
  {
    name: "ANUA Heartleaf Silky Moisture Sunscreen SPF50+ PA++++",
    description: "Weightless non-greasy chemical sunscreen providing broad spectrum SPF50+ PA++++ protection. Infused with soothing Heartleaf extract to calm sun-stressed skin with zero white cast.",
    price: 22,
    originalPrice: 26,
    rating: 4.9,
    reviewsCount: 6540,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    category: "Sunscreen",
    subcategory: "SPF Protection",
    badge: "SPF 50+ PA++++",
    active: true,
    stock: 140,
    ingredients: ["Heartleaf Extract","Broad Spectrum UV Filters","Centella Asiatica","Panthenol","Tocopherol"],
    skinConcerns: ["Acne","Sensitive","Dryness & Skin Barrier"],
    handle: "anua-heartleaf-silky-moisture-sunscreen-spf50",
    subtitle: "Broad Spectrum UV Shield + Heartleaf (50ml)",
    featured: true,
    kendallFav: true,
  },
  {
    name: "ANUA Ceramide 5% Deep Barrier Hydrating Gel Cream",
    description: "Intensive moisture barrier reinforcement gel cream featuring a bio-identical 5-Ceramide ratio. Instantly repairs compromised moisture barriers, soothing flakiness and tightness.",
    price: 27,
    originalPrice: 33,
    rating: 4.9,
    reviewsCount: 3980,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    category: "Moisturizer",
    subcategory: "Barrier Cream",
    badge: "BARRIER REPAIR",
    active: true,
    stock: 95,
    ingredients: ["5-Ceramide Complex","Cholesterol","Free Fatty Acids","Hyaluronic Acid","Squalane"],
    skinConcerns: ["Dryness & Skin Barrier","Sensitive","Acne"],
    handle: "anua-ceramide-5-deep-barrier-hydrating-gel-cream",
    subtitle: "5-Ceramide Complex + Cholesterol + Fatty Acids (80ml)",
    featured: true,
    kendallFav: false,
  },
  {
    name: "Heartleaf Quercetinol Pore Deep Cleansing Mask",
    description: "A deep-cleansing Heartleaf + Quercetinol sheet mask that dissolves impurities, tightens pores, and calms inflammation for glass-clear skin in 15 minutes.",
    price: 18,
    originalPrice: 24,
    rating: 4.8,
    reviewsCount: 2840,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/products/heartleaf-quercetinol-pore-deep-cleansing-mask.jpg?v=1700000001",
    category: "Face Masks",
    subcategory: "Sheet Mask",
    badge: "BESTSELLER",
    active: true,
    stock: 200,
    ingredients: ["Heartleaf Extract","Quercetinol","Niacinamide","Centella Asiatica"],
    skinConcerns: ["Acne","Blackheads & Clogged Pores","Sensitive"],
    handle: "heartleaf-quercetinol-pore-deep-cleansing-mask",
    subtitle: "Pore Purifying Sheet Mask · Face Masks",
    featured: true,
    kendallFav: false,
  },
  {
    name: "PDRN Salmon Hydrogel Eye Mask Patches",
    description: "Concentrated PDRN hydrogel patches that deliver 8-hour moisture, visibly reduce puffiness, and firm the delicate under-eye area while you sleep.",
    price: 22,
    originalPrice: 28,
    rating: 4.9,
    reviewsCount: 3610,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/products/pdrn-salmon-hydrogel-eye-mask.jpg?v=1700000002",
    category: "Face Masks",
    subcategory: "Eye Patch",
    badge: "VIRAL PDRN",
    active: true,
    stock: 180,
    ingredients: ["PDRN","Hyaluronic Acid","Collagen Peptide","Adenosine"],
    skinConcerns: ["Signs of Aging","Dryness & Skin Barrier","Dullness"],
    handle: "pdrn-salmon-hydrogel-eye-mask-patches",
    subtitle: "Anti-Aging Under-Eye Patches · Face Masks",
    featured: true,
    kendallFav: true,
  },
  {
    name: "Mugwort Pore Clarifying Clay Mask",
    description: "Korean Mugwort clay mask that absorbs excess sebum, minimizes enlarged pores, and leaves skin with a matte, porcelain-smooth finish.",
    price: 20,
    originalPrice: 26,
    rating: 4.7,
    reviewsCount: 1950,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/products/mugwort-pore-clarifying-clay-mask.jpg?v=1700000003",
    category: "Face Masks",
    subcategory: "Clay Mask",
    badge: null,
    active: true,
    stock: 150,
    ingredients: ["Mugwort Extract","Kaolin Clay","Salicylic Acid","Niacinamide"],
    skinConcerns: ["Acne","Blackheads & Clogged Pores","Dullness"],
    handle: "mugwort-pore-clarifying-clay-mask",
    subtitle: "Detox & Pore Minimizing Mask · Face Masks",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Heartleaf Spot Calming Blemish Serum",
    description: "Potent Heartleaf extract serum formulated to reduce redness, speed healing of active blemishes, and prevent post-acne scarring overnight.",
    price: 19,
    originalPrice: 25,
    rating: 4.8,
    reviewsCount: 4200,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/heartleaf-spot-serum.jpg?v=1700000004",
    category: "Spot Treatments & Care",
    subcategory: "Spot Serum",
    badge: "BESTSELLER",
    active: true,
    stock: 220,
    ingredients: ["Heartleaf Extract 77%","Salicylic Acid","Niacinamide","Tea Tree"],
    skinConcerns: ["Acne","Sensitive","Textural Irregularities"],
    handle: "heartleaf-spot-calming-blemish-serum",
    subtitle: "Targeted Spot Treatment · Spot Treatments & Care",
    featured: true,
    kendallFav: true,
  },
  {
    name: "Azelaic Acid Brightening Spot Corrector",
    description: "Azelaic Acid 10% concentrated spot corrector that fades dark spots, evens skin tone, and prevents new hyperpigmentation from forming.",
    price: 23,
    originalPrice: 30,
    rating: 4.7,
    reviewsCount: 3100,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/azelaic-acid-spot-corrector.jpg?v=1700000005",
    category: "Spot Treatments & Care",
    subcategory: "Spot Corrector",
    badge: "NEW",
    active: true,
    stock: 170,
    ingredients: ["Azelaic Acid 10%","Niacinamide","Tranexamic Acid","Vitamin C"],
    skinConcerns: ["Dark Spots","Dullness","Textural Irregularities"],
    handle: "azelaic-acid-brightening-spot-corrector",
    subtitle: "Dark Spot & Hyperpigmentation Corrector · Spot Treatments & Care",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Cica Centella Overnight Spot Healing Patch",
    description: "Ultra-thin hydrocolloid patches infused with Cica and Centella Asiatica to extract blemish contents overnight, leaving skin smooth and scar-free.",
    price: 14,
    originalPrice: 18,
    rating: 4.9,
    reviewsCount: 6800,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/cica-centella-overnight-spot-patch.jpg?v=1700000006",
    category: "Spot Treatments & Care",
    subcategory: "Acne Patch",
    badge: "BESTSELLER",
    active: true,
    stock: 400,
    ingredients: ["Centella Asiatica","Cica Extract","Hydrocolloid","Tea Tree Oil"],
    skinConcerns: ["Acne","Sensitive","Textural Irregularities"],
    handle: "cica-centella-overnight-spot-healing-patch",
    subtitle: "Hydrocolloid Acne Patch · Spot Treatments & Care",
    featured: true,
    kendallFav: true,
  },
  {
    name: "Peach Niacin Radiance Exfoliating Gel Peel",
    description: "A no-rinse gel peel with AHA/BHA exfoliants and Peach extract that visibly brightens, smooths rough texture, and delivers luminous skin in 10 minutes.",
    price: 27,
    originalPrice: 34,
    rating: 4.8,
    reviewsCount: 2700,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/peach-niacin-radiance-peel.jpg?v=1700000007",
    category: "Peels",
    subcategory: "Gel Peel",
    badge: "TRENDING",
    active: true,
    stock: 130,
    ingredients: ["Peach Extract","AHA (Glycolic Acid)","BHA (Salicylic Acid)","Niacinamide"],
    skinConcerns: ["Dark Spots","Dullness","Textural Irregularities"],
    handle: "peach-niacin-radiance-exfoliating-gel-peel",
    subtitle: "Gentle Exfoliating Peel · Peels",
    featured: true,
    kendallFav: false,
  },
  {
    name: "PHA Soft Peel Resurfacing Toner Pads",
    description: "Daily-use PHA resurfacing pads that exfoliate dead skin cells, refine pores, and hydrate simultaneously — safe for even the most sensitive skin.",
    price: 25,
    originalPrice: 32,
    rating: 4.7,
    reviewsCount: 2100,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/pha-soft-peel-toner-pads.jpg?v=1700000008",
    category: "Peels",
    subcategory: "Exfoliating Pads",
    badge: null,
    active: true,
    stock: 160,
    ingredients: ["PHA (Gluconolactone)","Centella Asiatica","Hyaluronic Acid","Panthenol"],
    skinConcerns: ["Sensitive","Textural Irregularities","Dullness"],
    handle: "pha-soft-peel-resurfacing-toner-pads",
    subtitle: "Gentle PHA Exfoliating Pads · Peels",
    featured: false,
    kendallFav: false,
  },
  {
    name: "Retinol Renewal Overnight Resurfacing Peel",
    description: "Time-release retinol overnight peel that stimulates cell turnover, firms skin, reduces fine lines, and reveals smoother texture by morning.",
    price: 34,
    originalPrice: 42,
    rating: 4.9,
    reviewsCount: 1880,
    image: "https://cdn.shopify.com/s/files/1/0753/1429/9158/files/retinol-renewal-overnight-peel.jpg?v=1700000009",
    category: "Peels",
    subcategory: "Overnight Peel",
    badge: "NEW",
    active: true,
    stock: 110,
    ingredients: ["Retinol 0.1%","Bakuchiol","Niacinamide","Hyaluronic Acid"],
    skinConcerns: ["Signs of Aging","Textural Irregularities","Dullness"],
    handle: "retinol-renewal-overnight-resurfacing-peel",
    subtitle: "Anti-Aging Retinol Peel · Peels",
    featured: false,
    kendallFav: false,
  }
];

// Persistent in-memory products store for instant fallback
const MEMORY_PRODUCTS: Map<string, Product> = new Map(
  SEED_PRODUCTS.map((p, idx) => [`p${idx + 1}`, { ...p, id: `p${idx + 1}` }])
);

export const db = {
  // --- PRODUCTS MANAGEMENT (Cloud Firestore + Memory + Disk Fallback) ---
  async getProducts(): Promise<Product[]> {
    const productMap = new Map<string, Product>();

    // 1. Seed with MEMORY_PRODUCTS (all 56 bundled products)
    MEMORY_PRODUCTS.forEach((p, key) => {
      if (p && p.name) {
        productMap.set(p.id || key, p);
      }
    });

    // 2. Merge disk DB products if available
    try {
      const disk = readDiskDb();
      if (disk.products && disk.products.length > 0) {
        disk.products.forEach((p) => {
          if (p && p.name) {
            productMap.set(p.id, p);
            MEMORY_PRODUCTS.set(p.id, p);
          }
        });
      }
    } catch (e) {
      console.warn("[DB] Error reading disk DB in getProducts:", e);
    }

    // 3. Query Firestore for live cloud updates/new products
    try {
      const colRef = collection(firestore, "products");
      const snapshot = await withTimeout(getDocs(colRef), 3000);

      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const prod: Product = {
            id: docSnap.id,
            name: data.name || "Anua Skincare Product",
            subtitle: data.subtitle || "",
            description: data.description || "",
            price: Number(data.price) || 0,
            originalPrice: Number(data.originalPrice) || Number(data.price) || 0,
            rating: Number(data.rating) || 4.8,
            reviewsCount: Number(data.reviewsCount) || 100,
            image: data.image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
            category: data.category || "Skincare",
            subcategory: data.subcategory || "General",
            badge: data.badge || null,
            active: data.active !== false,
            stock: Number(data.stock) ?? 100,
            ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
            skinConcerns: Array.isArray(data.skinConcerns) ? data.skinConcerns : [],
            handle: data.handle || "",
            featured: !!data.featured,
            kendallFav: !!data.kendallFav,
          };

          // Find if product already exists by name or handle to avoid duplicates
          let targetKey = docSnap.id;
          for (const [k, existing] of productMap.entries()) {
            if (
              existing.name.toLowerCase().trim() === prod.name.toLowerCase().trim() ||
              (existing.handle && prod.handle && existing.handle === prod.handle)
            ) {
              targetKey = k;
              break;
            }
          }

          productMap.set(targetKey, { ...productMap.get(targetKey), ...prod });
          MEMORY_PRODUCTS.set(docSnap.id, prod);
        });
      }
    } catch (e) {
      console.warn("[DB] Firestore getProducts warning, using local/memory fallback:", e);
    }

    return Array.from(productMap.values());
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(firestore, "products", id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return MEMORY_PRODUCTS.get(id) || null;
      }
      const data = snap.data();
      const prod: Product = {
        id: snap.id,
        name: data.name || "",
        description: data.description || "",
        price: Number(data.price) || 0,
        originalPrice: Number(data.originalPrice) || 0,
        rating: Number(data.rating) || 5.0,
        reviewsCount: Number(data.reviewsCount) || 0,
        image: data.image || "",
        category: data.category || "",
        subcategory: data.subcategory || "",
        badge: data.badge || null,
        active: data.active !== false,
        stock: Number(data.stock) ?? 100,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        featured: !!data.featured,
        kendallFav: !!data.kendallFav,
      };
      MEMORY_PRODUCTS.set(prod.id, prod);
      return prod;
    } catch {
      return MEMORY_PRODUCTS.get(id) || null;
    }
  },

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const docId = `p_${Date.now()}`;
    const newProd: Product = { ...product, id: docId };
    MEMORY_PRODUCTS.set(docId, newProd);

    // Save to disk
    try {
      const disk = readDiskDb();
      if (!disk.products) disk.products = [];
      disk.products.push(newProd);
      writeDiskDb(disk);
    } catch (e) {
      console.warn("[DB] Error writing product to disk:", e);
    }

    try {
      const colRef = collection(firestore, "products");
      const docRef = await addDoc(colRef, {
        ...product,
        createdAt: serverTimestamp(),
      });
      newProd.id = docRef.id;
      MEMORY_PRODUCTS.delete(docId);
      MEMORY_PRODUCTS.set(docRef.id, newProd);
      
      // Update disk with final doc ID
      try {
        const disk = readDiskDb();
        const pIdx = disk.products.findIndex((p) => p.id === docId);
        if (pIdx >= 0) disk.products[pIdx] = newProd;
        writeDiskDb(disk);
      } catch {}

      return newProd;
    } catch {
      return newProd;
    }
  },

  async updateProduct(id: string, updatedFields: Partial<Omit<Product, "id">>): Promise<Product | null> {
    const existing = MEMORY_PRODUCTS.get(id);
    let updated: Product | null = null;
    if (existing) {
      updated = { ...existing, ...updatedFields };
      MEMORY_PRODUCTS.set(id, updated);
    }

    // Save to disk
    try {
      const disk = readDiskDb();
      const pIdx = disk.products.findIndex((p) => p.id === id);
      if (pIdx >= 0) {
        disk.products[pIdx] = { ...disk.products[pIdx], ...updatedFields };
        if (!updated) updated = disk.products[pIdx];
        writeDiskDb(disk);
      }
    } catch {}

    try {
      const docRef = doc(firestore, "products", id);
      await updateDoc(docRef, {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      });
      return await this.getProductById(id);
    } catch {
      return updated || MEMORY_PRODUCTS.get(id) || null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    MEMORY_PRODUCTS.delete(id);
    try {
      const disk = readDiskDb();
      disk.products = disk.products.filter((p) => p.id !== id);
      writeDiskDb(disk);
    } catch {}
    try {
      const docRef = doc(firestore, "products", id);
      await deleteDoc(docRef);
      return true;
    } catch {
      return true;
    }
  },


  // --- ORDERS MANAGEMENT (Cloud Firestore + Disk Storage) ---
  async getOrders(): Promise<Order[]> {
    let orders: Order[] = [];
    try {
      const colRef = collection(firestore, "orders");
      const snapshot = await withTimeout(getDocs(colRef), 3000);
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          id: data.orderId || docSnap.id,
          firestoreDocId: docSnap.id,
          email: (data.email || "").toLowerCase().trim(),
          customerName: data.customerName || "Valued Customer",
          items: Array.isArray(data.items) ? data.items : [],
          total: Number(data.total) || 0,
          date: data.createdAt ? new Date(data.createdAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          status: data.status || "pending",
          paymentMethod: data.paymentMethod,
          paymentProofUrl: data.paymentProofUrl,
        });
      });
    } catch {
      // Fallback to disk
    }

    const disk = readDiskDb();
    const diskOrders = disk.orders || [];

    // Merge disk orders and Firestore orders by order ID to prevent duplicates
    const orderMap = new Map<string, Order>();
    diskOrders.forEach((o) => orderMap.set(o.id, o));
    orders.forEach((o) => orderMap.set(o.id, o));

    return Array.from(orderMap.values());
  },

  async getOrdersByEmail(email: string): Promise<Order[]> {
    const cleanEmail = email.toLowerCase().trim();
    const all = await this.getOrders();
    return all.filter((o) => o.email && o.email.toLowerCase().trim() === cleanEmail);
  },

  async createOrder(order: Omit<Order, "id" | "date">): Promise<Order> {
    const cleanEmail = order.email.toLowerCase().trim();
    const generatedOrderId = "ANU-" + Math.floor(100000 + Math.random() * 900000);
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

    // Save to disk
    try {
      const disk = readDiskDb();
      if (!disk.orders) disk.orders = [];
      disk.orders.unshift(newOrder);
      writeDiskDb(disk);
    } catch (e) {
      console.warn("[DB] Error saving order to disk:", e);
    }

    // Save to Firestore
    try {
      const colRef = collection(firestore, "orders");
      const docRef = await withTimeout(addDoc(colRef, {
        orderId: generatedOrderId,
        email: cleanEmail,
        customerName: order.customerName,
        items: order.items,
        total: Number(order.total),
        status: order.status || "pending",
        createdAt: new Date().toISOString(),
        paymentMethod: order.paymentMethod,
        paymentProofUrl: order.paymentProofUrl,
      }), 4000);
      newOrder.firestoreDocId = docRef.id;
    } catch (error) {
      console.warn("[DB] createOrder Firestore fallback to disk:", error instanceof Error ? error.message : error);
    }

    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order["status"]): Promise<boolean> {
    try {
      // Find order document in Firestore by orderId or documentId
      const colRef = collection(firestore, "orders");
      const q = query(colRef, where("orderId", "==", id));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const docRef = snap.docs[0].ref;
        await updateDoc(docRef, { status });
        return true;
      }

      // Try by direct doc ID
      const directRef = doc(firestore, "orders", id);
      await updateDoc(directRef, { status });
      return true;
    } catch (error) {
      console.warn("[DB] updateOrderStatus Firestore error:", error instanceof Error ? error.message : error);
      return false;
    }
  },

  // --- USER MANAGEMENT (Cloud Firestore + Memory Fallback) ---
  async getUsers(): Promise<User[]> {
    const userMap = new Map<string, User>();

    // 1. Load memory users first
    MEMORY_USERS.forEach((u, email) => {
      userMap.set(email.toLowerCase(), u);
    });

    // 2. Query Firestore with 5s timeout
    try {
      const colRef = collection(firestore, "users");
      const snapshot = await withTimeout(getDocs(colRef), 5000);

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.email) {
          const cleanEmail = data.email.toLowerCase();
          userMap.set(cleanEmail, {
            email: cleanEmail,
            name: data.name || cleanEmail.split("@")[0],
            role: data.role || (cleanEmail === "help.anuaglobal@gmail.com" || cleanEmail === "admin@anua.com" ? "admin" : "user"),
            joinDate: data.joinDate || new Date().toISOString().split("T")[0],
            newsletterSubscribed: !!data.newsletterSubscribed,
            passwordHash: data.passwordHash || "",
          });
        }
      });
    } catch (error) {
      console.warn("[DB] getUsers Firestore fallback to memory:", error instanceof Error ? error.message : error);
    }

    return Array.from(userMap.values());
  },

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();
    const isSuperAdmin = cleanEmail === "help.anuaglobal@gmail.com" || cleanEmail === "admin@anua.com";
    
    // 1. Try Firestore with timeout
    try {
      const colRef = collection(firestore, "users");
      const q = query(colRef, where("email", "==", cleanEmail));
      const snap = await withTimeout(getDocs(q), 3000);
      
      if (!snap.empty) {
        const data = snap.docs[0].data();
        const foundUser: User = {
          email: cleanEmail,
          name: data.name || cleanEmail.split("@")[0],
          role: data.role || (isSuperAdmin ? "admin" : "user"),
          joinDate: data.joinDate || new Date().toISOString().split("T")[0],
          newsletterSubscribed: !!data.newsletterSubscribed,
          passwordHash: data.passwordHash || (isSuperAdmin ? DEFAULT_ADMIN_HASH : ""),
        };
        MEMORY_USERS.set(cleanEmail, foundUser);
        return foundUser;
      }
    } catch {
      // Fallback to disk / memory
    }

    // 2. Check Memory Map
    const memUser = MEMORY_USERS.get(cleanEmail);
    if (memUser) {
      if (!memUser.passwordHash && isSuperAdmin) {
        memUser.passwordHash = DEFAULT_ADMIN_HASH;
      }
      return memUser;
    }

    // 3. Check db.json Disk Storage
    const disk = readDiskDb();
    const diskUser = disk.users.find((u: any) => u.email && u.email.toLowerCase().trim() === cleanEmail);
    if (diskUser) {
      const foundUser: User = {
        email: cleanEmail,
        name: diskUser.name || cleanEmail.split("@")[0],
        role: diskUser.role || (isSuperAdmin ? "admin" : "user"),
        joinDate: diskUser.joinDate || new Date().toISOString().split("T")[0],
        newsletterSubscribed: !!diskUser.newsletterSubscribed,
        passwordHash: diskUser.passwordHash || (isSuperAdmin ? DEFAULT_ADMIN_HASH : ""),
      };
      MEMORY_USERS.set(cleanEmail, foundUser);
      return foundUser;
    }

    // 4. Fallback Default Super Admin accounts
    if (isSuperAdmin) {
      const defaultAdmin: User = {
        email: cleanEmail,
        name: cleanEmail === "help.anuaglobal@gmail.com" ? "Anua (God Admin)" : "ANUA Admin",
        role: "admin",
        joinDate: new Date().toISOString().split("T")[0],
        newsletterSubscribed: true,
        passwordHash: DEFAULT_ADMIN_HASH,
      };
      MEMORY_USERS.set(cleanEmail, defaultAdmin);
      return defaultAdmin;
    }

    return null;
  },

  async createUser(newUser: Omit<User, "passwordHash"> & { password?: string; passwordHash?: string }): Promise<User> {
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

    const isSuperAdmin = cleanEmail === "help.anuaglobal@gmail.com" || cleanEmail === "admin@anua.com";

    const createdUser: User = {
      email: cleanEmail,
      name: newUser.name ? newUser.name.trim() : cleanEmail.split("@")[0],
      role: isSuperAdmin ? "admin" : (newUser.role || "user"),
      joinDate: newUser.joinDate || new Date().toISOString().split("T")[0],
      newsletterSubscribed: !!newUser.newsletterSubscribed,
      passwordHash,
    };

    // Save in memory
    MEMORY_USERS.set(cleanEmail, createdUser);

    // Save to disk db.json
    try {
      const disk = readDiskDb();
      const existingIdx = disk.users.findIndex((u: any) => u.email && u.email.toLowerCase().trim() === cleanEmail);
      if (existingIdx >= 0) {
        disk.users[existingIdx] = createdUser;
      } else {
        disk.users.push(createdUser);
      }
      writeDiskDb(disk);
    } catch (e) {
      console.warn("[DB] Error saving user to disk:", e);
    }

    // Save to Firestore
    try {
      const docRef = doc(firestore, "users", cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"));
      await withTimeout(setDoc(docRef, createdUser), 4000);
    } catch {
      console.warn("[DB] Firestore createUser fallback to disk/memory for", cleanEmail);
    }

    return createdUser;
  },

  async updateUserRole(email: string, role: "admin" | "user"): Promise<boolean> {
    return this.updateUserData(email, { role });
  },

  async updateUserData(email: string, fields: Partial<Omit<User, "email">>): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    // 1. Update memory
    const memUser = MEMORY_USERS.get(cleanEmail);
    if (memUser) {
      Object.assign(memUser, fields);
      MEMORY_USERS.set(cleanEmail, memUser);
    }
    // 2. Update disk
    try {
      const disk = readDiskDb();
      const item = disk.users.find((u) => u.email && u.email.toLowerCase().trim() === cleanEmail);
      if (item) {
        Object.assign(item, fields);
        writeDiskDb(disk);
      }
    } catch {}
    // 3. Update Firestore
    try {
      const docRef = doc(firestore, "users", cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"));
      await updateDoc(docRef, { ...fields, updatedAt: serverTimestamp() });
      return true;
    } catch {
      return !!memUser;
    }
  },

  async deleteUser(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    MEMORY_USERS.delete(cleanEmail);
    try {
      const disk = readDiskDb();
      disk.users = disk.users.filter((u) => !u.email || u.email.toLowerCase().trim() !== cleanEmail);
      writeDiskDb(disk);
    } catch {}
    try {
      const docRef = doc(firestore, "users", cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"));
      await deleteDoc(docRef);
      return true;
    } catch {
      return true;
    }
  },

  // --- NEWSLETTER SUBSCRIPTIONS (Cloud Firestore + Memory) ---
  async getNewsletters(): Promise<Newsletter[]> {
    try {
      const colRef = collection(firestore, "newsletters");
      const snapshot = await getDocs(colRef);
      const list: Newsletter[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          email: data.email || "",
          subscribedAt: data.subscribedAt || new Date().toISOString(),
        });
      });
      return list;
    } catch {
      return Array.from(MEMORY_NEWSLETTERS.values());
    }
  },

  async subscribeNewsletter(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const item = { email: cleanEmail, subscribedAt: new Date().toISOString() };
    MEMORY_NEWSLETTERS.set(cleanEmail, item);
    try {
      const docRef = doc(firestore, "newsletters", cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"));
      await setDoc(docRef, item);
      return true;
    } catch {
      return true;
    }
  },

  // --- VERIFICATION CODES (Cloud Firestore + Memory) ---
  async saveVerificationCode(email: string, code: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    MEMORY_VERIFICATION_CODES.set(cleanEmail, {
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    try {
      const docRef = doc(firestore, "verificationCodes", cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"));
      await withTimeout(setDoc(docRef, {
        email: cleanEmail,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      }), 5000);
    } catch {
      console.warn("[DB] Firestore saveVerificationCode fallback to memory for", cleanEmail);
    }
  },

  async verifyVerificationCode(email: string, code: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    // Check memory store first
    const memData = MEMORY_VERIFICATION_CODES.get(cleanEmail);
    if (memData) {
      if (memData.code === code && memData.expiresAt > Date.now()) {
        MEMORY_VERIFICATION_CODES.delete(cleanEmail);
        return true;
      }
    }
    try {
      const docRef = doc(firestore, "verificationCodes", cleanEmail.replace(/[^a-zA-Z0-9]/g, "_"));
      const snap = await withTimeout(getDoc(docRef), 5000);
      if (snap.exists()) {
        const data = snap.data();
        const isExpired = new Date(data.expiresAt).getTime() < Date.now();
        if (data.code === code && !isExpired) {
          await withTimeout(deleteDoc(docRef), 5000).catch(() => {});
          return true;
        }
      }
    } catch {
      console.warn("[DB] Firestore verifyVerificationCode fallback check for", cleanEmail);
    }
    return false;
  },

  // --- SETTINGS (Cloud Firestore) ---
  async getSettings(): Promise<Settings> {
    const defaultSettings: Settings = {
      promoText: "Subscribe & Enjoy Free Shipping Worldwide on Orders Over $35",
      geoRedirectEnabled: true,
      defaultCurrency: "USD",
      exchangeRate: 1,
      allowSignups: true,
      heroVideoUrl: "https://anua.com/cdn/shop/videos/c/vp/a05d819684fd40e497c6bfee7229d658/a05d819684fd40e497c6bfee7229d658.HD-1080p-7.2Mbps-86812723.mp4?v=0",
      heroTitle: "Gentle yet Effective Korean Skincare",
      heroSubtitle: "Discover the #1 viral Korean skincare brand — 40M+ sold globally.",
      heroCtaText: "SHOP ALL",
      heroCtaLink: "/shop",
    };

    try {
      const docRef = doc(firestore, "settings", "global");
      const snap = await withTimeout(getDoc(docRef), 5000);
      if (snap.exists()) {
        return { ...defaultSettings, ...snap.data() } as Settings;
      }
      await withTimeout(setDoc(docRef, defaultSettings), 5000).catch(() => {});
      return defaultSettings;
    } catch (error) {
      return defaultSettings;
    }
  },

  async updateSettings(updatedSettings: Partial<Settings>): Promise<Settings> {
    try {
      const docRef = doc(firestore, "settings", "global");
      const current = await this.getSettings();
      const merged = { ...current, ...updatedSettings };
      await withTimeout(setDoc(docRef, merged), 5000);
      return merged;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "settings/global");
      throw error;
    }
  },

  // --- REVIEWS (Cloud Firestore) ---
  async getReviews(): Promise<Review[]> {
    const defaultReviews: Review[] = [
      {
        id: "r1",
        author: "Sophia L.",
        rating: 5,
        date: "July 24, 2026",
        title: "Completely cleared my breakout redness!",
        comment: "The Heartleaf 77 Toner is worth every single piece of hype. My skin barrier was damaged and inflamed, and within 3 days this calmed down all redness. A holy grail!",
        verified: true,
        productName: "ANUA Heartleaf 77% Soothing Toner",
      },
      {
        id: "r2",
        author: "Emma W.",
        rating: 5,
        date: "July 19, 2026",
        title: "Best cleansing oil for blackheads!",
        comment: "It literally melts blackheads out of your nose while massaging. My skin has never felt cleaner or smoother. Does not clog my sensitive acne-prone skin.",
        verified: true,
        productName: "ANUA Heartleaf Pore Control Cleansing Oil",
      },
      {
        id: "r3",
        author: "Jessica M.",
        rating: 5,
        date: "July 15, 2026",
        title: "Faded my dark spot scars in 2 weeks",
        comment: "The Niacinamide 10% + TXA 4% serum is magic for post-acne dark marks. Combined with the Peach Niacin serum, my skin looks radiant and glass-like!",
        verified: true,
        productName: "ANUA Niacinamide 10% + TXA 4% Dark Spot Serum",
      },
    ];

    try {
      const colRef = collection(firestore, "reviews");
      const snap = await getDocs(colRef);
      if (snap.empty) {
        for (const r of defaultReviews) {
          await setDoc(doc(colRef, r.id), r);
        }
        return defaultReviews;
      }
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
    } catch (error) {
      return defaultReviews;
    }
  },

  async createReview(review: Omit<Review, "id">): Promise<Review> {
    const newId = `r-${Date.now()}`;
    const fullReview: Review = { id: newId, ...review };
    try {
      const docRef = doc(firestore, "reviews", newId);
      await setDoc(docRef, fullReview);
      return fullReview;
    } catch (error) {
      return fullReview;
    }
  },

  async deleteReview(id: string): Promise<boolean> {
    try {
      const docRef = doc(firestore, "reviews", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      return false;
    }
  },

  // --- FAQS (Cloud Firestore) ---
  async getFaqs(): Promise<FaqItem[]> {
    const defaultFaqs: FaqItem[] = [
      {
        id: "faq-1",
        category: "Products & Formulation",
        question: "Are ANUA products suitable for sensitive & acne-prone skin?",
        answer: "Yes! All ANUA formulations are dermatologist-tested, non-comedogenic, and specifically engineered with soothing ingredients like Heartleaf, Centella Asiatica, and PDRN to calm irritation.",
      },
      {
        id: "faq-2",
        category: "Products & Formulation",
        question: "What is Salmon PDRN and how does it work?",
        answer: "PDRN (Polydeoxyribonucleotide) is low-molecular salmon DNA extract used in clinical skin clinic treatments. It stimulates cellular regeneration, elasticity, and glass skin radiance.",
      },
      {
        id: "faq-3",
        category: "Shipping & Orders",
        question: "How long does shipping take?",
        answer: "Orders are processed within 24 business hours. Standard domestic shipping takes 3-5 business days. International express shipping takes 4-7 business days.",
      },
      {
        id: "faq-4",
        category: "Shipping & Orders",
        question: "What is your return policy?",
        answer: "We offer a 30-day risk-free satisfaction guarantee. If you are not completely satisfied with your formulation, contact support for a full refund.",
      },
    ];

    try {
      const docRef = doc(firestore, "faqs", "global");
      const snap = await getDoc(docRef);
      if (snap.exists() && Array.isArray(snap.data()?.items)) {
        return snap.data().items as FaqItem[];
      }
      await setDoc(docRef, { items: defaultFaqs });
      return defaultFaqs;
    } catch (error) {
      return defaultFaqs;
    }
  },

  async updateFaqs(items: FaqItem[]): Promise<FaqItem[]> {
    try {
      const docRef = doc(firestore, "faqs", "global");
      await setDoc(docRef, { items });
      return items;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, "faqs/global");
      throw error;
    }
  },

  // --- WHOLESALE APPLICATIONS ---
  async getWholesaleApplications(): Promise<WholesaleApplication[]> {
    try {
      const colRef = collection(firestore, "wholesale_applications");
      const snap = await getDocs(colRef);
      if (snap.empty) {
        return MEMORY_WHOLESALE;
      }
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WholesaleApplication));
    } catch (error) {
      return MEMORY_WHOLESALE;
    }
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
    try {
      const docRef = doc(firestore, "wholesale_applications", newId);
      await setDoc(docRef, newApp);
    } catch (error) {
      console.warn("Firestore wholesale application save fallback:", error);
    }
    return newApp;
  },

  async updateWholesaleApplicationStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<boolean> {
    const memItem = MEMORY_WHOLESALE.find((item) => item.id === id);
    if (memItem) {
      memItem.status = status;
    }
    try {
      const docRef = doc(firestore, "wholesale_applications", id);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      return true;
    }
  },

  async deleteWholesaleApplication(id: string): Promise<boolean> {
    const idx = MEMORY_WHOLESALE.findIndex((item) => item.id === id);
    if (idx !== -1) {
      MEMORY_WHOLESALE.splice(idx, 1);
    }
    try {
      const docRef = doc(firestore, "wholesale_applications", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      return true;
    }
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
