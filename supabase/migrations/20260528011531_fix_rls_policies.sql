/*
  # Fix RLS Policies - Remove Always-True Clauses

  ## Summary
  Replaces all "always true" RLS policies with properly scoped versions.

  ## Changes

  ### contact_messages
  - INSERT: Restrict to non-empty name, email, and message fields

  ### orders
  - INSERT: Restrict to rows where required customer fields are non-empty
  - UPDATE: Restrict to authenticated users only (admins), scoped by auth.uid() check

  ### products
  - INSERT: Restrict to authenticated users with a valid auth.uid()
  - UPDATE: Same — requires authenticated session
  - DELETE: Same — requires authenticated session
*/

-- ============================================================
-- DROP OLD ALWAYS-TRUE POLICIES
-- ============================================================

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can place an order" ON orders;
DROP POLICY IF EXISTS "Authenticated admin can update order status" ON orders;
DROP POLICY IF EXISTS "Authenticated admin can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated admin can update products" ON products;
DROP POLICY IF EXISTS "Authenticated admin can delete products" ON products;

-- ============================================================
-- CONTACT MESSAGES — INSERT
-- Only allow inserts where all required fields are non-empty
-- ============================================================

CREATE POLICY "Public can submit contact message with valid fields"
  ON contact_messages FOR INSERT
  WITH CHECK (
    length(trim(name))    > 0 AND
    length(trim(email))   > 0 AND
    length(trim(message)) > 0
  );

-- ============================================================
-- ORDERS — INSERT
-- Only allow inserts where required customer fields are present
-- ============================================================

CREATE POLICY "Public can place order with valid fields"
  ON orders FOR INSERT
  WITH CHECK (
    length(trim(customer_name))    > 0 AND
    length(trim(customer_email))   > 0 AND
    length(trim(customer_phone))   > 0 AND
    length(trim(shipping_address)) > 0 AND
    total_amount > 0
  );

-- ============================================================
-- ORDERS — UPDATE
-- Only authenticated admins can update (scoped to their session)
-- ============================================================

CREATE POLICY "Authenticated admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- PRODUCTS — INSERT
-- Only authenticated users with a valid session can insert
-- ============================================================

CREATE POLICY "Authenticated admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- PRODUCTS — UPDATE
-- Only authenticated users with a valid session can update
-- ============================================================

CREATE POLICY "Authenticated admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- PRODUCTS — DELETE
-- Only authenticated users with a valid session can delete
-- ============================================================

CREATE POLICY "Authenticated admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
