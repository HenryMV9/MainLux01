import { adminDb, initAdmin } from './admin-auth.js';
import { initMobileMenu, showToast } from './admin-ui.js';

await initAdmin();
initMobileMenu();

const ALL_SIZES = [37, 38, 39, 40, 41, 42, 43, 44];
let imageUrls = [];
let editId = null;

const sizesGrid = document.getElementById('sizesGrid');
const stockInput = document.getElementById('pStock');

function buildSizeGrid(selectedSizes = [], sizeStock = {}) {
  sizesGrid.innerHTML = ALL_SIZES.map(s => {
    const checked = selectedSizes.includes(s);
    const qty = sizeStock[s] ?? 0;
    return `
      <div class="size-stock-item${checked ? ' active' : ''}" id="ssi-${s}">
        <div class="size-stock-header">
          <input type="checkbox" class="size-checkbox" id="sc-${s}" data-size="${s}" ${checked ? 'checked' : ''}>
          <label class="size-label" for="sc-${s}">Size ${s}</label>
        </div>
        <input type="number" class="size-stock-input" id="sq-${s}" data-size="${s}"
          value="${checked ? qty : ''}" min="0" placeholder="Qty"
          ${checked ? '' : 'disabled'}>
      </div>`;
  }).join('');

  sizesGrid.querySelectorAll('.size-checkbox').forEach(cb => {
    cb.addEventListener('change', () => toggleSize(parseInt(cb.dataset.size), cb.checked));
  });
  sizesGrid.querySelectorAll('.size-stock-input').forEach(inp => {
    inp.addEventListener('input', syncTotalStock);
  });
}

function toggleSize(size, enabled) {
  const item = document.getElementById(`ssi-${size}`);
  const input = document.getElementById(`sq-${size}`);
  item.classList.toggle('active', enabled);
  input.disabled = !enabled;
  if (!enabled) input.value = '';
  syncTotalStock();
}

function syncTotalStock() {
  let total = 0;
  ALL_SIZES.forEach(s => {
    const cb = document.getElementById(`sc-${s}`);
    const inp = document.getElementById(`sq-${s}`);
    if (cb && cb.checked && inp && inp.value !== '') total += parseInt(inp.value) || 0;
  });
  stockInput.value = total;
}

function getSizeData() {
  const sizes = [];
  const sizeStock = {};
  ALL_SIZES.forEach(s => {
    const cb = document.getElementById(`sc-${s}`);
    const inp = document.getElementById(`sq-${s}`);
    if (cb && cb.checked) {
      sizes.push(s);
      sizeStock[s] = parseInt(inp?.value) || 0;
    }
  });
  return { sizes, sizeStock };
}

buildSizeGrid();

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('uploadPreview');

uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', e => { e.preventDefault(); uploadArea.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
imageInput.addEventListener('change', () => handleFiles(imageInput.files));

async function handleFiles(files) {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Uploading...';
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await adminDb.storage.from('product-images').upload(path, file);
    if (error) { showToast('Upload failed: ' + error.message, 'error'); continue; }
    const { data: { publicUrl } } = adminDb.storage.from('product-images').getPublicUrl(path);
    imageUrls.push(publicUrl);
    renderPreview();
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="ri-save-line"></i> Save Product';
}

function renderPreview() {
  preview.innerHTML = imageUrls.map((url, i) => `
    <div class="preview-item">
      <img src="${url}" alt="preview">
      ${i === 0 ? '<span class="primary-badge">Main</span>' : ''}
      <button type="button" class="remove-img" data-idx="${i}"><i class="ri-close-line"></i></button>
    </div>`).join('');
  preview.querySelectorAll('.remove-img').forEach(btn => {
    btn.addEventListener('click', () => { imageUrls.splice(parseInt(btn.dataset.idx), 1); renderPreview(); });
  });
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Saving...';

  const { sizes, sizeStock } = getSizeData();
  const stock = sizes.reduce((s, sz) => s + (sizeStock[sz] || 0), 0);

  const payload = {
    name: document.getElementById('pName').value.trim(),
    category: document.getElementById('pCategory').value,
    price: parseInt(document.getElementById('pPrice').value),
    stock,
    description: document.getElementById('pDescription').value.trim(),
    sizes,
    size_stock: sizeStock,
    images: imageUrls,
    is_featured: document.getElementById('pFeatured').checked,
    is_new_arrival: document.getElementById('pNewArrival').checked,
    is_active: document.getElementById('pActive').checked
  };

  if (!payload.name || !payload.category || !payload.price) {
    showToast('Please fill in all required fields.', 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-save-line"></i> Save Product';
    return;
  }

  let error;
  if (editId) { ({ error } = await adminDb.from('products').update(payload).eq('id', editId)); }
  else { ({ error } = await adminDb.from('products').insert([payload])); }

  if (error) {
    showToast('Failed to save: ' + error.message, 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-save-line"></i> Save Product';
    return;
  }

  showToast(editId ? 'Product updated!' : 'Product added!', 'success');
  setTimeout(() => { window.location.href = './products.html'; }, 900);
});

const id = new URLSearchParams(window.location.search).get('id');
if (id) {
  editId = id;
  document.getElementById('formTitle').textContent = 'Edit Product';
  document.title = 'Edit Product | MAINLUX Admin';
  const { data: p, error } = await adminDb.from('products').select('*').eq('id', id).maybeSingle();
  if (error || !p) {
    showToast('Product not found', 'error');
  } else {
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pDescription').value = p.description || '';
    document.getElementById('pFeatured').checked = p.is_featured;
    document.getElementById('pNewArrival').checked = p.is_new_arrival || false;
    document.getElementById('pActive').checked = p.is_active;
    buildSizeGrid(p.sizes || [], p.size_stock || {});
    imageUrls = p.images || [];
    renderPreview();
  }
}
