// ===== Toast Notification Component =====

let toastContainer = null;
let toastTimeout = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: none;
      width: 100%;
      max-width: 400px;
      padding: 0 16px;
    `;
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, type = 'info', duration = 3000) {
  ensureContainer();
  
  const toast = document.createElement('div');
  
  const colors = {
    info: { bg: '#1F2937', text: '#FFFFFF', icon: 'ℹ️' },
    success: { bg: '#059669', text: '#FFFFFF', icon: '✅' },
    error: { bg: '#DC2626', text: '#FFFFFF', icon: '❌' },
    warning: { bg: '#D97706', text: '#FFFFFF', icon: '⚠️' },
  };
  
  const style = colors[type] || colors.info;
  
  toast.style.cssText = `
    background: ${style.bg};
    color: ${style.text};
    padding: 12px 20px;
    border-radius: 16px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    pointer-events: auto;
    animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    max-width: 100%;
  `;
  
  toast.innerHTML = `<span>${style.icon}</span><span>${message}</span>`;
  
  // Add animation styles if not present
  if (!document.getElementById('toast-animations')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'toast-animations';
    styleEl.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(-20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(-20px) scale(0.95); }
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  toastContainer.appendChild(toast);
  
  const removeTimeout = setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
  
  toast.addEventListener('click', () => {
    clearTimeout(removeTimeout);
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  });
}
