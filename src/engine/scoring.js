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
      { title: 'Software Engineer (Product)', icon: '💻', match: 96, context: 'High demand in Bangalore & Hyderabad tech hubs.' },
      { title: 'AI/ML Architect', icon: '🤖', match: 94, context: 'The future of Indian IT services and product startups.' },
      { title: 'Aerospace Engineer (ISRO)', icon: '🚀', match: 90, context: 'Leading prestigious space missions for India.' },
      { title: 'Robotics Specialist', icon: '⚙️', match: 88, context: 'Automation expert for India\'s growing manufacturing sector.' },
      { title: 'Full Stack Developer', icon: '🌐', match: 93, context: 'Core pillar of India\'s digital transformation.' },
      { title: 'Research Scientist (DRDO)', icon: '🔬', match: 86, context: 'Developing cutting-edge defense tech for the nation.' },
    ],
    hiddenTalent: 'Visionary Thinking',
    hiddenDesc: 'You have an extraordinary ability to see possibilities where others see limitations. This rare trait makes you a natural innovator.',
  },
  humanitarian: {
    name: 'The Humanitarian',
    emoji: '🤝',
    variants: [
      'You are driven by a desire to make the world better. Your high Emotional Intelligence and people skills allow you to build deep connections.',
      'Your natural ability to connect with people on a deep level allows you to build strong communities and drive social change.',
      'You possess a rare combination of empathy and grit, making you a powerful advocate for those who need a voice.'
    ],
    topStrengths: ['Empathy', 'Emotional Intelligence', 'Conflict Resolution', 'Community Building', 'Integrity'],
    areasToImprove: ['Data Analysis', 'Technical Systems', 'Setting Boundaries', 'Emotional Detachment'],
    skillPlan: ['Volunteer for major NGOs', 'Attend Leadership Summits', 'Learn Conflict Management', 'Study Public Policy'],
    learningStyle: 'Collaborative discussion and case studies. You learn best when you can relate concepts to human experiences.',
    workEnvironment: 'NGOs, Social Enterprises, Healthcare institutions, or CSR wings of major Indian conglomerates.',
    actionableAdvice: 'Don\'t forget to practice self-care. Your empathy is a gift, but it can be draining if you don\'t set boundaries.',
    careers: [
      { title: 'Medical Doctor (Specialist)', icon: '🩺', match: 96, context: 'Serving in top institutions like AIIMS or Apollo.' },
      { title: 'IAS / IPS Officer', icon: '🇮🇳', match: 95, context: 'The pinnacle of social impact and administration in India.' },
      { title: 'Clinical Psychologist', icon: '🧠', match: 92, context: 'Addressing mental health needs in India\'s urban centers.' },
      { title: 'Public Health Official', icon: '🏢', match: 90, context: 'Designing healthcare policies for diverse Indian states.' },
      { title: 'NGO Director (Global)', icon: '🌍', match: 94, context: 'Leading large-scale social impact projects across rural India.' },
      { title: 'Corporate Social Responsibility (CSR) Head', icon: '🏢', match: 88, context: 'Bridging corporate profit with social good in major MNCs.' },
    ],
    hiddenTalent: 'Deep Empathy',
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
      { title: 'Civil Engineer (Infrastructure)', icon: '🏗️', match: 95, context: 'Building India\'s future smart cities and highways.' },
      { title: 'Mechanical Engineer (Automotive)', icon: '🚗', match: 92, context: 'Pillar of India\'s EV and manufacturing evolution.' },
      { title: 'Electrical Engineer (Power)', icon: '⚡', match: 90, context: 'Ensuring energy security for India\'s growing economy.' },
      { title: 'Management Consultant (MBB)', icon: '📊', match: 96, context: 'The gold standard for strategy across corporate India.' },
      { title: 'Chartered Accountant (CA)', icon: '📖', match: 94, context: 'A highly respected and core pillar of the Indian economy.' },
      { title: 'Chemical Engineer (Energy)', icon: '⚗️', match: 88, context: 'Leading innovation in India\'s petrochemical sectors.' },
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
      { title: 'Architect (COA Registered)', icon: '🏛️', match: 94, context: 'Designing the skylines of evolving Indian cities.' },
      { title: 'Creative Director (Ad-Agencies)', icon: '🎬', match: 95, context: 'Leading campaigns for top Indian and Global brands.' },
      { title: 'UI/UX Designer', icon: '🖌️', match: 92, context: 'Ensuring Indian tech products look world-class.' },
      { title: 'Content Creator (Digital)', icon: '📱', match: 94, context: 'Thriving in India\'s booming digital economy (YouTube/Insta).' },
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
      { title: 'Startup Founder (CEO)', icon: '🏢', match: 96, context: 'Leading the next generation of Indian Unicorns.' },
      { title: 'Marketing Head (CMO)', icon: '📣', match: 92, context: 'Driving brand stories for iconic Indian companies.' },
      { title: 'Indian Army Officer', icon: '⚔️', match: 95, context: 'Leadership of the highest order in our most respected institution.' },
      { title: 'HR Director', icon: '👥', match: 90, context: 'Building world-class talent pool for Indian industry.' },
      { title: 'Project Director', icon: '📈', match: 93, context: 'High-level management of mega projects in India.' },
      { title: 'Diplomat (IFS Officer)', icon: '🌐', match: 89, context: 'Representing India\'s interests on the global stage.' },
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
  eq: 'pink',
};

const CATEGORY_EMOJIS = {
  moral: '🧭',
  tech: '💻',
  reasoning: '🧩',
  personality: '🤝',
  creative: '🎨',
  eq: '🧠',
};

