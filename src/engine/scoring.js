// ===== Scoring Engine =====

const PERSONALITY_TYPES = {
  innovator: {
    name: 'The Innovator',
    emoji: '💡',
    description: 'You think outside the box and thrive on creating new solutions. Your mind naturally gravitates toward innovation and original thinking.',
    topStrengths: ['Creative Thinking', 'Problem Solving', 'Adaptability'],
    areasToImprove: ['Routine Execution', 'Delegation', 'Time Management'],
    skillPlan: ['Take a UI/UX design course', 'Join a coding bootcamp', 'Participate in hackathons'],
    careers: [
      { title: 'Product Designer', icon: '🎨', match: 92 },
      { title: 'Tech Entrepreneur', icon: '🚀', match: 88 },
      { title: 'Research Scientist', icon: '🔬', match: 85 },
    ],
    hiddenTalent: 'Visionary Thinking',
    hiddenDesc: 'You have an extraordinary ability to see possibilities where others see limitations. This rare trait makes you a natural innovator.',
  },
  humanitarian: {
    name: 'The Humanitarian',
    emoji: '🤝',
    description: 'You are deeply empathetic and driven by a desire to make the world better. Your moral compass and people skills are your superpower.',
    topStrengths: ['Empathy', 'Leadership', 'Integrity'],
    areasToImprove: ['Data Analysis', 'Technical Systems', 'Setting Boundaries'],
    skillPlan: ['Volunteer for community service', 'Take leadership workshops', 'Learn conflict resolution'],
    careers: [
      { title: 'Social Worker', icon: '💚', match: 94 },
      { title: 'Healthcare Professional', icon: '🏥', match: 90 },
      { title: 'NGO Director', icon: '🌍', match: 87 },
    ],
    hiddenTalent: 'Emotional Intelligence',
    hiddenDesc: 'Your ability to understand and navigate complex emotions — both your own and others\' — is exceptional and will open doors in any career.',
  },
  strategist: {
    name: 'The Strategist',
    emoji: '♟️',
    description: 'You excel at seeing the bigger picture and planning multiple moves ahead. Logic and analytical thinking are your strongest suits.',
    topStrengths: ['Analytical Thinking', 'Strategic Planning', 'Decision Making'],
    areasToImprove: ['Spontaneous Action', 'Creative Art', 'Public Speaking'],
    skillPlan: ['Play strategy games like Chess', 'Take data science courses', 'Learn financial modeling'],
    careers: [
      { title: 'Management Consultant', icon: '📊', match: 93 },
      { title: 'Data Scientist', icon: '📈', match: 89 },
      { title: 'Financial Analyst', icon: '💰', match: 86 },
    ],
    hiddenTalent: 'Systems Thinking',
    hiddenDesc: 'You naturally understand how complex systems work and interact. This ability to see patterns in chaos is incredibly valuable.',
  },
  creator: {
    name: 'The Creator',
    emoji: '🎨',
    description: 'You have an innate ability to bring ideas to life through creative expression. Your imagination and artistic sense set you apart.',
    topStrengths: ['Imagination', 'Visual Expression', 'Originality'],
    areasToImprove: ['Structured Planning', 'Data Processing', 'Routine Work'],
    skillPlan: ['Learn digital illustration', 'Start a design portfolio', 'Explore 3D modeling'],
    careers: [
      { title: 'UX/UI Designer', icon: '🖌️', match: 95 },
      { title: 'Content Creator', icon: '📱', match: 91 },
      { title: 'Architect', icon: '🏛️', match: 84 },
    ],
    hiddenTalent: 'Creative Vision',
    hiddenDesc: 'You see beauty and potential in everything around you. Your creative instincts can transform ordinary ideas into extraordinary experiences.',
  },
  leader: {
    name: 'The Leader',
    emoji: '👑',
    description: 'You naturally inspire and guide others. Your combination of confidence, vision, and interpersonal skills makes you a born leader.',
    topStrengths: ['Confidence', 'Visionary', 'Influence'],
    areasToImprove: ['Detail Orientation', 'Patience', 'Following Directions'],
    skillPlan: ['Join a debate club', 'Take on a team captain role', 'Learn project management'],
    careers: [
      { title: 'CEO / Founder', icon: '🏢', match: 91 },
      { title: 'Public Policy Maker', icon: '⚖️', match: 88 },
      { title: 'Team Manager', icon: '👥', match: 85 },
    ],
    hiddenTalent: 'Inspirational Leadership',
    hiddenDesc: 'You have a rare ability to motivate and bring out the best in people. Your natural charisma and conviction will take you far.',
  },
};

const CATEGORY_COLORS = {
  moral: 'primary',
  tech: 'blue',
  reasoning: 'purple',
  personality: 'green',
  creative: 'gold',
};

