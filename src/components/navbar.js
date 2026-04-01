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
    { id: 'nav-courses', icon: '📚', label: 'Courses', route: '/courses' },
    { id: 'nav-leaderboard', icon: '🏆', label: 'Ranking', route: '/leaderboard' },
    { id: 'nav-events', icon: '⚡', label: 'Events', route: '/events' },
    { id: 'nav-profile', icon: '👤', label: 'Profile', route: '/profile' },
  ];
  
  container.innerHTML = `
    <nav class="bottom-nav" role="navigation" aria-label="Main navigation">
      <div class="bottom-nav__inner">
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
      </div>
    </nav>
  `;
  
  const navElement = container.querySelector('.bottom-nav');
  if (!navElement) return;

  let hideTimeout;
  const HIDE_DELAY = 3000; // 3 seconds

  function showNav() {
    navElement.classList.remove('bottom-nav--hidden');
    resetTimeout();
  }

  function hideNav() {
    // Don't hide if it's currently being hovered (for desktops/laptops)
    if (!window.matchMedia('(pointer: coarse)').matches) {
       // On desktop, maybe we don't want to hide it as aggressively if mouse is over it
       // But user specifically asked for mobile view touch/scroll
    }
    navElement.classList.add('bottom-nav--hidden');
  }

  function resetTimeout() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideNav, HIDE_DELAY);
  }

  // Listeners for interaction
  const interactions = ['touchstart', 'touchmove', 'scroll', 'mousemove', 'click'];
  interactions.forEach(event => {
    window.addEventListener(event, showNav, { passive: true });
  });

  // Initial timer
  resetTimeout();

  // Event listeners for items
  container.querySelectorAll('.bottom-nav__item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent immediate hide/show logic conflicts
      const item = items.find(i => i.id === btn.id);
      if (item) {
        navigate(item.route);
        if (window.location.hash === '#' + item.route) {
          window.dispatchEvent(new Event('hashchange'));
        }
      }
    });
  });

  // Cleanup old listeners if renderNavbar is called again
  const prevCleanup = container._cleanup;
  if (prevCleanup) prevCleanup();

  container._cleanup = () => {
    interactions.forEach(event => {
      window.removeEventListener(event, showNav);
    });
    clearTimeout(hideTimeout);
  };
}

