import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export function renderAdmin(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  container.innerHTML = `
    <div class="page-container" style="background: var(--cream); min-height: 100dvh; padding-bottom: 80px;">
      <div class="dash-topbar" style="background: white; border-bottom: 1px solid var(--gray-200);">
        <button id="admin-back" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--gray-800);">←</button>
        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 18px;">Admin Console</span>
        <div style="width:24px;"></div>
      </div>
      
      <div style="padding: 24px;">
        <div style="background: white; border-radius: 20px; box-shadow: var(--shadow-sm); padding: 24px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">👑</div>
          <h2 style="font-family: var(--font-heading); font-size: 24px; margin-bottom: 8px;">Export Users</h2>
          <p style="color: var(--gray-500); margin-bottom: 24px; font-size: 14px;">Download a complete list of all registered users, including their phone numbers, city, and address in CSV format.</p>
          
          <button id="admin-export-btn" class="btn btn--block" style="background: #059669; color: white; padding: 16px; border-radius: 100px; font-weight: bold; font-size: 16px;">
            📥 Download Phone Nos / Users
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('admin-back')?.addEventListener('click', () => {
    navigate('/dashboard');
  });

  document.getElementById('admin-export-btn')?.addEventListener('click', () => {
    window.open('/api/auth/admin/export-users', '_blank');
  });
}
