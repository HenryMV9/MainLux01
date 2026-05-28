# MAINLUX — Admin Panel Guide

Premium luxury footwear brand. Designed for everyday luxury. Made in Nigeria.

---

## Running the Project

npm install
npm run dev       # local development
npm run build     # production build → /dist
npm run preview   # preview production build

---

## Admin Panel

Access the admin panel at /admin/login.html

### Pages

- Login          /admin/login.html         Owner sign-in
- Dashboard      /admin/dashboard.html     Overview: orders, revenue, low stock
- Products       /admin/products.html      View, search, filter, delete products
- Add Product    /admin/product-form.html  Upload new products or edit existing
- Orders         /admin/orders.html        View customer orders, update status
- Inventory      /admin/inventory.html     Quickly update stock quantities
- Settings       /admin/settings.html      WhatsApp, Instagram, TikTok, contact info

### How to Log In

1. Go to /admin/login.html
2. Enter your Supabase admin email and password
3. You will be redirected to the Dashboard

To create an admin account: go to your Supabase project → Authentication → Users → Add user.

---

## How to Upload Products

1. Go to Add Product (/admin/product-form.html)
2. Fill in:
   - Product Name — e.g. "Mainlux Noir"
   - Category — Male or Female
   - Price — in Naira (NGN)
   - Size & Stock — check each available size, enter how many pairs per size
   - Description — optional
   - Images — click or drag-and-drop. First image is the main display image.
   - Settings — toggle Featured, New Arrival, and Active
3. Click Save Product

Products set to Active automatically appear on the homepage, shop pages,
product detail pages, cart, and checkout.

Products set as Featured appear in the homepage "New Arrivals" section.

---

## How Stock Works

- Total Stock is auto-calculated from per-size quantities
- When total stock is 0, product shows "Out of Stock" in the store
- When total stock is 3 or less, it shows "Low Stock" and appears in Dashboard alert
- Use the Inventory page to quickly update stock without editing the full product

---

## Database Tables

- products        All product data including images, sizes, stock
- orders          Customer orders with items snapshot and status
- contact_messages Contact form submissions
- store_settings  WhatsApp, Instagram, TikTok, contact info

---

## Environment Variables

Set in .env:
  VITE_SUPABASE_URL=your-supabase-url
  VITE_SUPABASE_ANON_KEY=your-anon-key

These are also hardcoded as fallbacks in the source files so the site
works on Bolt hosting even without explicit env injection.

---

## Contact

WhatsApp: +234 810 118 1400
Instagram: @Mainluxury3
TikTok: @Mainluxury3
Email: Mainluxury3@gmail.com
