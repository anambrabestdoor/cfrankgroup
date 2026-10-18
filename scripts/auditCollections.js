const fs = require('fs');
const db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
const products = db.products;

const slugs = [
  'bestsellers', 'viral-pdrn', 'value-sets', 'acne', 'dark-spots', 'blackheads',
  'dullness', 'dryness', 'sensitive', 'aging', 'texture',
  'cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'face-masks', 'spot-care', 'peels',
  'azelaic-acid', 'heartleaf', 'niacinamide', 'retinol', 'rice', 'peach', 'ceramide'
];

console.log("=== COLLECTION PRODUCTS AUDIT ===");
slugs.forEach(slug => {
  const matches = products.filter(p => {
    if (p.active === false) return false;
    const t = (p.name + ' ' + p.description + ' ' + p.category + ' ' + p.subcategory + ' ' + (p.ingredients||[]).join(' ') + ' ' + (p.skinConcerns||[]).join(' ')).toLowerCase();
    switch (slug) {
      case 'bestsellers': return p.badge?.toLowerCase().includes('bestseller') || (p.reviewsCount||0) > 3000;
      case 'viral-pdrn': return p.badge?.toLowerCase().includes('pdrn') || (p.ingredients||[]).some(i => i.toLowerCase().includes('pdrn')) || p.name.toLowerCase().includes('pdrn');
      case 'value-sets': return (p.originalPrice||0) > p.price || p.name.toLowerCase().includes('set') || p.name.toLowerCase().includes('kit') || p.name.toLowerCase().includes('bundle');
      case 'acne': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('acne')) || t.includes('acne');
      case 'dark-spots': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('dark')) || t.includes('dark');
      case 'blackheads': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('pore') || c.toLowerCase().includes('blackhead')) || t.includes('blackhead') || t.includes('pore');
      case 'dullness': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('dull')) || t.includes('dull') || t.includes('bright');
      case 'dryness': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('dry') || c.toLowerCase().includes('barrier')) || t.includes('dry') || t.includes('hydrat');
      case 'sensitive': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('sensitive') || c.toLowerCase().includes('sooth')) || t.includes('sooth') || t.includes('calm');
      case 'aging': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('aging') || c.toLowerCase().includes('wrinkle')) || t.includes('aging') || t.includes('collagen');
      case 'texture': return (p.skinConcerns||[]).some(c => c.toLowerCase().includes('texture') || c.toLowerCase().includes('irregular')) || t.includes('texture') || t.includes('exfoliat');
      case 'cleanser': return p.category.toLowerCase().includes('cleans') || p.subcategory.toLowerCase().includes('cleans');
      case 'toner': return p.category.toLowerCase().includes('toner') || p.subcategory.toLowerCase().includes('toner') || p.subcategory.toLowerCase().includes('pad');
      case 'serum': return p.category.toLowerCase().includes('serum') || p.subcategory.toLowerCase().includes('serum') || p.subcategory.toLowerCase().includes('ampoule');
      case 'moisturizer': return p.category.toLowerCase().includes('moistur') || p.subcategory.toLowerCase().includes('cream') || p.subcategory.toLowerCase().includes('lotion');
      case 'sunscreen': return p.category.toLowerCase().includes('sun') || p.subcategory.toLowerCase().includes('spf');
      case 'face-masks': return t.includes('mask') || t.includes('sheet') || t.includes('pad');
      case 'spot-care': return t.includes('spot') || t.includes('treatment') || t.includes('patch');
      case 'peels': return t.includes('peel') || t.includes('exfoliat') || t.includes('acid');
      case 'azelaic-acid': return t.includes('azelaic');
      case 'heartleaf': return t.includes('heartleaf');
      case 'niacinamide': return t.includes('niacinamide');
      case 'retinol': return t.includes('retinol');
      case 'rice': return t.includes('rice');
      case 'peach': return t.includes('peach');
      case 'ceramide': return t.includes('ceramide');
      default: return false;
    }
  });
  console.log(`Slug '${slug}': ${matches.length} products`);
});
