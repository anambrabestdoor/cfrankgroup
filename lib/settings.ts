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
  serviceAreas: string[];
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Anambra Best Door Enterprises",
  parentCompany: "CFrank Enterprise",
  proprietor: "Chidera Frank Okonkwo",
  tagline: "Direct Importer of Heavy-Gauge Security Doors & Building Fittings",
  description: "Anambra Best Door Enterprises is a specialized construction activities and door fittings enterprise operated by CFrank Enterprise (Chidera Frank Okonkwo) at Maraim Plaza, Building Material International Market Ogidi, Anambra State. Supplying premium steel security doors, interior wooden doors, bullet proof doors, HDF doors, and building fittings nationwide.",
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

// Helper to format WhatsApp order message
export function buildWhatsAppOrderUrl(params: {
  productName?: string;
  price?: number;
  quantity?: number;
  size?: string;
  orientation?: string;
  additionalNotes?: string;
  cartItems?: Array<{ name: string; quantity: number; price: number; size?: string }>;
  total?: number;
  targetPhone?: string;
}): string {
  const phone = params.targetPhone || DEFAULT_SITE_SETTINGS.whatsappNumber;
  let text = "";

  if (params.cartItems && params.cartItems.length > 0) {
    text = `Hello Anambra Best Door Enterprises (CFrank Enterprise),\n\nI would like to place an order from your website catalogue:\n\n`;
    params.cartItems.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}\n`;
      if (item.size) text += `   Size/Spec: ${item.size}\n`;
    });
    if (params.total) {
      text += `\n*Total Amount:* ₦${params.total.toLocaleString()}\n`;
    }
    text += `\nPlease confirm availability and delivery terms to my location from Maraim Plaza Ogidi.`;
  } else if (params.productName) {
    text = `Hello Anambra Best Door Enterprises (CFrank Enterprise),\n\nI am interested in ordering:\n*${params.productName}*\n`;
    if (params.price) text += `Price: ₦${params.price.toLocaleString()}\n`;
    if (params.quantity) text += `Quantity: ${params.quantity}\n`;
    if (params.size) text += `Size/Spec: ${params.size}\n`;
    if (params.orientation) text += `Opening Orientation: ${params.orientation}\n`;
    if (params.additionalNotes) text += `Note: ${params.additionalNotes}\n`;
    text += `\nPlease confirm stock at Maraim Plaza Ogidi and shipping details.`;
  } else {
    text = `Hello Anambra Best Door Enterprises (CFrank Enterprise),\n\nI am contacting you from your website. I would like to inquire about your door inventory and pricing at Maraim Plaza Building Material Ogidi.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
