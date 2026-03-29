// ===== SPA Hash Router =====

const routes = {};
let currentCleanup = null;

export function registerRoute(path, handler) {
  routes[path] = handler;
}

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

function matchRoute(hash) {
  // Try exact match first
  if (routes[hash]) {
    return { handler: routes[hash], params: {} };
  }
  
  // Try parameterized routes
  for (const [pattern, handler] of Object.entries(routes)) {
    const patternParts = pattern.split('/');
    const hashParts = hash.split('/');
    
    if (patternParts.length !== hashParts.length) continue;
    
    const params = {};
    let match = true;
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = hashParts[i];
      } else if (patternParts[i] !== hashParts[i]) {
        match = false;
        break;
      }
    }
    
    if (match) return { handler, params };
  }
  
  return null;
}

async function handleRouteChange() {
  const hash = getCurrentRoute();
  const app = document.getElementById('app');
  
  // Run cleanup of previous page
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }
  
  const matched = matchRoute(hash);
  
  if (matched) {
    app.innerHTML = '';
    app.className = 'page-enter';
    
    // Small delay for animation
    requestAnimationFrame(() => {
      const cleanup = matched.handler(app, matched.params);
      if (typeof cleanup === 'function') {
        currentCleanup = cleanup;
      }
    });
  } else {
    // Default to landing
    navigate('/');
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  
  // Initial route
  handleRouteChange();
}
