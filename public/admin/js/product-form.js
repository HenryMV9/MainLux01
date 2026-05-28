import { adminDb, initAdmin } from './admin-auth.js';

await initAdmin();

const ALL_SIZES = [37, 38, 39, 40, 41, 42, 43, 44];
let selectedSizes = [];
let imageUrls = [];
let editId = null;

document.getElementById('sizesCheck').innerHTML = ALL_SIZES.map(s => `
  <div class="size-check-item" data-size="${s}"><input type="checkbox" value="${s}"> ${s}</div>`).join('');

document.querySelectorAll('.size-check-item').forEach(el => {
  el.addEventListener('click', () => {
    const size = parseInt(el.dataset.size);
    if (selectedSizes.includes(size)) { selectedSizes = selectedSizes.filter(s => s !== size); el.classList.remove('checked'); }
    else { selectedSizes.push(size); el.classList.add('checked'); }
  });
});

const uploadArea = document.getElementById('uploadArea');
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('uploadPreview');

uploadArea.addEventListener('click', () => imageInput.click());
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', e => { e.preventDefault(); uploadArea.classList.remove('dragover'); handleFiles(e.dataTransfer.files); });
imageInput.addEventListener('change', () => handleFiles(imageInput.files));

async function handleFiles(files) {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> Uploading...';
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await adminDb.storage.from('product-images').upload(path, file);
    if (error) { alert(`Upload failed: ${error.message}`); continue; }
    const { data: { publicUrl } } = adminDb.storage.from('product-images').getPublicUrl(path);
    imageUrls.push(publicUrl);
    addPreview(publicUrl, imageUrls.length - 1);
  }
  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="ri-save-line"></i> Save Product';
}

function addPreview(url, idx) {
  const item = document.createElement('div');
  item.className = 'preview-item';
  item.innerHTML = `<img src="${url}" alt="preview"><button type="button" class="remove-img"><i class="ri-close-line"></i></button>`;
  item.querySelector('.remove-img').addEventListener('click', () => { imageUrls.splice(idx, 1); preview.innerHTML = ''; imageUrls.forEach((u, i) => addPreview(u, i)); });
  preview.appendChild(item);
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="ri-loader-4-line"></i> Saving...';

  const payload = {
    name: document.getElementById('pName').value.trim(),
    category: document.getElementById('pCategory').value,
    price: parseInt(document.getElementById('pPrice').value),
    stock: parseInt(document.getElementById('pStock').value),
    description: document.getElementById('pDescription').value.trim(),
    sizes: selectedSizes.sort((a, b) => a - b),
    images: imageUrls,
    is_featured: document.getElementById('pFeatured').checked,
    is_active: document.getElementById('pActive').checked
  };

  if (!payload.name || !payload.category || !payload.price) {
    alert('Please fill in all required fields.');
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-save-line"></i> Save Product';
    return;
  }

  let error;
  if (editId) { ({ error } = await adminDb.from('products').update(payload).eq('id', editId)); }
  else { ({ error } = await adminDb.from('products').insert([payload])); }

  if (error) {
    alert('Failed to save product: ' + error.message);
    btn.disabled = false;
    btn.innerHTML = '<i class="ri-save-line"></i> Save Product';
    return;
  }
  window.location.href = './products.html';
});

const id = new URLSearchParams(window.location.search).get('id');
if (id) {
  editId = id;
  document.getElementById('formTitle').textContent = 'Edit Product';
  const { data: p, error } = await adminDb.from('products').select('*').eq('id', id).maybeSingle();
  if (error || !p) { alert('Product not found'); }
  else {
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pDescription').value = p.description || '';
    document.getElementById('pFeatured').checked = p.is_featured;
    document.getElementById('pActive').checked = p.is_active;
    selectedSizes = p.sizes || [];
    document.querySelectorAll('.size-check-item').forEach(el => {
      if (selectedSizes.includes(parseInt(el.dataset.size))) el.classList.add('checked');
    });
    imageUrls = p.images || [];
    imageUrls.forEach((url, i) => addPreview(url, i));
  }
}
