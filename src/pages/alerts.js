import { navigate } from '../router.js';
import { isLoggedIn, getUser } from '../utils/storage.js';

export async function renderAlerts(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }
  
  const user = getUser();
  let notifications = [];
  
  try {
    const res = await fetch(`/api/auth/notifications/${user.id}`);
    const data = await res.json();
    notifications = data.notifications || [];
  } catch (e) {
    console.error('Failed to fetch alerts', e);
  }

  container.innerHTML = `
    <div class="alerts-page page-container" style="background: var(--off-white); min-height: 100dvh; padding-bottom: 120px;">
      <div class="dash-topbar" style="background: white; border-bottom: 1px solid var(--gray-200); position: sticky; top: 0; z-index: 100;">
        <button id="alerts-back" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--gray-800); padding: 12px 18px;">←</button>
        <span style="font-family: var(--font-heading); font-weight: 800; font-size: 18px; color: var(--gray-900);">Alert Center</span>
        <div style="width:44px;"></div>
      </div>

      <div style="padding: 24px;">
        <div style="margin-bottom: 24px;">
          <h1 style="font-family: var(--font-heading); font-size: 24px; font-weight: 800; color: var(--gray-900);">Your Messages</h1>
          <p style="color: var(--gray-400); font-size: 14px; font-weight: 600; margin-top: 4px;">Important updates from the Identity Bureau</p>
        </div>

        <div class="notifications-list" style="display: grid; gap: 16px;">
          ${notifications.length === 0 ? `
            <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 32px; border: 1px solid var(--gray-100);">
              <div style="font-size: 56px; margin-bottom: 20px;">🔔</div>
              <h3 style="font-family: var(--font-heading); font-size: 20px; color: var(--gray-800); font-weight: 800;">No new alerts!</h3>
              <p style="margin-top: 8px; color: var(--gray-400); font-weight: 500;">You're all caught up on your dossier updates.</p>
            </div>
          ` : notifications.map((n, i) => `
            <div class="alert-card animate-fadeInUp" style="background: white; padding: 24px; border-radius: 28px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md); animation-delay: ${i * 0.1}s;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="background: var(--primary-lightest); color: var(--primary); font-size: 10px; font-weight: 900; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 1px;">OFFICIAL BROADCAST</div>
                <span style="font-size: 11px; font-weight: 600; color: var(--gray-400);">${new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 17px; margin-bottom: 8px; color: var(--gray-900);">${n.title}</h4>
              <p style="font-size: 14px; color: var(--gray-600); line-height: 1.6; font-weight: 500;">${n.message}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('alerts-back')?.addEventListener('click', () => {
    navigate('/dashboard');
  });
}
