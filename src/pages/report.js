// ===== Report Page (Premium Identity Edition) =====
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
      <div class="page-container" style="display:flex;align-items:center;justify-content:center;min-height:100dvh;flex-direction:column;gap:16px;padding:24px;text-align:center;background:var(--off-white);">
        <div style="font-size:64px;">🔍</div>
        <h2 style="font-family:var(--font-heading);font-weight:800;color:var(--gray-900);">Insight Not Found</h2>
        <p style="color:var(--gray-500);max-width:300px;">This digital identity record could not be retrieved from our secure vault.</p>
        <button class="btn btn--primary" id="report-take-test" style="border-radius:18px;">Start New Discovery →</button>
      </div>
    `;
    document.getElementById('report-take-test')?.addEventListener('click', () => navigate('/'));
    return;
  }

  const user = getUser();
  const leaderboard = getLeaderboard();
  const rank = leaderboard.findIndex(e => e.userId === result.userId) + 1;

  container.innerHTML = `
    <div class="report-page page-container animate-fadeIn" style="background: var(--off-white); min-height: 100dvh; padding-bottom: 120px;">
      
      <!-- Premium Identity Header -->
      <div class="report-header" style="background: linear-gradient(160deg, #0F172A 0%, #1E1B4B 100%); padding: 60px 24px 120px; position: relative; overflow: hidden; text-align: center; border-radius: 0 0 48px 48px; box-shadow: var(--shadow-2xl);">
        <!-- Animated Blobs -->
        <div class="deco-blob deco-blob--primary" style="top: -100px; right: -50px; width: 350px; height: 350px; opacity: 0.15;"></div>
        <div class="deco-blob deco-blob--secondary" style="bottom: -150px; left: -50px; width: 250px; height: 250px; opacity: 0.1;"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; position: relative; z-index: 10;">
          <button id="report-back" class="glass-card" style="width: 44px; height: 44px; border-radius: 14px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <span style="font-family: var(--font-heading); font-weight: 700; text-transform: uppercase; letter-spacing: 3px; font-size: 11px; color: rgba(255,255,255,0.5);">Verified Insight</span>
          <button id="report-share-btn" class="glass-card" style="width: 44px; height: 44px; border-radius: 14px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
        </div>

        <div class="animate-fadeInUp" style="position: relative; z-index: 10;">
          <div style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); padding: 8px 18px; border-radius: 100px; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px; backdrop-filter: blur(5px);">
            <span style="font-size: 14px;">✨</span>
            <span style="font-size: 11px; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 1.5px;">Identity Report</span>
          </div>

          <h1 style="color: white; font-family: var(--font-heading); font-size: 36px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; line-height: 1.1;">Your Professional<br/>Superpower Unlocked</h1>
          <p style="color: rgba(255,255,255,0.5); font-weight: 600; font-size: 14px;">Generated for ${result.userName} • ${formatDate(result.date)}</p>

          <!-- Floating Personality Icon -->
          <div class="report-personality-icon" style="font-size: 100px; margin: 40px auto; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5)); animation: float 4s ease-in-out infinite;">
            ${result.personalityEmoji}
          </div>

          <p style="color: var(--primary-light); font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 4px;">Classification</p>
          <p style="color: white; font-family: var(--font-heading); font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${result.personalityType}</p>
        </div>
      </div>

      <!-- Content Hub -->
      <div style="margin-top: -60px; padding: 0 24px; max-width: var(--max-w-content); margin-left: auto; margin-right: auto; position: relative; z-index: 10;">
        
        <!-- Personality Narrative -->
        <div class="glass-card animate-fadeInUp" style="padding: 32px; margin-bottom: 24px; border-radius: 32px; border: 1px solid rgba(255,255,255,0.6); box-shadow: var(--shadow-xl);">
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            <div style="font-size: 32px; opacity: 0.2; transform: translateY(-10px);">"</div>
            <p style="font-size:16px; color:var(--gray-700); line-height:1.7; font-weight: 500; font-style: italic;">${result.personalityDesc}</p>
            <div style="font-size: 32px; opacity: 0.2; align-self: flex-end; transform: translateY(10px);">"</div>
          </div>
        </div>

        <!-- Radical Potential Map -->
        <div class="card animate-fadeInUp delay-1" style="padding: 36px; border-radius: 36px; margin-bottom: 24px; box-shadow: var(--shadow-lg);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 44px; height: 44px; background: var(--primary-lightest); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px;">🗺️</div>
              <h3 style="font-weight: 800; font-size: 18px; color: var(--gray-900); font-family: var(--font-heading);">Potential Map</h3>
            </div>
            <div style="display: flex; gap: 4px;">
               ${[1,2,3].map(i => `<div style="width: 4px; height: 4px; background: var(--primary); border-radius: 50%; opacity: ${i/3}"></div>`).join('')}
            </div>
          </div>
          <div class="report-chart" style="height: 320px; position: relative;">
            <canvas id="radar-chart"></canvas>
          </div>
        </div>

        <!-- Success Strategy Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
          <div class="card animate-fadeInUp delay-2" style="padding: 24px; border-radius: 28px; background: linear-gradient(135deg, white 0%, var(--gray-50) 100%);">
            <span style="font-size: 24px; margin-bottom: 16px; display: block;">🧠</span>
            <h4 style="font-weight: 800; font-size: 14px; color: var(--gray-900); font-family: var(--font-heading); margin-bottom: 8px;">Learning Style</h4>
            <p style="font-size: 12px; color: var(--gray-600); line-height: 1.6; font-weight: 500;">${result.learningStyle || 'Experiential Discovery'}</p>
          </div>
          <div class="card animate-fadeInUp delay-2" style="padding: 24px; border-radius: 28px; background: linear-gradient(135deg, white 0%, var(--gray-50) 100%);">
            <span style="font-size: 24px; margin-bottom: 16px; display: block;">🏢</span>
            <h4 style="font-weight: 800; font-size: 14px; color: var(--gray-900); font-family: var(--font-heading); margin-bottom: 8px;">Environment</h4>
            <p style="font-size: 12px; color: var(--gray-600); line-height: 1.6; font-weight: 500;">${result.workEnvironment || 'Dynamic & Collaborative'}</p>
          </div>
        </div>

        <!-- Actionable Insight -->
        <div class="card animate-fadeInUp delay-3" style="padding:32px; border-radius: 32px; background: var(--gray-900); color: white; position: relative; overflow: hidden; margin-bottom: 24px;">
           <div style="position: absolute; right: -20px; top: -20px; width: 100px; height: 100px; background: var(--primary); opacity: 0.15; filter: blur(30px);"></div>
           <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
              <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🚀</div>
              <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 18px;">Growth Strategy</h3>
           </div>
           <p style="font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.7; font-weight: 400;">${result.actionableAdvice || 'Focus on building consistent practice in your primary talent areas to unlock advanced tier potential.'}</p>
        </div>

        <!-- Career Hub -->
        <div class="card animate-fadeInUp delay-4" style="padding: 32px; border-radius: 36px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-xl);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 4px; height: 24px; background: var(--primary); border-radius: 100px;"></div>
              <h3 style="font-weight: 800; font-size: 18px; color: var(--gray-900); font-family: var(--font-heading);">Career Pathways</h3>
            </div>
            <span style="font-size: 11px; font-weight: 800; color: var(--lime); background: var(--lime-light); padding: 4px 12px; border-radius: 50px;">ELITE MATCH</span>
          </div>

          <div style="display: grid; gap: 16px;">
            ${result.careers.map(c => `
              <div class="career-item" style="display: flex; align-items: center; gap: 20px; padding: 20px; background: var(--gray-50); border-radius: 20px; border: 1px solid var(--gray-100); transition: all 0.3s ease;">
                <div style="width: 52px; height: 52px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid var(--gray-200);">${c.icon}</div>
                <div style="flex: 1;">
                  <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 15px; color: var(--gray-900);">${c.title}</h4>
                  <div style="font-size: 11px; font-weight: 700; color: var(--gray-400); margin-top: 2px;">${c.context || 'Industry Match Available'}</div>
                </div>
                <div style="text-align: right;">
                   <div style="font-size: 18px; font-weight: 900; color: var(--primary); font-family: var(--font-heading);">${c.match}%</div>
                   <div style="font-size: 10px; font-weight: 800; color: var(--gray-300);">COMPATIBILITY</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        ${rank > 0 ? `
        <div class="animate-fadeInUp delay-5" style="margin-top: 32px;">
          <div class="glass-card" style="padding: 24px; border-radius: 28px; text-align: center; border: 1px solid var(--primary-light); background: var(--primary-lightest);">
            <p style="font-size:14px;color:var(--primary);font-weight:800; font-family: var(--font-heading); letter-spacing: 0.5px;">🏆 GLOBAL STANDING: RANKED #${rank}</p>
          </div>
        </div>
        ` : ''}

        <!-- Final CTA Row -->
        <div style="margin-top: 48px; display: flex; flex-direction: column; gap: 16px;">
          <button id="report-share-link" class="btn btn--primary" style="padding: 22px; border-radius: 20px; font-weight: 800; font-size: 16px;">Share Your Identity Card</button>
          <button id="report-retake" style="padding: 12px; background: transparent; border: none; color: var(--gray-400); font-weight: 700; font-size: 13px; cursor: pointer;">Redo Assessment</button>
        </div>
      </div>
    </div>
  `;

  // Animate interactions
  setTimeout(() => {
    launchConfetti(3000);
  }, 500);

  // Radar chart
  setTimeout(() => initRadarChart(result), 600);

  // Event listeners
  document.getElementById('report-back')?.addEventListener('click', () => navigate('/dashboard'));
  document.getElementById('report-retake')?.addEventListener('click', () => navigate('/quiz'));
  
  const shareUrl = window.location.origin + window.location.pathname + '#/results/' + result.id;
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'My Digital Identity Report', text: `I'm classified as "${result.personalityType}"! Discover your professional superpower:`, url: shareUrl });
    } else {
      navigator.clipboard?.writeText(shareUrl);
      showToast('Identity link copied! ✨', 'success');
    }
  };

  document.getElementById('report-share-link')?.addEventListener('click', handleShare);
  document.getElementById('report-share-btn')?.addEventListener('click', handleShare);
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
        label: 'Strength Tier',
        data,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderColor: '#4F46E5',
        borderWidth: 3,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#fff',
        pointBorderWidth: 2.5,
        pointRadius: 6,
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
          ticks: { stepSize: 25, display: false },
          grid: { color: 'rgba(0,0,0,0.06)' },
          angleLines: { color: 'rgba(0,0,0,0.06)' },
          pointLabels: {
            font: { family: "'Outfit', sans-serif", size: 12, weight: '700' },
            color: '#1E293B',
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#0F172A',
          titleFont: { family: "'Outfit', sans-serif", weight: '700' },
          bodyFont: { family: "'Inter', sans-serif" },
          padding: 14,
          cornerRadius: 16,
          callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}% Matched` },
        },
      },
    },
  });
}
