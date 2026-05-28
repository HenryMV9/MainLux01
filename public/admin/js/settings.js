import { adminDb, initAdmin } from './admin-auth.js';
import { initMobileMenu, showToast } from './admin-ui.js';

await initAdmin();
initMobileMenu();

const { data: { session } } = await adminDb.auth.getSession();
if (session) {
  const el = document.getElementById('settingAdminEmail');
  if (el) el.textContent = session.user.email;
}

const { data: settings } = await adminDb.from('store_settings').select('key, value');

function getVal(key) {
  return (settings || []).find(s => s.key === key)?.value || '';
}

document.getElementById('settingWhatsapp').value  = getVal('whatsapp');
document.getElementById('settingInstagram').value = getVal('instagram');
document.getElementById('settingTiktok').value    = getVal('tiktok');
document.getElementById('settingPhone').value     = getVal('phone');
document.getElementById('settingEmail').value     = getVal('email');
document.getElementById('settingAddress').value   = getVal('address');

async function saveSetting(key, value) {
  const { error } = await adminDb.from('store_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}

document.getElementById('saveSocialBtn').addEventListener('click', async () => {
  const btn = document.getElementById('saveSocialBtn');
  btn.disabled = true;
  try {
    await Promise.all([
      saveSetting('whatsapp',  document.getElementById('settingWhatsapp').value.trim()),
      saveSetting('instagram', document.getElementById('settingInstagram').value.trim()),
      saveSetting('tiktok',    document.getElementById('settingTiktok').value.trim()),
    ]);
    showToast('Social settings saved!', 'success');
  } catch (e) {
    showToast('Failed to save: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
  }
});

document.getElementById('saveStoreBtn').addEventListener('click', async () => {
  const btn = document.getElementById('saveStoreBtn');
  btn.disabled = true;
  try {
    await Promise.all([
      saveSetting('phone',   document.getElementById('settingPhone').value.trim()),
      saveSetting('email',   document.getElementById('settingEmail').value.trim()),
      saveSetting('address', document.getElementById('settingAddress').value.trim()),
    ]);
    showToast('Store info saved!', 'success');
  } catch (e) {
    showToast('Failed to save: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
  }
});
