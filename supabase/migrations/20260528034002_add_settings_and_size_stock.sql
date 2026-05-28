/*
  # Add store settings table and per-size stock to products

  1. New Tables
    - `store_settings` — key/value store for WhatsApp, Instagram, TikTok, contact info
  
  2. Modified Tables
    - `products` — add `size_stock` JSONB column (e.g. {"40": 5, "41": 8}) and `is_new_arrival` boolean

  3. Security
    - RLS enabled on store_settings
    - Public can read settings
    - Authenticated admin can insert/update settings
*/

-- Add new columns to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'size_stock'
  ) THEN
    ALTER TABLE products ADD COLUMN size_stock jsonb DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_new_arrival'
  ) THEN
    ALTER TABLE products ADD COLUMN is_new_arrival boolean DEFAULT false;
  END IF;
END $$;

-- Store settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read store settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admin can insert settings"
  ON store_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated admin can update settings"
  ON store_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Seed default settings
INSERT INTO store_settings (key, value) VALUES
  ('whatsapp', '2348101181400'),
  ('instagram', 'Mainluxury3'),
  ('tiktok', 'Mainluxury3'),
  ('email', 'Mainluxury3@gmail.com'),
  ('address', 'No. 1 Bajomo Street, Ahmadiyah, Lagos'),
  ('phone', '08101181400')
ON CONFLICT (key) DO NOTHING;
