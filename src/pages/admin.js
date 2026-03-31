import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export async function renderAdmin(container) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!isLoggedIn() || !isAdmin) { 
    navigate('/admin-login'); 
    return; 
  }

  // Fetch existing events for management
  let events = [];
  try {
    const res = await fetch('/api/competitions');
    const data = await res.json();
    events = data.competitions || [];
  } catch (e) {
    console.error('Failed to fetch competitions for management', e);
  }

  container.innerHTML = `
    <div class="admin-page page-container" style="background: var(--off-white); min-height: 100dvh; padding-bottom: 120px;">
      
      <!-- Admin Top Bar -->
      <div class="dash-topbar" style="background: white; border-bottom: 1px solid var(--gray-200); position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm);">
        <button id="admin-back" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--gray-800); padding: 12px 18px;">←</button>
        <span style="font-family: var(--font-heading); font-weight: 800; font-size: 18px; color: var(--gray-900);">Admin Console</span>
        <button id="admin-logout" style="background: none; border: none; color: var(--primary); font-weight: 700; font-size: 13px; cursor: pointer; padding-right: 18px;">Logout</button>
      </div>
      
      <div style="padding: 24px; display: grid; gap: 24px; max-width: 800px; margin: 0 auto;">
        
        <!-- Quick Stats / Core Actions -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="glass-card" style="padding: 24px; border-radius: 24px; text-align: center; border: 1px solid var(--gray-100); background: white;">
            <div style="font-size: 32px; margin-bottom: 12px;">📊</div>
            <div style="font-size: 11px; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px;">Engagement</div>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 24px; color: var(--gray-900);">${events.length} active</div>
            <button id="admin-export-btn" style="margin-top: 16px; background: #059669; color: white; border: none; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 12px; width: 100%; cursor: pointer;">📥 Export CSV</button>
          </div>
          <div class="glass-card" style="padding: 24px; border-radius: 24px; text-align: center; border: 1px solid var(--gray-100); background: white;">
            <div style="font-size: 32px; margin-bottom: 12px;">🏆</div>
            <div style="font-size: 11px; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px;">Management</div>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 24px; color: var(--gray-900);">Ecosystem</div>
            <button id="scroll-to-publish" style="margin-top: 16px; background: var(--primary); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 12px; width: 100%; cursor: pointer;">➕ Add New</button>
          </div>
        </div>

        <!-- ACTIVE EVENTS MANAGEMENT -->
        <div style="background: white; border-radius: 28px; padding: 32px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
            <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: var(--gray-900);">Published Events</h2>
            <span style="font-size: 12px; font-weight: 700; color: var(--primary); background: var(--primary-lightest); padding: 4px 12px; border-radius: 100px;">Control Panel</span>
          </div>
          
          <div style="display: grid; gap: 16px;">
            ${events.length === 0 ? `
              <p style="text-align: center; padding: 20px; color: var(--gray-400); font-style: italic;">No active events found.</p>
            ` : events.map(comp => `
              <div class="comp-admin-card" style="padding: 20px; border: 1px solid var(--gray-100); border-radius: 20px; background: var(--gray-50);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                  <div>
                    <h4 style="font-weight: 800; font-size: 16px; color: var(--gray-900); font-family: var(--font-heading);">${comp.title}</h4>
                    <span style="font-size: 11px; font-weight: 600; color: var(--gray-400);">${new Date(comp.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button class="btn-delete-comp" data-id="${comp.id}" style="background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 800; cursor: pointer;">Remove</button>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn-alert-modal" data-id="${comp.id}" data-title="${comp.title}" style="flex: 1; background: white; border: 1px solid var(--gray-200); padding: 10px; border-radius: 12px; font-size: 13px; font-weight: 700; color: var(--primary); cursor: pointer; text-align: center;">Send Targeted Alert</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- ADD EVENT FORM -->
        <div id="publish-section" style="background: white; border-radius: 28px; padding: 32px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-md);">
          <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: var(--gray-900); margin-bottom: 24px;">🚀 New Events Entry</h2>
          
          <div style="display: grid; gap: 16px;">
            <div class="auth-input-group">
              <label style="font-weight: 800; font-size: 11px; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Event Title</label>
              <input type="text" id="comp-title" class="input-field" placeholder="E.g. Tech Meetup 2024" style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 16px; padding: 18px; width: 100%; font-weight: 600;"/>
            </div>

            <div class="auth-input-group">
              <label style="font-weight: 800; font-size: 11px; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Description</label>
              <textarea id="comp-desc" class="input-field" placeholder="Briefly describe..." style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 16px; padding: 18px; width: 100%; font-weight: 600; min-height: 100px; resize: none;"></textarea>
            </div>

            <div class="auth-input-group">
              <label style="font-weight: 800; font-size: 11px; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">Enrollment Link</label>
              <input type="text" id="comp-link" class="input-field" placeholder="https://forms.gle/..." style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 16px; padding: 18px; width: 100%; font-weight: 600;"/>
            </div>

            <button id="admin-comp-btn" class="btn btn--primary btn--block" style="padding: 20px; border-radius: 18px; font-weight: 900; font-size: 16px; margin-top: 20px;">
              Publish to Ecosystem →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Modal / Simple Overlay -->
    <div id="alert-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; padding: 24px;">
       <div style="background: white; border-radius: 24px; padding: 32px; width: 100%; max-width: 500px; box-shadow: var(--shadow-2xl);">
          <h2 id="modal-comp-title" style="font-family: var(--font-heading); font-weight: 800; font-size: 20px; margin-bottom: 8px;">Broadcast</h2>
          <p style="color: var(--gray-500); font-size: 13px; margin-bottom: 24px;">Message will be sent to all enrolled participants.</p>
          
          <div style="display: grid; gap: 16px;">
             <input type="text" id="alert-title" placeholder="Notification Title" style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--gray-200); font-weight: 700;"/>
             <textarea id="alert-message" placeholder="Type your message..." style="width: 100%; padding: 14px; border-radius: 12px; border: 1px solid var(--gray-200); font-weight: 500; min-height: 120px; resize: none;"></textarea>
             <div style="display: flex; gap: 12px;">
                <button id="btn-close-modal" style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: var(--gray-100); color: var(--gray-600); font-weight: 700; cursor: pointer;">Cancel</button>
                <button id="btn-send-alert" style="flex: 2; padding: 14px; border-radius: 12px; border: none; background: var(--primary); color: white; font-weight: 700; cursor: pointer;">Send Alert</button>
             </div>
          </div>
       </div>
    </div>
  `;

  // --- Events ---
  document.getElementById('admin-back')?.addEventListener('click', () => { navigate('/dashboard'); });
  document.getElementById('admin-logout')?.addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    navigate('/dashboard');
  });

  document.getElementById('admin-export-btn')?.addEventListener('click', () => {
    window.open('/api/auth/admin/export-users', '_blank');
  });

  document.getElementById('scroll-to-publish')?.addEventListener('click', () => {
     document.getElementById('publish-section').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('admin-comp-btn')?.addEventListener('click', async () => {
    const title = document.getElementById('comp-title').value.trim();
    const description = document.getElementById('comp-desc').value.trim();
    const formLink = document.getElementById('comp-link').value.trim();

    if (!title || !description || !formLink) {
      alert('Fill all fields');
      return;
    }

    try {
      const res = await fetch('/api/competitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, formLink })
      });
      if (res.ok) {
        alert('Published!');
        renderAdmin(container);
      }
    } catch (e) { alert('Sync error'); }
  });

  document.querySelectorAll('.btn-delete-comp').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Archive this challenge?')) return;
      const id = btn.dataset.id;
      try {
        const res = await fetch(`/api/competitions/${id}`, { method: 'DELETE' });
        if (res.ok) renderAdmin(container);
      } catch (e) { console.error(e); }
    });
  });

  let targetCompId = null;
  const modal = document.getElementById('alert-modal');
  const modalTitle = document.getElementById('modal-comp-title');

  document.querySelectorAll('.btn-alert-modal').forEach(btn => {
    btn.addEventListener('click', () => {
       targetCompId = btn.dataset.id;
       modalTitle.textContent = `Broadcast: ${btn.dataset.title}`;
       modal.style.display = 'flex';
    });
  });

  document.getElementById('btn-close-modal')?.addEventListener('click', () => { modal.style.display = 'none'; });

  document.getElementById('btn-send-alert')?.addEventListener('click', async () => {
     const title = document.getElementById('alert-title').value.trim();
     const message = document.getElementById('alert-message').value.trim();
     if (!title || !message) return;

     try {
        const res = await fetch('/api/admin/notify-enrolled', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ competitionId: targetCompId, title, message })
        });
        if (res.ok) {
           alert('Alert broadcasted!');
           modal.style.display = 'none';
        }
     } catch (e) { alert('Broadcast error'); }
  });
}
