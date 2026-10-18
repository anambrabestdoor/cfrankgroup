-- ============================================================================
-- PHASE 1 & 2: SUPABASE POSTGRESQL SCHEMA DESIGN & SECURITY POLICIES
-- File: supabase_schema.sql
-- Description: Production-grade database DDL, triggers, and Row-Level
--              Security (RLS) policies for Anua Clean Skincare Storefront.
-- ============================================================================

-- Create custom user role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table linked to Supabase Auth
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  newsletter_subscribed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow public read-access to basic profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update their own profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow system/auth to insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admins full management of profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= 0),
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5.0),
  reviews_count INT NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  badge TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  ingredients TEXT[] DEFAULT '{}'::TEXT[]
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Allow anyone to read active products"
  ON public.products FOR SELECT
  USING (active = true OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "Allow admins to manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL, -- Array of ordered items: [{productId, productName, price, quantity}]
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered'))
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Allow users to view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid()));

CREATE POLICY "Allow users to place orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Allow admins full management of orders"
  ON public.orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- NEWSLETTERS TABLE
-- ============================================================================
CREATE TABLE public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on newsletters
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- Newsletters Policies
CREATE POLICY "Allow anyone to sign up for newsletter"
  ON public.newsletters FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admins to view and manage newsletters"
  ON public.newsletters FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- AUTOMATIC ADMIN ROLES TRIGGER FUNCTION (SECURE CYBERSECURITY HARDENING)
-- ============================================================================
-- Trigger function that executes on user sign-up to automatically handle
-- profiles creation and promotion of specific superuser emails.
-- This replaces vulnerable frontend check with locked-down server-side logic.

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role public.user_role;
  display_name TEXT;
BEGIN
  -- Automatically flag  and admin@anua.com as superuser admin
  IF LOWER(NEW.email) = '' OR LOWER(NEW.email) = 'admin@anua.com' THEN
    assigned_role := 'admin'::public.user_role;
  ELSE
    assigned_role := 'user'::public.user_role;
  END IF;

  -- Derive a fallback display name from user metadata or email if missing
  display_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  -- Insert profile entry
  INSERT INTO public.profiles (id, name, email, role, join_date, newsletter_subscribed)
  VALUES (
    NEW.id,
    display_name,
    NEW.email,
    assigned_role,
    NOW(),
    COALESCE((NEW.raw_user_meta_data->>'newsletter')::BOOLEAN, FALSE)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users insertions
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ============================================================================
-- VERIFICATION CODES TABLE (FOR PASSWORDLESS OTP FLOW)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.verification_codes (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on verification_codes
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read/upsert access for OTP authentication routines
CREATE POLICY "Allow system/api upsert access to verification codes"
  ON public.verification_codes FOR ALL
  USING (true)
  WITH CHECK (true);
