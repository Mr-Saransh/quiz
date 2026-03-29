// ===== Bottom Navigation Component =====
import { navigate, getCurrentRoute } from '../router.js';

export function renderNavbar() {
  const container = document.getElementById('navbar-root');
  if (!container) return;

  const currentRoute = getCurrentRoute();
  
  // Hide navbar on certain pages
  const HIDDEN_ROUTES = ['/', '/auth', '/quiz'];
  if (HIDDEN_ROUTES.includes(currentRoute) || currentRoute.startsWith('/quiz')) {
    container.innerHTML = '';
    return;
  }

  const items = [
    { id: 'nav-home', icon: '🏠', label: 'Home', route: '/dashboard' },
    { id: 'nav-leaderboard', icon: '🏆', label: 'Ranking', route: '/leaderboard' },
    { id: 'nav-notifications', icon: '🔔', label: 'Alerts', route: '/alerts', badge: true },
    { id: 'nav-profile', icon: '👤', label: 'Profile', route: '/profile' },
  ];
  
  container.innerHTML = `
    <nav class="bottom-nav" role="navigation" aria-label="Main navigation">
      ${items.map(item => {
        // Active logic: exact match or home link for dashboard
        const isActive = (item.route === '/dashboard' && currentRoute === '/dashboard') || 
                        (item.route !== '/dashboard' && currentRoute.startsWith(item.route));
        
        return `
          <button class="bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}" 
                  id="${item.id}"
                  aria-label="${item.label}">
            <span class="bottom-nav__icon">${item.icon}</span>
            <span class="bottom-nav__label">${item.label}</span>
            ${item.badge ? '<span class="bottom-nav__badge"></span>' : ''}
          </button>
        `;
      }).join('')}
    </nav>
  `;
  
  // Event listeners
  container.querySelectorAll('.bottom-nav__item').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = items.find(i => i.id === btn.id);
      if (item) {
        navigate(item.route);
        // Dispatch hashchange manually if same route to force update (though hash might not change)
        if (window.location.hash === '#' + item.route) {
          window.dispatchEvent(new Event('hashchange'));
        }
      }
    });
  });
}

