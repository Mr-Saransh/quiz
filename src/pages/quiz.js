// ===== Quiz Page =====
import { navigate, getCurrentRoute } from '../router.js';
import { getUser, isLoggedIn, saveResult } from '../utils/storage.js';
import { shuffleArray } from '../utils/helpers.js';
import { getRandomSet, CATEGORIES } from '../data/questions.js';
import { calculateResults, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS } from '../engine/scoring.js';
import { showToast } from '../components/toast.js';

let quizState = null;
let timerInterval = null;

export function renderQuiz(container) {
  if (!isLoggedIn()) { navigate('/auth'); return; }

  // Parse category filter from URL
  const hash = getCurrentRoute();
  const catParam = hash.includes('?category=') ? hash.split('?category=')[1] : null;

  // Get random question set
  const { setIndex, questions: allQuestions } = getRandomSet();
  
  // Filter by category if specified, otherwise use all
  let questions = catParam 
    ? allQuestions.filter(q => q.category === catParam)
    : allQuestions;
  
  // Shuffle questions and limit to 50 questions
  questions = shuffleArray(questions).slice(0, 50);

  quizState = {
    setIndex,
    questions,
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    timePerQuestion: new Array(questions.length).fill(0),
    startTime: Date.now(),
    category: catParam,
  };

  renderQuestion(container);
}

