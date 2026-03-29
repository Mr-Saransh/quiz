// ===== Scoring Engine =====

const PERSONALITY_TYPES = {
  innovator: {
    name: 'The Innovator',
    emoji: '💡',
    variants: [
      'You think outside the box and thrive on creating new solutions. Your mind naturally gravitates toward innovation and original thinking.',
      'Driven by curiosity, you see patterns where others see chaos. You are at your best when solving complex problems with unique, tech-forward solutions.',
      'A true visionary, you are not afraid to challenge the status quo. You constantly seek ways to improve systems through creative logic.'
    ],
    topStrengths: ['Creative Thinking', 'System Architecture', 'Problem Solving', 'Adaptability', 'Technical Agility'],
    areasToImprove: ['Routine Execution', 'Delegation', 'Time Management', 'Patience with Process'],
    skillPlan: ['Take a UI/UX design course', 'Enroll in an AI/ML bootcamp', 'Participate in Pan-India Hackathons', 'Learn Cloud Architecture'],
    learningStyle: 'Hands-on experimentation and project-based learning. You prefer "learning by doing" over theoretical lectures.',
    workEnvironment: 'Fast-paced tech startups, R&D labs, or creative agencies that value autonomy and "fail-fast" culture.',
    actionableAdvice: 'Focus on finishing one project before jumping to the next big idea. Use agile methodologies to track your progress.',
    careers: [
      { title: 'Product Manager (Tech)', icon: '🚀', match: 95, context: 'High demand in Bangalore & Hyderabad tech hubs.' },
      { title: 'AI/ML Engineer', icon: '🤖', match: 92, context: 'The future of Indian IT services and product startups.' },
      { title: 'UX/UI Architect', icon: '🎨', match: 88, context: 'Critical for India\'s growing consumer app ecosystem.' },
      { title: 'Growth Hacker', icon: '📈', match: 85, context: 'Ideal for scaling D2C brands in the Indian market.' },
      { title: 'R&D Scientist (ISRO/DRDO)', icon: '🚀', match: 82, context: 'For those aiming for prestigious government research.' },
      { title: 'Data Scientist', icon: '📊', match: 90, context: 'Driving decision-making in India\'s unicorn companies.' },
    ],
    hiddenTalent: 'Visionary Thinking',
    hiddenDesc: 'You have an extraordinary ability to see possibilities where others see limitations. This rare trait makes you a natural innovator.',
  },
  humanitarian: {
    name: 'The Humanitarian',
    emoji: '🤝',
    variants: [
      'You are deeply empathetic and driven by a desire to make the world better. Your moral compass and people skills are your superpower.',
      'Your natural ability to connect with people on a deep level allows you to build strong communities and drive social change.',
      'You possess a rare combination of empathy and grit, making you a powerful advocate for those who need a voice.'
    ],
    topStrengths: ['Empathy', 'Conflict Resolution', 'Community Building', 'Integrity', 'Persuasion'],
    areasToImprove: ['Data Analysis', 'Technical Systems', 'Setting Boundaries', 'Emotional Detachment'],
    skillPlan: ['Volunteer for major NGOs', 'Attend Leadership Summits', 'Learn Conflict Management', 'Study Public Policy'],
    learningStyle: 'Collaborative discussion and case studies. You learn best when you can relate concepts to human experiences.',
    workEnvironment: 'NGOs, Social Enterprises, Healthcare institutions, or CSR wings of major Indian conglomerates.',
    actionableAdvice: 'Don\'t forget to practice self-care. Your empathy is a gift, but it can be draining if you don\'t set boundaries.',
    careers: [
      { title: 'NGO Director', icon: '🌍', match: 94, context: 'Leading social impact projects across rural India.' },
      { title: 'Public Policy Consultant', icon: '⚖️', match: 91, context: 'Influencing governance and law at Central or State levels.' },
      { title: 'Healthcare Administrator', icon: '🏥', match: 89, context: 'Managing large hospital chains like Apollo or Fortis.' },
      { title: 'IAS / IPS Officer', icon: '🇮🇳', match: 95, context: 'The pinnacle of social impact and administrative power in India.' },
      { title: 'Corporate Social Responsibility (CSR) Head', icon: '🏢', match: 87, context: 'Bridging corporate profit with social good.' },
      { title: 'Clinical Psychologist', icon: '🧠', match: 92, context: 'Helping address the growing mental health needs in urban India.' },
    ],
    hiddenTalent: 'Emotional Intelligence',
    hiddenDesc: 'Your ability to understand and navigate complex emotions — both your own and others\' — is exceptional and will open doors in any career.',
  },
  strategist: {
    name: 'The Strategist',
    emoji: '♟️',
    variants: [
      'You excel at seeing the bigger picture and planning multiple moves ahead. Logic and analytical thinking are your strongest suits.',
      'A master of efficiency, you find the most logical path through any challenge. You value data and evidence over intuition.',
      'You are a natural architect of systems and strategies, always looking for ways to optimize and scale operations.'
    ],
    topStrengths: ['Analytical Thinking', 'Risk Assessment', 'Strategic Planning', 'Logical Reasoning', 'Financial Literacy'],
    areasToImprove: ['Spontaneous Action', 'Creative Art', 'Public Speaking', 'Emotional Sensitivity'],
    skillPlan: ['Study Advanced Excel & SQL', 'Take Financial Modeling courses', 'Master Game Theory', 'Learn Six Sigma'],
    learningStyle: 'Structured, data-driven, and logical. You prefer frameworks, models, and clear hierarchies of information.',
    workEnvironment: 'Investment Banks, Management Consulting firms, or Strategic Planning departments of MNCs.',
    actionableAdvice: 'Sometimes the best "strategy" is to take action. Don\'t get paralyzed by analysis.',
    careers: [
      { title: 'Management Consultant (MBB)', icon: '📊', match: 96, context: 'The gold standard for strategy across corporate India.' },
      { title: 'Chartered Accountant (CA)', icon: '📖', match: 93, context: 'A highly respected and core pillar of the Indian economy.' },
      { title: 'Data Scientist / Analyst', icon: '📈', match: 91, context: 'Transforming bytes into business strategies.' },
      { title: 'Investment Banker', icon: '💰', match: 88, context: 'Managing capital for India\'s biggest mergers and acquisitions.' },
      { title: 'Operations Manager', icon: '⚙️', match: 86, context: 'Ensuring efficiency in supply chains like Flipkart or Reliance.' },
      { title: 'Cryptocurrency Analyst', icon: '₿', match: 82, context: 'The new frontier of digital finance in India.' },
    ],
    hiddenTalent: 'Systems Thinking',
    hiddenDesc: 'You naturally understand how complex systems work and interact. This ability to see patterns in chaos is incredibly valuable.',
  },
  creator: {
    name: 'The Creator',
    emoji: '🎨',
    variants: [
      'You have an innate ability to bring ideas to life through creative expression. Your imagination and artistic sense set you apart.',
      'A storyteller at heart, you use visual and narrative tools to communicate complex ideas in beautiful ways.',
      'You see the world as a canvas. You are driven by the urge to create something that has never existed before.'
    ],
    topStrengths: ['Imagination', 'Visual Design', 'Storytelling', 'Originality', 'Aesthetic Sense'],
    areasToImprove: ['Structured Planning', 'Data Processing', 'Routine Work', 'Attention to Bureaucracy'],
    skillPlan: ['Master Adobe Creative Suite', 'Build a Digital Portfolio', 'Learn Video Production', 'Study Content Marketing'],
    learningStyle: 'Visual and explorative. You learn best through inspiration, observation, and creative play.',
    workEnvironment: 'Creative Studios, Advertising Agencies, Media Houses, or as an independent content creator.',
    actionableAdvice: 'Learn the business side of creativity. Protecting your intellectual property is as important as creating it.',
    careers: [
      { title: 'Creative Director', icon: '🎬', match: 95, context: 'Leading campaigns for top Indian and Global brands.' },
      { title: 'Content Creator (Social Media)', icon: '📱', match: 94, context: 'Thriving in India\'s booming digital economy (YouTube/Instagram).' },
      { title: 'Architect', icon: '🏛️', match: 90, context: 'Designing the skylines of evolving Indian cities.' },
      { title: 'UI/UX Designer', icon: '🖌️', match: 92, context: 'Ensuring Indian tech products look world-class.' },
      { title: 'Fashion Designer', icon: '👗', match: 88, context: 'Mixing traditional Indian textiles with modern global trends.' },
      { title: 'Interior Designer', icon: '🏠', match: 87, context: 'Redefining luxury and functionality in Indian homes.' },
    ],
    hiddenTalent: 'Creative Vision',
    hiddenDesc: 'You see beauty and potential in everything around you. Your creative instincts can transform ordinary ideas into extraordinary experiences.',
  },
  leader: {
    name: 'The Leader',
    emoji: '👑',
    variants: [
      'You naturally inspire and guide others. Your combination of confidence, vision, and interpersonal skills makes you a born leader.',
      'A master of mobilization, you know how to bring out the best in people to achieve a common goal.',
      'Your presence commands attention, and your vision provides direction. You are at your best when driving large-scale initiatives.'
    ],
    topStrengths: ['Confidence', 'Public Speaking', 'Visionary Leadership', 'Decision Making', 'Networking'],
    areasToImprove: ['Detail Orientation', 'Patience', 'Deep Technical Execution', 'Listening More'],
    skillPlan: ['Public Speaking Workshops', 'Project Management (PMP)', 'Negotiation Skill training', 'MBAs from Top B-Schools'],
    learningStyle: 'Top-down and executive-focused. You learn best from mentors, peers, and high-level summaries.',
    workEnvironment: 'Boardrooms, High-growth startups, Political organizations, or Corporate leadership roles.',
    actionableAdvice: 'Remember that leadership is about service. The best leaders listen twice as much as they speak.',
    careers: [
      { title: 'CEO / Startup Founder', icon: '🏢', match: 96, context: 'Leading the next generation of Indian Unicorns.' },
      { title: 'Marketing Head (CMO)', icon: '📣', match: 92, context: 'Driving brand stories for iconic Indian companies.' },
      { title: 'Politician / Legislator', icon: '🗳️', match: 85, context: 'Shaping the future of India through public service.' },
      { title: 'HR Director', icon: '👥', match: 90, context: 'Building world-class talent pool for Indian industry.' },
      { title: 'Indian Army Officer', icon: '⚔️', match: 94, context: 'Leadership of the highest order in one of India\'s most respected institutions.' },
      { title: 'Manager (IIM Tier)', icon: '📈', match: 93, context: 'High-level management in top-tier Indian companies.' },
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

  // Derive sub-type based on highest secondary category
  const sortedCats = Object.entries(categoryPcts).sort((a, b) => b[1] - a[1]);
  const primaryCat = sortedCats[0][0];
  const secondaryCat = sortedCats[1][0];

  const subTypePrefixes = {
    moral: 'Ethical', tech: 'Technical', reasoning: 'Analytical', personality: 'Social', creative: 'Creative'
  };
  const subTypeName = `${subTypePrefixes[primaryCat]} ${personality.name.split(' ')[1]}`;
  
  // Pick a random variant for description
  const description = personality.variants[Math.floor(Math.random() * personality.variants.length)];
  
  // Custom advice based on category performance
  const categoryAdvice = {
    moral: 'Your strong moral compass is a huge asset in leadership and social roles.',
    tech: 'Leveraging your technical aptitude will be key to your career growth in the digital era.',
    reasoning: 'Your logical clarity allows you to solve problems that baffle others.',
    personality: 'Your ability to read and influence social dynamics is your greatest superpower.',
    creative: 'Never suppress your creative instincts; they are what will make you irreplaceable.'
  };

  const actionableAdvice = `${personality.actionableAdvice} Also, ${categoryAdvice[primaryCat]}`;
  
  // Determine traits with percentages
  const topStrengths = personality.topStrengths
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)
    .map((trait) => ({ 
      name: trait, 
      value: clampScore(75 + Math.floor(Math.random() * 20)) 
    }));
  
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
    personalityType: subTypeName,
    personalityEmoji: personality.emoji,
    personalityDesc: description,
    topStrengths,
    areasToImprove: personality.areasToImprove.sort(() => 0.5 - Math.random()).slice(0, 3),
    skillPlan: personality.skillPlan.sort(() => 0.5 - Math.random()).slice(0, 3),
    learningStyle: personality.learningStyle,
    workEnvironment: personality.workEnvironment,
    actionableAdvice: actionableAdvice,
    careers: personality.careers.sort(() => 0.5 - Math.random()).slice(0, 5),
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
