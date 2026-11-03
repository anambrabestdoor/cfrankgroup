# Anambra Best Door — CFrank Enterprise

E-commerce storefront for Anambra Best Door (CFrank Enterprise), built with Next.js, Supabase, Cloudinary, and Tailwind CSS. Deployed on Vercel.

**Live site:** [anambrabestdoor.com](https://anambrabestdoor.com)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL)
- **Image hosting:** Cloudinary
- **Email:** Resend
- **AI assistant:** Gemini API (Frankie chatbot)
- **Auth:** JWT with bcrypt
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel (Hobby plan)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env.local.example` or create `.env.local` with these keys:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Public site URL (`http://localhost:3000` for dev) |
| `NEXT_PUBLIC_SITE_URL` | Same as above |
| `NODE_ENV` | `development` or `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_FROM_EMAIL` | Sender email address |
| `RESEND_REPLY_TO_EMAIL` | Reply-to email address |
| `ADMIN_NOTIFICATION_EMAIL` | Email for admin notifications |
| `GEMINI_API_KEY` | Google Gemini API key (for Frankie chatbot) |
| `GEMINI_MODEL` | Gemini model name |
| `JWT_SECRET` | Secret for signing auth tokens |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

---

## Supabase Setup

### Database Schema

The full schema is in [`supabase_schema.sql`](supabase_schema.sql). Run it in the Supabase SQL Editor to set up all tables and seed data.

### Keepalive (Preventing Free-Tier Pause)

Supabase pauses free-tier projects after 7 days of inactivity. This project has two keepalive mechanisms:

**1. Vercel Cron** (defined in [`vercel.json`](vercel.json))

Runs daily at 12:00 UTC, hitting `/api/cron/keepalive` which makes a lightweight query to the `products` table.

**2. GitHub Actions** (defined in [`.github/workflows/keepalive.yml`](.github/workflows/keepalive.yml))

Runs daily at 06:00 UTC. Queries the Supabase REST API directly — works even if the Vercel deployment is down.

#### Required GitHub Repository Secrets

These must be set for the GitHub Actions keepalive to work:

1. Go to **GitHub repo** → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Secret Name | Where to Find It |
|-------------|-----------------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → `service_role` key |

Type the secret names manually (don't paste) to avoid hidden characters.

---

## Project Structure

```
app/
  api/              # API routes (auth, cart, orders, products, cron, etc.)
  admin/            # Admin dashboard
  components/       # React components
  shop/             # Storefront pages
  ...
lib/                # Shared utilities (supabase client, auth, db)
public/             # Static assets
scripts/            # Build and sync scripts
.github/workflows/  # GitHub Actions (keepalive)
supabase_schema.sql # Database schema and seed data
vercel.json         # Vercel config and cron jobs
```

---

## Deployment

Deployed automatically via Vercel on push to `main`.

**Vercel project:** [anambrabestdoor](https://vercel.com/anambra-best-door/anambrabestdoor)

Make sure all environment variables listed above are also set in **Vercel** → **Project Settings** → **Environment Variables**.

---

## CAC Registration

**Business Name:** CFrank Enterprise  
**CAC BN:** 9943925
