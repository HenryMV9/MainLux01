# MAINLUX — Premium Luxury Footwear

Designed for everyday luxury. Made in Nigeria.

---

## Project Structure

```
project/
├── public/                   Main website (served statically)
│   ├── index.html            Homepage
│   ├── male.html             Male collection shop
│   ├── female.html           Female collection shop
│   ├── product.html          Product detail (dynamic, uses ?id=)
│   ├── cart.html             Shopping cart
│   ├── checkout.html         Checkout form
│   ├── about.html            Brand story
│   ├── contact.html          Contact + message form
│   ├── order-success.html    Post-checkout confirmation
│   ├── css/                  Stylesheets
│   │   ├── shared.css        Navbar, footer, shared components
│   │   ├── style.css         Homepage styles
│   │   ├── shop.css          Shop pages
│   │   ├── product.css       Product detail
│   │   ├── cart.css          Cart page
│   │   ├── checkout.css      Checkout page
│   │   ├── about.css         About page
│   │   └── contact.css       Contact page
│   ├── js/                   JavaScript
│   │   ├── supabase-client.js  Initializes Supabase (fetches config from server)
│   │   ├── shared.js           Navbar scroll, mobile menu, cart badge, toast
│   │   ├── app.js              Homepage slider + dynamic new arrivals
│   │   ├── shop.js             Dynamic product loading + filters
│   │   ├── product.js          Product detail rendering
│   │   ├── cart.js             Cart management
│   │   └── checkout.js         Order submission
│   └── admin/                Admin panel (Supabase Auth required)
│       ├── login.html          Admin login
│       ├── dashboard.html      Stats overview
│       ├── products.html       Product list + management
│       ├── product-form.html   Add/edit product with image upload
│       ├── orders.html         Order management
│       ├── css/admin.css       Admin styles
│       └── js/admin-auth.js    Auth guard (runs on all admin pages)
├── server.js                 Express server (API + static serving)
├── package.json              Dependencies
├── .env                      Environment variables
└── README.md                 This file
```

---

## How to Run Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```
   Or for development with auto-restart:
   ```
   npm run dev
   ```

3. Open your browser:
   ```
   http://localhost:3000
   ```

---

## Environment Variables (.env)

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Public anon key (safe to use in browser) |
| `SUPABASE_SERVICE_KEY` | Secret service key (server-side only, never exposed) |

These are already configured in the `.env` file.

---

## How Admin Login Works

1. Go to `http://localhost:3000/admin/login.html`
2. Sign in with your admin email and password
3. Credentials are created in your **Supabase Dashboard**:
   - Go to your Supabase project → Authentication → Users → Add User
   - Create an account with any email and password you choose
4. Once signed in, you are redirected to the dashboard

Every admin page checks for a valid session. If not authenticated, it redirects to the login page automatically.

---

## How to Add Products

**Via Admin Panel (recommended):**
1. Sign in to the admin panel
2. Click "Add Product" in the sidebar
3. Fill in the product details:
   - Name, category (male/female), price, stock
   - Select available sizes
   - Upload product images (stored in Supabase Storage)
   - Toggle "Featured" to show in homepage New Arrivals
4. Click "Save Product"
5. The product appears on the store immediately

**Via Supabase Dashboard (direct):**
- Go to your Supabase project → Table Editor → products
- Insert a row directly

---

## How Stock Works

- Each product has a `stock` integer column
- When a product has `stock = 0`, it shows "Out of Stock" and the Add to Cart button is disabled
- Products with `stock <= 3` show "Low Stock"
- Update stock quantity in the admin panel by editing the product

---

## How Orders Work

1. Customer fills in their cart and goes to checkout
2. On "Place Order", the order is sent to `/api/orders` (Express route)
3. Express validates the data and saves it to the `orders` table in Supabase
4. Customer is redirected to the order success page
5. Admin can view all orders in the admin panel at `/admin/orders.html`
6. Admin can update order status (Pending → Confirmed → Shipped → Delivered)

---

## Image Uploads

- Product images are uploaded directly to **Supabase Storage** in the `product-images` bucket
- Admin uploads files in the product form
- Images are stored as public URLs in the product's `images` array field
- Multiple images are supported (first image is the primary display image)

To enable image uploads, you need to:
1. Go to Supabase Dashboard → Storage
2. Create a bucket called `product-images` (set to Public)
3. Images will upload automatically when adding/editing products

---

## How to Edit Pages

- **Store pages** (HTML/CSS/JS) are in `/public/`
- **Brand colors** are defined as CSS variables in `/public/css/shared.css` under `:root`
- **Footer** is consistent across all pages using the same HTML structure
- **Admin styles** are in `/public/admin/css/admin.css`

To change brand colors, update the variables in `shared.css`:
```css
:root {
  --black: #0B0B0B;
  --gold: #C9A35B;
  --cream: #F5F1EA;
  --beige: #D8C3A5;
  --charcoal: #2B2B2B;
}
```

---

## Deployment

**Node.js hosting (Railway, Render, Heroku):**
1. Push your code to GitHub
2. Connect the repository to your hosting provider
3. Set the start command to `npm start`
4. Add environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)

The app runs on `PORT` environment variable (defaults to 3000).

---

## Database Tables

| Table | Purpose |
|---|---|
| `products` | All shoe products with images, sizes, stock, pricing |
| `orders` | Customer orders with items snapshot and delivery details |
| `contact_messages` | Messages submitted via the contact form |

---

## Support

WhatsApp: +234 810 118 1400
Email: Mainluxury3@gmail.com
Instagram: @Mainluxury3
