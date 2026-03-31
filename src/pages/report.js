// ===== Premium Report Page (Image-Matched Edition) =====
import { navigate } from '../router.js';
import { getResultById, getUser, getLeaderboard } from '../utils/storage.js';
import { animateCounter, formatDate } from '../utils/helpers.js';
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
    }
  } catch (e) {
    console.log('API fetch failed, trying localStorage');
  }
  
  if (!result) {
    result = getResultById(resultId);
  }

  if (!result) {
    container.innerHTML = `
      <div class="page-container flex-center flex-col text-center" style="min-height:100dvh;gap:16px;padding:24px;">
        <div style="font-size:64px;">🔍</div>
        <h2 style="font-family: var(--font-heading); font-weight: 800;">Report Not Found</h2>
        <button class="btn btn--primary" id="report-take-test">Back to Dashboard</button>
      </div>
    `;
    document.getElementById('report-take-test')?.addEventListener('click', () => navigate('/dashboard'));
    return;
  }

  container.innerHTML = `
    <div class="report-page animate-fadeIn">
      
      <!-- Premium Header -->
      <header class="report-header">
        <div class="report-header__badge">
          <span>✨ Assessment Complete</span>
        </div>
        <h1 class="report-header__title text-mobile-3xl">Your True Potential</h1>
        <p class="report-header__subtitle">Insight • AI Driven • Report</p>


        <div class="report-status-badge">
          <span class="text-mobile-sm">🌟 ${result.personalityType}</span>
        </div>
      </header>

      <!-- Main Content Container -->
      <main>
        
        <!-- Insight Box -->
        <div class="report-insight-card animate-fade-in delay-1">
          <p>"${result.personalityDesc}"</p>
        </div>

        <!-- Potential Map (Radar) -->
        <section class="report-section animate-fade-in delay-2">
          <div class="report-section__header">
            <span class="report-section__icon">🗺️</span>
            <h3 class="report-section__title">Your Potential Map</h3>
          </div>
          <div class="report-chart-container">
            <canvas id="radar-chart"></canvas>
          </div>
        </section>

        <!-- Category Breakdown -->
        <section class="report-section animate-fade-in delay-2">
          <div class="report-section__header">
            <span class="report-section__icon">📊</span>
            <h3 class="report-section__title">Category Breakdown</h3>
          </div>
          <div class="category-breakdown">
            ${Object.entries(result.categoryScores).map(([key, score]) => `
              <div class="category-item">
                <div class="category-item__meta">
                  <div class="category-item__label">
                    <span>${CATEGORY_EMOJIS[key]}</span>
                    <span>${CATEGORY_LABELS[key]}</span>
                  </div>
                  <span class="category-item__value">${score}%</span>
                </div>
                <div class="category-item__progress">
                  <div class="category-item__fill" style="width: ${score}%; background: ${getGradientForCategory(key)}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Top Strengths -->
        <section class="report-section animate-fade-in delay-3">
          <div class="report-section__header">
            <span class="report-section__icon">✨</span>
            <h3 class="report-section__title">Top Strengths</h3>
          </div>
          <div class="strengths-grid grid-mobile-1">
            ${result.topStrengths.slice(0, 4).map((s, i) => `
              <div class="strength-card">
                <div class="strength-card__icon">${getStrengthIcon(s.name)}</div>
                <div class="strength-card__name">${s.name}</div>
                <div class="strength-card__value">${s.value}% Match</div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Areas to Improve -->
        <section class="report-section animate-fade-in delay-3">
          <div class="report-section__header">
            <span class="report-section__icon">🚀</span>
            <h3 class="report-section__title">Areas to Improve</h3>
          </div>
          <div class="action-list">
            ${result.areasToImprove.map(item => `
              <div class="action-item">
                <span class="action-item__bullet">✦</span>
                <span class="action-item__text">${item}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Skill Development Plan -->
        <section class="report-section animate-fade-in delay-3">
          <div class="report-section__header">
            <span class="report-section__icon">📝</span>
            <h3 class="report-section__title">Skill Development Plan</h3>
          </div>
          <div class="action-list">
            ${result.skillPlan.map(item => `
              <div class="skill-plan-item">
                <div class="skill-plan-item__check">✓</div>
                <span class="skill-plan-item__text">${item}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Growth Dimensions -->
        <section class="report-section animate-fade-in delay-3">
          <div class="report-section__header">
            <span class="report-section__icon">🧬</span>
            <h3 class="report-section__title">Growth Dimensions</h3>
          </div>
          <div class="growth-grid grid-mobile-1">
            <div class="growth-card">
              <div class="growth-card__title">Cognitive Signature</div>
              <div class="growth-card__text">${result.cognitiveSignature || 'Analytical & Methodical'}</div>
            </div>
            <div class="growth-card">
              <div class="growth-card__title">Market Value</div>
              <div class="growth-card__text">${result.marketValue || 'High demand in modern enterprise.'}</div>
            </div>
          </div>
        </section>

        <!-- Emotional Intelligence Section -->
        <section class="report-section animate-fade-in delay-3">
          <div class="ei-card">
            <span class="ei-card__badge">High Performance Insight</span>
            <h3 class="ei-card__title">Emotional Intelligence</h3>
            <p class="ei-card__text">Your ability to navigate complex social dynamics is one of your strongest traits. You synthesize technical data with human empathy to drive results.</p>
          </div>
        </section>

        <!-- Success Strategy -->
        <section class="report-section animate-fade-in delay-3">
          <div class="report-section__header">
            <span class="report-section__icon">🚀</span>
            <h3 class="report-section__title">Success Strategy</h3>
          </div>
          <div class="strategy-card">
            <div class="strategy-icon">💡</div>
            <p class="strategy-text">${result.actionableAdvice}</p>
          </div>
        </section>

        <!-- Tailored Career Guide -->
        <section class="report-section animate-fade-in delay-3">
          <div class="report-section__header">
            <span class="report-section__icon">🎯</span>
            <h3 class="report-section__title">Tailored Career Guide</h3>
          </div>
          <div class="career-guide">
            ${result.careers.map(c => `
              <div class="career-card">
                <div class="career-card__icon">${c.icon}</div>
                <div class="career-card__content">
                  <div class="career-card__title">${c.title}</div>
                  <div class="career-card__context">${c.context}</div>
                </div>
                <div class="career-card__match">
                  <span class="career-card__pct">${c.match}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

      </main>

      <!-- Bottom Footer Action -->
      <footer class="report-footer">
        <div class="report-footer__actions">
          <button class="share-btn share-btn--secondary" id="report-retake-btn">
            <span>🔄 Retake Assessment</span>
          </button>
          <button class="share-btn" id="report-share-btn">
            <span>🔗 Copy Share Link</span>
          </button>
        </div>
      </footer>
    </div>
  `;

  // Animate counter

  // Confetti
  setTimeout(() => launchConfetti(), 300);

  // Radar Chart
  setTimeout(() => initRadarChart(result), 600);

  // Share link
  document.getElementById('report-share-btn')?.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard! 📋', 'success');
  });

  document.getElementById('report-retake-btn')?.addEventListener('click', () => {
    navigate('/quiz');
  });
}

function getGradientForCategory(cat) {
  const gradients = {
    moral: '#F43F5E',
    tech: '#6366F1',
    reasoning: '#A855F7',
    personality: '#10B981',
    creative: '#F59E0B'
  };
  return gradients[cat] || '#6366F1';
}

function getStrengthIcon(name) {
  const icons = {
    'Empathy': '🤝',
    'Integrity': '🌟',
    'Community Building': '💪',
    'Conflict Resolution': '🔥',
    'Creative Thinking': '🎨',
    'Analytical Thinking': '🧩',
    'Leadership': '👑',
    'Problem Solving': '💡'
  };
  return icons[name] || '✨';
}

function initRadarChart(result) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;

  const labels = Object.keys(result.categoryScores).map(k => CATEGORY_LABELS[k]);
  const data = Object.values(result.categoryScores);

  new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Aptitude Match',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366F1',
        borderWidth: 3,
        pointBackgroundColor: '#6366F1',
        pointBorderColor: '#fff',
        pointRadius: 4,
      }],
    },
    options: {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          pointLabels: {
            font: { weight: '700', size: 11 }
          }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}
