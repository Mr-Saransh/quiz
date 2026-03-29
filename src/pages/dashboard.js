// ===== Dashboard Page =====
import { navigate } from '../router.js';
import { getUser, isLoggedIn, getLatestResult, clearUser } from '../utils/storage.js';
import { getInitials, getAvatarColor } from '../utils/helpers.js';
import { CATEGORIES } from '../data/questions.js';

const CARD_STYLES = ['', 'category-card--secondary', 'category-card--blue', 'category-card--purple', 'category-card--gold'];

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
    <div class="dashboard page-container paper-bg">
      <!-- Top bar -->
      <div class="dash-topbar" style="cursor: pointer;" id="topbar-profile" title="Edit Profile">
        <div class="dash-topbar__user">
          ${user.profileImage ? `
            <div class="avatar" style="border: 2px solid var(--primary); background-image: url('${user.profileImage}'); background-size: cover; background-position: center;"></div>
          ` : `
            <div class="avatar" style="background:${avatarColor}">${initials}</div>
          `}
          <div class="dash-topbar__info">
            <span class="dash-topbar__greeting">Hello there 👋</span>
            <span class="dash-topbar__name">${user.name || 'New Explorer'}</span>
          </div>
        </div>
        <div class="coin-badge">
          <div class="coin-badge__icon">$</div>
          <span>${latest ? latest.totalScore : '0'}</span>
        </div>
      </div>

      ${!user.name || !user.ageClass ? `
      <!-- Complete Profile Banner -->
      <div style="padding: 0 24px 16px;">
        <div style="background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 16px; padding: 16px; color: white; display:flex; align-items:center; justify-content:space-between; box-shadow: var(--shadow-primary);">
          <div>
            <h4 style="font-family:var(--font-heading); font-size:16px; margin-bottom:4px;">Complete Your Profile</h4>
            <p style="font-size:12px; opacity:0.9;">Add your name and grade to get started.</p>
          </div>
          <button id="btn-complete-profile" style="background:white; color:var(--primary); border:none; padding:8px 16px; border-radius:24px; font-weight:bold; cursor:pointer;">Go →</button>
        </div>
      </div>
      ` : ''}

      <!-- Search -->
      <div class="dash-search">
        <span class="dash-search__icon">🔍</span>
        <input type="text" class="dash-search__input" placeholder="Search quiz..." id="dash-search-input" />
        <div class="dash-search__filter">⚙</div>
      </div>

      <!-- Section title -->
      <div class="dash-section">
        <div class="dash-section__header">
          <h2 class="dash-section__title">Choose<br/>your game</h2>
          <a href="#" class="dash-section__link">See all</a>
        </div>
      </div>

      <!-- Category cards -->
      <div class="dash-categories" id="dash-categories">
        ${CATEGORIES.map((cat, i) => `
          <div class="category-card ${CARD_STYLES[i] || ''} animate-fadeInUp delay-${i + 1}" data-category="${cat.key}" id="category-${cat.key}">
            <div class="category-card__deco category-card__deco--1"></div>
            <div class="category-card__deco category-card__deco--2"></div>
            <span class="category-card__emoji">${cat.emoji}</span>
            <div>
              <h3 class="category-card__title">${cat.label}</h3>
              <p class="category-card__desc">6 questions to test your skills</p>
            </div>
            <button class="category-card__play">▶ Play</button>
          </div>
        `).join('')}
      </div>

      <!-- Full assessment -->
      <div class="full-assessment-card animate-fadeInUp delay-6" id="start-full-assessment">
        <span class="full-assessment-card__stars">🌟</span>
        <div class="full-assessment-card__badge">🎯 Recommended</div>
        <h3 class="full-assessment-card__title">Full Assessment</h3>
        <p class="full-assessment-card__desc">Take the complete 30-question assessment across all categories to get your detailed evaluation report.</p>
        <button class="btn btn--primary" id="btn-full-assessment">Start Full Assessment →</button>
      </div>

      ${latest ? `
        <div style="padding:0 24px 24px;">
          <div class="card card--interactive" id="view-latest-report" style="cursor:pointer;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="font-size:32px;">${latest.personalityEmoji || '📊'}</div>
              <div style="flex:1;">
                <h4 style="font-size:14px;margin-bottom:2px;">Your Latest Report</h4>
                <p style="font-size:12px;color:var(--gray-500);">${latest.personalityType} • Score: ${latest.totalScore}</p>
              </div>
              <span style="color:var(--primary);font-weight:700;">View →</span>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;



  // Category card clicks — start quiz with specific category
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      navigate(`/quiz?category=${cat}`);
    });
  });

  // Full assessment
  document.getElementById('btn-full-assessment')?.addEventListener('click', () => {
    navigate('/quiz');
  });
  document.getElementById('start-full-assessment')?.addEventListener('click', (e) => {
    if (e.target.id !== 'btn-full-assessment') navigate('/quiz');
  });

  // View report
  document.getElementById('view-latest-report')?.addEventListener('click', () => {
    if (latest) navigate(`/results/${latest.id}`);
  });

  // Profile actions
  document.getElementById('topbar-profile')?.addEventListener('click', () => {
    navigate('/profile');
  });
  document.getElementById('btn-complete-profile')?.addEventListener('click', () => {
    navigate('/profile');
  });
}
