# Anambra Best Door: Developer SEO Architecture & Implementation Guide

This guide is written for engineers and developers working on the Anambra Best Door codebase. It documents every search engine optimization (SEO) system already built into the application, explains how to replicate them for new routes, and outlines upcoming SEO features to implement.

---

## 1. System Overview: How Next.js Handles SEO

In traditional Single Page Applications (e.g., standard Vite or Create-React-App), HTML is served nearly blank (`<div id="root"></div>`), requiring client-side JavaScript to render text. Search engine crawlers (Googlebot, Bingbot) can struggle or delay indexing with purely client-side rendering.

Our application uses **Next.js App Router (Server-Side Rendering & Static Generation)**. Every page's HTML, metadata, heading hierarchy, and structured schema are generated on the server before reaching the crawler, ensuring immediate indexability.

---

## 2. Implemented SEO Systems (How to Replicate)

### 2.1 Dynamic Metadata & OpenGraph (`generateMetadata`)

Next.js provides two ways to declare metadata:
1. **Static Metadata**: For static pages (`/about`, `/contact`, `/shipping`), export a `const metadata: Metadata` object in `layout.tsx` or `page.tsx`.
2. **Dynamic Metadata**: For dynamic parameter routes (`/products/[id]` or `/collections/[slug]`), export an `async function generateMetadata({ params })`.

#### How to Replicate for a Dynamic Page:
Look at [`app/products/[id]/page.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/products/[id]/page.tsx#L76-L128):

```typescript
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This item is not listed in our inventory.",
    };
  }

  const title = product.seoTitle || `${product.name} | Price & Specs | Anambra Best Door`;
  const description = product.seoDescription || product.shortDescription;
  const canonicalUrl = `https://anambrabestdoor.com/products/${product.slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: [product.name, product.categoryLabel, "Building Materials Ogidi", "Security doors Onitsha"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_NG",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}
```

*Key Takeaway*: Always specify a **canonical URL** (`alternates.canonical`). This tells Google which URL is the master version, preventing duplicate content penalties if products are accessed by both database ID and URL slug.

---

### 2.2 Dynamic XML Sitemap (`app/sitemap.ts`)

