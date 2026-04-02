import { navigate } from '../router.js';
import { getUser, setUser, isLoggedIn, clearUser, getLatestResult } from '../utils/storage.js';
import { apiSetProfile } from '../utils/api.js';
import { showToast } from '../components/toast.js';
import { formatDate } from '../utils/helpers.js';
import { CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from '../engine/scoring.js';
import { CATEGORIES } from '../data/questions.js';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

let profileChartInstance = null;

export async function renderProfile(container, params) {
  const viewerId = params?.id;
  const currentUserId = getUser()?.id || getUser()?.userId;
  const isOwner = !viewerId || viewerId === currentUserId;

  let user = null;
  let latestResult = null;

  if (isOwner) {
    if (!isLoggedIn()) { navigate('/auth'); return; }
    user = getUser();
    latestResult = getLatestResult();
    
    // Sync owner data in background
    fetch(`/api/auth/user/${user.id}`).then(async r => {
      if (r.ok) {
        const data = await r.json();
        setUser(data.user);
      }
    }).catch(() => {});
  } else {
    // Viewer Mode: Fetch public data
    try {
      const [userRes, resultsRes] = await Promise.all([
        fetch(`/api/auth/user/${viewerId}`),
        fetch(`/api/quiz/results/user/${viewerId}`)
      ]);
      
      if (!userRes.ok) throw new Error('User not found');
      
      const userData = await userRes.json();
      user = userData.user;
      
      const resultsData = await resultsRes.json();
      latestResult = resultsData.results?.[0] || null;
    } catch (err) {
      container.innerHTML = `
        <div class="page-container flex-center flex-col text-center" style="min-height:100dvh;gap:16px;padding:24px;">
          <div style="font-size:64px;">👤</div>
          <h2 style="font-family: var(--font-heading); font-weight: 800;">Persona Not Found</h2>
          <p style="color: var(--gray-500);">This digital identification code is invalid or has been archived.</p>
          <button class="btn btn--primary" onclick="window.location.hash='#/'">Return to Hub</button>
        </div>
      `;
      return;
    }
  }

  const theme = user.themeColor || '#4F46E5';
  const personality = user.personalityType || 'The Explorer';
  const emoji = user.personalityEmoji || '🧭';
  
  container.innerHTML = `
    <div class="profile-page animate-fadeIn">
      
      <!-- Premium Hero Section -->
      <div class="profile-hero">
        <div class="deco-blob deco-blob--primary" style="top: -100px; right: -50px; width: 350px; height: 350px; opacity: 0.2;"></div>
        <div class="deco-blob deco-blob--secondary" style="bottom: -50px; left: -50px; width: 250px; height: 250px; opacity: 0.1;"></div>
        
        <div class="profile-hero__content">
          <div class="profile-hero__header">
            <button id="profile-back" class="glass-card flex-center" style="width: 44px; height: 44px; border-radius: 14px; color: white; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <span style="font-family: var(--font-heading); font-weight: 700; text-transform: uppercase; letter-spacing: 3px; font-size: 11px; opacity: 0.6;">Digital Persona Hub</span>
            <button id="profile-share" class="glass-card flex-center" style="width: 44px; height: 44px; border-radius: 14px; color: white; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>

          <div class="flex flex-col items-center text-center animate-fadeInUp">
            <div class="avatar-wrapper">
              <div style="position: absolute; inset: -20px; background: radial-gradient(circle, ${theme}44 0%, transparent 70%); filter: blur(25px); animation: pulse 3s infinite;"></div>
              
              <div id="avatar-trigger" class="avatar-main" style="${!isOwner ? 'cursor: default; transform: none;' : ''}">
                  <img id="profile-preview-img" src="${user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.contact || user.id}`}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.05);"/>
                  <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3)); pointer-events: none;"></div>
              </div>
              
              ${isOwner ? `
                <div class="avatar-edit-badge" id="avatar-edit-icon">
                   🎨
                </div>
              ` : ''}
              
              <div class="avatar-emoji-badge" style="border: 2px solid ${theme};">
                 ${emoji}
              </div>
            </div>
            
            <h1 class="profile-name">${user.name || 'Anonymous Explorer'}</h1>
            <div class="flex items-center gap-2 justify-center flex-wrap">
              <span style="color: white; font-weight: 800; font-size: 13px; background: ${theme}; padding: 8px 20px; border-radius: 100px; box-shadow: 0 8px 20px ${theme}33;">${personality}</span>
              <span style="color: rgba(255,255,255,0.7); font-weight: 700; font-size: 11px; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 100px; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);">LEVEL ${latestResult ? '2' : '1'} CITIZEN</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Hub -->
      <div class="meta-container">
        
        ${latestResult ? `
          <!-- FULL REPORT INTEGRATION -->
          
          <!-- Metadata Bar -->
          <div class="animate-fadeInUp metadata-bar">
             <div class="glass-card" style="padding: 10px 18px; border-radius: 100px; font-size: 11px; font-weight: 800; color: var(--gray-500); background: rgba(255,255,255,0.8); border: 1px solid var(--gray-100);">
                ID: ${latestResult.id.toUpperCase()}
             </div>
             <div class="glass-card" style="padding: 10px 18px; border-radius: 100px; font-size: 11px; font-weight: 800; color: var(--gray-500); background: rgba(255,255,255,0.8); border: 1px solid var(--gray-100);">
                VALIDATED: ${formatDate(latestResult.date)}
             </div>
          </div>

          <!-- Neural Signature -->
          <div class="glass-card animate-fadeInUp delay-1" style="padding: 40px; margin-bottom: 24px; border-radius: 40px; border: 1.5px solid rgba(255,255,255,0.8); box-shadow: var(--shadow-2xl); background: rgba(255,255,255,0.95); position: relative; overflow: hidden;" class="px-mobile-4">
             <div style="position: absolute; top: -20px; left: -20px; width: 120px; height: 120px; background: var(--primary); opacity: 0.05; border-radius: 50%; filter: blur(40px);"></div>
             <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px; position: relative; z-index: 2;">
                <div style="width: 44px; height: 44px; background: #EEF2FF; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px;">🧠</div>
                <h3 style="font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--gray-500);">Neural Signature</h3>
             </div>
             <p style="font-size: 18px; color: var(--gray-900); line-height: 1.7; font-weight: 600; position: relative; z-index: 2;" class="text-mobile-lg">
                ${latestResult.cognitiveSignature}
             </p>
          </div>

          <!-- Market Value & Synergy Grid -->
          <div class="card-grid-custom">
             <div class="card animate-fadeInUp delay-2" style="padding: 32px; border-radius: 36px; background: white; border: 1px solid var(--gray-100); display: flex; flex-direction: column; justify-content: center;" class="px-mobile-4">
                <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                   <span style="width: 8px; height: 8px; background: #059669; border-radius: 50%; display: inline-block;"></span> Strategic Placement
                </div>
                <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 20px; color: var(--gray-900); margin-bottom: 12px;">Market Valuation</h4>
                <p style="font-size: 14px; color: var(--gray-600); line-height: 1.6; font-weight: 500;">${latestResult.marketValue}</p>
             </div>
             <div class="card animate-fadeInUp delay-2" style="padding: 32px; border-radius: 36px; background: var(--primary-gradient); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <div style="font-size: 40px; font-weight: 900; line-height: 1; margin-bottom: 4px;">${latestResult.neuralSynergy}%</div>
                <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.8;">Neural Synergy</div>
                <div style="margin-top: 16px; font-size: 10px; font-weight: 600; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 100px;">SUPREME TIER</div>
             </div>
          </div>

          <!-- Trait Analysis -->
          <div class="card animate-fadeInUp delay-3" style="padding: 36px; border-radius: 40px; margin-bottom: 24px; box-shadow: var(--shadow-xl); background: white;">
             <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 32px;">
                <div style="width: 48px; height: 48px; background: #EEF2FF; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🧬</div>
                <h3 style="font-weight: 800; font-size: 20px; color: var(--gray-900); font-family: var(--font-heading);">Psychological Architecture</h3>
             </div>
             <div style="display: grid; gap: 20px;">
                ${latestResult.topStrengths.map(s => `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <span style="font-size: 13px; font-weight: 800; color: var(--gray-700);">${s.name.toUpperCase()}</span>
                      <span style="font-size: 13px; font-weight: 900; color: var(--primary);">${s.value}%</span>
                    </div>
                    <div style="height: 10px; background: var(--gray-100); border-radius: 100px; overflow: hidden; border: 1px solid var(--gray-50);">
                      <div style="width: ${s.value}%; height: 100%; background: var(--primary-gradient); border-radius: 100px; transition: width 1s ease-out;"></div>
                    </div>
                  </div>
                `).join('')}
             </div>
          </div>

          <!-- Potential Spectrum Chart -->
          <div class="card animate-fadeInUp delay-3" style="padding: 36px; border-radius: 40px; margin-bottom: 24px; box-shadow: var(--shadow-xl); background: white;" class="px-mobile-4">
             <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;" class="flex-wrap gap-2">
                <div style="display: flex; align-items: center; gap: 14px;">
                   <div style="width: 48px; height: 48px; background: #F5F3FF; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🧩</div>
                   <h3 style="font-weight: 800; font-size: 18px; color: var(--gray-900); font-family: var(--font-heading);">Potential Spectrum</h3>
                </div>
                <div style="font-size: 10px; font-weight: 800; color: var(--primary); background: var(--primary-lightest); padding: 6px 14px; border-radius: 100px; border: 1px solid var(--primary-light);">ELITE INSIGHT</div>
             </div>
             <div style="height: 300px; position: relative;">
                <canvas id="profile-radar-chart"></canvas>
             </div>
          </div>

          <!-- Hidden Talent -->
          <div class="card animate-fadeInUp delay-4" style="padding: 36px; border-radius: 40px; margin-bottom: 24px; background: linear-gradient(135deg, #4F46E5 0%, #312E81 100%); color: white; position: relative; overflow: hidden;">
             <div style="position: absolute; right: -30px; bottom: -30px; font-size: 160px; opacity: 0.1; transform: rotate(-15deg);">✨</div>
             <div style="position: relative; z-index: 2;">
                <div style="background: rgba(255,255,255,0.15); display: inline-flex; padding: 6px 16px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.2);">Rare Discovery</div>
                <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 24px; margin-bottom: 12px;">${latestResult.hiddenTalent}</h3>
                <p style="font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6; font-weight: 400; max-width: 480px;">${latestResult.hiddenTalentDesc}</p>
             </div>
          </div>

          <!-- Strategy & Growth Hub -->
          <div class="evolution-grid">
             <div class="card animate-fadeInUp delay-4" style="padding: 32px; border-radius: 36px; background: white;" class="px-mobile-4">
                <div style="width: 52px; height: 52px; background: #F0FDF4; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 20px;">🛣️</div>
                <h4 style="font-weight: 800; font-size: 14px; color: var(--gray-900); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Growth Plan</h4>
                <div style="display: grid; gap: 8px;">
                   ${latestResult.skillPlan.map(s => `
                     <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray-600); font-weight: 600;">
                        <span style="color: var(--lime); font-size: 16px;">✓</span> ${s}
                     </div>
                   `).join('')}
                </div>
             </div>
             <div class="card animate-fadeInUp delay-4" style="padding: 32px; border-radius: 36px; background: white;" class="px-mobile-4">
                <div style="width: 52px; height: 52px; background: #FFF7ED; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 20px;">🛡️</div>
                <h4 style="font-weight: 800; font-size: 14px; color: var(--gray-900); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Evolution Focus</h4>
                <div style="display: grid; gap: 8px;">
                   ${latestResult.areasToImprove.map(a => `
                     <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray-600); font-weight: 600;">
                        <span style="color: var(--gold); font-size: 16px;">↗</span> ${a}
                     </div>
                   `).join('')}
                </div>
             </div>
          </div>

          <!-- Career Discovery Hub (Substantially Expanded) -->
          <div class="card animate-fadeInUp delay-5" style="padding: 40px; border-radius: 44px; margin-bottom: 24px; border: 1.5px solid var(--gray-100); box-shadow: var(--shadow-2xl); background: white;">
             <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;">
                <div>
                   <h3 style="font-weight: 800; font-size: 22px; color: var(--gray-900); font-family: var(--font-heading);">Matched Career Pathways</h3>
                   <p style="font-size: 13px; color: var(--gray-400); font-weight: 600; margin-top: 4px;">Based on your current cognitive architecture</p>
                </div>
                <span style="font-size: 11px; font-weight: 900; color: #059669; background: #D1FAE5; padding: 6px 16px; border-radius: 100px;">VALIDATED MATCH</span>
             </div>
             <div class="career-grid">
                ${latestResult.careers.map((c, i) => `
                   <div style="display: flex; align-items: center; gap: 20px; padding: 24px; background: var(--gray-50); border-radius: 28px; border: 1.5px solid var(--white); box-shadow: var(--shadow-sm); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-6px)'; this.style.borderColor='var(--primary-lightest)';" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='var(--white)';">
                    <div style="width: 56px; height: 56px; background: white; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: var(--shadow-sm); border: 1px solid var(--gray-100); flex-shrink: 0;">${c.icon}</div>
                    <div style="flex: 1;">
                      <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 14px; color: var(--gray-900);">${c.title}</h4>
                      <div style="font-size: 10px; font-weight: 700; color: var(--gray-400); margin-top: 4px;">RELEVANCE: <span style="color: var(--primary); font-weight: 800;">${c.match}%</span></div>
                    </div>
                  </div>
                `).join('')}
             </div>
          </div>
        ` : `
          <!-- No Results State -->
          <div class="glass-card animate-fadeInUp delay-1" style="padding: 40px; margin-bottom: 24px; border-radius: 32px; text-align: center; border: 2px dashed rgba(79, 70, 229, 0.2);">
             <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
             <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 20px; color: var(--gray-900); margin-bottom: 12px;">Identity Incomplete</h3>
             <p style="color: var(--gray-500); font-size: 14px; margin-bottom: 28px;">Complete your first talent assessment to unlock your full Digital Persona report here.</p>
             <button class="btn btn--primary" id="profile-take-test" style="width: 240px; padding: 18px; border-radius: 16px;">Initiate Discovery →</button>
          </div>
        `}

        <!-- Settings / Public CTA Section -->
        <div class="card animate-fadeInUp delay-5" style="border-radius: 40px; padding: 40px; border: 1px solid var(--gray-100); box-shadow: var(--shadow-xl); background: white;">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 36px;">
            <div style="width: 6px; height: 28px; background: var(--primary); border-radius: 10px;"></div>
            <h3 style="font-weight: 800; font-size: 20px; color: var(--gray-900); font-family: var(--font-heading);">${isOwner ? 'System Settings' : 'Network Identity'}</h3>
          </div>

          <div style="display: grid; gap: 24px;">
            <div class="auth-input-group">
              <label style="font-weight: 800; font-size: 11px; margin-bottom: 12px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1.5px;">Legal Identity Name</label>
              <input type="text" id="profile-name" class="input-field" placeholder="Full Name" value="${user.name || ''}" ${!isOwner ? 'readonly' : ''} style="border: 2px solid var(--gray-100); border-radius: 20px; padding: 20px; font-weight: 700; font-size: 15px; ${!isOwner ? 'background: #f8fafc;' : ''}" />
            </div>

            <div class="grid grid-2 grid-mobile-1" style="gap: 20px;">
              <div class="auth-input-group">
                <label style="font-weight: 800; font-size: 11px; margin-bottom: 12px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1.5px;">Age / Class Tier</label>
                <input type="text" id="profile-age" class="input-field" placeholder="18 / Expert" value="${user.ageClass || ''}" ${!isOwner ? 'readonly' : ''} style="border: 2px solid var(--gray-100); border-radius: 20px; padding: 20px; font-weight: 700; font-size: 15px; ${!isOwner ? 'background: #f8fafc;' : ''}" />
              </div>
              <div class="auth-input-group">
                <label style="font-weight: 800; font-size: 11px; margin-bottom: 12px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1.5px;">Location Origin</label>
                <input type="text" id="profile-city" class="input-field" placeholder="City" value="${user.city || ''}" ${!isOwner ? 'readonly' : ''} style="border: 2px solid var(--gray-100); border-radius: 20px; padding: 20px; font-weight: 700; font-size: 15px; ${!isOwner ? 'background: #f8fafc;' : ''}" />
              </div>
            </div>

            ${isOwner ? `
              <div class="auth-input-group" style="margin-bottom: 10px;">
                <label style="font-weight: 800; font-size: 11px; margin-bottom: 12px; display:block; color:var(--gray-400); text-transform:uppercase; letter-spacing: 1.5px;">External Profile Media (URL)</label>
                <input type="url" id="profile-image-url" class="input-field" placeholder="https://cloud.com/image.png" value="${user.profileImage || ''}" style="border: 2px solid var(--gray-100); border-radius: 20px; padding: 20px; font-weight: 500; font-family: monospace; font-size: 13px;" />
              </div>
            ` : ''}
          </div>

          <div style="margin-top: 48px; display: flex; flex-direction: column; gap: 16px;">
            ${isOwner ? `
              <button id="profile-save-btn" class="btn btn--primary" style="padding: 24px; border-radius: 24px; font-weight: 900; font-size: 17px; width: 100%;">Sync Digital Record</button>
              <button id="profile-logout-btn" style="padding: 12px; background: transparent; border: none; color: var(--red); font-weight: 800; font-size: 14px; cursor: pointer; transition: all 0.3s; opacity: 0.6;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">Terminate Current Session</button>
            ` : `
              <button id="profile-cta-btn" class="btn btn--primary" style="padding: 24px; border-radius: 24px; font-weight: 900; font-size: 17px; width: 100%;">Discover Your Persona →</button>
              <p style="text-align: center; font-size: 12px; color: var(--gray-400); font-weight: 600;">Join thousands uncovering their digital potential</p>
            `}
          </div>
        </div>
      </div>

      <!-- Avatar Selection Modal -->
      <div id="avatar-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content glass-card animate-scaleIn modal-content-custom">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;" class="gap-2">
            <div>
               <h2 style="font-family: var(--font-heading); font-weight: 900; font-size: 24px; margin: 0; letter-spacing: -1px; color: var(--gray-900);" class="text-mobile-xl">Persona Gallery</h2>
               <p style="color: var(--gray-400); font-size: 12px; font-weight: 600; margin-top: 4px;">Choose your unique representation</p>
            </div>
            <button id="close-avatar-modal-btn" style="background: var(--gray-100); border: none; width: 44px; height: 44px; border-radius: 16px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; transition: all 0.2s; flex-shrink: 0;">✕</button>
          </div>
          
          <div class="avatar-grid" style="overflow-y: auto; padding-right: 4px; flex: 1;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
              ${[1,2,3,4].map(i => `
                <div class="avatar-option ${user.profileImage === `/avatars/male_${i}.png` ? 'avatar-option--selected' : ''}" data-url="/avatars/male_${i}.png" style="border-radius: 32px; border: 3px solid var(--gray-100); background: #F8FAFC; transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; aspect-ratio: 0.9;">
                  <img src="/avatars/male_${i}.png" alt="Male Persona ${i}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
                  <div style="position: absolute; bottom: 0; inset-inline: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.4)); color: white; font-weight: 700; font-size: 11px; text-align: center;">MALE SPECIMEN 0${i}</div>
                </div>
              `).join('')}
              ${[1,2,3,4].map(i => `
                <div class="avatar-option ${user.profileImage === `/avatars/female_${i}.png` ? 'avatar-option--selected' : ''}" data-url="/avatars/female_${i}.png" style="border-radius: 32px; border: 3px solid var(--gray-100); background: #F8FAFC; transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; aspect-ratio: 0.9;">
                  <img src="/avatars/female_${i}.png" alt="Female Persona ${i}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;">
                  <div style="position: absolute; bottom: 0; inset-inline: 0; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.4)); color: white; font-weight: 700; font-size: 11px; text-align: center;">FEMALE SPECIMEN 0${i}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <button id="close-avatar-modal" class="btn btn--secondary" style="width: 100%; padding: 20px; border-radius: 20px; font-weight: 800; margin-top: 24px;">Confirm Selection</button>
        </div>
      </div>
    </div>
  `;

  // --- Modal Logic ---
  const modal = document.getElementById('avatar-modal');
  const trigger = document.getElementById('avatar-trigger');
  const editIcon = document.getElementById('avatar-edit-icon');
  const previewImg = document.getElementById('profile-preview-img');
  const urlInput = document.getElementById('profile-image-url');

  const openModal = () => { modal.style.display = 'flex'; };
  const closeModal = () => { modal.style.display = 'none'; };

  trigger?.addEventListener('click', openModal);
  editIcon?.addEventListener('click', (e) => { e.stopPropagation(); openModal(); });
  document.getElementById('close-avatar-modal')?.addEventListener('click', closeModal);
  document.getElementById('close-avatar-modal-btn')?.addEventListener('click', closeModal);

  document.querySelectorAll('.avatar-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const url = opt.getAttribute('data-url');
      if (previewImg) previewImg.src = url;
      if (urlInput) urlInput.value = url;
      document.querySelectorAll('.avatar-option').forEach(o => {
          o.style.borderColor = 'var(--gray-100)';
          o.style.boxShadow = 'none';
      });
      opt.style.borderColor = 'var(--primary)';
      opt.style.boxShadow = '0 0 0 4px var(--primary-lightest)';
      setTimeout(closeModal, 300);
      showToast('Persona identification updated ✨', 'success');
    });
  });

  document.getElementById('profile-back')?.addEventListener('click', () => { navigate('/dashboard'); });
  document.getElementById('profile-take-test')?.addEventListener('click', () => { navigate('/quiz'); });

  // Share functionality
  document.getElementById('profile-share')?.addEventListener('click', async () => {
    const shareTitle = isOwner ? `My Dynamic Persona Profile` : `${user.name}'s Dynamic Persona`;
    const shareText = isOwner 
      ? `I just discovered my personality type as ${user.personalityType} ${user.personalityEmoji}! Check out my full report.` 
      : `Check out ${user.name}'s digital persona profile and discovery report!`;
    
    // Share the public profile URL
    const shareUrl = `${window.location.origin}${window.location.pathname}#/profile/${user.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        showToast('Profile link ready to share! ✨', 'success');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Profile link copied to clipboard! 📋', 'success');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        showToast('Sharing failed', 'error');
      }
    }
  });

  document.getElementById('profile-cta-btn')?.addEventListener('click', () => {
    navigate('/quiz');
  });

  // Init Radar Chart if result exists
  if (latestResult) {
      setTimeout(() => initRadarChart(latestResult), 600);
  }

  document.getElementById('profile-save-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('profile-name')?.value.trim();
    const ageClass = document.getElementById('profile-age')?.value.trim();
    const city = document.getElementById('profile-city')?.value.trim();
    const profileImage = urlInput?.value.trim();
    
    if (!name || name.length < 2) { showToast('Profile identification required', 'error'); return; }

    const btn = document.getElementById('profile-save-btn');
    btn.disabled = true;
    btn.textContent = 'Syncing...';

    try {
      const data = await apiSetProfile(user.id, name, ageClass, city, user.address || '', profileImage);
      setUser(data.user);
      showToast('Digital sync complete! ✨', 'success');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Retry Synchronization';
    }
  });

  document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to terminate this session?')) {
      clearUser();
      navigate('/');
    }
  });
}

function initRadarChart(result) {
  const canvas = document.getElementById('profile-radar-chart');
  if (!canvas) return;

  if (profileChartInstance) {
    profileChartInstance.destroy();
  }

  const labels = Object.keys(result.categoryScores).map(k => result.categoryLabels[k]);
  const data = Object.values(result.categoryScores);

  profileChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Matched Potential',
        data,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
        borderColor: '#4F46E5',
        borderWidth: 4,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
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
          titleFont: { family: "'Outfit', sans-serif", weight: '800' },
          bodyFont: { family: "'Inter', sans-serif" },
          padding: 16,
          cornerRadius: 20,
          callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}% Potential` },
        },
      },
    },
  });
}
