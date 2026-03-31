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
    <div class="dashboard page-container" style="background: var(--off-white); min-height: 100dvh; padding-bottom: 120px;">
      
      <!-- Premium Top Bar -->
      <div class="glass-card" style="margin: 20px 24px; padding: 12px 20px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 20px; z-index: 100; border: 1px solid rgba(255,255,255,0.4);">
        <div class="dash-topbar__user" id="topbar-profile" style="cursor: pointer; display: flex; align-items: center; gap: 12px;">
          ${user.profileImage ? `
            <div class="avatar" style="width: 44px; height: 44px; border: 2px solid var(--primary); background-image: url('${user.profileImage}'); background-size: cover; background-position: center; border-radius: 14px;"></div>
          ` : `
            <div class="avatar" style="width: 44px; height: 44px; background:${avatarColor}; border-radius: 14px; font-weight: 800; font-family: var(--font-heading); display: flex; align-items:center; justify-content:center; color: white;">${initials}</div>
          `}
          <div class="dash-topbar__info">
            <span style="font-size: 11px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px;">Welcome back</span>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 16px; color: var(--gray-900); line-height: 1.2;">${user.name || 'New Explorer'}</div>
          </div>
        </div>
        <div class="coin-badge" style="background: var(--primary-lightest); padding: 8px 16px; border-radius: 14px; border: 1px solid var(--primary-light);">
          <span style="font-size: 16px; margin-right: 6px;">✨</span>
          <span style="font-weight: 800; font-family: var(--font-heading); color: var(--primary); font-size: 14px;">${latest ? latest.totalScore : '0'} SPARK</span>
        </div>
      </div>

      <!-- Hero Assessment Section -->
      <div style="padding: 0 24px 32px;" class="animate-fadeInUp">
        <div class="hero-card" id="start-full-assessment" style="background: linear-gradient(135deg, var(--gray-900) 0%, #312E81 100%); border-radius: 32px; padding: 36px; color: white; position: relative; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); cursor: pointer;">
          <!-- Decorative Background -->
          <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: var(--primary); opacity: 0.2; filter: blur(60px); border-radius: 50%;"></div>
          
          <div style="position: relative; z-index: 2;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
              <span style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); padding: 7px 18px; border-radius: 100px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: white;">Elite Evaluation</span>
              <span style="font-size: 26px; filter: drop-shadow(0 0 10px rgba(79, 70, 229, 0.4));">💎</span>
            </div>
            <h2 style="font-family: var(--font-heading); font-size: 36px; font-weight: 900; margin-bottom: 14px; line-height: 1.05; letter-spacing: -1.5px; color: #FFFFFF; text-shadow: 0 2px 10px rgba(0,0,0,0.1);">Full Talent<br/>Assessment</h2>
            <p style="font-size: 15px; color: rgba(255,255,255,0.9); line-height: 1.6; margin-bottom: 36px; max-width: 260px; font-weight: 500;">Unlock your complete professional potential report with our 30-question logic evaluation.</p>
            <button class="btn btn--primary" id="btn-full-assessment" style="width: 100%; padding: 22px; border-radius: 20px; font-weight: 900; font-size: 17px; background: #FFFFFF; color: #1E1B4B; border: none; box-shadow: 0 15px 30px rgba(0,0,0,0.15); transition: all 0.3s; transform: translateZ(0);">Begin Assessment →</button>
          </div>
        </div>
      </div>

      <!-- Bento Grid Section -->
      <div style="padding: 0 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 20px; color: var(--gray-900);">Quick Practice</h3>
          <span style="font-size: 12px; font-weight: 700; color: var(--primary); cursor: pointer;">Show All</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" id="dash-categories">
          ${CATEGORIES.map((cat, i) => `
            <div class="category-card animate-fadeInUp delay-${i + 1}" data-category="${cat.key}" style="background: var(--white); border-radius: 24px; padding: 24px; border: 1px solid var(--gray-100); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;" onmouseover="this.style.transform='translateY(-8px)'; this.style.borderColor='var(--primary-light)'; this.style.boxShadow='var(--shadow-lg)'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--gray-100)'; this.style.boxShadow='none'">
              <div style="width: 52px; height: 52px; background: var(--gray-50); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; border: 1px solid var(--gray-100);">${cat.emoji}</div>
              <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 15px; color: var(--gray-900); margin-bottom: 4px;">${cat.label}</h4>
              <p style="font-size: 11px; font-weight: 600; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px;">Level Up</p>
            </div>
          `).join('')}
        </div>
      </div>

      ${latest ? `
        <!-- Floating Latest Report -->
        <div style="padding: 32px 24px 0;">
          <div class="card card--interactive animate-fadeInUp delay-5" id="view-latest-report" style="border-radius: 28px; padding: 20px; background: var(--white); border: 1px solid var(--gray-100); box-shadow: var(--shadow-lg);">
            <div style="display:flex;align-items:center;gap:16px;">
              <div style="width: 60px; height: 60px; background: var(--primary-lightest); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px;">${latest.personalityEmoji || '📊'}</div>
              <div style="flex:1;">
                <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 16px; margin-bottom: 2px; color: var(--gray-900);">Recent Achievement</h4>
                <p style="font-size: 13px; color:var(--gray-500); font-weight: 500;">Your <span style="color: var(--primary); font-weight: 700;">${latest.personalityType}</span> report is active.</p>
              </div>
              <div style="width: 44px; height: 44px; border-radius: 14px; background: var(--gray-50); display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 900;">→</div>
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
