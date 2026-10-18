const fs = require('fs');

const PRODUCTS_METADATA = {
  'prod-001': {
    name: 'Interior Luxury Foreign HDF Door',
    price: 185000,
    originalPrice: 210000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Foreign HDF Luxury Doors'
  },
  'prod-002': {
    name: 'HDF Wooden Door with Complete Fittings',
    price: 145000,
    originalPrice: 165000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'HDF Wooden Doors'
  },
  'prod-003': {
    name: 'Custom HDF Construction (On-Demand)',
    price: 0,
    originalPrice: 0,
    priceOnRequest: true,
    group: 'doors',
    subcategory: 'Custom HDF Construction'
  },
  'prod-004': {
    name: 'Watson Door (Standard)',
    price: 135000,
    originalPrice: 155000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Watson & Panel Doors'
  },
  'prod-005': {
    name: '4ft Watson Grand Door',
    price: 220000,
    originalPrice: 250000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Watson & Panel Doors'
  },
  'prod-006': {
    name: 'Bulletproof Security Door',
    price: 0,
    originalPrice: 0,
    priceOnRequest: true,
    group: 'doors',
    subcategory: 'Security & Armoured Doors'
  },
  'prod-007': {
    name: 'Bible Design Cast Door',
    price: 480000,
    originalPrice: 540000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Luxury Cast Entrances'
  },
  'prod-008': {
    name: 'Italian Copper Luxury Door',
    price: 620000,
    originalPrice: 690000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Luxury Cast Entrances'
  },
  'prod-009': {
    name: 'Israeli High-Security Door',
    price: 550000,
    originalPrice: 620000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Security & Armoured Doors'
  },
  'prod-010': {
    name: 'Juihua 3ft Heavy-Duty Door',
    price: 320000,
    originalPrice: 360000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Security & Armoured Doors'
  },
  'prod-011': {
    name: 'American Panel Door',
    price: 160000,
    originalPrice: 185000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Watson & Panel Doors'
  },
  'prod-012': {
    name: 'Harmony Toilet Size Door',
    price: 95000,
    originalPrice: 115000,
    priceOnRequest: false,
    group: 'doors',
    subcategory: 'Waterproof Bathroom Doors'
  },
  'prod-013': {
    name: 'Executive Gold WC',
    price: 280000,
    originalPrice: 320000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Water Closets & Toilets'
  },
  'prod-014': {
    name: 'Golden Executive Ideal England (with Matching Basin)',
    price: 380000,
    originalPrice: 430000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Water Closets & Toilets'
  },
  'prod-015': {
    name: 'Golden Sink (Italian Collection)',
    price: 240000,
    originalPrice: 280000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Kitchen Sinks & Brassware'
  },
  'prod-016': {
    name: 'Cubicle Shower Room Enclosure',
    price: 450000,
    originalPrice: 510000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Showers & Enclosures'
  },
  'prod-017': {
    name: 'Power Shower Tower System',
    price: 165000,
    originalPrice: 195000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Showers & Enclosures'
  },
  'prod-018': {
    name: 'Big Brother Luxury Tap / Faucet Series',
    price: 55000,
    originalPrice: 68000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Kitchen Sinks & Brassware'
  },
  'prod-019': {
    name: 'Big Brother Luxury Tap Model II',
    price: 62000,
    originalPrice: 75000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Kitchen Sinks & Brassware'
  },
  'prod-020': {
    name: 'Dining Basin Suite',
    price: 120000,
    originalPrice: 140000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Wash Hand Basins'
  },
  'prod-021': {
    name: 'Golden Executive Basin',
    price: 135000,
    originalPrice: 155000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Wash Hand Basins'
  },
  'prod-022': {
    name: 'Pioneer Special Sink',
    price: 115000,
    originalPrice: 135000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Kitchen Sinks & Brassware'
  },
  'prod-023': {
    name: 'Plain India Basin',
    price: 65000,
    originalPrice: 78000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Wash Hand Basins'
  },
  'prod-024': {
    name: 'Pro WC Series',
    price: 210000,
    originalPrice: 245000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Water Closets & Toilets'
  },
  'prod-025': {
    name: 'V-Star Crola with Large Basin',
    price: 145000,
    originalPrice: 170000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Wash Hand Basins'
  },
  'prod-026': {
    name: 'V-Star Medium Pro',
    price: 195000,
    originalPrice: 225000,
    priceOnRequest: false,
    group: 'sanitary',
    subcategory: 'Water Closets & Toilets'
  }
};

let content = fs.readFileSync('app/data/doorsData.ts', 'utf8');

// 1. Add group and subcategory to interface
if (!content.includes('group?:')) {
  content = content.replace(
    '  category: "security-doors"',
    '  group?: "doors" | "sanitary";\n  subcategory?: string;\n  category: "security-doors"'
  );
}

