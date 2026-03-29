// ===== Local Storage Wrapper =====

const KEYS = {
  USER: 'qp_user',
  RESULTS: 'qp_results',
  LEADERBOARD: 'qp_leaderboard',
  CURRENT_QUIZ: 'qp_current_quiz',
};

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER));
  } catch {
    return null;
  }
}

export function setUser(userData) {
  localStorage.setItem(KEYS.USER, JSON.stringify(userData));
}

export function clearUser() {
  localStorage.removeItem(KEYS.USER);
}

export function isLoggedIn() {
  return !!getUser();
}

// Results
export function saveResult(result) {
  const results = getAllResults();
  results.push(result);
  localStorage.setItem(KEYS.RESULTS, JSON.stringify(results));
  
  // Also update leaderboard
  updateLeaderboard(result);
}

export function getAllResults() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.RESULTS)) || [];
  } catch {
    return [];
  }
}

export function getResultById(id) {
  const results = getAllResults();
  return results.find(r => r.id === id) || null;
}

export function getUserResults() {
  const user = getUser();
  if (!user) return [];
  return getAllResults().filter(r => r.userId === user.id);
}

export function getLatestResult() {
  const userResults = getUserResults();
  if (userResults.length === 0) return null;
  return userResults[userResults.length - 1];
}

// Leaderboard
export function getLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.LEADERBOARD)) || getDefaultLeaderboard();
  } catch {
    return getDefaultLeaderboard();
  }
}

function updateLeaderboard(result) {
  const board = getLeaderboard();
  const existing = board.findIndex(e => e.userId === result.userId);
  
  const entry = {
    userId: result.userId,
    name: result.userName,
    score: result.totalScore,
    personality: result.personalityType,
    date: result.date,
  };
  
  if (existing >= 0) {
    if (board[existing].score < result.totalScore) {
      board[existing] = entry;
    }
  } else {
    board.push(entry);
  }
  
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(board));
}

function getDefaultLeaderboard() {
  const names = [
    'Aarav Sharma', 'Priya Patel', 'Rahul Gupta', 'Ananya Singh',
    'Vikram Reddy', 'Diya Nair', 'Arjun Kumar', 'Meera Joshi',
    'Karthik Rao', 'Sneha Iyer', 'Rohan Malhotra', 'Ishita Verma',
    'Aditya Bhat', 'Kavya Menon', 'Dev Chopra', 'Riya Kaur',
    'Nikhil Das', 'Shreya Pandey', 'Manav Sinha', 'Pooja Tiwari'
  ];
  
  const personalities = ['The Innovator', 'The Humanitarian', 'The Strategist', 'The Creator', 'The Leader'];
  
  return names.map((name, i) => ({
    userId: `mock_${i}`,
    name,
    score: Math.floor(850 - (i * 30) + Math.random() * 20),
    personality: personalities[Math.floor(Math.random() * personalities.length)],
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  })).sort((a, b) => b.score - a.score);
}

// Current quiz state
export function saveQuizState(state) {
  localStorage.setItem(KEYS.CURRENT_QUIZ, JSON.stringify(state));
}

export function getQuizState() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.CURRENT_QUIZ));
  } catch {
    return null;
  }
}

export function clearQuizState() {
  localStorage.removeItem(KEYS.CURRENT_QUIZ);
}

// Initialize default leaderboard on first load
export function initStorage() {
  if (!localStorage.getItem(KEYS.LEADERBOARD)) {
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(getDefaultLeaderboard()));
  }
}
