// ===== Utility Helpers =====

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}


export function encodeData(data) {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch {
    return '';
  }
}

export function decodeData(str) {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    return null;
  }
}

export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function getAvatarColor(name) {
  const colors = [
    '#FF6B00', '#7BC67E', '#4A90D9', '#8B5CF6',
    '#E6A817', '#FF4D4D', '#14B8A6', '#EC4899',
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function animateCounter(element, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(lerp(start, target, eased));
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

export function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function isMobileNumber(str) {
  const clean = str.replace(/\s/g, '');
  if (!/^[6-9]\d{9}$/.test(clean)) return false;
  // Block common fake sequences
  if (/^(\d)\1{9}$/.test(clean)) return false; // 9999999999
  if (/^0123456789|1234567890|9876543210$/.test(clean)) return false; 
  return true;
}

export function isValidEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
