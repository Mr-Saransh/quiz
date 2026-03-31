// ===== Dashboard Page (Premium Redesign) =====
import { navigate } from '../router.js';
import { getUser, isLoggedIn, getLatestResult, clearUser } from '../utils/storage.js';
import { getInitials, getAvatarColor } from '../utils/helpers.js';
import { CATEGORIES } from '../data/questions.js';

export function renderDashboard(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  const user = getUser();
  if (!user || (!user.id && !user.userId)) { clearUser(); navigate('/auth'); return; }
  
  fetch(`/api/auth/user/${user.id}`).then(r => {
    if (!r.ok) {
      clearUser();
      navigate('/auth');
    }
  }).catch(() => {});

  const latest = getLatestResult();
  const initials = getInitials(user.name);
  const avatarColor = getAvatarColor(user.name);

  container.innerHTML = `
    <div class="dashboard page-container">
      
      <!-- Premium Top Bar -->
      <div class="glass-card flex-between" style="margin: 20px 24px; padding: 12px 20px; border-radius: 20px; position: sticky; top: 20px; z-index: 100; border: 1px solid rgba(255,255,255,0.4);" class="px-mobile-4">
        <div class="dash-topbar__user" id="topbar-profile" style="cursor: pointer;">
          ${user.profileImage ? `
            <div class="avatar" style="width: 40px; height: 40px; border: 2px solid var(--primary); background-image: url('${user.profileImage}'); background-size: cover; background-position: center; border-radius: 12px;"></div>
          ` : `
            <div class="avatar" style="width: 40px; height: 40px; background:${avatarColor}; border-radius: 12px; font-weight: 800; font-family: var(--font-heading); display: flex; align-items:center; justify-content:center; color: white; font-size: 14px;">${initials}</div>
          `}
          <div class="dash-topbar__info">
            <span style="font-size: 10px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px;">Welcome back</span>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 15px; color: var(--gray-900); line-height: 1.2;">${user.name || 'New Explorer'}</div>
          </div>
        </div>
        <div class="coin-badge flex-center" style="background: var(--primary-lightest); padding: 6px 12px; border-radius: 12px; border: 1px solid var(--primary-light);">
          <span style="font-size: 14px; margin-right: 4px;">✨</span>
          <span style="font-weight: 800; font-family: var(--font-heading); color: var(--primary); font-size: 13px;">${latest ? latest.totalScore : '0'}</span>
        </div>
      </div>

      <!-- Hero Assessment Section -->
      <div class="animate-fadeInUp px-mobile-4" style="padding: 0 24px 32px;">
        <div class="hero-card" id="start-full-assessment" style="background: linear-gradient(135deg, var(--gray-900) 0%, #312E81 100%); border-radius: 32px; padding: 32px; color: white; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); cursor: pointer;">
          <!-- Decorative Background -->
          <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: var(--primary); opacity: 0.2; filter: blur(60px); border-radius: 50%;"></div>
          
          <div style="position: relative; z-index: 2;">
            <div class="flex-between" style="margin-bottom: 24px;">
              <span style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 100px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: white;">Elite Evaluation</span>
              <span style="font-size: 24px;">💎</span>
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 32px; font-weight: 900; margin-bottom: 12px; line-height: 1.05; letter-spacing: -1px; color: #FFFFFF;" class="text-mobile-2xl">Full Talent<br/>Assessment</h2>
            <p style="font-size: 14px; color: rgba(255,255,255,0.85); line-height: 1.6; margin-bottom: 32px; max-width: 260px; font-weight: 500;">Unlock your complete report with our logic evaluation.</p>
            <button class="btn btn--primary" id="btn-full-assessment" style="width: 100%; padding: 20px; border-radius: 20px; font-weight: 900; font-size: 17px; background: #FFFFFF; color: #1E1B4B; border: none; box-shadow: 0 15px 30px rgba(0,0,0,0.15);">Begin Assessment →</button>
          </div>
        </div>
      </div>

      <!-- Bento Grid Section -->
      <div class="px-mobile-4" style="padding: 0 24px;">
        <div class="flex-between" style="margin-bottom: 20px;">
          <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 18px; color: var(--gray-900);">Quick Practice</h3>
          <span style="font-size: 12px; font-weight: 700; color: var(--primary); cursor: pointer;">Show All</span>
        </div>

        <div class="grid grid-2 grid-mobile-1" style="gap: 16px;" id="dash-categories">
          ${CATEGORIES.map((cat, i) => `
            <div class="category-card animate-fadeInUp delay-${i + 1}" data-category="${cat.key}" style="background: var(--white); border-radius: 24px; padding: 20px; border: 1px solid var(--gray-100); cursor: pointer;">
              <div style="width: 44px; height: 44px; background: var(--gray-50); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; border: 1px solid var(--gray-100);">${cat.emoji}</div>
              <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 14px; color: var(--gray-900); margin-bottom: 4px;">${cat.label}</h4>
              <p style="font-size: 10px; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px;">Level Up</p>
            </div>
          `).join('')}
        </div>
      </div>

      ${latest ? `
        <!-- Floating Latest Report -->
        <div class="px-mobile-4" style="padding: 32px 24px 0;">
          <div class="card card--interactive animate-fadeInUp delay-5" id="view-latest-report" style="border-radius: 24px; padding: 16px; background: var(--white); border: 1px solid var(--gray-100); box-shadow: var(--shadow-lg);">
            <div style="display:flex;align-items:center;gap:14px;">
              <div style="width: 52px; height: 52px; background: var(--primary-lightest); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">${latest.personalityEmoji || '📊'}</div>
              <div style="flex:1;">
                <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 15px; margin-bottom: 2px; color: var(--gray-900);">Recent Achievement</h4>
                <p style="font-size: 12px; color:var(--gray-500); font-weight: 500;">Your <span style="color: var(--primary); font-weight: 700;">${latest.personalityType}</span> report is active.</p>
              </div>
              <div style="width: 36px; height: 36px; border-radius: 10px; background: var(--gray-50); display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 900;">→</div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;

  // Events
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      navigate(`/quiz?category=${cat}`);
    });
  });

  document.getElementById('btn-full-assessment')?.addEventListener('click', () => { navigate('/quiz'); });
  document.getElementById('start-full-assessment')?.addEventListener('click', (e) => {
    if (e.target.id !== 'btn-full-assessment') navigate('/quiz');
  });

  document.getElementById('view-latest-report')?.addEventListener('click', () => {
    if (latest) navigate(`/results/${latest.id}`);
  });

  document.getElementById('topbar-profile')?.addEventListener('click', () => { navigate('/profile'); });
}
