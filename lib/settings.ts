export interface SiteSettings {
  companyName: string;
  parentCompany: string;
  proprietor: string;
  tagline: string;
  description: string;
  address: string;
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
  jijiShopUrl: string;
  githubUrl: string;
  whatsappInquiryTemplate: string;
  whatsappCartTemplate: string;
  serviceAreas: string[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Anambra Best Door Enterprises",
  parentCompany: "CFrank Enterprise",
  proprietor: "Chidera Frank Okonkwo",
  tagline: "Direct Importer of Heavy-Gauge Security Doors & Building Fittings",
  description: "Anambra Best Door Enterprises is a specialized construction activities and door fittings enterprise operated by CFrank Enterprise (Chidera Frank Okonkwo) at Maraim Plaza, Building Material International Market Ogidi, Anambra State. Supplying premium steel security doors, interior wooden doors, bullet proof doors, HDF doors, sanitary wares, and building fittings nationwide.",
  address: "No 16/17, Maraim Plaza Building Material Ogidi, Ogidi, Anambra State, Nigeria",
  marketLocation: "Maraim Plaza, Building Material International Market, Ogidi, Onitsha",
  phone: "+2347070070305",
  phoneDisplay: "+234 707 007 0305",
  whatsappNumber: "2347070070305",
  salesEmail: "anambrabestdoor@gmail.com",
  workingHours: "Mon - Sat: 8:00 AM - 5:30 PM",
  cacNumber: "BN 9943925",
  cacRegistrationDate: "Oct 16, 2026",
  cacStatus: "ACTIVE",
  cacCertificateUrl: "/cac-status-report-page1.jpeg",
  cacPage2Url: "/cac-proprietor-page2.jpeg",
  instagramUrl: "https://www.instagram.com/anambrabestdoor/",
  jijiShopUrl: "https://jiji.ng/shop/anambrabestdoor",
  githubUrl: "https://github.com/anambrabestdoor/anambrabestdoor",
  whatsappInquiryTemplate: "Hello CFrank Enterprise, I would like to inquire about the current price and stock availability for [Door Name] (Size: [Size], Quantity: [Qty]).",
  whatsappCartTemplate: "Hello CFrank Enterprise, I would like to inquire about current price and availability for the following items from your catalogue:\n\n[Items]\n\nPlease confirm availability and delivery terms to my project site.",
  serviceAreas: [
    "Anambra (Onitsha, Awka, Nnewi, Ogidi)",
    "Asaba & Delta State",
    "Enugu & South-East",
    "Lagos & South-West",
    "Abuja (FCT)",
    "Port Harcourt & South-South",
    "Nationwide Delivery"
  ],
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
    const size = params.size || "Standard Spec";
    const qty = String(params.quantity || 1);

    text = rawTemplate
      .replace(/\[Door Name\]/gi, name)
      .replace(/\[Product Name\]/gi, name)
      .replace(/\[Size\]/gi, size)
      .replace(/\[Quantity\]/gi, qty)
      .replace(/\[Qty\]/gi, qty)
      .replace(/\[Market Location\]/gi, DEFAULT_SITE_SETTINGS.marketLocation);

    if (params.orientation) {
      text += `\nOpening Orientation: ${params.orientation}`;
    }
    if (params.additionalNotes) {
      text += `\nNote: ${params.additionalNotes}`;
    }
  } else {
    text = `Hello CFrank Enterprise, I am contacting you from your website. I would like to inquire about your product inventory, current prices, and delivery terms.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
