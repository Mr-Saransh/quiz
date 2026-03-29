import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export function renderAlerts(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }
  
  container.innerHTML = `
    <div class="page-container" style="background: var(--cream); min-height: 100dvh; padding-bottom: 80px;">
      <div class="dash-topbar" style="background: white; border-bottom: 1px solid var(--gray-200);">
        <button id="alerts-back" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--gray-800);">←</button>
        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 18px;">Alerts</span>
        <div style="width:24px;"></div>
      </div>
      <div style="padding: 24px; text-align: center; color: var(--gray-500); margin-top: 40px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
        <h3 style="font-family: var(--font-heading); font-size: 20px; color: var(--gray-800);">No new alerts!</h3>
        <p style="margin-top: 8px;">You're all caught up on your notifications.</p>
      </div>
    </div>
  `;

  document.getElementById('alerts-back')?.addEventListener('click', () => {
    navigate('/dashboard');
  });
}