const CATEGORY_LABELS = {
  moral: 'Moral Reasoning',
  tech: 'Tech & Logic',
  reasoning: 'Analytical Thinking',
  personality: 'Personality & Values',
  creative: 'Creative Aptitude',
  eq: 'Emotional Intelligence',
};

export function calculateResults(answers, questions, user) {
  const categoryScores = {
    moral: { correct: 0, total: 0, weighted: 0 },
    tech: { correct: 0, total: 0, weighted: 0 },
    reasoning: { correct: 0, total: 0, weighted: 0 },
    personality: { correct: 0, total: 0, weighted: 0 },
    creative: { correct: 0, total: 0, weighted: 0 },
    eq: { correct: 0, total: 0, weighted: 0 },
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
  categoryPcts.eq = clampScore(categoryPcts.eq + Math.floor(Math.random() * 15));
  
  // Overall score (out of 1000)
  const avgPct = Object.values(categoryPcts).reduce((a, b) => a + b, 0) / 6;
  const totalScore = Math.round(avgPct * 10);
  
  // Determine personality type
  const personalityType = determinePersonalityType(categoryPcts, personalityDims);
  const personality = PERSONALITY_TYPES[personalityType];

  // Derive sub-type based on highest secondary category
  const sortedCats = Object.entries(categoryPcts).sort((a, b) => b[1] - a[1]);
  const primaryCat = sortedCats[0][0];
  const secondaryCat = sortedCats[1][0];

  const subTypePrefixes = {
    moral: 'Ethical', tech: 'Technical', reasoning: 'Analytical', personality: 'Social', creative: 'Creative', eq: 'Empathetic'
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
    creative: 'Never suppress your creative instincts; they are what will make you irreplaceable.',
    eq: 'Your high emotional intelligence allows you to navigate complex human dynamics with grace.'
  };

  // Custom deep-dive insights
  const cognitiveSignatures = {
    innovator: 'Your cognitive signature is defined by "Divergent Synthesis". You excel at taking disparate pieces of data and merging them into a cohesive, novel architecture. Your brain bypasses conventional linear processing in favor of high-speed pattern recognition.',
    humanitarian: 'Your cognitive signature is defined by "Empathetic Resonance". You have a unique neurological ability to mirror and decode the emotional states of those around you, allowing you to build trust and drive systemic social change.',
    strategist: 'Your cognitive signature is defined by "Quantum Logic". You process variables simultaneously rather than sequentially, allowing you to project long-term outcomes and identify critical risks with surgical precision.',
    creator: 'Your cognitive signature is defined by "Aesthetic Fluency". You translate abstract concepts into visual or narrative languages with ease, creating a powerful emotional bridge between ideas and their audience.',
    leader: 'Your cognitive signature is defined by "Command Presence". You naturally synthesize interpersonal data into strategic action, allowing you to mobilize diverse teams toward a singular, high-stakes vision.'
  };

  const marketValues = {
    innovator: 'Elite Tier: High demand in R&D, AI development, and disruptive product leadership. You represent the top 5% of technical visionaries.',
    humanitarian: 'Strategic Asset: Essential for public policy, social infrastructure, and corporate stewardship. You drive the "Moral Advantage" of organizations.',
    strategist: 'Core Pillar: Critical for financial architecture, operational scaling, and risk mitigation. You are the architect of sustainable growth.',
    creator: 'High Impact: Vital for brand evolution, digital storytelling, and consumer experience. You turn abstract products into cultural phenomena.',
    leader: 'Supreme Tier: Required for organizational scaling, capital management, and high-trust leadership roles. You are a natural force multiplier.'
  };

  const actionableAdvice = `${personality.actionableAdvice} Also, ${categoryAdvice[primaryCat]}`;
  
  // Determine traits with percentages
  const topStrengths = personality.topStrengths
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
    .map((trait) => ({ 
      name: trait, 
      value: clampScore(78 + Math.floor(Math.random() * 20)) 
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
    cognitiveSignature: cognitiveSignatures[personalityType],
    marketValue: marketValues[personalityType],
    neuralSynergy: clampScore(80 + Math.floor(Math.random() * 18)),
    topStrengths,
    areasToImprove: personality.areasToImprove.sort(() => 0.5 - Math.random()).slice(0, 4),
    skillPlan: personality.skillPlan.sort(() => 0.5 - Math.random()).slice(0, 4),
    learningStyle: personality.learningStyle,
    workEnvironment: personality.workEnvironment,
    actionableAdvice: actionableAdvice,
    careers: personality.careers.sort(() => 0.5 - Math.random()).slice(0, 6),
    hiddenTalent: personality.hiddenTalent,
    hiddenTalentDesc: personality.hiddenDesc,
  };
}

function determinePersonalityType(categoryPcts, dims) {
  // Weight categories + personality dimensions
  const scores = {
    innovator: (categoryPcts.tech * 0.3 + categoryPcts.creative * 0.4 + dims.creativity * 2),
    humanitarian: (categoryPcts.moral * 0.3 + categoryPcts.eq * 0.4 + dims.empathy * 2),
    strategist: (categoryPcts.reasoning * 0.4 + categoryPcts.tech * 0.3 + dims.logic * 2),
    creator: (categoryPcts.creative * 0.4 + categoryPcts.eq * 0.2 + dims.creativity * 1.5 + dims.empathy),
    leader: (categoryPcts.personality * 0.2 + categoryPcts.eq * 0.2 + categoryPcts.reasoning * 0.3 + dims.leadership * 2),
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
