import { navigate } from '../router.js';
import { isLoggedIn, getUser } from '../utils/storage.js';

export async function renderCompetitions(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  const user = getUser();
  let competitions = [];
  try {
    const res = await fetch('/api/competitions');
    const data = await res.json();
    competitions = data.competitions || [];
  } catch (e) {
    console.error('Failed to fetch competitions', e);
  }

  container.innerHTML = `
    <div class="competitions-page page-container paper-bg" style="min-height: 100dvh; background: var(--off-white);">
      <div class="comp-header" style="padding: 40px 24px 20px;">
        <div style="font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Active Ecosystem</div>
        <h1 style="font-family: var(--font-heading); font-size: 32px; font-weight: 900; color: var(--gray-900); line-height: 1.1;">Elite <br>Challenges</h1>
        <p style="color: var(--gray-500); margin-top: 12px; font-weight: 500; font-size: 15px;">Participate in world-class evaluations and win exclusive digital identity rewards.</p>
      </div>

      <div class="comp-list" style="padding: 24px; display: grid; gap: 24px; padding-bottom: 120px;">
        ${competitions.length === 0 ? `
          <div style="text-align: center; padding: 60px 20px; background: var(--white); border-radius: 32px; border: 2px dashed var(--gray-100); margin-top: 40px;">
            <div style="font-size: 56px; margin-bottom: 20px;">🔍</div>
            <p style="color: var(--gray-500); font-weight: 800; font-size: 18px;">No active challenges found.</p>
            <p style="font-size: 13px; color: var(--gray-400); margin-top: 8px; font-weight: 500;">Our curators are currently preparing new evaluations. Check back soon!</p>
          </div>
        ` : competitions.map(comp => `
          <div class="comp-card animate-fadeInUp" style="background: white; border-radius: 32px; overflow: hidden; box-shadow: var(--shadow-xl); border: 1px solid var(--gray-100); position: relative; transition: all 0.3s; cursor: default;">
            <div style="height: 140px; background: linear-gradient(135deg, #1E1B4B, #4F46E5); position: relative;">
               <div style="position: absolute; bottom: -16px; left: 24px; background: white; padding: 6px 14px; border-radius: 100px; box-shadow: var(--shadow-md); font-size: 10px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 1.5px; border: 1px solid var(--primary-lightest);">
                 LIVE NOW ⚡
               </div>
               <div style="position: absolute; top: 20px; right: 20px; font-size: 32px; opacity: 0.15; filter: grayscale(1);">💎</div>
            </div>
            <div style="padding: 40px 24px 32px;">
              <h3 style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; margin-bottom: 12px; color: var(--gray-900);">${comp.title}</h3>
              <p style="color: var(--gray-600); font-size: 14px; line-height: 1.7; margin-bottom: 32px; font-weight: 500;">${comp.description}</p>
              
              <button class="btn btn--primary btn--block btn-enroll" 
                      data-id="${comp.id}" 
                      data-link="${comp.formLink}" 
                      style="border-radius: 20px; padding: 20px; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.15);">
                Enroll and Reveal Challenge →
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.btn-enroll').forEach(btn => {
    btn.addEventListener('click', async () => {
      const compId = btn.dataset.id;
      const link = btn.dataset.link;
      const originalText = btn.innerHTML;
      
      // Visual feedback
      btn.innerHTML = 'Enrolling...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      try {
        // Log enrollment in our DB first
        const res = await fetch(`/api/competitions/${compId}/enroll`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ userId: user.id })
        });
        
        if (!res.ok) console.warn('Enrollment tracking failed');
      } catch (e) {
        console.error('Enrollment network error', e);
      } finally {
        // Always open the link regardless of tracking success for UX
        if (link) window.open(link, '_blank');
        btn.innerHTML = 'Enrolled! Opening...';
        setTimeout(() => {
           btn.innerHTML = originalText;
           btn.style.opacity = '1';
           btn.disabled = false;
        }, 2000);
      }
    });
  });
}