// 2. Add CATEGORY_GROUPS if not present
if (!content.includes('CATEGORY_GROUPS')) {
  const groupsDefinition = `export const CATEGORY_GROUPS = [
  {
    id: "doors",
    title: "Category A: Premium Doors & Architectural Entrances",
    subcategories: [
      { id: "foreign-hdf", name: "Foreign HDF Luxury Doors", filterCategory: "hdf-doors" },
      { id: "security-steel", name: "Security & Bulletproof Doors", filterCategory: "security-doors" },
      { id: "luxury-cast", name: "Bible Design & Italian Copper Doors", filterCategory: "luxury-doors" },
      { id: "watson-panel", name: "Watson & American Panel Doors", filterCategory: "interior-doors" },
      { id: "waterproof-doors", name: "Waterproof Bathroom Doors", filterCategory: "bathroom-doors" },
    ]
  },
  {
    id: "sanitary",
    title: "Category B: Luxury Sanitary Ware & Bathroom Fittings",
    subcategories: [
      { id: "wc", name: "Water Closets & Toilets", filterCategory: "sanitary-fittings" },
      { id: "basins", name: "Wash Hand Basins", filterCategory: "sanitary-fittings" },
      { id: "showers", name: "Showers & Enclosures", filterCategory: "sanitary-fittings" },
      { id: "sinks-taps", name: "Kitchen Sinks & Brassware", filterCategory: "sanitary-fittings" },
    ]
  }
];\n\n`;
  content = content.replace('export const DOOR_PRODUCTS: DoorProduct[] = [', groupsDefinition + 'export const DOOR_PRODUCTS: DoorProduct[] = [');
}

// 3. Update each product block
for (const [id, meta] of Object.entries(PRODUCTS_METADATA)) {
  const idRegex = new RegExp(`id:\\s*"${id}"[\\s\\S]*?\\n  \\},`, 'm');
  const match = content.match(idRegex);
  if (match) {
    let block = match[0];
    
    // update name
    block = block.replace(/name:\s*".*?",/, `name: "${meta.name}",\n    group: "${meta.group}",\n    subcategory: "${meta.subcategory}",`);
    
    // update price
    block = block.replace(/price:\s*\d+,/, `price: ${meta.price},`);
    block = block.replace(/originalPrice:\s*\d+,/, `originalPrice: ${meta.originalPrice},`);
    block = block.replace(/priceOnRequest:\s*(true|false),/, `priceOnRequest: ${meta.priceOnRequest},`);
    
    content = content.replace(match[0], block);
  }
}

// 4. Add Harmony Toilet Set prod-027 if missing
if (!content.includes('prod-027')) {
  const prod27 = `  {
    id: "prod-027",
    slug: "harmony-toilet-set",
    name: "Harmony Toilet Set",
    group: "sanitary",
    subcategory: "Water Closets & Toilets",
    category: "sanitary-fittings",
    categoryLabel: "Sanitary & Bathroom Fittings",
    price: 175000,
    originalPrice: 205000,
    priceOnRequest: false,
    image: "/products/Virony wc.jpeg",
    gallery: ["/products/Virony wc.jpeg", "/products/Conceal wc.jpeg"],
    badge: "Popular Set",
    stockStatus: "in_stock",
    stock: 18,
    shortDescription: "Complete coordinated ceramic water closet suite with quiet siphon flushing and durable soft-close seat.",
    description: "The Harmony Toilet Set delivers quiet, high-efficiency dual-flush technology with premium glazed vitreous china designed for residential homes, guest suites, and estate installations.",
    specifications: {
      "Flushing Technology": "Siphonic Dual-Flush 3L/6L",
      "Glaze": "Nano Anti-Bacterial Ultra-Smooth Ceramic",
      "Trapway": "Concealed Smooth Skirted Trapway",
      "Installation": "Standard Floor Mount Rough-in"
    },
    jijiUrl: "https://jiji.ng/shop/anambrabestdoor",
    seoTitle: "Harmony Toilet Set | Luxury Water Closet | Anambra Best Door",
    seoDescription: "Shop the Harmony Toilet Set at Anambra Best Door. Luxury sanitary wares directly from Maraim Plaza Ogidi depot.",
    focusKeyphrase: "Harmony Toilet Set",
    featured: true,
    active: true,
  },
];`;
  content = content.replace(/\n\];\s*$/, ',\n' + prod27 + '\n');
}

fs.writeFileSync('app/data/doorsData.ts', content, 'utf8');
console.log('Successfully updated app/data/doorsData.ts with categories, subcategories, and realistic depot pricing!');
