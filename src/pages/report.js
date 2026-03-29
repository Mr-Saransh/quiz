// ===== Report Page =====
import { navigate } from '../router.js';
import { getResultById, getUser, isLoggedIn, getLeaderboard } from '../utils/storage.js';
import { animateCounter, getInitials, getAvatarColor, formatDate } from '../utils/helpers.js';
import { launchConfetti } from '../components/confetti.js';
import { showToast } from '../components/toast.js';
import { CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from '../engine/scoring.js';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

export async function renderReport(container, params) {
  const resultId = params.id;
  
  // Try API first, then localStorage
  let result = null;
  try {
    const res = await fetch(`/api/quiz/results/${resultId}`);
    if (res.ok) {
      const data = await res.json();
      result = data.result;
      // Add display helpers if missing
      result.date = result.createdAt || result.date;
      result.categoryColors = result.categoryColors || CATEGORY_COLORS;
      result.categoryEmojis = result.categoryEmojis || CATEGORY_EMOJIS;
      result.categoryLabels = result.categoryLabels || CATEGORY_LABELS;
    }
  } catch (e) {
    console.log('API fetch failed, trying localStorage');
  }
  
  if (!result) {
    result = getResultById(resultId);
  }

  if (!result) {
    container.innerHTML = `
      <div class="page-container" style="display:flex;align-items:center;justify-content:center;min-height:100dvh;flex-direction:column;gap:16px;padding:24px;text-align:center;">
        <div style="font-size:64px;">🔍</div>
        <h2 style="font-family:var(--font-heading);font-weight:800;">Report Not Found</h2>
        <p style="color:var(--gray-500);">This report may have been removed or the link is incorrect.</p>
        <button class="btn btn--primary" id="report-take-test">Take Your Own Test →</button>
      </div>
    `;
    document.getElementById('report-take-test')?.addEventListener('click', () => navigate('/'));
    return;
  }

  const user = getUser();
  const isOwner = user && user.id === result.userId;
  const leaderboard = getLeaderboard();
  const rank = leaderboard.findIndex(e => e.userId === result.userId) + 1;

  container.innerHTML = `
    <div class="report-page page-container">
      <!-- Header -->
      <div class="report-header">
        <div class="report-header__bg-circle report-header__bg-circle--1"></div>
        <div class="report-header__bg-circle report-header__bg-circle--2"></div>
        
        <button class="report-header__back" id="report-back">←</button>
        <button class="report-header__share" id="report-share-btn">↗</button>

        <div class="report-header__badge">📊 AI Assessment Report</div>
        <h1 class="report-header__title">Your True Potential</h1>
        <p class="report-header__name">${result.userName} • ${formatDate(result.date)}</p>

        <!-- Score -->
        <div class="report-score">
          <div class="report-score-circle">
            <span class="report-score-circle__value" id="score-counter">0</span>
            <span class="report-score-circle__max">/ 1000</span>
          </div>
        </div>

        <p class="report-header__personality-label">Your Personality Type</p>
        <p class="report-header__personality">${result.personalityEmoji} ${result.personalityType}</p>
      </div>

      <!-- About personality -->
      <div class="report-section">
        <div class="card" style="border-left:4px solid var(--primary);">
          <p style="font-size:14px;color:var(--gray-600);line-height:1.7;">${result.personalityDesc}</p>
        </div>
      </div>

      <!-- Potential Map (Radar) -->
      <div class="report-section">
        <h3 class="report-section__title">🗺️ Your Potential Map</h3>
        <div class="report-chart">
          <canvas id="radar-chart"></canvas>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="report-section">
        <h3 class="report-section__title">📊 Category Breakdown</h3>
        <div class="report-categories" id="report-categories">
          ${Object.entries(result.categoryScores).map(([key, score]) => `
            <div class="report-category-item">
              <div class="report-category-item__header">
                <span class="report-category-item__name">${result.categoryEmojis[key]} ${result.categoryLabels[key]}</span>
                <span class="report-category-item__score">${score}%</span>
              </div>
              <div class="report-category-item__bar">
                <div class="report-category-item__fill report-category-item__fill--${result.categoryColors[key]}" style="width:${score}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Top Strengths -->
      <div class="report-section">
        <h3 class="report-section__title">✨ Top Strengths</h3>
        <div class="report-traits">
          ${result.topStrengths.map((t, i) => `
            <div class="report-trait">
              <div class="report-trait__emoji">${['🌟', '💪', '🔥', '💡'][i] || '⭐'}</div>
              <div class="report-trait__name">${t.name}</div>
              <div class="report-trait__value">${t.value}%</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Areas to Improve -->
      <div class="report-section">
        <h3 class="report-section__title">🌱 Areas to Improve</h3>
        <div class="report-list">
          ${result.areasToImprove.map(area => `
            <div class="report-list-item report-list-item--warning">
              <span class="report-list-item__icon">↳</span>
              <span class="report-list-item__text">${area}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Skill Development Plan -->
      <div class="report-section">
        <h3 class="report-section__title">📈 Skill Development Plan</h3>
        <div class="report-list">
          ${result.skillPlan.map(plan => `
            <div class="report-list-item report-list-item--success">
              <span class="report-list-item__icon">✓</span>
              <span class="report-list-item__text">${plan}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Growth & Learning (New Section) -->
      <div class="report-section">
        <h3 class="report-section__title">🧠 Growth Dimensions</h3>
        <div class="report-grid">
          <div class="report-card report-card--purple">
            <div class="report-card__label">Learning Style</div>
            <div class="report-card__content">${result.learningStyle || 'Visual & Experiential'}</div>
          </div>
          <div class="report-card report-card--blue">
            <div class="report-card__label">Ideal Environment</div>
            <div class="report-card__content">${result.workEnvironment || 'Fast-paced & Dynamic'}</div>
          </div>
        </div>
      </div>

      <!-- Hidden Talent -->
      ${result.hiddenTalent ? `
      <div class="report-section">
        <div class="report-talent">
          <div class="report-talent__label">✨ Hidden Talent Unlocked</div>
          <h3 class="report-talent__title">${result.hiddenTalent}</h3>
          <p class="report-talent__desc">${result.hiddenTalentDesc}</p>
        </div>
      </div>
      ` : ''}

      <!-- Actionable Advice -->
      <div class="report-section">
        <h3 class="report-section__title">🚀 Success Strategy</h3>
        <div class="report-advice">
          <div class="report-advice__icon">💡</div>
          <div class="report-advice__content">
            <p class="report-advice__text">${result.actionableAdvice || 'Focus on consistent practice.'}</p>
          </div>
        </div>
      </div>

      <!-- Career Suggestions -->
      <div class="report-section">
        <h3 class="report-section__title">🎯 Tailored Career Paths</h3>
        <p class="report-section__subtitle">Based on Indian Industry Standards 🇮🇳</p>
        <div class="report-careers">
          ${result.careers.map(c => `
            <div class="report-career">
              <div class="report-career__icon report-career__icon--primary">${c.icon}</div>
              <div class="report-career__info">
                <div class="report-career__title">${c.title}</div>
                <div class="report-career__match">High Match Score</div>
                <div class="report-career__context">${c.context || ''}</div>
              </div>
              <div class="report-career__pct">${c.match}%</div>
            </div>
          `).join('')}
        </div>
      </div>

      ${rank > 0 ? `
      <div class="report-section">
        <div class="card text-center" style="background:var(--primary-lightest);border:2px solid var(--primary);">
          <p style="font-size:14px;color:var(--primary);font-weight:600;">🏆 You are ranked #${rank} on the leaderboard!</p>
        </div>
      </div>
      ` : ''}

      <!-- CTAs -->
      <div class="report-ctas" style="margin-top: 24px;">
        <button class="btn btn--block btn--lg" id="report-share-link" style="background: var(--primary); color: white; border-radius: 50px;">
          🔗 Copy Shareable Link
        </button>
        <div class="report-share-row" style="margin-top: 16px;">
          <button class="report-share-btn" id="share-whatsapp" title="Share on WhatsApp">📱</button>
          <button class="report-share-btn" id="share-twitter" title="Share on Twitter">🐦</button>
          <button class="report-share-btn" id="share-copy" title="Copy link">📋</button>
        </div>
      </div>
    </div>
  `;

  // Animate score
  setTimeout(() => {
    const el = document.getElementById('score-counter');
    if (el) animateCounter(el, result.totalScore, 1500);
    launchConfetti(3000);
  }, 500);

  // Radar chart
  setTimeout(() => initRadarChart(result), 600);

  // Event listeners
  document.getElementById('report-back')?.addEventListener('click', () => navigate('/dashboard'));
  document.getElementById('report-retake')?.addEventListener('click', () => navigate('/quiz'));
  document.getElementById('report-take-own')?.addEventListener('click', () => navigate('/'));
  
  const shareUrl = window.location.origin + window.location.pathname + '#/results/' + result.id;
  
  document.getElementById('report-share-link')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(shareUrl);
    showToast('Link copied to clipboard!', 'success');
  });
  document.getElementById('report-share-btn')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: 'My QuizPotential Report', text: `I scored ${result.totalScore}/1000 and I'm "${result.personalityType}"! Take your assessment:`, url: shareUrl });
    } else {
      navigator.clipboard?.writeText(shareUrl);
      showToast('Link copied!', 'success');
    }
  });
  document.getElementById('share-copy')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(shareUrl);
    showToast('Link copied!', 'success');
  });
  document.getElementById('share-whatsapp')?.addEventListener('click', () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`I scored ${result.totalScore}/1000 on QuizPotential! I'm "${result.personalityType}" 🎯 Take yours: ${shareUrl}`)}`);
  });
  document.getElementById('share-twitter')?.addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${result.totalScore}/1000 on QuizPotential! I'm "${result.personalityType}" 🎯`)}&url=${encodeURIComponent(shareUrl)}`);
  });
}

function initRadarChart(result) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;

  const labels = Object.keys(result.categoryScores).map(k => result.categoryLabels[k]);
  const data = Object.values(result.categoryScores);

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Your Score',
        data,
        backgroundColor: 'rgba(255, 107, 0, 0.15)',
        borderColor: '#FF6B00',
        borderWidth: 2.5,
        pointBackgroundColor: '#FF6B00',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 25,
            display: false,
          },
          grid: {
            color: 'rgba(0,0,0,0.05)',
          },
          angleLines: {
            color: 'rgba(0,0,0,0.05)',
          },
          pointLabels: {
            font: {
              family: "'Outfit', sans-serif",
              size: 11,
              weight: '600',
            },
            color: '#374151',
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#1F2937',
          titleFont: { family: "'Outfit', sans-serif", weight: '700' },
          bodyFont: { family: "'Inter', sans-serif" },
          padding: 12,
          cornerRadius: 12,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
          },
        },
      },
    },
  });
}