function renderQuestion(container) {
  const { questions, currentIndex, answers } = quizState;
  const q = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex) / total) * 100;
  const catInfo = CATEGORIES.find(c => c.key === q.category) || {};
  const letters = ['A', 'B', 'C', 'D'];

  container.innerHTML = `
    <div class="quiz-page page-container">
      <!-- Top bar -->
      <div class="quiz-topbar">
        <button class="quiz-topbar__back" id="quiz-back" aria-label="Go back">←</button>
        <div class="quiz-topbar__progress">
          <span class="quiz-topbar__counter">Question ${currentIndex + 1} of ${total}</span>
          <div class="progress-bar">
            <div class="progress-bar__fill" style="width:${progress}%"></div>
          </div>
        </div>
        <div class="quiz-timer" id="quiz-timer">
          <svg class="quiz-timer__svg" viewBox="0 0 36 36">
            <circle class="quiz-timer__circle-bg" cx="18" cy="18" r="15.9"></circle>
            <circle class="quiz-timer__circle" id="timer-circle" cx="18" cy="18" r="15.9"
                    stroke-dasharray="100" stroke-dashoffset="0"></circle>
          </svg>
          <span class="quiz-timer__value" id="timer-value">30</span>
        </div>
      </div>

      <!-- Category badge -->
      <div class="quiz-category">
        <span class="badge badge--${catInfo.color || 'primary'}">${catInfo.emoji || '📝'} ${catInfo.label || q.category}</span>
      </div>

      <!-- Question -->
      <div class="quiz-question">
        <p class="quiz-question__text">${q.text}</p>

        <div class="quiz-options" id="quiz-options">
          ${q.options.map((opt, i) => `
            <div class="quiz-option ${answers[currentIndex] === i ? 'quiz-option--selected' : ''}" 
                 data-index="${i}" id="option-${i}">
              <span class="quiz-option__letter">${letters[i]}</span>
              <span class="quiz-option__text">${opt}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Next button -->
      <div class="quiz-next">
        <button class="btn btn--primary btn--block btn--lg" id="quiz-next-btn" ${answers[currentIndex] === null ? 'disabled style="opacity:0.5;pointer-events:none;"' : ''}>
          ${currentIndex === total - 1 ? 'Submit Test' : 'Next Question →'}
        </button>
      </div>
    </div>
  `;

  // Start timer
  startTimer();

  // Option click
  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const idx = parseInt(opt.dataset.index);
      quizState.answers[currentIndex] = idx;

      // Visual feedback
      document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('quiz-option--selected'));
      opt.classList.add('quiz-option--selected');

      // Enable next button
      const nextBtn = document.getElementById('quiz-next-btn');
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
      }
    });
  });

  // Next button
  document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
    if (quizState.answers[currentIndex] === null) {
      showToast('Please select an answer', 'warning');
      return;
    }
    
    clearInterval(timerInterval);

    if (currentIndex < total - 1) {
      quizState.currentIndex++;
      renderQuestion(container);
    } else {
      finishQuiz(container);
    }
  });

  // Back button
  document.getElementById('quiz-back')?.addEventListener('click', () => {
    if (currentIndex > 0) {
      clearInterval(timerInterval);
      quizState.currentIndex--;
      renderQuestion(container);
    } else {
      if (confirm('Are you sure you want to quit the quiz?')) {
        clearInterval(timerInterval);
        navigate('/dashboard');
      }
    }
  });
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = 30;
  const timerValue = document.getElementById('timer-value');
  const timerCircle = document.getElementById('timer-circle');

  function updateTimer() {
    if (timerValue) timerValue.textContent = timeLeft;
    
    const offset = ((30 - timeLeft) / 30) * 100;
    if (timerCircle) timerCircle.setAttribute('stroke-dashoffset', offset);

    // Warning state
    if (timeLeft <= 5) {
      timerValue?.classList.add('quiz-timer__value--warning');
      timerCircle?.classList.add('quiz-timer__circle--warning');
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // Auto-advance
      if (quizState.answers[quizState.currentIndex] === null) {
        quizState.answers[quizState.currentIndex] = -1; // No answer
      }
      const container = document.getElementById('app');
      if (quizState.currentIndex < quizState.questions.length - 1) {
        quizState.currentIndex++;
        renderQuestion(container);
      } else {
        finishQuiz(container);
      }
    }
    timeLeft--;
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

async function finishQuiz(container) {
  clearInterval(timerInterval);
  
  const user = getUser();
  const result = calculateResults(quizState.answers, quizState.questions, user);

  // Show completion screen
  container.innerHTML = `
    <div class="quiz-page page-container" style="display:flex;align-items:center;justify-content:center;">
      <div class="quiz-complete__card" style="background:var(--white);border-radius:24px;padding:32px;text-align:center;max-width:340px;box-shadow:var(--shadow-2xl);animation:scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1);">
        <div class="quiz-complete__emoji" style="font-size:64px;margin-bottom:16px;animation:bounce 2s ease infinite;">🎉</div>
        <h2 style="font-family:var(--font-heading);font-weight:800;font-size:24px;margin-bottom:8px;">Quiz Complete!</h2>
        <p style="color:var(--gray-500);font-size:14px;margin-bottom:24px;">Your evaluation report is being generated...</p>
        <div class="spinner" style="margin:0 auto;"></div>
      </div>
    </div>
  `;

  // Submit to backend API
  try {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        setIndex: quizState.setIndex,
        totalScore: result.totalScore,
        totalCorrect: result.totalCorrect,
        totalQuestions: result.totalQuestions,
        categoryScores: result.categoryScores,
        personalityType: result.personalityType,
        personalityEmoji: result.personalityEmoji,
        personalityDesc: result.personalityDesc,
        topStrengths: result.topStrengths,
        areasToImprove: result.areasToImprove,
        skillPlan: result.skillPlan,
        learningStyle: result.learningStyle,
        workEnvironment: result.workEnvironment,
        actionableAdvice: result.actionableAdvice,
        careers: result.careers,
        hiddenTalent: result.hiddenTalent,
        hiddenTalentDesc: result.hiddenTalentDesc,
        answers: quizState.answers,
      }),
    });
    const data = await res.json();
    if (data.success && data.resultId) {
      // Also save locally for offline access
      result.id = data.resultId;
      saveResult(result);
      setTimeout(() => navigate(`/results/${data.resultId}`), 1500);
    } else {
      throw new Error('Submit failed');
    }
  } catch (err) {
    console.error('Failed to submit to API, saving locally:', err);
    saveResult(result);
    setTimeout(() => navigate(`/results/${result.id}`), 1500);
  }
}

export function cleanupQuiz() {
  clearInterval(timerInterval);
  quizState = null;
}