const CATEGORY_EMOJIS = {
  moral: '🧭',
  tech: '💻',
  reasoning: '🧩',
  personality: '🤝',
  creative: '🎨',
};

const CATEGORY_LABELS = {
  moral: 'Moral Reasoning',
  tech: 'Tech & Logic',
  reasoning: 'Analytical Thinking',
  personality: 'Personality & Values',
  creative: 'Creative Aptitude',
};

export function calculateResults(answers, questions, user) {
  const categoryScores = {
    moral: { correct: 0, total: 0, weighted: 0 },
    tech: { correct: 0, total: 0, weighted: 0 },
    reasoning: { correct: 0, total: 0, weighted: 0 },
    personality: { correct: 0, total: 0, weighted: 0 },
    creative: { correct: 0, total: 0, weighted: 0 },
  };
  
  // Personality dimension accumulators
  const personalityDims = {
    empathy: 0,
    logic: 0,
    creativity: 0,
    leadership: 0,
    practicality: 0,
  };
  
  let totalCorrect = 0;
  let totalQuestions = questions.length;
  
  questions.forEach((q, index) => {
    const answer = answers[index];
    const cat = q.category;
    
    if (categoryScores[cat]) {
      categoryScores[cat].total++;
      
      if (q.type === 'objective') {
        if (answer === q.correct) {
          categoryScores[cat].correct++;
          totalCorrect++;
        }
      } else {
        // Personality/subjective — all answers give points but with different weights
        categoryScores[cat].correct++;
        totalCorrect++;
      }
      
      // Accumulate personality weights from chosen answer
      if (q.weights && q.weights[answer] !== undefined) {
        const w = q.weights[answer];
        if (w.empathy) personalityDims.empathy += w.empathy;
        if (w.logic) personalityDims.logic += w.logic;
        if (w.creativity) personalityDims.creativity += w.creativity;
        if (w.leadership) personalityDims.leadership += w.leadership;
        if (w.practicality) personalityDims.practicality += w.practicality;
      }
    }
  });
  
  // Calculate category percentages
  const categoryPcts = {};
  for (const [cat, data] of Object.entries(categoryScores)) {
    categoryPcts[cat] = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  }
  
  // Add some variability for subjective categories
  categoryPcts.moral = clampScore(categoryPcts.moral + Math.floor(Math.random() * 15));
  categoryPcts.personality = clampScore(categoryPcts.personality + Math.floor(Math.random() * 10));
  categoryPcts.creative = clampScore(categoryPcts.creative + Math.floor(Math.random() * 12));
  
  // Overall score (out of 1000)
  const avgPct = Object.values(categoryPcts).reduce((a, b) => a + b, 0) / 5;
  const totalScore = Math.round(avgPct * 10);
  
  // Determine personality type
  const personalityType = determinePersonalityType(categoryPcts, personalityDims);
  const personality = PERSONALITY_TYPES[personalityType];
  
  // Determine traits with percentages
  const topStrengths = personality.topStrengths.map((trait) => ({ name: trait, value: clampScore(75 + Math.floor(Math.random() * 20)) }));
  
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    userId: user.id,
    userName: user.name,
    date: new Date().toISOString(),
    totalScore,
    totalCorrect,
    totalQuestions,
    categoryScores: categoryPcts,
    categoryColors: CATEGORY_COLORS,
    categoryEmojis: CATEGORY_EMOJIS,
    categoryLabels: CATEGORY_LABELS,
    personalityType: personality.name,
    personalityEmoji: personality.emoji,
    personalityDesc: personality.description,
    topStrengths,
    areasToImprove: personality.areasToImprove,
    skillPlan: personality.skillPlan,
    careers: personality.careers,
    hiddenTalent: personality.hiddenTalent,
    hiddenTalentDesc: personality.hiddenDesc,
  };
}

function determinePersonalityType(categoryPcts, dims) {
  // Weight categories + personality dimensions
  const scores = {
    innovator: (categoryPcts.tech * 0.3 + categoryPcts.creative * 0.4 + dims.creativity * 2),
    humanitarian: (categoryPcts.moral * 0.4 + categoryPcts.personality * 0.3 + dims.empathy * 2),
    strategist: (categoryPcts.reasoning * 0.4 + categoryPcts.tech * 0.3 + dims.logic * 2),
    creator: (categoryPcts.creative * 0.4 + categoryPcts.moral * 0.2 + dims.creativity * 1.5 + dims.empathy),
    leader: (categoryPcts.personality * 0.3 + categoryPcts.reasoning * 0.3 + dims.leadership * 2),
  };
  
  let maxType = 'innovator';
  let maxScore = -Infinity;
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  }
  
  return maxType;
}

function clampScore(val) {
  return Math.min(100, Math.max(30, val));
}

export { PERSONALITY_TYPES, CATEGORY_COLORS, CATEGORY_EMOJIS, CATEGORY_LABELS };
