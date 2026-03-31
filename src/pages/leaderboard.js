// ===== Leaderboard Page =====
import { navigate } from '../router.js';
import { getLeaderboard, getUser, isLoggedIn } from '../utils/storage.js';
import { getInitials, getAvatarColor } from '../utils/helpers.js';

export async function renderLeaderboard(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  container.innerHTML = `
    <div class="leaderboard-page page-container paper-bg" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:80dvh; padding:40px;">
      <div class="lb-coming-soon">
        <div style="font-size:80px; margin-bottom:24px; filter: drop-shadow(0 10px 15px rgba(255,107,0,0.3)); animate-pulse">🏆</div>
        <h1 style="font-family:var(--font-heading); font-size:32px; font-weight:800; color:var(--gray-900); margin-bottom:12px;">Ranking System</h1>
        <div style="width:60px; height:6px; background:linear-gradient(to right, var(--primary), var(--secondary)); border-radius:10px; margin:0 auto 24px;"></div>
        <h2 style="font-size:24px; font-weight:700; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom:16px;">Coming Soon!</h2>
        <p style="color:var(--gray-500); line-height:1.6; max-width:280px; margin:0 auto 32px;">We are currently calculating global rankings and preparing special rewards for our top performers. Stay tuned!</p>
        
        <div style="background:var(--cream); padding:20px; border-radius:24px; border:1px dashed var(--primary); display:flex; align-items:center; gap:12px; margin-bottom:32px;">
           <span style="font-size:24px;">✨</span>
           <div style="text-align:left;">
             <p style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:2px;">TIP</p>
             <p style="font-size:11px; color:var(--gray-600);">Take more assessments to increase your potential score!</p>
           </div>
        </div>

        <button class="btn btn--primary" id="btn-back-home" style="padding:16px 40px; border-radius:50px; font-weight:700;">Back to Dashboard</button>
      </div>
    </div>
  `;

  document.getElementById('btn-back-home')?.addEventListener('click', () => {
    navigate('/dashboard');
  });
}
