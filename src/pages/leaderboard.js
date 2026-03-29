// ===== Leaderboard Page =====
import { navigate } from '../router.js';
import { getLeaderboard, getUser, isLoggedIn } from '../utils/storage.js';
import { getInitials, getAvatarColor } from '../utils/helpers.js';

export async function renderLeaderboard(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  const user = getUser();
  
  // Try API, fall back to localStorage
  let board;
  try {
    const res = await fetch('/api/leaderboard?period=monthly');
    const data = await res.json();
    board = data.leaderboard && data.leaderboard.length > 0 ? data.leaderboard : getLeaderboard();
  } catch (e) {
    board = getLeaderboard();
  }
  
  const top3 = board.slice(0, 3);
  const rest = board.slice(3, 20);

  // Reorder top3 for podium display: [2nd, 1st, 3rd]
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const podiumClasses = ['lb-podium__item--2nd', 'lb-podium__item--1st', 'lb-podium__item--3rd'];
  const medals = ['🥈', '👑', '🥉'];

  container.innerHTML = `
    <div class="leaderboard-page page-container paper-bg">
      <!-- Header -->
      <div class="lb-header">
        <h1 class="lb-header__title">🏆 Leaderboard</h1>
      </div>

      <!-- Filter tabs -->
      <div class="lb-filters">
        <div class="pill-tabs">
          <button class="pill-tab" id="filter-today">Today</button>
          <button class="pill-tab" id="filter-weekly">Weekly</button>
          <button class="pill-tab pill-tab--active" id="filter-monthly">Monthly</button>
        </div>
      </div>

      <!-- Podium -->
      <div class="lb-podium">
        ${podiumOrder.map((entry, i) => {
          if (!entry) return '';
          const initials = getInitials(entry.name);
          const color = getAvatarColor(entry.name);
          const isYou = entry.userId === user.id;
          return `
            <div class="${podiumClasses[i]}  lb-podium__item">
              <div class="lb-podium__crown">${medals[i]}</div>
              <div class="lb-podium__avatar-wrap">
                <div class="lb-podium__avatar" style="background:${color}">${initials}</div>
                <div class="lb-podium__score-badge">
                  <span class="coin">$</span> ${entry.score}
                </div>
              </div>
              <div class="lb-podium__name">${isYou ? 'You' : entry.name.split(' ')[0]}</div>
              <div class="lb-podium__block">${i === 1 ? '1' : i === 0 ? '2' : '3'}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Rest of list -->
      <div class="lb-list" id="lb-list">
        ${rest.map((entry, i) => {
          const rank = i + 4;
          const initials = getInitials(entry.name);
          const color = getAvatarColor(entry.name);
          const isYou = entry.userId === user.id;
          return `
            <div class="lb-list-item ${isYou ? 'lb-list-item--you' : ''}">
              <span class="lb-list-item__rank">${rank}</span>
              <div class="lb-list-item__avatar" style="background:${color};color:white">${initials}</div>
              <div class="lb-list-item__info">
                <div class="lb-list-item__name">${isYou ? entry.name + ' (You)' : entry.name}</div>
              </div>
              <div class="lb-list-item__score-badge">
                <span class="coin">$</span> ${entry.score}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;



  // Filter tabs (cosmetic — data is the same)
  document.querySelectorAll('.pill-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pill-tab').forEach(t => t.classList.remove('pill-tab--active'));
      tab.classList.add('pill-tab--active');
    });
  });
}
