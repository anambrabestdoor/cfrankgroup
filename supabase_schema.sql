-- ============================================================================
-- SUPABASE POSTGRESQL SCHEMA DESIGN & SECURITY POLICIES
-- File: supabase_schema.sql
-- Project: Anambra Best Door by CFrank Enterprise
-- Description: Production-grade schema for door & sanitary products, dynamic
--              site settings, WhatsApp inquiry templates, and quote requests.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  price NUMERIC(12, 2) DEFAULT 0 CHECK (price >= 0),
  original_price NUMERIC(12, 2) DEFAULT 0 CHECK (original_price >= 0),
  price_on_request BOOLEAN NOT NULL DEFAULT TRUE,
  image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}'::TEXT[],
  badge TEXT,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9 CHECK (rating >= 0 AND rating <= 5.0),
  reviews_count INT NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'pre_order', 'out_of_stock')),
  stock INT NOT NULL DEFAULT 10 CHECK (stock >= 0),
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] DEFAULT '{}'::TEXT[],
  specifications JSONB NOT NULL DEFAULT '{}'::JSONB,
  jiji_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexing for fast search and category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
DROP POLICY IF EXISTS "Allow public read access on active products" ON public.products;
CREATE POLICY "Allow public read access on active products"
  ON public.products FOR SELECT
  USING (active = true);

-- Allow authenticated admins full management
DROP POLICY IF EXISTS "Allow admin write access on products" ON public.products;
CREATE POLICY "Allow admin write access on products"
  ON public.products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 2. SITE SETTINGS TABLE (Dynamic Templates, CAC Info, Phone & Address)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  company_name TEXT NOT NULL DEFAULT 'Anambra Best Door',
  parent_company TEXT NOT NULL DEFAULT 'CFrank Enterprise',
  cac_number TEXT NOT NULL DEFAULT 'BN 2818981',
  phone TEXT NOT NULL DEFAULT '+2348032766854',
  phone_display TEXT NOT NULL DEFAULT '+234 803 276 6854',
  whatsapp_number TEXT NOT NULL DEFAULT '2348032766854',
  email TEXT NOT NULL DEFAULT 'sales@anambrabestdoor.ng',
  address TEXT NOT NULL DEFAULT 'No 16/17, Maraim Plaza Building Material Ogidi, Ogidi, Anambra State, Nigeria',
  second_address TEXT DEFAULT '',
  market_location TEXT NOT NULL DEFAULT 'Maraim Plaza, Building Material International Market Ogidi, Anambra State',
  working_hours TEXT NOT NULL DEFAULT 'Mon - Sat: 8:00 AM - 5:30 PM',
  delivery_info TEXT NOT NULL DEFAULT 'Nationwide waybill delivery across all 36 states',
  jiji_shop_url TEXT NOT NULL DEFAULT 'https://jiji.ng/shop/cfrankenterprise',
  whatsapp_inquiry_template TEXT NOT NULL DEFAULT 'Hello CFrank Enterprise, I would like to inquire about the current price and stock availability for [Door Name] (Size: [Size], Quantity: [Qty]).',
  whatsapp_cart_template TEXT NOT NULL DEFAULT 'Hello CFrank Enterprise, I would like to place an order inquiry for the following items from your catalogue:\n\n[Items]\n\nPlease advise on current pricing, stock availability, and waybill delivery terms.',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Ensure second_address and newly added columns exist if table was created previously
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS second_address TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS working_hours TEXT DEFAULT 'Mon - Sat: 8:00 AM - 5:30 PM';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS market_location TEXT DEFAULT 'Maraim Plaza, Building Material International Market Ogidi, Anambra State';

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site settings
DROP POLICY IF EXISTS "Allow public read access on site settings" ON public.site_settings;
CREATE POLICY "Allow public read access on site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Allow authenticated admin to update settings
DROP POLICY IF EXISTS "Allow admin write access on site settings" ON public.site_settings;
CREATE POLICY "Allow admin write access on site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 3. QUOTE INQUIRIES & LEAD CAPTURE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.quote_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  category TEXT,
  product_name TEXT,
  size TEXT,
  orientation TEXT,
  quantity INT DEFAULT 1,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on quote_inquiries
ALTER TABLE public.quote_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public to insert quote inquiries
DROP POLICY IF EXISTS "Allow public insert on quote inquiries" ON public.quote_inquiries;
CREATE POLICY "Allow public insert on quote inquiries"
  ON public.quote_inquiries FOR INSERT
  WITH CHECK (true);

-- Allow authenticated admins to view and update quote inquiries
DROP POLICY IF EXISTS "Allow admin management on quote inquiries" ON public.quote_inquiries;
CREATE POLICY "Allow admin management on quote inquiries"
  ON public.quote_inquiries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 4. INITIAL SEED FOR SITE SETTINGS
-- ============================================================================
INSERT INTO public.site_settings (
  id,
  company_name,
  parent_company,
  cac_number,
  phone,
  phone_display,
  whatsapp_number,
  email,
  address,
  second_address,
  market_location,
  working_hours,
  delivery_info,
  jiji_shop_url,
  whatsapp_inquiry_template,
  whatsapp_cart_template
) VALUES (
  'global',
  'Anambra Best Door',
  'CFrank Enterprise',
  'BN 2818981',
  '+2348032766854',
  '+234 803 276 6854',
  '2348032766854',
  'sales@anambrabestdoor.ng',
  'No 16/17, Maraim Plaza Building Material Ogidi, Ogidi, Anambra State, Nigeria',
  '',
  'Maraim Plaza, Building Material International Market Ogidi, Anambra State',
  'Mon - Sat: 8:00 AM - 5:30 PM',
  'Nationwide waybill delivery across all 36 states',
  'https://jiji.ng/shop/cfrankenterprise',
  'Hello CFrank Enterprise, I would like to inquire about the current price and stock availability for [Door Name] (Size: [Size], Quantity: [Qty]).',
  'Hello CFrank Enterprise, I would like to place an order inquiry for the following items from your catalogue:\n\n[Items]\n\nPlease advise on current pricing, stock availability, and waybill delivery terms.'
) ON CONFLICT (id) DO UPDATE SET
  whatsapp_inquiry_template = EXCLUDED.whatsapp_inquiry_template,
  whatsapp_cart_template = EXCLUDED.whatsapp_cart_template,
  address = EXCLUDED.address,
  second_address = EXCLUDED.second_address,
  market_location = EXCLUDED.market_location,
  updated_at = NOW();
