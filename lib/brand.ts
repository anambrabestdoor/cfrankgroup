/**
 * CFrank Group — Centralised Brand Configuration
 *
 * All brand identity values are resolved from environment variables with
 * sensible CFrank Group defaults. No file in the application should hardcode
 * the brand name, tagline, contact details, or design tokens.
 *
 * Client-safe values use the NEXT_PUBLIC_ prefix.
 * Server-only secrets (API keys, etc.) live in other env vars and are NOT here.
 */

// ─── Design Tokens ───────────────────────────────────────────────────────────

export const colors = {
  /** Primary brand dark — charcoal */
  charcoal: "#121518",
  /** Background — warm white / canvas */
  warmWhite: "#FBF9F5",
  /** Primary brand accent — warm architectural amber (from logo) */
  amber: "#F3661B",
  /** Accent hover / active amber */
  amberDark: "#D9530F",
  /** Accent light amber for subtle backgrounds */
  amberLight: "#FDF3EC",
  /** Backward-compatible aliases for previous gold references */
  mutedGold: "#F3661B",
  goldDark: "#D9530F",
  goldLight: "#FDF3EC",
  /** Neutral text — dark charcoal */
  textPrimary: "#121518",
  /** Neutral secondary text */
  textSecondary: "#45484D",
  /** Neutral muted text */
  textMuted: "#6B7077",
  /** Surface — pure white */
  surfaceWhite: "#FFFFFF",
  /** Surface — off-white */
  surfaceLight: "#F5F2EB",
  /** Border — light neutral */
  borderLight: "#E5E3DC",
  /** Border — medium neutral */
  borderMedium: "#D5D1C6",
  /** WhatsApp green (functional, not brand) */
  whatsapp: "#25D366",
} as const;

// ─── Brand Identity ──────────────────────────────────────────────────────────

export const brand = {
  /** Full legal / display name */
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "CFrank Group",

  /** Abbreviated name for tight spaces, PWA, etc. */
  shortName: process.env.NEXT_PUBLIC_BRAND_SHORT_NAME || "CFrank",

  /** Primary tagline */
  tagline:
    process.env.NEXT_PUBLIC_BRAND_TAGLINE ||
    "Everything to build, secure, and complete your space.",

  /** One-paragraph corporate description */
  description:
    process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ||
    "We deliver quality security doors, stone-coated roof tiles, smart biometric door locks, and sanitary wares; building project supply in one order.",

  /** Contact email */
  email: process.env.NEXT_PUBLIC_BRAND_EMAIL || "info@cfrankgroup.com",

  /** Contact phone (international format with +) */
  phone: process.env.NEXT_PUBLIC_BRAND_PHONE || "+2347070070305",

  /** Display-formatted phone */
  phoneDisplay:
    process.env.NEXT_PUBLIC_BRAND_PHONE_DISPLAY || "+234 707 007 0305",

  /** WhatsApp number (international without +, for wa.me links) */
  whatsappNumber:
    process.env.NEXT_PUBLIC_BRAND_WHATSAPP || "2347070070305",

  /** Primary address */
  address:
    process.env.NEXT_PUBLIC_BRAND_ADDRESS ||
    "No. 16/17 Maraim Plaza, Building Materials International Market, Ogidi, Anambra State, Nigeria",

  /** Proprietor / CEO name */
  proprietor:
    process.env.NEXT_PUBLIC_BRAND_PROPRIETOR || "Chidera Frank Okonkwo",

  /** CAC registration number */
  cacNumber: process.env.NEXT_PUBLIC_BRAND_CAC_NUMBER || "BN 9943925",

  /** Working hours */
  workingHours:
    process.env.NEXT_PUBLIC_BRAND_WORKING_HOURS || "Mon - Sat: 8:00 AM - 5:30 PM",

  /** Canonical website URL (no trailing slash) */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cfrankgroup.com",

  /** Application URL for runtime links and metadata base */
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  /** Social media links */
  social: {
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "",
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "",
    twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || "",
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "",
    jiji: process.env.NEXT_PUBLIC_SOCIAL_JIJI || "",
  },

  /** Currency */
  currency: {
    code: "NGN",
    symbol: "₦",
  },

  /** Location coordinates for structured data */
  geo: {
    latitude: "6.1432",
    longitude: "6.8623",
  },
} as const;

// ─── SEO Defaults ────────────────────────────────────────────────────────────

export const seo = {
  titleTemplate: `%s | ${brand.name}`,
  defaultTitle: `${brand.name} | ${brand.tagline}`,
  openGraph: {
    type: "website" as const,
    locale: "en_NG",
    siteName: brand.name,
  },
  keywords: [
    "CFrank Group",
    "CFrank Groups",
    "CFrank Enterprise",
    "CFrank Enterprises",
    "Anambra Best Door",
    "Anambra Best Door Enterprises",
    "CFrank building materials",
    "CFrank doors",
    "Nigerian business group",
    "building materials Nigeria",
    "construction materials Anambra",
    "doors and fittings Nigeria",
    "Turkish security doors Nigeria",
    "armoured steel doors Onitsha",
    "stone coated roof tiles Nigeria",
    "smart door locks Nigeria",
    "sanitary wares Ogidi",
    "Ogidi market",
  ],
};

// ─── WhatsApp Defaults ───────────────────────────────────────────────────────

export const whatsappDefaults = {
  inquiryTemplate: `Hello ${brand.name}, I would like to inquire about the current price and stock availability for [Product Name] (Quantity: [Qty]).`,
  cartTemplate: `Hello ${brand.name}, I would like to inquire about current price and availability for the following items:\n\n[Items]\n\nPlease confirm availability and delivery terms.`,
  generalGreeting: `Hello ${brand.name}, I am contacting you from your website. I would like to inquire about your products and services.`,
};

