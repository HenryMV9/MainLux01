// MAINLUX Shared JS
// Mobile menu, navbar scroll, cart badge, toast, scroll animations

// ── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── MOBILE MENU ────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
  }

  const openMenu = () => {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ── CART BADGE ─────────────────────────────────────────────
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('mainluxCart') || '[]');
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    if (total > 0) {
      badge.textContent = total > 9 ? '9+' : total;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

updateCartBadge();
window.addEventListener('storage', updateCartBadge);
window.updateCartBadge = updateCartBadge;

// ── TOAST NOTIFICATIONS ────────────────────────────────────
function showToast(message, type = 'default') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
window.showToast = showToast;

// ── SCROLL FADE-IN ANIMATIONS ──────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');
if (fadeEls.length > 0) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeEls.forEach(el => observer.observe(el));
}

// ── FOOTER YEAR ────────────────────────────────────────────
const yearEls = document.querySelectorAll('.footer-year');
yearEls.forEach(el => el.textContent = new Date().getFullYear());
