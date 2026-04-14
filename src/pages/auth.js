// ===== Auth Page — Email OTP & Password Login =====
import { navigate } from '../router.js';
import { setUser, clearUser } from '../utils/storage.js';
import { isMobileNumber, isValidEmail } from '../utils/helpers.js';
import { 
  apiRegisterBasic, 
  apiSendEmailOTP, 
  apiVerifyEmailOTP, 
  apiSetPassword, 
  apiLoginPassword 
} from '../utils/api.js';
import { showToast } from '../components/toast.js';

let authStep = 'form'; // form | otp | loginPassword | setPassword
let authMethod = 'otp'; // otp | password
let otpDigits = ['', '', '', '', '', ''];
let emailForOTP = '';
let isLoading = false;
let errorMsg = '';
let currentUser = null; // Store user after OTP verify to set password

export function renderAuth(container) {
  // Clear any stale session if not in setPassword step
  if (authStep !== 'setPassword') {
    clearUser();
  }

  // Reset state if coming from outside
  if (!container.dataset.initialized) {
    authStep = 'form';
    authMethod = 'otp';
    otpDigits = ['', '', '', '', '', ''];
    isLoading = false;
    errorMsg = '';
    emailForOTP = '';
    currentUser = null;
    container.dataset.initialized = 'true';
  }
  
  const pageContainer = container.querySelector('.page-container') || container;

  function render() {
    let title = 'Welcome!';
    let subtitle = 'Enter your details to get started';

    if (authStep === 'otp') {
      title = 'Verify Code';
      subtitle = `Enter the 6-digit code sent to<br/><strong style="color:var(--primary);">${emailForOTP}</strong>`;
    } else if (authStep === 'loginPassword') {
      title = 'Login';
      subtitle = 'Sign in with your email and password';
    } else if (authStep === 'setPassword') {
      title = 'Secure Account';
      subtitle = 'Set a password for future logins';
    }

    pageContainer.innerHTML = `
      <div class="auth-page" style="background: var(--off-white); min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 16px; position: relative; overflow: hidden; font-family: var(--font-body);">
        
        <!-- Background Blobs -->
        <div class="deco-blob deco-blob--primary" style="top: -150px; left: -100px; width: 400px; height: 400px; opacity: 0.1;"></div>
        <div class="deco-blob deco-blob--secondary" style="bottom: -150px; right: -100px; width: 350px; height: 350px; opacity: 0.08;"></div>
        
        <div class="auth-card glass-card animate-scaleIn" style="width: 100%; max-width: 440px; padding: 40px 32px; border-radius: 40px; border: 1px solid rgba(255,255,255,0.8); box-shadow: var(--shadow-2xl); position: relative; z-index: 10; background: white;">
          
          <!-- Logo & Title -->
          <div class="auth-card__logo" style="text-align: center; margin-bottom: 28px;">
            <div style="width: 64px; height: 64px; background: var(--primary-gradient); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: var(--shadow-primary);">
              <span style="font-size: 32px;">🎯</span>
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: var(--gray-900); letter-spacing: -1px; margin-bottom: 6px;">
              ${title}
            </h2>
            <p style="color: var(--gray-500); font-size: 13px; font-weight: 500;">
              ${subtitle}
            </p>
          </div>

          <!-- Method Toggles (only on form/loginPassword) -->
          ${(authStep === 'form' || authStep === 'loginPassword') ? `
            <div style="display: flex; background: var(--gray-100); padding: 4px; border-radius: 12px; margin-bottom: 24px;">
              <button id="toggle-otp" style="flex: 1; padding: 10px; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: ${authMethod === 'otp' ? 'white' : 'transparent'}; color: ${authMethod === 'otp' ? 'var(--primary)' : 'var(--gray-500)'}; box-shadow: ${authMethod === 'otp' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};">OTP Login</button>
              <button id="toggle-pass" style="flex: 1; padding: 10px; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: ${authMethod === 'password' ? 'white' : 'transparent'}; color: ${authMethod === 'password' ? 'var(--primary)' : 'var(--gray-500)'}; box-shadow: ${authMethod === 'password' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};">Password Login</button>
            </div>
          ` : ''}

          ${authStep === 'form' ? renderFormStep() : ''}
          ${authStep === 'otp' ? renderOTPStep() : ''}
          ${authStep === 'loginPassword' ? renderLoginPasswordStep() : ''}
          ${authStep === 'setPassword' ? renderSetPasswordStep() : ''}
          
        </div>
      </div>
    `;
    bindEvents();
  }

  function renderFormStep() {
    return `
      <div style="display: grid; gap: 14px;">
        <!-- Name -->
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Full Name</label>
          <input type="text" id="auth-name" class="input-field" placeholder="E.g. Rahul Sharma" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" value="${localStorage.getItem('_auth_name') || ''}" />
        </div>

        <!-- Age & Class (Split) -->
        <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 12px;">
          <div class="auth-input-group">
            <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Age</label>
            <input type="number" id="auth-age" class="input-field" placeholder="Age" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" value="${localStorage.getItem('_auth_age') || ''}" />
          </div>
          <div class="auth-input-group">
            <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Class</label>
            <input type="text" id="auth-class" class="input-field" placeholder="E.g. Class 9 / College" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" value="${localStorage.getItem('_auth_class') || ''}" />
          </div>
        </div>

        <!-- Phone -->
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Mobile Number</label>
          <div style="position: relative;">
            <div style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-weight: 800; font-size: 14px; color: var(--primary);">+91</div>
            <input type="tel" id="auth-phone" class="input-field" placeholder="10-digit number" maxlength="10" inputmode="numeric" 
                style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px 16px 16px 52px; font-weight: 600; font-family: monospace; letter-spacing: 1px;" value="${localStorage.getItem('_auth_phone') || ''}" />
          </div>
        </div>

        <!-- Email -->
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Email Address (for OTP)</label>
          <div style="position: relative;">
            <div style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--primary);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/></svg>
            </div>
            <input type="email" id="auth-email" class="input-field" placeholder="you@gmail.com" inputmode="email"
                style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px 16px 16px 48px; font-weight: 600;" value="${localStorage.getItem('_auth_email') || ''}" />
          </div>
        </div>

        ${errorMsg ? `<div style="background: #FEE2E2; color: #DC2626; padding: 10px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; text-align: center;">${errorMsg}</div>` : ''}

        <!-- Submit -->
        <div style="margin-top: 8px;">
          <button id="auth-otp-btn" class="btn btn--primary" style="width: 100%; padding: 20px; border-radius: 20px; font-weight: 800; font-size: 15px;" ${isLoading ? 'disabled' : ''}>
            ${isLoading ? '<span class="btn-loader" style="display:inline-block; width:18px; height:18px; border:3px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:8px;"></span> Sending OTP...' : '🔐 Get Verification OTP'}
          </button>
          <a href="#/" style="display: block; text-align: center; margin-top: 20px; font-size: 12px; color: var(--gray-400); text-decoration: none; font-weight: 600;">← Back to home</a>
        </div>
      </div>
    `;
  }

  function renderOTPStep() {
    return `
      <div style="display: grid; gap: 16px;">
        <!-- OTP Boxes -->
        <div style="display: flex; gap: 8px; justify-content: center; margin: 12px 0; flex-wrap: wrap;">
          ${otpDigits.map((d, i) => `
            <input type="text" class="otp-box" data-index="${i}" maxlength="1" inputmode="numeric" value="${d}" autocomplete="one-time-code"
              style="width: clamp(38px, 10vw, 48px); height: clamp(48px, 12vw, 58px); border: 2px solid var(--gray-200); border-radius: 16px; text-align: center; font-size: 24px; font-weight: 800; font-family: 'Inter', monospace; color: var(--gray-900); transition: all 0.2s; background: white;" />
          `).join('')}
        </div>

        ${errorMsg ? `<div style="background: #FEE2E2; color: #DC2626; padding: 10px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; text-align: center;">${errorMsg}</div>` : ''}

        <button id="verify-otp-btn" class="btn btn--primary" style="width: 100%; padding: 20px; border-radius: 20px; font-weight: 800; font-size: 15px;" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? '<span class="btn-loader" style="display:inline-block; width:18px; height:18px; border:3px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; margin-right:8px;"></span> Verifying...' : '✓ Verify & Login'}
        </button>

        <div style="text-align: center;">
          <button id="back-to-form" style="background: none; border: none; color: var(--gray-400); font-size: 13px; font-weight: 700; cursor: pointer;">
            ← Edit Details
          </button>
        </div>
      </div>
    `;
  }

  function renderLoginPasswordStep() {
    return `
      <div style="display: grid; gap: 14px;">
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Email Address</label>
          <input type="email" id="login-email" class="input-field" placeholder="you@gmail.com" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" value="${localStorage.getItem('_auth_email') || ''}" />
        </div>
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Password</label>
          <input type="password" id="login-password" class="input-field" placeholder="••••••••" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" />
        </div>

        ${errorMsg ? `<div style="background: #FEE2E2; color: #DC2626; padding: 10px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; text-align: center;">${errorMsg}</div>` : ''}

        <button id="password-login-btn" class="btn btn--primary" style="width: 100%; padding: 20px; border-radius: 20px; font-weight: 800; font-size: 15px;" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? '<span class="btn-loader"></span> Logging in...' : '🚀 Login'}
        </button>
      </div>
    `;
  }

  function renderSetPasswordStep() {
    return `
      <div style="display: grid; gap: 14px;">
        <p style="font-size: 14px; color: var(--gray-600); text-align: center; margin-bottom: 10px;">
          Set a password for your account so you can login easily next time!
        </p>
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">New Password</label>
          <input type="password" id="new-password" class="input-field" placeholder="At least 6 characters" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" />
        </div>
        <div class="auth-input-group">
          <label style="font-weight: 700; font-size: 11px; margin-bottom: 6px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1px;">Confirm Password</label>
          <input type="password" id="confirm-password" class="input-field" placeholder="Repeat password" style="border: 1.5px solid var(--gray-100); border-radius: 18px; padding: 16px; font-weight: 600;" />
        </div>

        ${errorMsg ? `<div style="background: #FEE2E2; color: #DC2626; padding: 10px 14px; border-radius: 12px; font-size: 12px; font-weight: 700; text-align: center;">${errorMsg}</div>` : ''}

        <button id="set-password-btn" class="btn btn--primary" style="width: 100%; padding: 20px; border-radius: 20px; font-weight: 800; font-size: 15px;" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? '<span class="btn-loader"></span> Saving...' : '🔒 Set Password & Continue'}
        </button>
      </div>
    `;
  }

  function bindEvents() {
    // Method Toggles
    document.getElementById('toggle-otp')?.addEventListener('click', () => {
      authMethod = 'otp';
      authStep = 'form';
      errorMsg = '';
      render();
    });
    document.getElementById('toggle-pass')?.addEventListener('click', () => {
      authMethod = 'password';
      authStep = 'loginPassword';
      errorMsg = '';
      render();
    });

    // Phone input - numbers only
    document.getElementById('auth-phone')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Send OTP Button
    document.getElementById('auth-otp-btn')?.addEventListener('click', async () => {
      const name = document.getElementById('auth-name')?.value?.trim();
      const age = document.getElementById('auth-age')?.value?.trim();
      const studentClass = document.getElementById('auth-class')?.value?.trim();
      const phone = document.getElementById('auth-phone')?.value?.trim();
      const email = document.getElementById('auth-email')?.value?.trim();

      if (!name || name.length < 2) { errorMsg = 'Please enter your full name'; render(); return; }
      if (!age) { errorMsg = 'Please enter your age'; render(); return; }
      if (!studentClass) { errorMsg = 'Please enter your class'; render(); return; }
      if (!isMobileNumber(phone)) { errorMsg = 'Valid 10-digit mobile number required'; render(); return; }
      if (!isValidEmail(email)) { errorMsg = 'Valid email address required'; render(); return; }

      // Save temporarily
      localStorage.setItem('_auth_name', name);
      localStorage.setItem('_auth_age', age);
      localStorage.setItem('_auth_class', studentClass);
      localStorage.setItem('_auth_phone', phone);
      localStorage.setItem('_auth_email', email);
      
      emailForOTP = email;
      isLoading = true;
      errorMsg = '';
      render();

      try {
        await apiSendEmailOTP(email);
        authStep = 'otp';
        isLoading = false;
        render();
      } catch (err) {
        console.error('OTP send error:', err);
        errorMsg = err.message || 'Failed to send OTP. Please try again.';
        isLoading = false;
        render();
      }
    });

    // OTP Interaction
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach((box, idx) => {
      box.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
        otpDigits[idx] = val;
        if (val && idx < otpBoxes.length - 1) otpBoxes[idx + 1].focus();
      });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) otpBoxes[idx - 1].focus();
      });
      if (idx === 0) setTimeout(() => box.focus(), 100);
    });

    // Verify OTP Button
    document.getElementById('verify-otp-btn')?.addEventListener('click', async () => {
      const code = otpDigits.join('');
      if (code.length !== 6) { errorMsg = 'Please enter the complete 6-digit OTP'; render(); return; }

      isLoading = true;
      errorMsg = '';
      render();

      try {
        await apiVerifyEmailOTP(emailForOTP, code);
        
        // OTP verified — register user with backend
        const name = localStorage.getItem('_auth_name');
        const age = localStorage.getItem('_auth_age');
        const studentClass = localStorage.getItem('_auth_class');
        const phone = localStorage.getItem('_auth_phone');
        const email = localStorage.getItem('_auth_email');
        
        const data = await apiRegisterBasic(name, age, studentClass, phone, email);
        currentUser = data.user;
        
        // Cleanup temp storage
        localStorage.removeItem('_auth_name');
        localStorage.removeItem('_auth_age');
        localStorage.removeItem('_auth_class');
        localStorage.removeItem('_auth_phone');
        localStorage.removeItem('_auth_email');

        if (!currentUser.hasPassword) {
          authStep = 'setPassword';
          isLoading = false;
          render();
        } else {
          setUser(currentUser);
          showToast('Verified & logged in! ✨', 'success');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('OTP verification error:', err);
        errorMsg = err.message || 'Invalid OTP. Please try again.';
        isLoading = false;
        render();
      }
    });

    // Password Login Button
    document.getElementById('password-login-btn')?.addEventListener('click', async () => {
      const email = document.getElementById('login-email')?.value?.trim();
      const password = document.getElementById('login-password')?.value;

      if (!isValidEmail(email)) { errorMsg = 'Valid email required'; render(); return; }
      if (!password) { errorMsg = 'Password required'; render(); return; }

      isLoading = true;
      errorMsg = '';
      render();

      try {
        const data = await apiLoginPassword(email, password);
        setUser(data.user);
        showToast('Success! Welcome back! 🚀', 'success');
        navigate('/dashboard');
      } catch (err) {
        console.error('Password login error:', err);
        errorMsg = err.message || 'Login failed. Check your credentials.';
        isLoading = false;
        render();
      }
    });

    // Set Password Button
    document.getElementById('set-password-btn')?.addEventListener('click', async () => {
      const pass = document.getElementById('new-password')?.value;
      const confirm = document.getElementById('confirm-password')?.value;

      if (!pass || pass.length < 6) { errorMsg = 'Password must be at least 6 characters'; render(); return; }
      if (pass !== confirm) { errorMsg = 'Passwords do not match'; render(); return; }

      isLoading = true;
      errorMsg = '';
      render();

      try {
        await apiSetPassword(currentUser.id, pass);
        setUser(currentUser); // Log them in
        showToast('Password set! ✨', 'success');
        navigate('/dashboard');
      } catch (err) {
        console.error('Set password error:', err);
        errorMsg = err.message || 'Failed to set password.';
        isLoading = false;
        render();
      }
    });

    document.getElementById('back-to-form')?.addEventListener('click', () => {
      authStep = 'form';
      otpDigits = ['', '', '', '', '', ''];
      errorMsg = '';
      render();
    });

    // Auto-focus logic
    if (authStep === 'form' && !errorMsg) {
      setTimeout(() => document.getElementById('auth-name')?.focus(), 200);
    } else if (authStep === 'loginPassword') {
      setTimeout(() => document.getElementById('login-email')?.focus(), 200);
    } else if (authStep === 'setPassword') {
      setTimeout(() => document.getElementById('new-password')?.focus(), 200);
    }
  }

  render();
}
