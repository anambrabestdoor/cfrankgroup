# MASTER PROMPT — REBRAND ANUA PROJECT TO CFRANK Enterprise

You are working inside an existing production-oriented Next.js project originally built for an Anua skincare/e-commerce business.

Your task is to transform this existing project into a completely independent, professional website and digital platform for:

# CFRANK Enterprise

The previous Anua brand must NOT remain visible anywhere in the final application.

This is not a superficial find-and-replace exercise.

You must first understand the existing codebase, identify reusable architecture, identify Anua-specific assumptions, and then systematically transform the project into a Cfrank Enterprise platform.

Do not destroy useful existing functionality simply because it was originally built for Anua.

---

# 1. FIRST: AUDIT THE ENTIRE PROJECT

Before modifying files, inspect the repository thoroughly.

Understand:

* Next.js version
* App Router / Pages Router
* TypeScript configuration
* Tailwind/CSS architecture
* component structure
* layouts
* routes
* API routes/server actions
* Supabase integration
* database schema
* authentication
* authorization
* admin dashboard
* product/catalogue functionality
* cart/order functionality if present
* email functionality
* Resend integration
* image/media handling
* Cloudinary integration if present
* environment variables
* middleware
* SEO implementation
* metadata
* sitemap
* robots.txt
* structured data
* analytics
* forms
* validation
* error handling
* loading states
* responsive behaviour
* security practices

Search the entire repository for:

* Anua
* skincare
* cosmetics
* beauty
* serum
* moisturizer
* cleanser
* skincare-specific terminology
* Anua image URLs
* Anua product names
* old brand metadata
* old social links
* old contact information
* old domain references
* old Open Graph data
* old structured data
* hardcoded demo data
* placeholder content
* fake reviews
* fake customer information

Do not start blindly editing files.

Create an internal understanding of what can be reused and what must be replaced.

---

# 2. CORE OBJECTIVE

Transform the project into a professional website for Cfrank Enterprise.

The final project should feel like it was originally designed and engineered for Cfrank Enterprise.

Do NOT leave behind:

* Anua branding
* skincare terminology
* irrelevant product categories
* old colour systems
* old copy
* old metadata
* old structured data
* old image assets
* old business information
* old URLs
* old SEO references
* old schema
* old social links
* old email addresses
* old domain names

There must be no accidental Anua references in the production build.

---

# 3. BRAND NAME

Use:

Cfrank Enterprise

Treat the brand as a broader business rather than locking the company permanently into one narrow product category.

However, DO NOT invent what Cfrank Enterprise actually sells or does.

The client-provided business information is the source of truth.

If business information is missing, create clearly identifiable placeholders for the admin/client to replace.

Never fabricate:

* addresses
* phone numbers
* WhatsApp numbers
* prices
* testimonials
* reviews
* certifications
* years of experience
* delivery claims
* locations served
* awards
* company history
* social accounts
* product specifications
* guarantees
* statistics

---

# 4. BRAND SYSTEM

Create a coherent visual identity around Cfrank Enterprise.

Do not simply inherit the Anua colour palette.

Build:

* primary brand colour
* secondary colour
* neutral palette
* typography hierarchy
* buttons
* cards
* forms
* badges
* navigation
* footer
* section headings
* product presentation
* CTA components
* responsive states

The design should feel:

* professional
* modern
* trustworthy
* clean
* commercial
* fast
* credible
* Nigerian-market appropriate
* mobile-first

Avoid generic AI-generated website aesthetics.

Do NOT overuse:

* gradients
* glassmorphism
* excessive rounded cards
* glowing elements
* unnecessary animations
* giant decorative typography
* meaningless statistics
* fake trust badges
* excessive shadows
* pulsing UI
* generic stock-style sections

Design should support the business rather than distract from it.

---

# 5. INFORMATION ARCHITECTURE

Determine the appropriate final site structure based on the actual Cfrank Enterprise business.

Potential structure may include:

/
/about
/products
/products/[slug]
/categories/[slug]
/services
/projects
/contact
/shipping
/blog
/blog/[slug]

Only create sections that make sense for the actual business.

Do not create pages merely to make the website appear larger.

If a section is not supported by real business information, either omit it or create a clearly marked content placeholder.

---

# 6. HOMEPAGE

Rebuild the homepage specifically for Cfrank Enterprise.

The homepage should communicate immediately:

1. What Cfrank Enterprise is
2. What it offers
3. Who it serves
4. Why someone should explore/contact/buy
5. How to take the next step

Potential sections:

* Hero
* Core offering
* Featured products/services
* Product categories
* About/brand introduction
* How it works
* Projects/gallery
* Delivery/shipping information where applicable
* Testimonials where real testimonials exist
* FAQ where real questions exist
* CTA
* Contact
* Footer

