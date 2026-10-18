const fs = require('fs');
const path = require('path');

const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));
const products = db.products || [];

let output = 'export const PRODUCTS: Product[] = [\n';

products.forEach((p, i) => {
  const ing = JSON.stringify(p.ingredients || []);
  const sc = JSON.stringify(p.skinConcerns || []);
  const badge = p.badge ? JSON.stringify(p.badge) : 'null';
  const handle = p.handle || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  output += `  {\n`;
  output += `    id: ${JSON.stringify(p.id)},\n`;
  output += `    handle: ${JSON.stringify(handle)},\n`;
  output += `    name: ${JSON.stringify(p.name)},\n`;
  output += `    subtitle: ${JSON.stringify(p.subtitle || '')},\n`;
  output += `    description: ${JSON.stringify(p.description)},\n`;
  output += `    price: ${Number(p.price)},\n`;
  output += `    originalPrice: ${Number(p.originalPrice || p.price)},\n`;
  output += `    rating: ${Number(p.rating || 4.8)},\n`;
  output += `    reviewsCount: ${Number(p.reviewsCount || 500)},\n`;
  output += `    image: ${JSON.stringify(p.image)},\n`;
  output += `    category: ${JSON.stringify(p.category)},\n`;
  output += `    subcategory: ${JSON.stringify(p.subcategory || '')},\n`;
  output += `    badge: ${badge},\n`;
  output += `    active: ${p.active !== false},\n`;
  output += `    stock: ${Number(p.stock || 100)},\n`;
  output += `    ingredients: ${ing},\n`;
  output += `    skinConcerns: ${sc},\n`;
  output += `    featured: ${!!p.featured},\n`;
  output += `    kendallFav: ${!!p.kendallFav},\n`;
  output += `  }${i < products.length - 1 ? ',' : ''}\n`;
});

output += '];\n';

// Write to a temp file first so we can inspect
fs.writeFileSync(path.join(__dirname, 'generatedProducts.txt'), output, 'utf8');
console.log(`Generated ${products.length} products → scripts/generatedProducts.txt`);
console.log('Categories:', [...new Set(products.map(p => p.category))].join(', '));
