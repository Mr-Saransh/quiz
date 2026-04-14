// ===== Assessment Questions for Combo Course Coupon =====
// 10 questions covering: Soft Skills, Computer, AI, Coding, Cyber Security, Financial Literacy

export const ASSESSMENT_QUESTIONS = [
  // Soft Skills (2)
  {
    id: 'a1',
    category: 'Soft Skills',
    icon: '🤝',
    text: 'During a team project, two members have conflicting ideas. As a mediator, what is the best approach?',
    options: [
      'Side with the louder person',
      'Listen to both sides and find common ground',
      'Ask the teacher to decide',
      'Ignore the conflict and continue working alone'
    ],
    correct: 1
  },
  {
    id: 'a2',
    category: 'Soft Skills',
    icon: '🤝',
    text: 'Which of these is the most effective way to communicate during a professional presentation?',
    options: [
      'Reading directly from slides word-by-word',
      'Speaking fast to cover more content',
      'Making eye contact and using clear, structured points',
      'Using as much jargon as possible to sound smart'
    ],
    correct: 2
  },

  // Computer Basics (2)
  {
    id: 'a3',
    category: 'Computer',
    icon: '💻',
    text: 'What does RAM stand for in computing?',
    options: [
      'Random Access Memory',
      'Read And Manage',
      'Readily Available Machine',
      'Run All Memory'
    ],
    correct: 0
  },
  {
    id: 'a4',
    category: 'Computer',
    icon: '💻',
    text: 'Which of these is an operating system?',
    options: [
      'Google Chrome',
      'Microsoft Word',
      'Linux',
      'Photoshop'
    ],
    correct: 2
  },

  // AI (2)
  {
    id: 'a5',
    category: 'AI',
    icon: '🤖',
    text: 'What does "AI" stand for?',
    options: [
      'Automated Internet',
      'Artificial Intelligence',
      'Advanced Integration',
      'Automatic Input'
    ],
    correct: 1
  },
  {
    id: 'a6',
    category: 'AI',
    icon: '🤖',
    text: 'Which of these is an example of AI in daily life?',
    options: [
      'A calculator app',
      'A voice assistant like Alexa or Siri',
      'A basic alarm clock',
      'A flashlight app'
    ],
    correct: 1
  },

  // Coding (2)
  {
    id: 'a7',
    category: 'Coding',
    icon: '👨‍💻',
    text: 'In most programming languages, what does a "loop" do?',
    options: [
      'Ends the program immediately',
      'Repeats a block of code multiple times',
      'Deletes variables from memory',
      'Creates a new file'
    ],
    correct: 1
  },
  {
    id: 'a8',
    category: 'Coding',
    icon: '👨‍💻',
    text: 'What is the output of: print(2 + 3 * 4)?',
    options: [
      '20',
      '14',
      '24',
      '9'
    ],
    correct: 1
  },

  // Cyber Security (1)
  {
    id: 'a9',
    category: 'Cyber Security',
    icon: '🔒',
    text: 'Which of these is the strongest password?',
    options: [
      'password123',
      'myname2000',
      'P@$$w0rd!Xyz9#',
      '12345678'
    ],
    correct: 2
  },

  // Financial Literacy (1)
  {
    id: 'a10',
    category: 'Financial Literacy',
    icon: '💰',
    text: 'What is "compound interest"?',
    options: [
      'Interest charged only on the principal amount',
      'Interest calculated on both principal and accumulated interest',
      'A type of bank loan',
      'A fixed monthly payment'
    ],
    correct: 1
  }
];
