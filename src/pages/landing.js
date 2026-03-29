// ===== Landing Page =====
import { navigate } from '../router.js';
import { isLoggedIn } from '../utils/storage.js';

export function renderLanding(container) {
  // If already logged in, go to dashboard
  if (isLoggedIn()) {
    navigate('/dashboard');
    return;
  }

  container.innerHTML = `
    <div class="landing page-container">
      <!-- Background -->
      <div class="landing__bg">
        <div class="landing__bg-shape landing__bg-shape--1"></div>
        <div class="landing__bg-shape landing__bg-shape--2"></div>
      </div>

      <!-- Top bar Logo -->
      <div class="landing__topbar">
        <img src="/images/logo.png" alt="Apni Vidya" class="landing__logo" />
      </div>

      <!-- Content -->
      <div class="landing__content" style="padding-top: 10vh; padding-bottom: 40px;">
        <!-- Illustration -->
        <div class="landing__mascot" style="margin-bottom: 32px">
          <img src="/images/mascot.png" alt="Student Illustration" id="landing-mascot" style="max-width: 220px;" />
        </div>

        <!-- Headline -->
        <h1 class="landing__headline" style="font-size: 32px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; color: var(--white);">
          Unlock Your Child’s<br/>
          <span style="color: var(--secondary);">True Potential</span>
        </h1>

        <p class="landing__subtitle" style="font-size: 16px; font-weight: 500; margin-bottom: 24px; opacity: 0.9; color: var(--white);">
          Skill development | Early potential discovery | Future career clarity
        </p>

        <!-- Benefits -->
        <div class="landing__benefits" style="text-align: left; background: rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin-bottom: 32px; backdrop-filter: blur(10px);">
          <ul style="list-style: none; padding: 0; margin: 0; color: var(--white); display: flex; flex-direction: column; gap: 12px;">
            <li style="display: flex; align-items: center; gap: 12px;">
              <span style="background: var(--secondary); color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">✓</span>
              <span style="font-size: 15px;">Understand personality & strengths</span>
            </li>
            <li style="display: flex; align-items: center; gap: 12px;">
              <span style="background: var(--secondary); color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">✓</span>
              <span style="font-size: 15px;">Identify hidden talents</span>
            </li>
            <li style="display: flex; align-items: center; gap: 12px;">
              <span style="background: var(--secondary); color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">✓</span>
              <span style="font-size: 15px;">Get career direction early</span>
            </li>
          </ul>
        </div>

        <!-- CTA -->
        <button class="btn btn--block btn--lg" id="landing-start-btn" style="background: var(--white); color: var(--primary); font-size: 18px; font-weight: 700; border-radius: 50px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
          Get Started ✨
        </button>
      </div>
    </div>
  `;

  // Start button
  document.getElementById('landing-start-btn')?.addEventListener('click', () => {
    navigate('/auth');
  });
}
