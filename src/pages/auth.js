// ===== Auth Page (API-backed, No OTP) =====
import { navigate } from '../router.js';
import { setUser, isLoggedIn } from '../utils/storage.js';
import { isMobileNumber, isValidEmail } from '../utils/helpers.js';
import { apiRegisterBasic } from '../utils/api.js';
import { showToast } from '../components/toast.js';

let authMode = 'mobile';

export function renderAuth(container) {
  if (isLoggedIn()) { navigate('/dashboard'); return; }
  authMode = 'mobile';
  
  const pageContainer = container.querySelector('.page-container') || container;
  
  pageContainer.innerHTML = `
    <div class="auth-page animate-fadeIn" style="background: var(--off-white); min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 16px; position: relative; overflow: hidden; font-family: var(--font-body);">
      
      <!-- Premium Background Bits -->
      <div class="deco-blob deco-blob--primary" style="top: -150px; left: -100px; width: 400px; height: 400px; opacity: 0.1;"></div>
      <div class="deco-blob deco-blob--secondary" style="bottom: -150px; right: -100px; width: 350px; height: 350px; opacity: 0.08;"></div>
      
      <div class="auth-card glass-card animate-scaleIn" style="width: 100%; max-width: 440px; padding: 40px 32px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.8); box-shadow: var(--shadow-2xl); position: relative; z-index: 10; background: white;">
        <div class="auth-card__logo" style="text-align: center; margin-bottom: 32px;">
          <div style="width: 64px; height: 64px; background: var(--primary-gradient); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: var(--shadow-primary);">
             <span style="font-size: 32px;">🎯</span>
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; color: var(--gray-900); letter-spacing: -1px; margin-bottom: 8px;">Welcome!</h2>
          <p style="color: var(--gray-500); font-size: 14px; font-weight: 500;">Enter your details to discover your potential</p>
        </div>
        
        <div style="display: grid; gap: 16px;">
          <div class="auth-input-group">
            <label style="font-weight: 700; font-size: 11px; margin-bottom: 8px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Full Name</label>
            <input type="text" id="auth-name" class="input-field" placeholder="E.g. Rahul Sharma" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 18px; font-weight: 600;" />
          </div>

          <div class="auth-input-group">
            <label style="font-weight: 700; font-size: 11px; margin-bottom: 8px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Age / Class</label>
            <input type="text" id="auth-ageClass" class="input-field" placeholder="E.g. 14 / Class 9" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 18px; font-weight: 600;" />
          </div>

          <div class="auth-toggle" style="background: var(--gray-50); padding: 6px; border-radius: 16px; display: flex; gap: 4px;">
            <button class="auth-toggle__btn ${authMode === 'mobile' ? 'auth-toggle__btn--active' : ''}" id="toggle-mobile" style="flex: 1; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s;">📱 Mobile</button>
            <button class="auth-toggle__btn ${authMode === 'email' ? 'auth-toggle__btn--active' : ''}" id="toggle-email" style="flex: 1; padding: 10px; border-radius: 12px; font-weight: 700; font-size: 13px; border: none; cursor: pointer; transition: all 0.2s;">📧 Email</button>
          </div>

          <div class="auth-input-group">
            <label style="font-weight: 700; font-size: 11px; margin-bottom: 8px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">${authMode === 'mobile' ? 'Mobile Number' : 'Email Address'}</label>
            <div style="position: relative;">
               <div style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%); font-weight: 800; font-size: 14px; color: var(--primary);">
                  ${authMode === 'mobile' ? '+91' : '✉️'}
               </div>
               <input type="${authMode === 'mobile' ? 'tel' : 'email'}" id="auth-contact" class="input-field"
                    placeholder="${authMode === 'mobile' ? 'Enter 10-digit number' : 'Enter your email'}"
                    style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 18px 18px 18px 54px; font-weight: 600; font-family: monospace;" />
            </div>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <button id="auth-get-started" class="btn btn--primary" style="width: 100%; padding: 22px; border-radius: 20px; font-weight: 800; font-size: 16px;">
            Get Started →
          </button>
          <a href="#/" style="display: block; text-align: center; margin-top: 24px; font-size: 13px; color: var(--gray-400); text-decoration: none; font-weight: 600;">← Back to home</a>
        </div>
      </div>
    </div>
  `;

  const btnToggleMobile = document.getElementById('toggle-mobile');
  const btnToggleEmail = document.getElementById('toggle-email');

  if (authMode === 'mobile') {
     btnToggleMobile.style.background = 'white';
     btnToggleMobile.style.color = 'var(--primary)';
     btnToggleMobile.style.boxShadow = 'var(--shadow-sm)';
     btnToggleEmail.style.background = 'transparent';
     btnToggleEmail.style.color = 'var(--gray-400)';
  } else {
     btnToggleEmail.style.background = 'white';
     btnToggleEmail.style.color = 'var(--primary)';
     btnToggleEmail.style.boxShadow = 'var(--shadow-sm)';
     btnToggleMobile.style.background = 'transparent';
     btnToggleMobile.style.color = 'var(--gray-400)';
  }

  btnToggleMobile?.addEventListener('click', () => { authMode = 'mobile'; renderAuth(container); });
  btnToggleEmail?.addEventListener('click', () => { authMode = 'email'; renderAuth(container); });

  document.getElementById('auth-get-started')?.addEventListener('click', async () => {
    const name = document.getElementById('auth-name')?.value?.trim();
    const ageClass = document.getElementById('auth-ageClass')?.value?.trim();
    const contactValue = document.getElementById('auth-contact')?.value?.trim();

    if (!name || name.length < 2) { showToast('Full name identification required', 'error'); return; }
    if (!ageClass) { showToast('Age/Tier specification required', 'error'); return; }
    
    if (authMode === 'mobile' && !isMobileNumber(contactValue)) { showToast('Valid 10-digit number required', 'error'); return; }
    if (authMode === 'email' && !isValidEmail(contactValue)) { showToast('Valid email gateway required', 'error'); return; }

    const btn = document.getElementById('auth-get-started');
    btn.disabled = true;
    btn.textContent = 'Verifying...';

    try {
      const data = await apiRegisterBasic(name, ageClass, contactValue);
      setUser(data.user);
      showToast('Access granted! ✨', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Access denied', 'error');
      btn.disabled = false;
      btn.textContent = 'Retry Access';
    }
  });

  setTimeout(() => document.getElementById('auth-name')?.focus(), 300);
}
