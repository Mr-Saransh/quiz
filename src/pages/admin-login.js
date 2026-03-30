import { navigate } from '../router.js';

export function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="auth-page page-container" style="background: var(--off-white); min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 24px;">
      <div class="auth-card animate-fadeInUp" style="background: white; border-radius: 32px; padding: 40px; width: 100%; max-width: 400px; box-shadow: var(--shadow-2xl); border: 1px solid var(--gray-100);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
          <h2 style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: var(--gray-900);">Admin Portal</h2>
          <p style="color: var(--gray-500); font-size: 14px; margin-top: 8px;">Enter fixed credentials to access console</p>
        </div>

        <div style="display: grid; gap: 20px;">
          <div class="auth-input-group">
            <label style="font-weight: 700; color: var(--gray-700); font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block;">Admin ID</label>
            <input type="text" id="admin-id" class="input-field" placeholder="Enter ID" style="background: var(--gray-50); border: 1px solid var(--gray-100); border-radius: 16px; padding: 18px; width: 100%; font-weight: 600;"/>
          </div>

          <div class="auth-input-group">
            <label style="font-weight: 700; color: var(--gray-700); font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block;">Password</label>
            <input type="password" id="admin-pass" class="input-field" placeholder="••••••••" style="background: var(--gray-50); border: 1px solid var(--gray-100); border-radius: 16px; padding: 18px; width: 100%; font-weight: 600;"/>
          </div>

          <button id="btn-admin-login" class="btn btn--primary btn--block" style="padding: 20px; border-radius: 18px; font-weight: 800; font-size: 16px; margin-top: 12px; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);">
            Access Console →
          </button>
          
          <button id="btn-admin-cancel" style="background: none; border: none; color: var(--gray-400); font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 8px;">
            Cancel & Return
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-admin-login').addEventListener('click', async () => {
    const id = document.getElementById('admin-id').value.trim();
    const password = document.getElementById('admin-pass').value.trim();

    if (!id || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        alert(data.error || 'Invalid credentials');
      }
    } catch (e) {
      alert('Network error');
    }
  });

  document.getElementById('btn-admin-cancel').addEventListener('click', () => {
    navigate('/dashboard');
  });
}
