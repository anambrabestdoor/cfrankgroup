# CFrank Group

Digital commerce platform and architectural building supplies procurement portal for **CFrank Group**, featuring security doors, stone-coated roof tiles, smart biometric locksets, and luxury sanitary wares.

- **Corporate Brand:** CFrank Group
- **Registered Operating Property:** Anambra Best Door Enterprises
- **CAC Registration:** BN 9943925 (Corporate Affairs Commission)
- **Anti-Money Laundering Compliance:** SCUML RN: SC 041603036 (Special Control Unit Against Money Laundering / EFCC)
- **Headquarters:** No. 16/17 Maraim Plaza, Building Materials International Market, Ogidi, Anambra State, Nigeria

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
- **Asset Storage:** Cloudinary (Namespaced to `cfrank_group/`)
- **Email:** Resend API
- **AI Assistant:** Google Gemini API (Frankie Assistant)
- **Styling:** Tailwind CSS 4
- **Hosting & CI/CD:** Vercel + GitHub Actions

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Type check & production build test
npx tsc --noEmit
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create `.env.local` in the project root:

```env
# -------------------------------------------------------------------------
# Application URLs
# -------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# -------------------------------------------------------------------------
# Supabase Database (Dedicated CFrank Group Project)
# -------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# -------------------------------------------------------------------------
# Cloudinary (Can reuse existing account — namespaced to cfrank_group/)
# -------------------------------------------------------------------------
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# -------------------------------------------------------------------------
# Resend Email API
# -------------------------------------------------------------------------
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL="CFrank Group <orders@cfrankgroup.com>"
RESEND_REPLY_TO_EMAIL="info@cfrankgroup.com"
ADMIN_NOTIFICATION_EMAIL=info@cfrankgroup.com

# -------------------------------------------------------------------------
# AI Assistant (Google Gemini)
# -------------------------------------------------------------------------
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# -------------------------------------------------------------------------
# Admin Dashboard Authentication
# -------------------------------------------------------------------------
JWT_SECRET=super-secure-random-jwt-secret-min-32-chars-long
ADMIN_EMAIL=admin@cfrankgroup.com
ADMIN_PASSWORD=YourSecurePassword2026!
```

---

## Supabase Database Setup & Keepalive Guide

### 1. Database Initialization
1. Create a **separate, dedicated Supabase project** for CFrank Group at [supabase.com](https://supabase.com). *(Do not share the database with Anambra Best Door so company settings and orders remain independent).*
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste the contents of [`supabase_schema.sql`](supabase_schema.sql) and click **Run**.
4. Retrieve your **Project URL**, **anon key**, and **service_role key** from **Project Settings → API**.
5. Log into the admin portal (`/admin` → Settings → **Database Health**), click **"Ping Supabase"**, then click **"Sync Catalogue to Supabase"** to populate all products and settings with one click.

---

### 2. Dual Keepalive System (Preventing 7-Day Free-Tier Pause)

Supabase pauses free-tier databases after **7 days of inactivity**. To guarantee 100% uptime, this repository employs a **dual daily keepalive system** running across two independent cloud providers.

#### Why previous crons failed & how this solves it:
- **Active PostgreSQL Write Transactions:** Supabase's pause monitor tracks PostgreSQL database engine activity (Write-Ahead Logs and disk I/O). Read-only `HEAD` requests can be satisfied from edge caches without waking the Postgres engine.
- The keepalive route (`/api/cron/keepalive`) now executes both a **read query** and an **active write transaction**:
  ```ts
  await supabase.from("site_settings").update({ updated_at: timestamp }).eq("id", "global");
  ```
  This creates an active WAL event and guarantees Supabase registers compute activity.

#### Schedule:
1. **Cron #1 — Vercel Cron:**
   - Defined in [`vercel.json`](vercel.json).
   - Executes daily at **12:00 UTC**, invoking `/api/cron/keepalive`.
2. **Cron #2 — GitHub Actions:**
   - Defined in [`.github/workflows/keepalive.yml`](.github/workflows/keepalive.yml).
   - Executes twice daily at **00:00 UTC** and **12:00 UTC**.
   - Queries the Supabase REST API directly and pings the production site.
   - Can be triggered manually on demand via the **Actions** tab on GitHub (**Run workflow** button).

#### Configuring GitHub Actions Secrets:
To enable the direct GitHub Actions keepalive:
1. Open your GitHub repository: [https://github.com/anambrabestdoor/cfrankgroup](https://github.com/anambrabestdoor/cfrankgroup)
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name | Where to Find It |
|---|---|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` secret |
| `SITE_URL` *(Optional)* | Your production URL (e.g. `https://cfrankgroup.com`) |

---

## Cloudinary Asset Configuration

You can use your existing Cloudinary credentials. All uploads from this project are strictly namespaced under the **`cfrank_group/`** folder:
- **Products:** `cfrank_group/products`
- **Videos:** `cfrank_group/videos`
- **Site Assets:** `cfrank_group/site`

Existing media from previous projects will not be overwritten or modified.

---

## Legal & Compliance Security

### Document Protection (SCUML & CAC)
To prevent unauthorized downloads, scraping, and fraudulent reproduction of legal certificates:
- Documents are rendered using HTML5 `<canvas>` via [`ProtectedDocumentViewer.tsx`](app/components/ProtectedDocumentViewer.tsx) with **no direct `<img>` tags in the DOM**.
- Context menu (right-click) and drag-and-drop are disabled.
- An invisible interaction shield overlays the graphics, directing DOM inspection tools to an empty `<div>`.
- Documents feature a permanently burned forensic anti-tamper watermark:
  > `VERIFICATION COPY • CFRANK GROUP PROPERTY • ANAMBRA BEST DOOR ENTERPRISES (RN: SC 041603036) • NOT FOR RE-USE`
- Certificates are suppressed during browser print / PDF export (`@media print`).

### Payment Safety Policy
All customer-facing order touchpoints (About page, Checkout, Invoice quotes) enforce the strict payment verification notice:
> *"All bank transfers must be made exclusively to accounts bearing the exact business name **Anambra Best Door Enterprises**. The account must be verified and approved by a verified customer care agent of the company before any transfer is made. Any payment instruction for a different account name is not from us."*