Instead of maintaining a static `sitemap.xml` file by hand, our application uses [`app/sitemap.ts`](file:///c:/Users/X/Desktop/cfankenterprise/app/sitemap.ts), which dynamically generates the sitemap whenever new products or categories are added.

* Location: `https://anambrabestdoor.com/sitemap.xml`
* Automatically merges:
  1. Static core routes (`/`, `/shop`, `/wholesale`, `/about`, `/contact`, `/blog`, `/shipping`, `/faq`).
  2. All category collection routes (`/collections/[slug]`).
  3. Every active product in the database (`/products/[slug]`), with `lastModified` date and crawler priority settings (`0.8` to `1.0`).

#### Rule for Developers:
Whenever you create a new public top-level section (e.g., `/calculator` or `/trade-portal`), add its entry into the `staticRoutes` array inside [`app/sitemap.ts`](file:///c:/Users/X/Desktop/cfankenterprise/app/sitemap.ts).

---

### 2.3 Crawler Directives (`app/robots.ts`)

[`app/robots.ts`](file:///c:/Users/X/Desktop/cfankenterprise/app/robots.ts) tells web robots which pages to index and which to ignore.

* **Allowed**: All public catalog pages, blogs, and marketing pages.
* **Disallowed**:
  * `/admin/` and `/admin/*` (preventing indexing of administrative dashboards)
  * `/api/` (preventing crawlers from wasting crawl budget on JSON endpoints)
  * `/checkout` and `/account/` (preventing private customer session indexing)
* Links directly to the sitemap: `sitemap: https://anambrabestdoor.com/sitemap.xml`.

---

### 2.4 Structured Data / Schema.org (JSON-LD)

Search engines read HTML for text, but they read **Schema.org JSON-LD** to understand the entity behind the text. Rich results (star ratings, prices, in-stock badges, Google Knowledge Panels) come directly from JSON-LD.

Our implementation spans three key schemas:

1. **LocalBusiness & Organization Schema** ([`app/components/JsonLd.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/components/JsonLd.tsx)):
   * Declares business entity (`CFrank Enterprise` trading as `Anambra Best Door`).
   * Physical GPS coordinates (`latitude: 6.1432`, `longitude: 6.8623`).
   * Postal address in Ogidi, Anambra State.
   * `areaServed`: Anambra, Delta, Enugu, Imo, Rivers, Lagos, Abuja.
   * `currenciesAccepted`: `NGN`.
   * `openingHoursSpecification`: Monday through Saturday, 08:00 to 17:30.

2. **Product Schema** ([`app/products/[id]/page.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/products/[id]/page.tsx#L162-L236)):
   * Declares `@type: "Product"` with SKU, name, brand, image, and description.
   * `offers`: Price in NGN, price validity window (`priceValidUntil`), and stock status (`https://schema.org/InStock` vs `OutOfStock`).
   * `hasMerchantReturnPolicy`: 7-day finite return window for physical warehouse inspection.
   * `shippingDetails`: Handling time (0-1 days) and transit time (1-3 days nationwide).

3. **BreadcrumbList Schema** ([`app/products/[id]/page.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/products/[id]/page.tsx#L238-L255) & [`app/collections/[slug]/page.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/collections/[slug]/page.tsx#L214-L230)):
   * Declares the site hierarchy (`Home > Collections > Security Doors > Product Name`) so Google displays breadcrumb navigation in search snippets.

4. **FAQPage Schema** ([`app/page.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/page.tsx#L97-L115) & [`app/faq/page.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/faq/page.tsx#L50-L65)):
   * Structures questions and answers so Google can render accordions directly on the search engine results page (SERP).

---

### 2.5 On-Page Heading Hierarchy & Semantic HTML

Every page follows strict semantic HTML rules:
* Exactly **one `<h1>`** per page (the main title).
* Section headings use `<h2>`, and sub-topics or product card titles use `<h3>`.
* Interactive buttons use `<button>`, and destination links use Next.js `<Link>`.
* All image tags use `alt` attributes containing the product name and category rather than generic filler words.

---

### 2.6 Real-Time Admin SEO Scorer (Yoast-Style)

In the Admin Dashboard ([`app/admin/AdminClient.tsx`](file:///c:/Users/X/Desktop/cfankenterprise/app/admin/AdminClient.tsx#L973-L1022)), we built an interactive real-time SEO health checker. When staff members add or edit a product, the system calculates a 0-100 score based on:
1. **Focus Keyphrase presence** in the product name and SEO title.
2. **SEO Title Length**: Recommended 25 to 65 characters.
3. **Meta Description Length**: Recommended 80 to 160 characters.
4. **Product Photography**: Validation that image assets are configured.
5. **Marketplace Cross-Linking**: Validation of Jiji.ng verified store URL.

---

## 3. SEO Systems Yet to Implement (Action Plan)

The following systems are planned for upcoming development phases:

### Phase 1: Search Engine Verification & Indexing
- [ ] **Google Search Console (GSC) Verification**:
  * Sign in to Google Search Console with the business Google account.
  * Add domain property `anambrabestdoor.com`.
  * Confirm the TXT DNS verification record on Namecheap/Cloudflare or HTML tag in `app/layout.tsx` (`verification.google`).
  * Submit `https://anambrabestdoor.com/sitemap.xml`.
- [ ] **Bing Webmaster Tools Verification**:
  * Import verified GSC profile into Bing Webmaster Tools to capture traffic from Bing and Yahoo.

### Phase 2: Google Merchant Center & Free Shopping Listings
- [ ] **Automated Google Shopping Product Feed (`/api/feed/google-shopping`)**:
  * Search engines crawl a specialized XML/TSV feed for Google Shopping free listings.
  * Build an endpoint that queries `db.getProducts()` and outputs Google Merchant RSS 2.0 XML:
    * `<g:id>`: Product ID / SKU.
    * `<g:title>`: Clean product name.
    * `<g:description>`: Detailed product description.
    * `<g:link>`: Canonical URL.
    * `<g:image_link>`: High-resolution product image.
    * `<g:availability>`: `in_stock` or `out_of_stock`.
    * `<g:price>`: E.g., `185000 NGN`.
    * `<g:condition>`: `new`.

### Phase 3: Content Marketing & Topic Clusters
- [ ] **Technical Door Buyer Guides on `/blog`**:
  * Create high-intent commercial guides answering frequent customer search queries:
    1. *Turkish Armoured Doors vs Israeli Security Doors: Steel Gauge & Pricing Guide in Nigeria*.
    2. *Standard Door Sizes in Nigeria (3ft, 4ft, 5ft) for Masons and Site Engineers*.
    3. *Waterproof WPC Bathroom Doors vs Wooden Doors: Why Flush Doors Rot*.
  * Each article must cross-link directly to relevant product collections with contextual anchor text.

### Phase 4: Image SEO Optimization
- [ ] **Descriptive Image File Naming**:
  * When uploading via Admin Cloudinary integration, enforce automatic slug-based image naming (e.g., `turkish-security-door-double-leaf-onitsha.webp` instead of `IMG_20261028_1829.jpg`).
- [ ] **Image Sitemap**:
  * Extend `app/sitemap.ts` to include Google image tags (`<image:image><image:loc>...</image:loc></image:image>`) for faster indexing in Google Images.

### Phase 5: Local SEO & Google Business Profile Alignment
- [ ] **Google Business Profile (GBP) Synchronization**:
  * Ensure the GBP profile for Anambra Best Door exactly matches our website:
    * Primary Name: `Anambra Best Door - CFrank Enterprise`
    * Address: `Shop 8, First Floor, God's Own Plaza W-Line, Building Materials International Market, Ogidi, Anambra State (Opposite Chubby Plaza)`
    * Phone: `+234 707 007 0305`
    * Category: `Door Supplier`, `Building Materials Store`
  * Add the website URL `https://anambrabestdoor.com` directly to the GBP profile.

---

## 4. Checklist for Adding a New Page or Route

Whenever you add a new page to this project, complete this checklist before opening a Pull Request:

1. **Title & Meta Description**: Does the page export a descriptive `title` and `description` (avoiding generic copy)?
2. **Canonical Link**: Is `alternates: { canonical: ... }` configured?
3. **OpenGraph Card**: Are `og:title`, `og:description`, and `og:image` defined for WhatsApp and Facebook sharing previews?
4. **Semantic Structure**: Is there exactly one `<h1>` tag at the top of the content?
5. **Heading Hierarchy**: Do subheadings use `<h2>` and `<h3>` without skipping levels?
6. **Image Alt Text**: Do all `<Image />` elements include descriptive, natural English `alt` text?
7. **XML Sitemap**: Is the new route added to `app/sitemap.ts`?
8. **Schema.org**: If the page represents a product, service, or FAQ, is JSON-LD structured data provided?
9. **Crawler Validation**: Is the page accessible to crawlers (not blocked in `app/robots.ts`)?
10. **Build Check**: Does `npm run build` compile all static and dynamic pages with 0 TypeScript and Next.js errors?
