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
    <div class="auth-page page-container">
      <div class="auth-page__bg">
        <div class="auth-page__bg-circle auth-page__bg-circle--1"></div>
        <div class="auth-page__bg-circle auth-page__bg-circle--2"></div>
      </div>
      <div class="auth-card" style="box-shadow: var(--shadow-xl); border-radius: 24px;">
        <div class="auth-card__logo">
          <img src="/images/logo.png" alt="Apni Vidya Logo" style="height: 48px; margin-bottom: 24px;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 100\\'><circle cx=\\'50\\' cy=\\'50\\' r=\\'50\\' fill=\\'%236366f1\\' /><text x=\\'50\\' y=\\'55\\' font-family=\\'Arial\\' font-size=\\'40\\' fill=\\'white\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>A</text></svg>'"/>
          <h2 class="auth-card__title" style="color: var(--primary);">Welcome!</h2>
          <p class="auth-card__subtitle">Enter your details to discover your potential</p>
        </div>
        
        <div class="auth-input-group" style="margin-bottom: 16px;">
          <label for="auth-name" style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">Full Name</label>
          <input type="text" id="auth-name" class="input-field" placeholder="E.g. Rahul Sharma" style="border-radius: 12px;" />
        </div>

        <div class="auth-input-group" style="margin-bottom: 16px;">
          <label for="auth-ageClass" style="font-weight: 600; font-size: 14px; margin-bottom: 8px; display:block; color:var(--gray-700);">Age / Class</label>
          <input type="text" id="auth-ageClass" class="input-field" placeholder="E.g. 14 / Class 9" style="border-radius: 12px;" />
        </div>

        <div class="auth-toggle">
          <button class="auth-toggle__btn ${authMode === 'mobile' ? 'auth-toggle__btn--active' : ''}" id="toggle-mobile">📱 Mobile</button>
          <button class="auth-toggle__btn ${authMode === 'email' ? 'auth-toggle__btn--active' : ''}" id="toggle-email">📧 Email</button>
        </div>

        <div class="auth-input-group" style="margin-bottom: 24px;">
          <label for="auth-contact">${authMode === 'mobile' ? 'Mobile Number' : 'Email Address'}</label>
          <div class="auth-input-wrapper">
            <span class="auth-input-wrapper__prefix">${authMode === 'mobile' ? '🇮🇳 +91' : '📧'}</span>
            <input type="${authMode === 'mobile' ? 'tel' : 'email'}" id="auth-contact" class="input-field"
                   placeholder="${authMode === 'mobile' ? 'Enter 10-digit number' : 'Enter your email'}"
                   maxlength="${authMode === 'mobile' ? '10' : '100'}" style="border-radius: 12px; margin-left: 10px;" />
          </div>
        </div>

        <button class="btn btn--block" id="auth-get-started" style="background: var(--primary); color: white; border-radius: 50px; padding: 16px; font-weight: 700; margin-top: 16px;">
          Get Started →
        </button>

        <p class="auth-resend" style="margin-top:24px;text-align:center;">
          <a href="#/" style="font-size:14px;color: var(--gray-400); text-decoration: none;">← Back to home</a>
        </p>
      </div>
    </div>
  `;

  document.getElementById('toggle-mobile')?.addEventListener('click', () => { authMode = 'mobile'; renderAuth(container); });
  document.getElementById('toggle-email')?.addEventListener('click', () => { authMode = 'email'; renderAuth(container); });

  document.getElementById('auth-get-started')?.addEventListener('click', async () => {
    const name = document.getElementById('auth-name')?.value?.trim();
    const ageClass = document.getElementById('auth-ageClass')?.value?.trim();
    const input = document.getElementById('auth-contact');
    const contactValue = input?.value?.trim();

    if (!name || name.length < 2) { showToast('Please enter your full name', 'error'); return; }
    if (!ageClass) { showToast('Please enter your age or class', 'error'); return; }
    
    if (authMode === 'mobile' && !isMobileNumber(contactValue)) { showToast('Please enter a valid 10-digit mobile number', 'error'); return; }
    if (authMode === 'email' && !isValidEmail(contactValue)) { showToast('Please enter a valid email address', 'error'); return; }

    const btn = document.getElementById('auth-get-started');
    btn.disabled = true;
    btn.textContent = 'Starting...';

    try {
      const data = await apiRegisterBasic(name, ageClass, contactValue);
      setUser(data.user);
      showToast('Logged in successfully! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Failed to start', 'error');
      btn.disabled = false;
      btn.textContent = 'Get Started →';
    }
  });

  setTimeout(() => document.getElementById('auth-name')?.focus(), 300);
}
