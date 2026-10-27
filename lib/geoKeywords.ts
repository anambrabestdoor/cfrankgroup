// Programmatic Nigerian Geo-Targeting and High-Intent Search Keyword Generator
// Generates commercial search phrases for any product name and category across Nigerian commercial hubs.

export const NIGERIAN_CITIES_AND_STATES = [
  // South-East
  { city: "Onitsha", state: "Anambra", market: "Building Material International Market Ogidi" },
  { city: "Ogidi", state: "Anambra", market: "Building Material Market" },
  { city: "Awka", state: "Anambra", market: "Awka Main Market" },
  { city: "Nnewi", state: "Anambra", market: "Nnewi Building Market" },
  { city: "Enugu", state: "Enugu", market: "Kenyatta / Ogbete Market" },
  { city: "Nsukka", state: "Enugu", market: "Nsukka Central" },
  { city: "Owerri", state: "Imo", market: "Relief Market / Douglas" },
  { city: "Aba", state: "Abia", market: "Ariaria / Eziukwu Market" },
  { city: "Umuahia", state: "Abia", market: "Ubani Market" },
  { city: "Abakaliki", state: "Ebonyi", market: "Kpirikpiri Market" },

  // South-South
  { city: "Asaba", state: "Delta", market: "Cable Point / Ogbeogonogo" },
  { city: "Warri", state: "Delta", market: "Main Market Warri" },
  { city: "Port Harcourt", state: "Rivers", market: "Mile 1 / Trans Amadi" },
  { city: "Benin City", state: "Edo", market: "Mission Road / Oba Market" },
  { city: "Calabar", state: "Cross River", market: "Watt Market" },
  { city: "Uyo", state: "Akwa Ibom", market: "Itam Market" },

  // North-Central & Middle Belt
  { city: "Makurdi", state: "Benue", market: "Modern Market Makurdi" },
  { city: "Gboko", state: "Benue", market: "Gboko Central" },
  { city: "Otukpo", state: "Benue", market: "Otukpo Main" },
  { city: "Abuja", state: "FCT", market: "Dei-Dei Building Materials Market" },
  { city: "Jos", state: "Plateau", market: "Terminus / Katako Market" },
  { city: "Lokoja", state: "Kogi", market: "International Market Lokoja" },
  { city: "Ilorin", state: "Kogi", market: "Mandate / Oja Oba" },
  { city: "Lafia", state: "Nasarawa", market: "Lafia Modern Market" },

  // South-West
  { city: "Lagos", state: "Lagos", market: "Alaba International / Trade Fair" },
  { city: "Ibadan", state: "Oyo", market: "Bodija / Dugbe Market" },
  { city: "Abeokuta", state: "Ogun", market: "Kuto / Itoku" },
  { city: "Akure", state: "Ondo", market: "Oja Oba Akure" },

  // North
  { city: "Kano", state: "Kano", market: "Sabon Gari Market" },
  { city: "Kaduna", state: "Kaduna", market: "Sheikh Gumi Central Market" },
];

export const SEARCH_INTENTS = [
  "price",
  "price in",
  "dealers",
  "suppliers",
  "wholesale price",
  "direct importer",
  "distributors",
  "cost",
  "cost of",
  "market price",
];

/**
 * Programmatically generate high-intent keywords for any door or fitting product
 */
export function generateGeoKeywords(productName: string, categoryLabel?: string): string[] {
  const cleanName = productName.trim();
  const cleanCategory = categoryLabel?.trim() || "";

  const keywords: string[] = [
    cleanName,
    `${cleanName} price`,
    `${cleanName} price in Nigeria`,
    `${cleanName} wholesale price`,
    `${cleanName} direct importer`,
    `${cleanName} suppliers Nigeria`,
    `${cleanName} specifications and size`,
    `${cleanName} Building Material Market Ogidi`,
    `${cleanName} Anambra Best Door`,
    `${cleanName} CFrank Enterprise`,
  ];

  if (cleanCategory) {
    keywords.push(
      `${cleanCategory} price in Nigeria`,
      `${cleanCategory} suppliers in Onitsha`,
      `${cleanCategory} wholesale Building Material Market Ogidi`,
      `${cleanCategory} importer Anambra`
    );
  }

  // Key regional target combinations
  const topLocations = [
    "Onitsha",
    "Ogidi",
    "Awka",
    "Anambra",
    "Asaba",
    "Delta",
    "Enugu",
    "Benue",
    "Makurdi",
    "Port Harcourt",
    "Rivers State",
    "Owerri",
    "Imo",
    "Aba",
    "Abia",
    "Abuja",
    "Lagos",
    "Benin City",
    "Jos",
    "Lokoja",
    "Calabar",
    "Uyo",
  ];

  topLocations.forEach((loc) => {
    keywords.push(`${cleanName} price in ${loc}`);
    keywords.push(`${cleanName} suppliers in ${loc}`);
  });

  return Array.from(new Set(keywords));
}

/**
 * Programmatically construct a geo-rich SEO description for any product
 */
export function generateGeoDescription(productName: string, customDesc?: string): string {
  if (customDesc && customDesc.length >= 40) {
    return customDesc;
  }
  return `Buy genuine ${productName} directly from CFrank Enterprise at wholesale importer prices. Heavy-duty security and architectural fittings with direct waybill dispatch to Onitsha, Ogidi, Asaba, Enugu, Makurdi, Port Harcourt, Owerri, Abuja, Lagos, and nationwide across Nigeria.`;
}