Do not fill missing sections with fabricated claims.

---

# 7. PRODUCT / CATALOGUE SYSTEM

Reuse the existing e-commerce architecture where appropriate.

Products should support appropriate fields such as:

* name
* slug
* description
* short description
* price
* sale price if applicable
* SKU where applicable
* category
* images
* videos where applicable
* specifications
* availability
* featured status
* SEO title
* SEO description
* canonical URL where necessary
* created_at
* updated_at

Use Supabase as the source of truth.

Do not hardcode the catalogue into React components.

Product pages should be dynamically generated.

Use clean URLs:

/products/product-name

instead of:

/product?id=123

where appropriate.

---

# 8. MEDIA

Use Cloudinary for appropriate image/video media rather than storing large binary files directly inside PostgreSQL.

Implement sensible upload restrictions.

Initial application-level recommendations:

Images:

* maximum approximately 5 MB per file
* optimize automatically
* resize oversized images
* use modern formats where appropriate

Videos:

* maximum approximately 50 MB per file
* reasonable duration restriction
* optimize/compress where possible

These limits must be configurable rather than scattered as magic numbers throughout the application.

Never allow arbitrary massive uploads.

Store media references/URLs and metadata in Supabase rather than binary media.

---

# 9. ADMIN DASHBOARD

Preserve and adapt the existing admin functionality.

The administrator should be able to manage appropriate business content such as:

* products
* categories
* product images
* product videos
* descriptions
* pricing
* availability
* blog posts
* FAQs
* testimonials
* projects/gallery
* contact information
* SEO metadata

Only expose features that are actually supported by the existing application architecture and business requirements.

Do not create fake dashboard functionality.

Every admin action must actually persist data.

Do not simulate persistence with localStorage.

---

# 10. SUPABASE

Audit the existing Supabase implementation.

Verify:

* schema
* relationships
* indexes
* RLS
* authentication
* authorization
* server/client boundaries
* exposed data
* service-role usage
* API access
* database queries
* validation

Never expose:

SUPABASE_SERVICE_ROLE_KEY

to the browser.

Use environment variables correctly.

Do not weaken Row Level Security merely to make the application work.

Remove unnecessary Anua tables/fields if they have no purpose.

Do not destroy useful existing data without understanding its purpose.

---

# 11. EMAIL / RESEND

Audit the existing Resend implementation.

Remove Anua-specific email templates.

Create Cfrank Enterprise email templates where required.

Examples:

* contact form notification
* customer inquiry
* order notification if ordering exists
* admin notification
* confirmation email where appropriate

Do not expose email API keys client-side.

Use server-side email sending.

Implement proper validation and rate limiting for public forms.

---

# 12. SECURITY

Treat the project as a production website.

Check for:

* exposed API keys
* exposed service-role keys
* insecure server actions
* missing authorization
* unrestricted database writes
* unsafe file uploads
* XSS
* injection vulnerabilities
* weak validation
* unrestricted admin operations
* insecure redirects
* spam-prone forms
* abuse of public APIs
* missing rate limits

Validate input on the server.

Do not trust client-side validation alone.

---

# 13. PERFORMANCE

Optimize for real mobile users.

Pay particular attention to:

* image optimization
* responsive images
* lazy loading
* server components
* unnecessary client components
* JavaScript bundle size
* font loading
* third-party scripts
* database queries
* caching
* duplicate requests
* Core Web Vitals

Do not introduce animations or libraries that negatively affect performance without a real reason.

---

# 14. SEO FOUNDATION

Prepare the entire website for search engines.

Every important indexable page should have:

* unique title
* unique meta description
* canonical URL
* appropriate heading structure
* descriptive URL
* Open Graph metadata
* Twitter/X metadata where appropriate
* meaningful image alt text
* internal links
* crawlable content

Implement:

* sitemap.xml
* robots.txt
* canonical URLs
* 404 page
* appropriate redirects
* breadcrumb navigation where useful
* structured data

Use Next.js metadata APIs properly.

Do not duplicate metadata across every page.

---

# 15. STRUCTURED DATA

Implement schema only where it accurately represents the page.

Potential schemas:

* Organization
* LocalBusiness if appropriate
* WebSite
* BreadcrumbList
* Product
* ProductGroup
* Article
* FAQPage only when the visible page genuinely contains qualifying FAQ content

Do not fabricate schema properties.

Do not create fake:

* ratings
* review counts
* prices
* addresses
* phone numbers
* opening hours
* aggregate ratings

Structured data must match visible page content.

---

# 16. GEO / AI SEARCH READINESS

Structure the website so that information is easy for search engines and AI answer systems to understand.

Use:

* clear entity information
* explicit business description
* consistent business name
* consistent contact information
* clear product/service descriptions
* question-and-answer content
* descriptive headings
* concise factual paragraphs
* semantic HTML
* strong internal linking
* structured data
* author information for articles
* publication/update dates
* clear location information where applicable

Do not keyword-stuff.

Do not write unnatural AI-targeted copy.

The goal is to make Cfrank Enterprise genuinely understandable and quotable as an entity.

---

# 17. BLOG

If the existing project has a blog system, adapt it to Cfrank Enterprise.

The admin must be able to:

* create
* edit
* save
* publish
* unpublish
* delete
* categorize

blog posts.

Each article should support:

* title
* slug
* excerpt
* content
* featured image
* author
* category
* published date
* updated date
* SEO title
* SEO description
* canonical URL

Do not generate hundreds of AI articles.

Create an architecture that supports genuinely useful content.

---

# 18. LOCAL SEARCH READINESS

Where applicable, prepare the website for local search.

Ensure the business's real:

* name
* address
* phone
* service area
* operating hours
* contact information

can be represented consistently.

Do not invent location data.

If the client later creates a Google Business Profile, the website should use consistent NAP information.

---

# 19. ANALYTICS

Preserve or implement appropriate analytics.

Track meaningful events where appropriate:

* product views
* contact clicks
* WhatsApp clicks
* phone clicks
* email clicks
* catalogue interactions
* form submissions
* purchases/orders if applicable

Do not create fake analytics numbers.

---

# 20. REMOVE THE OLD BRAND COMPLETELY

Before completion, perform a repository-wide search.

Search for:

Anua

and all known Anua-specific terminology.

Also search for:

* old domains
* old metadata
* old images
* old product names
* old email addresses
* old social URLs
* old company names
* old schema
* old comments containing business-specific references

There should be no accidental Anua references remaining.

---

# 21. DO NOT FAKE FUNCTIONALITY

This rule is critical.

Never create:

* fake authentication
* fake database persistence
* fake analytics
* fake order systems
* fake reviews
* fake customer counts
* fake Google rankings
* fake indexing status
* fake API responses
* fake admin actions
* localStorage pretending to be a database

If functionality is not implemented, implement it properly or clearly identify it as incomplete.

---

# 22. DOMAIN / DEPLOYMENT

Prepare the project for deployment on Vercel.

Do not assume traditional shared hosting.

Ensure:

* production build succeeds
* environment variables are documented
* no secrets are committed
* routes work on Vercel
* dynamic routes work
* server actions/API routes work
* images work in production
* Supabase works in production
* Resend works in production
* Cloudinary works in production

Do not hardcode localhost URLs.

Use environment variables for production URLs.

---

# 23. FINAL QUALITY AUDIT

Before declaring the project complete, test:

### Functional

* navigation
* products
* product pages
* search/filtering if present
* forms
* authentication
* admin dashboard
* media uploads
* email
* database operations

### SEO

* metadata
* canonical URLs
* sitemap
* robots
* structured data
* headings
* internal links
* indexability

### Performance

* mobile
* desktop
* image loading
* JS bundle
* Core Web Vitals considerations

### Security

* authentication
* authorization
* RLS
* uploads
* forms
* environment variables
* API exposure

### Branding

* no Anua references
* no old assets
* no old metadata
* no old URLs
* consistent Cfrank Enterprise branding

---

# EXECUTION RULE

Do not rewrite the project blindly.

Work in this order:

1. Audit repository
2. Understand architecture
3. Identify reusable functionality
4. Identify Anua-specific functionality
5. Design Cfrank Enterprise architecture
6. Replace brand system
7. Replace content/data model where necessary
8. Adapt product/catalogue system
9. Adapt admin dashboard
10. Adapt Supabase
11. Adapt Resend
12. Adapt Cloudinary
13. Implement SEO
14. Implement structured data
15. Implement GEO/AI-search readiness
16. Optimize performance
17. Harden security
18. Test
19. Search entire repository for old Anua references
20. Perform final production audit

Do not stop after making the UI look different.

Talking abput ui, check the  photo images for the UI Images samples to use. I wat something like that website, design and color, you can make space for the logo image in the header but for now make use of the text CFrank Enterprise as the logo text. I want it sleek and modern, not the old style. I want the color to be gold and black and white for the logo. the font  of the website 

The objective is a genuinely independent, production-ready Cfrank Enterprise platform built from the reusable foundation of the existing project.

At the end, provide a concise implementation report containing:

* what was reused
* what was removed
* what was rebuilt
* database changes
* new routes
* SEO implementation
* structured data
* GEO implementation
* security improvements
* performance improvements
* environment variables required
* remaining client information required
* known limitations
* deployment instructions
