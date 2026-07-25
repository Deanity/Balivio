-- ==========================================
-- BALIVIO DATABASE DDL SCHEMA (POSTGRESQL)
-- Generated from docs/Schema.dbml
-- Optimized for Supabase PostgreSQL
-- ==========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. AUTHENTICATION & USERS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable to support Google OAuth
    display_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'guest', -- 'guest', 'host', 'admin'
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'unverified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    avatar_url VARCHAR(512),
    birth_date DATE,
    gender VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_token VARCHAR(512) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(512),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. PROPERTIES & LOCATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL, -- e.g., Canggu, Ubud, Uluwatu
    region VARCHAR(255) NOT NULL DEFAULT 'Bali',
    image_url VARCHAR(512),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL, -- e.g., Private Villa, Boutique Villa, Family Villa, Luxury Villa
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.villas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type_id INTEGER REFERENCES public.property_types(id) ON DELETE SET NULL,
    area_id INTEGER REFERENCES public.areas(id) ON DELETE SET NULL,
    host_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    price_per_night NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    discount_percent INTEGER DEFAULT 0,
    bedrooms INTEGER NOT NULL DEFAULT 1,
    guests_capacity INTEGER NOT NULL DEFAULT 2,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'maintenance'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.villa_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.amenities (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL, -- e.g., wifi, pool, ac, kitchen, breakfast, beach, parking
    label VARCHAR(255) NOT NULL,
    icon_name VARCHAR(100),
    category VARCHAR(100) -- e.g., General, Safety, Entertainment
);

CREATE TABLE IF NOT EXISTS public.villa_amenities (
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE NOT NULL,
    amenity_id INTEGER REFERENCES public.amenities(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (villa_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS public.villa_policies (
    villa_id UUID PRIMARY KEY REFERENCES public.villas(id) ON DELETE CASCADE,
    check_in_time VARCHAR(10) NOT NULL DEFAULT '14:00',
    check_out_time VARCHAR(10) NOT NULL DEFAULT '12:00',
    cancellation_policy TEXT NOT NULL,
    custom_rules TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. AVAILABILITY & INVENTORY
-- ==========================================

CREATE TABLE IF NOT EXISTS public.villa_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available', -- 'available', 'blocked', 'booked'
    price_override NUMERIC(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (villa_id, date)
);

-- ==========================================
-- 4. BOOKINGS & RESERVATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code VARCHAR(100) UNIQUE NOT NULL, -- e.g., BK-2026-X8Y1
    villa_id UUID REFERENCES public.villas(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 2,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'paid', 'cancelled', 'completed'
    subtotal NUMERIC(12, 2) NOT NULL,
    service_fee NUMERIC(12, 2) NOT NULL,
    tax NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 5. PAYMENTS & FINANCIALS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    payment_code VARCHAR(255) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'transfer', 'card', 'ewallet'
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    gateway_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payment_transfer_details (
    payment_id UUID PRIMARY KEY REFERENCES public.payments(id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    virtual_account_number VARCHAR(100) NOT NULL,
    expired_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payment_card_details (
    payment_id UUID PRIMARY KEY REFERENCES public.payments(id) ON DELETE CASCADE,
    card_holder_name VARCHAR(255) NOT NULL,
    masked_card_number VARCHAR(50) NOT NULL,
    card_brand VARCHAR(50) NOT NULL,
    auth_code VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS public.payment_ewallet_details (
    payment_id UUID PRIMARY KEY REFERENCES public.payments(id) ON DELETE CASCADE,
    provider_name VARCHAR(100) NOT NULL, -- GoPay, OVO, DANA, ShopeePay
    external_transaction_id VARCHAR(255),
    qr_code_url VARCHAR(512)
);

-- ==========================================
-- 6. SOCIAL & FEEDBACK
-- ==========================================

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    rating NUMERIC(2, 1) NOT NULL, -- Scale 1-5
    comment TEXT,
    reply_from_host TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.wishlists (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    villa_id UUID REFERENCES public.villas(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, villa_id)
);

-- ==========================================
-- 7. AUTOMATIC USER SYNC FROM SUPABASE AUTH
-- ==========================================

-- Function to handle new user signup from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, password_hash, display_name, role, status)
  VALUES (
    new.id,
    new.email,
    NULL, -- password_hash is not stored locally for Supabase Auth / Google OAuth
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'guest',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run function after user insert in auth schema
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
