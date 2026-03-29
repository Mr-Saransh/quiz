// ===== API Client =====
const API_BASE = '/api';

async function request(path, options = {}) {
  const url = API_BASE + path;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);

  // Guard against non-JSON responses (e.g. Vercel 404 HTML pages)
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Server error (${res.status}): Expected JSON but got "${text.substring(0, 60)}..."`);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data;
}

export async function apiRegisterBasic(name, ageClass, contact) {
  return request('/auth/register-basic', {
    method: 'POST',
    body: { name, ageClass, contact },
  });
}

export async function apiSetProfile(userId, name, ageClass, city, address, profileImage) {
  return request('/auth/set-profile', {
    method: 'PUT',
    body: { userId, name, ageClass, city, address, profileImage },
  });
}

export async function apiGetUser(userId) {
  return request(`/auth/user/${userId}`);
}

// Quiz
export async function apiSubmitQuiz(resultData) {
  return request('/quiz/submit', {
    method: 'POST',
    body: resultData,
  });
}

export async function apiGetResult(resultId) {
  return request(`/quiz/results/${resultId}`);
}

export async function apiGetUserResults(userId) {
  return request(`/quiz/results/user/${userId}`);
}

// Leaderboard
export async function apiGetLeaderboard(period = 'monthly') {
  return request(`/leaderboard?period=${period}`);
}

// Stats
export async function apiGetStats() {
  return request('/stats');
}
