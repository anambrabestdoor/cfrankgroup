import { brand, colors, whatsappDefaults } from "./brand";

export interface SiteSettings {
  companyName: string;
  parentCompany: string;
  proprietor: string;
  tagline: string;
  description: string;
  address: string;
  secondAddress: string;
  marketLocation: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string; // international format without + for direct links e.g. 2347070070305
  salesEmail: string;
  workingHours: string;
  cacNumber: string;
  cacRegistrationDate: string;
  cacStatus: string;
  cacCertificateUrl: string;
  cacPage2Url: string;
  instagramUrl: string;
  facebookUrl: string;
  jijiShopUrl: string;
  whatsappInquiryTemplate: string;
  whatsappCartTemplate: string;
  heroVideoUrl?: string;
  heroPosterUrl?: string;
  heroImageUrl?: string;
  logoUrl?: string;
  serviceAreas: string[];
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: brand.name,
  parentCompany: brand.name,
  proprietor: brand.proprietor,
  tagline: brand.tagline,
  description: brand.description,
  address: brand.address,
  secondAddress: "",
  marketLocation: brand.address,
  phone: brand.phone,
  phoneDisplay: brand.phoneDisplay,
  whatsappNumber: brand.whatsappNumber,
  salesEmail: brand.email,
  workingHours: brand.workingHours,
  cacNumber: brand.cacNumber,
  cacRegistrationDate: "Oct 16, 2026",
  cacStatus: "ACTIVE",
  cacCertificateUrl: "/cac-status-report-page1.jpeg",
  cacPage2Url: "/cac-proprietor-page2.jpeg",
  instagramUrl: brand.social.instagram,
  facebookUrl: brand.social.facebook,
  jijiShopUrl: brand.social.jiji,
  whatsappInquiryTemplate: whatsappDefaults.inquiryTemplate,
  whatsappCartTemplate: whatsappDefaults.cartTemplate,
  heroVideoUrl: "/cfrank_hero_assembly.mp4?v=4.5",
  heroPosterUrl: "/cfrank_hero_poster.webp?v=4.5",
  heroImageUrl: "",
  logoUrl: "/cfranklogo.png",
  serviceAreas: [
    "Anambra (Onitsha, Awka, Nnewi, Ogidi)",
    "Asaba & Delta State",
    "Enugu & South-East",
    "Lagos & South-West",
    "Abuja (FCT)",
    "Port Harcourt & South-South",
    "Nationwide Delivery"
  ],
  deliverySummaryHeading: "Warehouse Direct Dispatch",
  deliverySummaryText: "Same-day loading for South-East and Asaba; 24 to 48 hours for Lagos, Abuja, Port Harcourt and other states.",
  deliveryRegions: [
    {
      name: "South-East & Eastern States",
      duration: "Same-Day / 24h",
      coverage: "Onitsha, Ogidi, Awka, Nnewi, Asaba, Enugu, Owerri, Aba, Abakaliki, Makurdi"
    },
    {
      name: "South-South States",
      duration: "24h Transit",
      coverage: "Port Harcourt, Warri, Benin City, Uyo, Calabar"
    },
    {
      name: "South-West States",
      duration: "24h - 48h",
      coverage: "Lagos State, Ibadan, Abeokuta, Ogun"
    },
    {
      name: "North-Central & Northern States",
      duration: "24h - 48h",
      coverage: "Abuja (FCT), Jos, Lokoja, Kano, Kaduna"
    }
  ],
  deliveryPackagingNote: "All doors and sanitary ware are strapped with protective edge guards, corrugated pads, and waterproof wrap before handover to verified commercial transport lines.",
  preDispatchInspectionNote: "Before any door or sanitary fitting leaves our warehouse, our sales team records photos and video of the exact product, frame, hinges, and hardware for WhatsApp confirmation with the buyer or site engineer.",
};

// Helper to format WhatsApp order message using dynamic templates
export function buildWhatsAppOrderUrl(params: {
  productName?: string;
  price?: number;
  quantity?: number;
  size?: string;
  orientation?: string;
  additionalNotes?: string;
  cartItems?: Array<{ name: string; quantity: number; price?: number; size?: string }>;
  total?: number;
  targetPhone?: string;
  inquiryTemplate?: string;
  cartTemplate?: string;
}): string {
  const phone = params.targetPhone || DEFAULT_SITE_SETTINGS.whatsappNumber;
  let text = "";

  if (params.cartItems && params.cartItems.length > 0) {
    const rawTemplate = params.cartTemplate || DEFAULT_SITE_SETTINGS.whatsappCartTemplate;
    let itemsText = "";
    params.cartItems.forEach((item, idx) => {
      itemsText += `${idx + 1}. *${item.name}* (Qty: ${item.quantity})`;
      if (item.size) itemsText += ` - Spec: ${item.size}`;
      if (item.price && item.price > 0) itemsText += ` - ₦${(item.price * item.quantity).toLocaleString()}`;
      itemsText += `\n`;
    });

    text = rawTemplate
      .replace(/\[Items\]/gi, itemsText.trim())
      .replace(/\[Market Location\]/gi, DEFAULT_SITE_SETTINGS.marketLocation);
  } else if (params.productName) {
    const rawTemplate = params.inquiryTemplate || DEFAULT_SITE_SETTINGS.whatsappInquiryTemplate;
    const name = params.productName || "Product";
    const qty = String(params.quantity || 1);

    let text = rawTemplate
      .replace(/\[Door Name\]/gi, name)
      .replace(/\[Product Name\]/gi, name)
      .replace(/\[Quantity\]/gi, qty)
      .replace(/\[Qty\]/gi, qty)
      .replace(/\[Market Location\]/gi, DEFAULT_SITE_SETTINGS.marketLocation);

    if (params.size && params.size.trim().length > 0) {
      text = text.replace(/\[Size\]/gi, params.size);
    } else {
      // Cleanly remove size segment when inquiring about non-door products
      text = text
        .replace(/\(Size:\s*\[Size\],\s*/gi, "(")
        .replace(/\(Size:\s*\[Size\]\)/gi, "")
        .replace(/Size:\s*\[Size\],?\s*/gi, "")
        .replace(/\[Size\]/gi, "")
        .replace(/\(\s*\)/g, "")
        .replace(/\s\s+/g, " ");
    }

    if (params.orientation && params.orientation.trim().length > 0) {
      text += `\nOpening Orientation: ${params.orientation}`;
    }
    if (params.additionalNotes) {
      text += `\nNote: ${params.additionalNotes}`;
    }
  } else {
    text = `Hello ${brand.name}, I am contacting you from your website. I would like to inquire about your product inventory, current prices, and delivery terms.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
