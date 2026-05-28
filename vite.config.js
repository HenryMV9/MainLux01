import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'public/index.html'),
        male: resolve(__dirname, 'public/male.html'),
        female: resolve(__dirname, 'public/female.html'),
        product: resolve(__dirname, 'public/product.html'),
        cart: resolve(__dirname, 'public/cart.html'),
        checkout: resolve(__dirname, 'public/checkout.html'),
        about: resolve(__dirname, 'public/about.html'),
        contact: resolve(__dirname, 'public/contact.html'),
        'order-success': resolve(__dirname, 'public/order-success.html'),
        'admin-login': resolve(__dirname, 'public/admin/login.html'),
        'admin-dashboard': resolve(__dirname, 'public/admin/dashboard.html'),
        'admin-orders': resolve(__dirname, 'public/admin/orders.html'),
        'admin-products': resolve(__dirname, 'public/admin/products.html'),
        'admin-product-form': resolve(__dirname, 'public/admin/product-form.html'),
      },
    },
  },
});
