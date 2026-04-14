import { navigate } from '../router.js';
import { ASSESSMENT_QUESTIONS } from '../data/assessment-questions.js';
import { isLoggedIn, getUser } from '../utils/storage.js';

export function renderCourseAssessment(container) {
  let step = 'loading'; // loading | phone | quiz | result
  let phoneNumber = '';
  let currentQuestion = 0;
  let answers = [];
  let score = 0;
  let couponCode = '';
  let isLoading = false;
  let errorMsg = '';

  // Initialize
  const user = isLoggedIn() ? getUser() : null;
  if (user && user.contact) {
    phoneNumber = user.contact.replace('+91', '');
    checkAttempt();
  } else {
    step = 'phone';
    render();
  }

  async function checkAttempt() {
    isLoading = true;
    render();
    try {
      const checkRes = await fetch(`/api/assessment/check/+91${phoneNumber}`);
      const checkData = await checkRes.json();

      if (checkData.attempted) {
        couponCode = checkData.couponCode;
        step = 'result';
        score = -1; // Flag to show "existing coupon" instead of new score
      } else {
        step = 'quiz';
      }
    } catch (err) {
      console.error('Phone check error:', err);
      // Fallback to phone step if check fails
      step = 'phone';
    } finally {
      isLoading = false;
      render();
    }
  }

  function render() {
    container.innerHTML = `
      <div class="assessment-page">
        <div class="assessment-bg-shapes">
          <div class="assessment-shape assessment-shape-1"></div>
          <div class="assessment-shape assessment-shape-2"></div>
          <div class="assessment-shape assessment-shape-3"></div>
        </div>

        <div class="assessment-container animate-fadeInUp">
          <button class="assessment-back-btn" id="back-btn">← Back to Courses</button>

          ${step === 'loading' ? '<div class="flex-center" style="min-height:300px;"><div class="loader"></div></div>' : ''}
          ${step === 'phone' ? renderPhoneStep() : ''}
          ${step === 'quiz' ? renderQuizStep() : ''}
          ${step === 'result' ? renderResultStep() : ''}
        </div>
      </div>
    `;

    bindEvents();
  }

  function renderPhoneStep() {
    return `
      <div class="assessment-card glass-card">
        <div class="assessment-header">
          <div class="assessment-icon-big">📱</div>
          <h1 class="assessment-title">Free Assessment</h1>
          <p class="assessment-desc">Enter your phone number to take the assessment and unlock an exclusive coupon code worth <strong>₹3,000</strong></p>
        </div>

        <div class="assessment-steps-bar">
          <div class="step-dot active">1</div>
          <div class="step-line"></div>
          <div class="step-dot">2</div>
          <div class="step-line"></div>
          <div class="step-dot">3</div>
        </div>
        <div class="step-labels">
          <span class="active">Phone</span>
          <span>Assess</span>
          <span>Coupon</span>
        </div>

        <div class="phone-input-wrapper">
          <div class="phone-prefix">+91</div>
          <input type="tel" id="phone-input" class="phone-input" 
            placeholder="Enter 10-digit mobile number" 
            maxlength="10" value="${phoneNumber}"
            inputmode="numeric" pattern="[0-9]*" />
        </div>

        ${errorMsg ? `<div class="assessment-error">${errorMsg}</div>` : ''}

        <button id="verify-btn" class="assessment-btn assessment-btn-primary" ${isLoading ? 'disabled' : ''}>
          ${isLoading ? '<span class="btn-loader"></span> Verifying...' : '⚡ Get Started'}
        </button>
      </div>
    `;
  }

  function renderQuizStep() {
    const q = ASSESSMENT_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion) / ASSESSMENT_QUESTIONS.length) * 100;
    const selected = answers[currentQuestion];

    return `
      <div class="assessment-card glass-card quiz-card">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="quiz-header">
          <span class="quiz-category-badge">${q.icon} ${q.category}</span>
          <span class="quiz-counter">${currentQuestion + 1} / ${ASSESSMENT_QUESTIONS.length}</span>
        </div>

        <h2 class="quiz-question-text">${q.text}</h2>

        <div class="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-option ${selected === i ? 'selected' : ''}" data-index="${i}">
              <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="quiz-option-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div class="quiz-nav">
          ${currentQuestion > 0 ? `
            <button id="quiz-prev" class="assessment-btn assessment-btn-ghost">← Previous</button>
          ` : '<div></div>'}
          <button id="quiz-next" class="assessment-btn assessment-btn-primary" ${selected === undefined ? 'disabled' : ''} ${isLoading ? 'disabled' : ''}>
            ${isLoading ? '<span class="btn-loader"></span>' : (currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'Submit Assessment →' : 'Next →')}
          </button>
        </div>
      </div>
    `;
  }

  function renderResultStep() {
    const percentage = score === -1 ? 100 : Math.round((score / ASSESSMENT_QUESTIONS.length) * 100);
    const emoji = score === -1 ? '✨' : (percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : percentage >= 40 ? '👍' : '📚');
    const title = score === -1 ? 'Welcome Back!' : 'Assessment Complete!';
    const subtitle = score === -1 ? 'You have already completed the assessment.' : (percentage >= 50 ? 'Great job! You have qualified for the reward.' : 'Nice effort! Here is your reward for participating.');

    return `
      <div class="assessment-card glass-card result-card">
        <div class="result-confetti">
          ${Array(12).fill(0).map((_, i) => `<div class="confetti-piece" style="--delay: ${i * 0.1}s; --x: ${Math.random() * 100}%"></div>`).join('')}
        </div>
        
        <div class="result-header">
          <div class="result-emoji animate-bounce">${emoji}</div>
          <h1 class="result-title">${title}</h1>
          <p style="text-align:center; color:var(--gray-500); font-weight:500; margin-top:4px;">${subtitle}</p>
        </div>

        ${score !== -1 ? `
          <div class="result-score-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" stroke-width="8"/>
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" stroke-width="8"
                stroke-dasharray="${percentage * 2.64} 264" stroke-dashoffset="0"
                stroke-linecap="round" transform="rotate(-90 50 50)" class="score-circle"/>
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#4F46E5"/>
                  <stop offset="100%" style="stop-color:#06B6D4"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="score-text">
              <span class="score-number">${score}</span>
              <span class="score-total">/ ${ASSESSMENT_QUESTIONS.length}</span>
            </div>
          </div>
        ` : ''}

        <div class="coupon-section" style="${score === -1 ? 'margin-top: 24px;' : ''}">
          <div class="coupon-badge">🎉 Your Exclusive Coupon</div>
          <div class="coupon-code-display">
            <span class="coupon-code-text" id="coupon-text">${couponCode}</span>
            <button class="coupon-copy-btn" id="copy-coupon" title="Copy code">📋</button>
          </div>
          <p class="coupon-info">This coupon gives you <strong>₹3,000 OFF</strong> on the All-in-One Combo Course!</p>
        </div>

        <div class="result-actions">
          <button id="go-to-courses" class="assessment-btn assessment-btn-primary">
            🛒 Apply Coupon & Buy Course
          </button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    // Back button
    document.getElementById('back-btn')?.addEventListener('click', () => navigate('/courses'));

    // Phone step
    document.getElementById('phone-input')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
      phoneNumber = e.target.value;
    });

    document.getElementById('verify-btn')?.addEventListener('click', () => {
      if (phoneNumber.length !== 10) {
        errorMsg = 'Please enter a valid 10-digit mobile number';
        render();
        return;
      }
      checkAttempt();
    });

    // Quiz step
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        answers[currentQuestion] = parseInt(btn.dataset.index);
        render();
      });
    });

    document.getElementById('quiz-prev')?.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        render();
      }
    });

    document.getElementById('quiz-next')?.addEventListener('click', async () => {
      if (answers[currentQuestion] === undefined) return;

      if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        currentQuestion++;
        render();
      } else {
        score = 0;
        ASSESSMENT_QUESTIONS.forEach((q, i) => {
          if (answers[i] === q.correct) score++;
        });

        isLoading = true;
        render();

        try {
          const res = await fetch('/api/assessment/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: `+91${phoneNumber}`,
              score,
              totalQuestions: ASSESSMENT_QUESTIONS.length
            })
          });

          const data = await res.json();
          couponCode = data.couponCode || 'PROMO3000';
        } catch (err) {
          console.error('Submit error:', err);
          couponCode = 'PROMO3000';
        }

        step = 'result';
        isLoading = false;
        render();
      }
    });

    // Result step
    document.getElementById('copy-coupon')?.addEventListener('click', () => {
      const couponText = document.getElementById('coupon-text')?.textContent;
      if (couponText) {
        navigator.clipboard.writeText(couponText).then(() => {
          const btn = document.getElementById('copy-coupon');
          btn.textContent = '✅';
          setTimeout(() => { btn.textContent = '📋'; }, 2000);
        });
      }
    });

    document.getElementById('go-to-courses')?.addEventListener('click', () => {
      navigate(`/courses?coupon=${couponCode}`);
    });
  }

  render();
}
