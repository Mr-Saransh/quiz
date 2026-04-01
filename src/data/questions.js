// ===== Questions Index — 5 Sets, 5 Sections, 6 Questions Each =====
import set1 from './set1.js';
import set2 from './set2.js';
import set3 from './set3.js';
import set4 from './set4.js';
import set5 from './set5.js';

export const QUESTION_SETS = [set1, set2, set3, set4, set5];

export const CATEGORIES = [
  { key: 'moral', label: 'Moral Dilemmas', emoji: '🧭', color: 'primary' },
  { key: 'tech', label: 'Tech & Logic', emoji: '💻', color: 'blue' },
  { key: 'reasoning', label: 'Reasoning', emoji: '🧩', color: 'purple' },
  { key: 'personality', label: 'Personality & Volunteering', emoji: '🤝', color: 'green' },
  { key: 'creative', label: 'Creative / Aptitude', emoji: '🎨', color: 'gold' },
  { key: 'eq', label: 'Emotional Intelligence', emoji: '🧠', color: 'pink' },
];

export function getRandomSet() {
  const index = Math.floor(Math.random() * QUESTION_SETS.length);
  return { setIndex: index, questions: QUESTION_SETS[index] };
}

export function getSetByIndex(index) {
  return QUESTION_SETS[index] || QUESTION_SETS[0];
}
