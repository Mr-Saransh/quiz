import { navigate } from '../router.js';
import { getUser, setUser, isLoggedIn, clearUser } from '../utils/storage.js';
import { apiSetProfile } from '../utils/api.js';
import { showToast } from '../components/toast.js';

export function renderProfile(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  const user = getUser();
  if (!user || (!user.id && !user.userId)) { clearUser(); navigate('/auth'); return; }

  fetch(`/api/auth/user/${user.id}`).then(r => {
    if (!r.ok) {
      clearUser();
      navigate('/auth');
    }
  }).catch(() => {});
  
  container.innerHTML = `
    <div class="page-container" style="background: var(--cream); min-height: 100dvh; padding-bottom: 80px;">
      <!-- Top bar -->
      <div class="dash-topbar" style="background: white; border-bottom: 1px solid var(--gray-200);">
        <button id="profile-back" style="background:none; border:none; font-size:24px; cursor:pointer; color:var(--gray-800);">←</button>
        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 18px;">Your Profile</span>
        <div style="width:24px;"></div>
      </div>

      <div style="padding: 24px;">
        <div style="background: white; border-radius: 20px; box-shadow: var(--shadow-sm); padding: 24px;">
          
          <div style="display:flex; flex-direction:column; align-items:center; margin-bottom: 24px;">
            <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; background: var(--primary-lightest); margin-bottom: 12px; display:flex; align-items:center; justify-content:center; border: 3px solid var(--primary);">
              <img id="profile-preview-img" src="${user.profileImage || '/images/default-avatar.png'}" alt="Avatar" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%23A78BFA\\' /><text x=\\'50\\' y=\\'55\\' font-family=\\'Arial\\' font-size=\\'40\\' fill=\\'white\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>👤</text></svg>'"/>
            </div>
          </div>

          <div class="auth-input-group" style="margin-bottom: 16px;">
            <label style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">Full Name</label>
            <input type="text" id="profile-name" class="input-field" placeholder="E.g. Rahul Sharma" value="${user.name || ''}" style="border-radius: 12px;" />
          </div>

          <div class="auth-input-group" style="margin-bottom: 16px;">
            <label style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">Age / Class</label>
            <input type="text" id="profile-age" class="input-field" placeholder="E.g. 14 / Class 9" value="${user.ageClass || ''}" style="border-radius: 12px;" />
          </div>

          <div class="auth-input-group" style="margin-bottom: 16px;">
            <label style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">City</label>
            <input type="text" id="profile-city" class="input-field" placeholder="E.g. Mumbai" value="${user.city || ''}" style="border-radius: 12px;" />
          </div>

          <div class="auth-input-group" style="margin-bottom: 16px;">
            <label style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">Address</label>
            <textarea id="profile-address" class="input-field" placeholder="Your full address..." style="border-radius: 12px; min-height: 80px; resize: vertical;">${user.address || ''}</textarea>
          </div>

          <div class="auth-input-group" style="margin-bottom: 24px;">
            <label style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">Profile Image URL</label>
            <input type="url" id="profile-image-url" class="input-field" placeholder="https://example.com/my-photo.jpg" value="${user.profileImage || ''}" style="border-radius: 12px;" />
          </div>

          <button id="profile-save-btn" class="btn btn--block" style="background: var(--primary); color: white; padding: 16px; border-radius: 100px; font-weight: bold; font-size: 16px;">Save Changes</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('profile-back')?.addEventListener('click', () => {
    navigate('/dashboard');
  });

  document.getElementById('profile-image-url')?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const imgParam = document.getElementById('profile-preview-img');
    if (imgParam) {
      imgParam.src = val || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23A78BFA' /><text x='50' y='55' font-family='Arial' font-size='40' fill='white' text-anchor='middle' dominant-baseline='middle'>👤</text></svg>";
    }
  });

  document.getElementById('profile-save-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('profile-name')?.value.trim();
    const ageClass = document.getElementById('profile-age')?.value.trim();
    const city = document.getElementById('profile-city')?.value.trim();
    const address = document.getElementById('profile-address')?.value.trim();
    const profileImage = document.getElementById('profile-image-url')?.value.trim();
    
    if (!name || name.length < 2) { showToast('Please enter a valid name', 'error'); return; }
    if (!ageClass) { showToast('Please enter your age or class', 'error'); return; }

    const btn = document.getElementById('profile-save-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
      const data = await apiSetProfile(user.id, name, ageClass, city, address, profileImage);
      // Update local storage user data
      setUser(data.user);
      showToast('Profile updated successfully! ✨', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);

    } catch (err) {
      showToast(err.message || 'Error saving profile', 'error');
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  });

}
