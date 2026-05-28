/*
  # MAINLUX E-Commerce Initial Schema

  ## Summary
  This migration creates the full database schema for the MAINLUX luxury footwear
  e-commerce platform. It sets up products, orders, and contact messages with
  proper security through Row Level Security.

  ## New Tables

  ### products
  Stores all shoe products for the MAINLUX store.
  - id: unique product identifier
  - name: product display name
  - description: product description text
  - price: price in whole naira (e.g. 45000 = ₦45,000)
  - category: 'male' or 'female' collection
  - images: array of image URLs (first is primary)
  - sizes: array of available shoe sizes (e.g. [40, 41, 42])
  - stock: total available quantity
  - is_featured: shown in homepage new arrivals/featured section
  - is_active: soft delete / hide from storefront
  - created_at: timestamp

  ### orders
  Stores customer orders placed through the checkout.
  - id: unique order identifier
  - customer_name, customer_email, customer_phone: customer details
  - shipping_address: delivery address
  - items: JSONB snapshot of cart at time of purchase (preserves historical pricing)
  - total_amount: order total in naira
  - status: order lifecycle (pending → confirmed → shipped → delivered)
  - created_at: timestamp

  ### contact_messages
  Stores messages submitted through the contact page form.
  - id, name, email, message, created_at

  ## Security
  - RLS enabled on all tables
  - Products: public read for active items, admin write
  - Orders: anyone can insert (place order), only authenticated admin can read/update
  - Contact messages: anyone can insert, only authenticated admin can read

  ## Seed Data
  6 initial products seeded (3 male, 3 female) with placeholder Unsplash images.
*/

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  price       INTEGER NOT NULL CHECK (price > 0),
  category    TEXT NOT NULL CHECK (category IN ('male', 'female')),
  images      TEXT[] NOT NULL DEFAULT '{}',
  sizes       INTEGER[] NOT NULL DEFAULT '{}',
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- ORDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  total_amount     INTEGER NOT NULL CHECK (total_amount > 0),
  status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes            TEXT DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place an order"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admin can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- CONTACT MESSAGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated admin can read contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- ============================================================
-- SEED PRODUCTS
-- ============================================================

INSERT INTO products (name, description, price, category, images, sizes, stock, is_featured, is_active) VALUES
(
  'Mainlux Noir',
  'Crafted for modern elegance and everyday comfort, the Mainlux Noir premium slide combines refined luxury aesthetics with exceptional durability. Designed and made in Nigeria for individuals who value premium lifestyle fashion.',
  45000,
  'male',
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1978&auto=format&fit=crop'],
  ARRAY[40, 41, 42, 43],
  15,
  true,
  true
),
(
  'Midnight Luxe',
  'The Midnight Luxe slide is the pinnacle of MAINLUX craftsmanship. Bold silhouette, premium cushioning, and an unmistakable finish that commands attention. For the discerning man who demands the best.',
  45000,
  'male',
  ARRAY['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1978&auto=format&fit=crop'],
  ARRAY[42, 43, 44],
  3,
  false,
  true
),
(
  'Royal Gold Slide',
  'Inspired by Nigerian royalty, the Royal Gold Slide is a statement in luxury. Gold-accented straps over supple premium material make this the crown jewel of the MAINLUX male collection.',
  55000,
  'male',
  ARRAY['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1978&auto=format&fit=crop', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1974&auto=format&fit=crop'],
  ARRAY[41, 42, 43],
  12,
  true,
  true
),
(
  'Soft Beige Luxe',
  'The Soft Beige Luxe slide wraps your foot in cloud-like comfort. Its warm neutral tone pairs effortlessly with any outfit, making it the everyday essential for the modern Nigerian woman.',
  35000,
  'female',
  ARRAY['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1978&auto=format&fit=crop'],
  ARRAY[37, 38, 39],
  20,
  true,
  true
),
(
  'Elegant Gold Slide',
  'Grace meets glamour in the Elegant Gold Slide. Delicate gold detailing on a premium cream base creates a slide that transitions seamlessly from brunch to evening. Sophistication personified.',
  45000,
  'female',
  ARRAY['https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1978&auto=format&fit=crop'],
  ARRAY[38, 39, 40],
  2,
  true,
  true
),
(
  'Mainlux Femme',
  'Bold, feminine, and unmistakably MAINLUX. The Femme slide is a celebration of Nigerian womanhood — confident, stylish, and effortlessly luxurious in every step.',
  55000,
  'female',
  ARRAY['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1978&auto=format&fit=crop', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1974&auto=format&fit=crop', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1974&auto=format&fit=crop'],
  ARRAY[39, 40],
  8,
  false,
  true
);
